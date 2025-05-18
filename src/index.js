import app from "./app.js";
import config from "./app/config/index.js";
import prisma from "./app/utlis/prisma.js";
let server;

main().catch((err) => console.log(err));

async function main() {
  try {
    const response = await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful!", response);
    server = app.listen(config.port, () => {
      console.log(`Server is Running http://localhost:${config.port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

process.on("unhandledRejection", () => {
  console.log("Unhandled Rejection is detected , shutting down ...");
  //For Asynchronous operations
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (e) => {
  console.log("Unhandled Exception is detected , shutting down ...");
  console.log(e);
  //For Synchronous operations
  process.exit(1);
});

const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing server...`);

  try {
    await prisma.$disconnect();
    console.log("✅ Prisma connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Shutdown error:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
