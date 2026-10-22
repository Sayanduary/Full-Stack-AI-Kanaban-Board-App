import jwt from "jsonwebtoken";

export const sign_token = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verify_token = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
