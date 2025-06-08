/*
  Warnings:

  - The primary key for the `attendenceReply` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `attendenceReply` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `attendenceThread` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `attendenceThread` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `attendenceThreadId` on the `attendenceReply` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "attendenceReply" DROP CONSTRAINT "attendenceReply_attendenceThreadId_fkey";

-- DropIndex
DROP INDEX "attendenceReply_id_key";

-- DropIndex
DROP INDEX "attendenceThread_id_key";

-- AlterTable
ALTER TABLE "attendenceReply" DROP CONSTRAINT "attendenceReply_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "attendenceThreadId",
ADD COLUMN     "attendenceThreadId" INTEGER NOT NULL,
ADD CONSTRAINT "attendenceReply_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "attendenceThread" DROP CONSTRAINT "attendenceThread_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "attendenceThread_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "attendenceReply" ADD CONSTRAINT "attendenceReply_attendenceThreadId_fkey" FOREIGN KEY ("attendenceThreadId") REFERENCES "attendenceThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
