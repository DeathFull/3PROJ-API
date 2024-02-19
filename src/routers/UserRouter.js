import express from "express";
import userRepository from "../repositories/UserRepository.js";
import { z } from "zod";

const userRouter = express.Router();

const UserRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

userRouter.get("/", async (req, res) => {
  const users = await userRepository.getUsers();
  res.json(users);
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await userRepository.getUserById(id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
});

userRouter.get("/:idGroup", async (req, res) => {
  const { idGroup } = req.params;
  const users = await userRepository.getUsersByGroup(idGroup);
  res.json(users);
});

userRouter.post("/register", async (req, res) => {});

userRouter.post("/login", async (req, res) => {});

userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userToUpdate = await userRepository.getUserById(id);
  if (!userToUpdate) {
    return res.status(404).send("User not found");
  }
  await userRepository.updateUser(id, req.body);
  res.status(200).send("User updated");
});

userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await userRepository.deleteUser(id);
  res.status(204).send("User deleted");
});

export default userRouter;
