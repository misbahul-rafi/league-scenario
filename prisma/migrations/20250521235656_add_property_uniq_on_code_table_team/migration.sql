/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Team_code_key` ON `Team`(`code`);
