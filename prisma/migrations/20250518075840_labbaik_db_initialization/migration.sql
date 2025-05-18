-- CreateTable
CREATE TABLE "LabbaikBot" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabbaikBot_pkey" PRIMARY KEY ("id")
);
