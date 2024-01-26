import express from "express";
import groupRepository from "../repositories/GroupRepository.js";


const router = express();

router.get("/", async (req, res) => {
  const groups = await groupRepository.getGroups();
  res.json(groups);
})

router.get("/:id", async (req, res) => {
  const {id} = req.params;
  const group = await groupRepository.getGroupById(id);
  if (!group) {
    return res.status(404).send("Group not found");
  }
  res.json(group);
})

router.post("/", async (req, res) => {
  const group = await groupRepository.createGroup(req.body);
  res.status(201).json(group);
})

router.put("/:id", async (req, res) => {
  const {id} = req.params;
  const groupToUpdate = await groupRepository.getGroupById(id);
  if (groupToUpdate) {
    await groupRepository.updateGroup(id, req.body)
  } else {
    return res.status(404).send("Group not found");
  }
  res.status(200).send("Group updated");
})

router.delete("/:id", async (req, res) => {
  const {id} = req.params;
  await groupRepository.deleteGroup(id);
  res.status(204).send("Group deleted")
})