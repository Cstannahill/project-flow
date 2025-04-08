/*
  Warnings:

  - Changed the type of `method` on the `ApiRoute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

-- AlterTable
ALTER TABLE "ApiRoute" DROP COLUMN "method",
ADD COLUMN     "method" "HttpMethod" NOT NULL;
