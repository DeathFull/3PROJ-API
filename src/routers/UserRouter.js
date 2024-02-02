import express from "express";
import userRepository from "../repositories/UserRepository.js";
import {z} from "zod";

;
const router = express.Router();

const UserRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

router.get("/", async (req, res) => {
  const users = await userRepository.getUsers();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const {id} = req.params;
  const user = await userRepository.getUserById(id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
})

router.get("/:idGroup", async (req, res) => {
  const {idGroup} = req.params;
  const users = await userRepository.getUsersByGroup(idGroup);
  res.json(users);
})

router.post("/register", async (req, res) => {

})


router.post("/login", async (req, res) => {

})


router.put("/:id", async (req, res) => {
  const {id} = req.params;
  const userToUpdate = await userRepository.getUserById(id);
  if (!userToUpdate) {
    return res.status(404).send("User not found");
  }
  await userRepository.updateUser(id, req.body)
  res.status(200).send("User updated");
})


router.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await userRepository.deleteUser(id);
  res.status(204).send("User deleted")
})




