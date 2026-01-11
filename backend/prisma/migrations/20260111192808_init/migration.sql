/*
  Warnings:

  - You are about to drop the column `data_prova_at` on the `plano_estudo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `plano_estudo` DROP COLUMN `data_prova_at`,
    ADD COLUMN `data_prova` DATETIME(3) NULL;
