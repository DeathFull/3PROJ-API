import express from "express";
import userRepository from "../repositories/UserRepository.js";
import {z} from "zod";
import {UserModel} from "../models/UserModel.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

const UserRegisterSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  // username: z.string(),
  password: z.string().min(6),
});

userRouter.get("/", async (req, res) => {
  const users = await userRepository.getUsers();
  res.json(users);
});

userRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  const user = await userRepository.getUserById(id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
});

userRouter.get("/:idGroup", async (req, res) => {
  const {idGroup} = req.params;
  const users = await userRepository.getUsersByGroup(idGroup);
  res.json(users);
});

userRouter.post("/register", async (req, res) => {
  let validation;
  try {
    validation = UserRegisterSchema.parse(req.body);
  } catch (e) {
    return res.status(400).send(e);
  }

  console.log(validation);

  const {firstname, lastname, email, /*username,*/ password} = validation;
  UserModel.register(
    new UserModel({firstname, lastname, email, /*username*/}),
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
          {expiresIn: "2h"},
          (err, token) => {
            return res.status(201).json({token});
          },
        );
      });
    },
  );
});

userRouter.post("/login", async (req, res) => {
  const user = new UserModel({
    // username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

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
          {expiresIn: "2h"},
          (err, token) => {
            return res.status(201).json({token});
          },
        );
      },
      (err) => {
        return res.status(401).send(err.content);
      },
    );
  });
});

  userRouter.get("/login/google", (req, res) => {
  passport.authenticate("google", {scope: ["profile", "email"]})(req, res);
});

userRouter.get("/login/google/callback", (req, res) => {
  passport.authenticate("google", {failureRedirect: "/login"})(req, res, () => {
    jwt.sign(
      {
        user: req.user._id,
      },
      process.env.JWT_SECRET,
      {expiresIn: "2h"},
      (err, token) => {
        return res.status(201).json({token});
      },
    );
  });

});

userRouter.put("/:id", async (req, res) => {
  const {id} = req.params;
  const userToUpdate = await userRepository.getUserById(id);
  if (!userToUpdate) {
    return res.status(404).send("User not found");
  }
  await userRepository.updateUser(id, req.body);
  res.status(200).send("User updated");
});

userRouter.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await userRepository.deleteUser(id);
  res.status(204).send("User deleted");
});

export default userRouter;
