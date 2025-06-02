/*
  Warnings:

  - You are about to drop the column `point` on the `Leaderboard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,season]` on the table `League` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `season` to the `League` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Game_slug_key` ON `Game`;

-- DropIndex
DROP INDEX `Team_code_key` ON `Team`;

-- AlterTable
ALTER TABLE `Leaderboard` DROP COLUMN `point`;

-- AlterTable
ALTER TABLE `League` ADD COLUMN `season` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Game_name_key` ON `Game`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `League_code_season_key` ON `League`(`code`, `season`);

-- CreateIndex
CREATE UNIQUE INDEX `Team_name_key` ON `Team`(`name`);
