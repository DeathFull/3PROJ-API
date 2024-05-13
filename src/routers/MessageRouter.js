import express from "express";
import messageRepository from "../repositories/MessageRepository.js";


const messageRouter = express.Router();

messageRouter.get("/", async (req, res) => {
  const messages = await messageRepository.getMessages();
  res.json(messages);
})

messageRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  const message = await messageRepository.getMessageById(id)
  if (!message) {
    res.status(404).send("Message not found");
  }
  res.json(message);
})

messageRouter.post("/", async (req, res) => {
  try {
    const message = await messageRepository.createMessage(req.body);
    res.status(201).json(message);
  } catch (e) {
    return res.status(400).send(e);
  }
})

messageRouter.put("/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const messageToUpdate = await messageRepository.getMessageById(id);
    if (!messageToUpdate) {
      return res.status(404).send("Message not found");
    }
    await messageRepository.updateMessage(id, req.body)
    res.status(200).send("Message updated")
  } catch (e) {
    return res.status(400).send(e);
  }
})

messageRouter.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await messageRepository.deleteMessage(id);
  res.status(204).send("Message deleted")
})

