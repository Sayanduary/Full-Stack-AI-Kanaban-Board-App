import bcrypt from "bcryptjs";
import { query } from "../config/db.js";
import { sign_token } from "../utils/jwt.js";
import { ApiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const public_user = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  avatar_url: u.avatar_url,
  created_at: u.created_at,
});

const register = asyncHandler(async (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const { password } = req.body;
  if (!name) throw new ApiError.badRequest("name is required");
  if (!password) throw new ApiError.badRequest("password is required");
  if (!EMAIL_RE.test(email))
    throw ApiError.badRequest("A valid email is required");
  const existing = await query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rows.length)
    throw new ApiError.conflict("Email is already registered");
  const password_hash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `INSERT INTO users(name,email,password_hash)
     VALUES ($1,$2,$3)
     RETURNING id, name, email, avatar_url, created_at`,
    [name, email, password_hash],
  );
  const user = rows[0];
  const token = sign_token({ id: user.id, email: user.email, name: user.name });
  res.status(201).json({ user: public_user(user), token });
});

const login = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const { password } = req.body;

  if (!email || !password)
    throw new ApiError.badRequest("Email and Password are required");
  const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user) throw new ApiError.unauthorized("Invalid email or password");
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new ApiError.badRequest("Password is Incorrect");

  const token = sign_token({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  res.status(200).json({
    user: public_user(user),
    token,
  });
});

const me = asyncHandler(async (req, res) => {
  const { rows } = await query(
    "SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1",
    [req.user.id],
  );
  if (!rows.length) throw new ApiError.notFound("User Not Found");
  res.status(200).json({
    user: rows[0],
  });
});

export { register, login, me };
