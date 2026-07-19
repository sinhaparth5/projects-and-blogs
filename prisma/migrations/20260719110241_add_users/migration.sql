-- AlterTable
ALTER TABLE "Article" ADD COLUMN "authorId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Seed the two article owners so existing articles can be backfilled safely.
INSERT INTO "User" ("id", "username", "displayName", "updatedAt")
VALUES
    ('demo_parth', 'parth', 'Parth Sinha', CURRENT_TIMESTAMP),
    ('demo_shine', 'shine', 'Shine', CURRENT_TIMESTAMP);

UPDATE "Article"
SET "authorId" = CASE
    WHEN "blog" = 'pb' THEN 'demo_parth'
    WHEN "blog" = 'sb' THEN 'demo_shine'
END;

ALTER TABLE "Article" ALTER COLUMN "authorId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Article_authorId_idx" ON "Article"("authorId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
