import express from "express";
const app = express();
import bodyParser from "body-parser";
import prisma from "./app/utlis/prisma.js";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";
import cookieParser from "cookie-parser";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

//test routes
app.get("/health", async (req, res) => {
  const response = await prisma.$queryRaw`SELECT 1`;
  res.json({
    status: "OK",
    response,
  });
});

app.use(globalErrorHandler);

export default app;
