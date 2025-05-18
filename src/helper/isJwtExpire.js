import jwt from "jsonwebtoken";
import AppErrors from "../errors/AppErrors.js";
export const isJwtExpired = (token) => {
  const decoded = jwt.decode(token);
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  if (decoded.exp < currentTimeInSeconds) {
    throw new AppErrors(403, "Session expired. Please login again.");
  }

  return true;
};
