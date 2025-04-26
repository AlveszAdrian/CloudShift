-- CreateTable
CREATE TABLE "SiemRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "triggers" INTEGER NOT NULL DEFAULT 0,
    "lastTriggered" DATETIME,
    "credentialId" TEXT NOT NULL,
    CONSTRAINT "SiemRule_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "AwsCredential" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiemEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL,
    "source" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "message" TEXT NOT NULL,
    "rawData" TEXT NOT NULL,
    "accountId" TEXT,
    "region" TEXT,
    "resource" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "credentialId" TEXT NOT NULL,
    "ruleId" TEXT,
    CONSTRAINT "SiemEvent_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "AwsCredential" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SiemEvent_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "SiemRule" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SiemRule_credentialId_idx" ON "SiemRule"("credentialId");

-- CreateIndex
CREATE INDEX "SiemEvent_credentialId_idx" ON "SiemEvent"("credentialId");

-- CreateIndex
CREATE INDEX "SiemEvent_ruleId_idx" ON "SiemEvent"("ruleId");
