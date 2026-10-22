import express from "express";
import { register, login, me } from "../controller/auth.controller.js";
import { require_auth } from "../middleware/auth.js";

export const auth_router = express.Router();

auth_router.post("/register", register);
auth_router.post("/login", login);
auth_router.get("/me", require_auth, me);
