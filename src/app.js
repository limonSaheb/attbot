import express from "express";
const app = express();
import bodyParser from "body-parser";
import router from "./app/routes/index.js";
import prisma from "./app/utlis/prisma.js";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";
import cookieParser from "cookie-parser";

//MiddleWare
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //Middleware body parser
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies

//test routes
app.get("/health", async (req, res) => {
  const response = await prisma.$queryRaw`SELECT 1`;
  res.json({
    status: "OK",
    response,
  });
});

//api routes
app.use("/api/v1", router);

//global error
app.use(globalErrorHandler);

export default app;
