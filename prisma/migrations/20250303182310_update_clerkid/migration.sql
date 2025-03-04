/*
  Warnings:

  - You are about to drop the column `userId` on the `Expenses` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Income` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `clerkId` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Expenses" DROP CONSTRAINT "Expenses_userId_fkey";

-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_userId_fkey";

-- AlterTable
ALTER TABLE "Expenses" DROP COLUMN "userId",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "userId",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("clerkId");

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
