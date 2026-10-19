import jwt from "jsonwebtoken";

export const sign_token = (payload) => {
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verify_token = (token) => {
  jwt.verify(token, process.env.JWT_SECRET);
};
