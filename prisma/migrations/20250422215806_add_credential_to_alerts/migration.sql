-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "credentialId" TEXT,
    CONSTRAINT "Alert_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "AwsCredential" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Alert" ("createdAt", "description", "id", "resourceId", "resourceType", "severity", "status", "title", "updatedAt") SELECT "createdAt", "description", "id", "resourceId", "resourceType", "severity", "status", "title", "updatedAt" FROM "Alert";
DROP TABLE "Alert";
ALTER TABLE "new_Alert" RENAME TO "Alert";
CREATE INDEX "Alert_credentialId_idx" ON "Alert"("credentialId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
