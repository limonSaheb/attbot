/*
  Warnings:

  - You are about to drop the column `checkInTime` on the `attendenceReply` table. All the data in the column will be lost.
  - You are about to drop the column `checkOutTime` on the `attendenceReply` table. All the data in the column will be lost.
  - You are about to drop the column `earlyLeaveReason` on the `attendenceReply` table. All the data in the column will be lost.
  - You are about to drop the column `earlyLeaveRequest` on the `attendenceReply` table. All the data in the column will be lost.
  - You are about to drop the column `goal` on the `attendenceReply` table. All the data in the column will be lost.
  - You are about to drop the column `workUpdate` on the `attendenceReply` table. All the data in the column will be lost.
  - You are about to drop the column `msg` on the `attendenceThread` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `attendenceReply` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `attendenceThread` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "attendenceReply" DROP COLUMN "checkInTime",
DROP COLUMN "checkOutTime",
DROP COLUMN "earlyLeaveReason",
DROP COLUMN "earlyLeaveRequest",
DROP COLUMN "goal",
DROP COLUMN "workUpdate";

-- AlterTable
ALTER TABLE "attendenceThread" DROP COLUMN "msg";

-- CreateTable
CREATE TABLE "updateThread" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "updateThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "updateReply" (
    "id" SERIAL NOT NULL,
    "updateThreadId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "workUpdate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "updateReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "updateThread_id_key" ON "updateThread"("id");

-- CreateIndex
CREATE UNIQUE INDEX "updateReply_id_key" ON "updateReply"("id");

-- CreateIndex
CREATE UNIQUE INDEX "attendenceReply_id_key" ON "attendenceReply"("id");

-- CreateIndex
CREATE UNIQUE INDEX "attendenceThread_id_key" ON "attendenceThread"("id");

-- AddForeignKey
ALTER TABLE "updateReply" ADD CONSTRAINT "updateReply_updateThreadId_fkey" FOREIGN KEY ("updateThreadId") REFERENCES "updateThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
