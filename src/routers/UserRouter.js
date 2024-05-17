import express from "express";
import userRepository from "../repositories/UserRepository.js";
import { z } from "zod";
import { UserModel } from "../models/UserModel.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { loginMiddleware } from "../middlewares/loginMiddleware.js";
import mongoose from "mongoose";
import groupRepository from "../repositories/GroupRepository.js";
import multer from "multer";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

const userRouter = express.Router();
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING,
);
const containerName = "images";

const UserRegisterSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(), // username: z.string(),
  password: z.string().min(6),
});

userRouter.get("/", loginMiddleware, async (req, res) => {
  const account = await userRepository.getUserById(req.user);
  return res.status(200).json(account);
});

userRouter.get("/all", async (req, res) => {
  const users = await userRepository.getUsers();
  return res.status(200).json(users);
});

userRouter.get("/email/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).send("Email is required");
  }
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    return res.status(404).send("User not found");
  }
  return res.status(200).json(user);
});

userRouter.get("/groups", loginMiddleware, async (req, res) => {
  const groups = await groupRepository.getGroupsByUser(req.user);
  if (!groups) {
    return res.status(404).send("Groups not found");
  }
  return res.status(200).json(groups);
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ObjectID" });
  }
  const user = await userRepository.getUserById(id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  return res.status(200).json(user);
});

// TODO: À méditer
userRouter.get("/:id/groups", async (req, res) => {
  const { id } = req.params;
  const groups = await groupRepository.getGroupsByUser(id);
  if (!groups) {
    return res.status(404).send("Groups not found");
  }
  return res.status(200).json(groups);
});

userRouter.post("/register", async (req, res) => {
  let validation;
  try {
    validation = UserRegisterSchema.parse(req.body);

    console.log(validation);

    const { firstname, lastname, email, /*username,*/ password } = validation;
    UserModel.register(
      new UserModel({ firstname, lastname, email /*username*/ }),
      password,
      (err, user) => {
        if (err) {
          return res.status(500).send(err.message);
        }

        passport.authenticate("local")(req, res, () => {
          jwt.sign(
            {
              data: {
                user: user._id,
              },
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
            (err, token) => {
              return res.status(201).json({ token });
            },
          );
        });
      },
    );
  } catch (e) {
    return res.status(400).send(e);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send("Email and password are required");
    }
    const user = await UserModel.findOne({
      email: req.body.email,
    }).exec();

    req.login(user, (err) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      passport.authenticate("local")(
        req,
        res,
        () => {
          jwt.sign(
            {
              user: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
            (err, token) => {
              return res.status(200).json({ token });
            },
          );
        },
        (err) => {
          return res.status(401).send(err.content);
        },
      );
    });
  } catch (e) {
    return res.status(400).send(e);
  }
});

userRouter.get("/login/google", (req, res) => {
  if (!req.query.redirectUrl) {
    res.status(400).send("no redirectUrl specified");
  }

  const redirectUrl = req.query.redirectUrl;
  const state = JSON.stringify({ redirectUrl });

  passport.authenticate("google", {
    state,
    scope: ["profile", "email"],
  })(req, res);
});

userRouter.get(
  "/login/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const { redirectUrl } = JSON.parse(req.query.state);
    jwt.sign(
      {
        user: req.user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
      (err, token) => {
        return res.redirect(`${redirectUrl}?token=${token}`);
      },
    );
  },
);

userRouter.get("/login/facebook", passport.authenticate("facebook"));

userRouter.get("/login/facebook/callback", (req, res) => {
  passport.authenticate("facebook", { failureRedirect: "/" })(req, res, () => {
    jwt.sign(
      {
        user: req.user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
      (err, token) => {
        return res.status(200).json({ token });
      },
    );
  });
});

userRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userToUpdate = await userRepository.getUserById(id);
    if (!userToUpdate) {
      return res.status(404).send("User not found");
    }
    await userRepository.updateUser(id, req.body);
    return res.status(200).send("User updated");
  } catch (e) {
    return res.status(400).send(e);
  }
});

userRouter.post(
  "/updateImage",
  loginMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).send("File is not an image.");
      }

      const user = req.user;
      const extension = file.originalname.split(".");

      const blobName = [user, extension[extension.length - 1]].join(".");
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });

      return res.status(200).send(`${blockBlobClient.url}`);
    } catch (error) {
      console.error("Error uploading file to Azure Blob Storage:", error);
      return res.status(500).send("Error uploading file.");
    }
  },
);

userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await userRepository.deleteUser(id);
  return res.status(204).send("User deleted");
});

export default userRouter;
