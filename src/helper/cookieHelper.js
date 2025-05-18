import * as dotenv from "dotenv";
dotenv.config();

const setCookie = (res, key, value) => {
  res.cookie(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    domain:
      process.env.NODE_ENV === "production" ? ".manager.asgshop.my" : undefined, // Allow subdomains
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const clearTheCookie = (res, key) => {
  res.clearCookie(key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    domain:
      process.env.NODE_ENV === "production" ? ".manager.asgshop.my" : undefined, // Match the domain
    path: "/",
  });
};

export const CookieHelper = {
  setCookie,
  clearTheCookie,
};
