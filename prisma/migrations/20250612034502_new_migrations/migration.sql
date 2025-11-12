-- CreateTable
CREATE TABLE "labbaikBot" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "labbaikBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendenceThread" (
    "id" SERIAL NOT NULL,
    "msg" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendenceThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendenceReply" (
    "id" SERIAL NOT NULL,
    "attendenceThreadId" INTEGER NOT NULL,
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

-- AddForeignKey
ALTER TABLE "attendenceReply" ADD CONSTRAINT "attendenceReply_attendenceThreadId_fkey" FOREIGN KEY ("attendenceThreadId") REFERENCES "attendenceThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
