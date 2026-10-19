import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import { router } from "./src/routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./src/middleware/errorHandler.js";

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({ name: "AI Kanaban Board API", status: "running" });
});

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Runnin on http://localhost:${PORT}`);
});
