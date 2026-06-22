/*
  Warnings:

  - You are about to drop the column `published` on the `Recipe` table. All the data in the column will be lost.
  - Made the column `ingredients` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `instructions` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ingredients" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT,
    "preparationTime" INTEGER,
    "servings" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Recipe" ("createdAt", "description", "id", "ingredients", "instructions", "title", "updatedAt") SELECT "createdAt", "description", "id", "ingredients", "instructions", "title", "updatedAt" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
