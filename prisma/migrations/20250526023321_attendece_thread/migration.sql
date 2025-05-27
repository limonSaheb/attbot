-- CreateTable
CREATE TABLE "AttendenceThread" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendenceThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendenceReply" (
    "id" UUID NOT NULL,
    "AttendenceThreadId" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL,
    "workUpdate" TEXT NOT NULL,
    "checkOutTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendenceReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendenceThread_id_key" ON "AttendenceThread"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AttendenceReply_id_key" ON "AttendenceReply"("id");

-- AddForeignKey
ALTER TABLE "AttendenceReply" ADD CONSTRAINT "AttendenceReply_AttendenceThreadId_fkey" FOREIGN KEY ("AttendenceThreadId") REFERENCES "AttendenceThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
