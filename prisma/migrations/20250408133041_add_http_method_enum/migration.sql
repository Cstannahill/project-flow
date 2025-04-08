/*
  Warnings:

  - Made the column `description` on table `ApiRoute` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ApiRoute" ALTER COLUMN "description" SET NOT NULL;
