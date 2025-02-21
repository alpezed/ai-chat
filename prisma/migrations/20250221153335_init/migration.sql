/*
  Warnings:

  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_ChatToUser_B_index";

-- DropIndex
DROP INDEX "_ChatToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ChatToUser";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "userId" TEXT,
    "createdAd" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("createdAd", "id", "title", "updatedAt") SELECT "createdAd", "id", "title", "updatedAt" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
