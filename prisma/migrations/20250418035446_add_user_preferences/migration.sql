/*
  Warnings:

  - You are about to drop the column `prevProjectId` on the `UserPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "prevProjectId",
ADD COLUMN     "selectedProjectId" TEXT;
