/*
  Warnings:

  - You are about to drop the `AttendenceReply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttendenceThread` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LabbaikBot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttendenceReply" DROP CONSTRAINT "AttendenceReply_AttendenceThreadId_fkey";

-- DropTable
DROP TABLE "AttendenceReply";

-- DropTable
DROP TABLE "AttendenceThread";

-- DropTable
DROP TABLE "LabbaikBot";

-- CreateTable
CREATE TABLE "labbaikBot" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "labbaikBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendenceThread" (
    "id" UUID NOT NULL,
    "msg" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendenceThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendenceReply" (
    "id" UUID NOT NULL,
    "attendenceThreadId" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workUpdate" TEXT,
    "checkOutTime" TIMESTAMP(3),
    "earlyLeaveRequest" TEXT,
    "earlyLeaveReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendenceReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendenceThread_id_key" ON "attendenceThread"("id");

-- CreateIndex
CREATE UNIQUE INDEX "attendenceReply_id_key" ON "attendenceReply"("id");

-- AddForeignKey
ALTER TABLE "attendenceReply" ADD CONSTRAINT "attendenceReply_attendenceThreadId_fkey" FOREIGN KEY ("attendenceThreadId") REFERENCES "attendenceThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
