-- CreateTable
CREATE TABLE "ApiRoute" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "params" JSONB,
    "query" JSONB,
    "body" JSONB,
    "responses" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiRoute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApiRoute" ADD CONSTRAINT "ApiRoute_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
