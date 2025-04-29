/*
  Warnings:

  - You are about to drop the `SiemEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SiemRule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SiemEvent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SiemRule";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "InsightsRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "query" TEXT NOT NULL,
    "logGroup" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "triggers" INTEGER NOT NULL DEFAULT 0,
    "lastTriggered" DATETIME,
    "lastExecuted" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "credentialId" TEXT NOT NULL,
    CONSTRAINT "InsightsRule_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "AwsCredential" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Detection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ruleId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Detection_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "InsightsRule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "InsightsRule_credentialId_idx" ON "InsightsRule"("credentialId");

-- CreateIndex
CREATE INDEX "Detection_ruleId_idx" ON "Detection"("ruleId");

-- CreateIndex
CREATE INDEX "Detection_timestamp_idx" ON "Detection"("timestamp");

-- CreateIndex
CREATE INDEX "Detection_severity_idx" ON "Detection"("severity");

-- CreateIndex
CREATE INDEX "Detection_acknowledged_idx" ON "Detection"("acknowledged");
