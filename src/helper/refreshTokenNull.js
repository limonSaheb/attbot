import jwt from "jsonwebtoken";
import AppErrors from "../errors/AppErrors.js";
import { CookieHelper } from "./cookieHelper.js";
export const refreshTokenToNull = (res, token) => {
  const decoded = jwt.decode(token);
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  if (decoded.exp < currentTimeInSeconds) {
    CookieHelper.clearTheCookie(res, "refreshToken");
    throw new AppErrors(403, "Session expired. Please login again.");
  }

  return true;
};
