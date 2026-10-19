import { config } from "dotenv";
config();

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    console.log("Applying schema...");

    await pool.query(sql);

    console.log("Schema applied successfully");
  } catch (error) {
    console.error("Failed to apply schema:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
