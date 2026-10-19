import { verify_token } from "../utils/jwt.js";
import { ApiError } from "../utils/api.error.js";

export const require_auth = (req, _res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new ApiError.unauthorized("Missing authentication token");
    const decoded = verify_token(token);
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
    next();
  } catch (error) {
    if (error.isApiError) return next(error);
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};
