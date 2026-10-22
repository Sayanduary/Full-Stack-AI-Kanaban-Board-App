import express from "express";
import { auth_router } from "./auth.routes.js";
export const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

router.use("/auth", auth_router);
