import express from "express";
import userRepository from "../repositories/UserRepository.js";
import {z} from "zod";
import UserRepository from "../repositories/UserRepository.js";

;
const router = express.Router();

const UserRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

router.get("/", async (req, res) => {
  const users = await userRepository.getUsers();
  res.json(users)
});

router.get("/:id", async (req, res) => {
  const {id} = req.params;
  const user = await userRepository.getUserById(id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
})

router.post("/register", async (req, res) => {

})


router.post("/login", async (req, res) => {

})


router.put("/:id", async (req, res) => {
  const {id} = req.params;
  const userToUpdate = await userRepository.getUserById(id);
  if (userToUpdate) {
    await UserRepository.updateUser(id, req.body)
  } else {
    return res.status(404).send("User not found");
  }
  res.status(200).send("User updated");
})


router.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await UserRepository.deleteUser(id);
  res.status(204).send("User deleted")
})




