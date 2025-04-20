/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `ApiSpec` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApiSpec_projectId_key" ON "ApiSpec"("projectId");
