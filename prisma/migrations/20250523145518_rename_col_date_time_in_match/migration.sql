/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Match` table. All the data in the column will be lost.
  - Added the required column `date` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Match` DROP COLUMN `dateTime`,
    ADD COLUMN `date` DATETIME(3) NOT NULL;
