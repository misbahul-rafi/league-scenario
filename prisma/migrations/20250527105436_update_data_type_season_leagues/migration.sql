/*
  Warnings:

  - You are about to alter the column `season` on the `League` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `League` MODIFY `season` INTEGER NOT NULL;
