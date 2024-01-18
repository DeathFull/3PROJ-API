import express from "express";
import passport from "passport";
import { UserModel } from "../models/UserModel.js";
import userRepository from "../repositories/UserRepository.js";
import { z } from "zod";;
const router = express.Router();

router.get("/",(req,res) => {

});

const UserRegisterSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});



