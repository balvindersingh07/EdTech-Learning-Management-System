-- Persisted LMS snapshot (single row id = 1)
CREATE TABLE "AppStateSnapshot" (
    "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
    "payload" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Align User with Prisma schema (accountStatus used by auth flows)
ALTER TABLE "User" ADD COLUMN "accountStatus" TEXT NOT NULL DEFAULT 'active';
