/*
  Warnings:

  - Added the required column `msg` to the `AttendenceThread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttendenceThread" ADD COLUMN     "msg" TEXT NOT NULL;
