/*
  Warnings:

  - You are about to drop the column `observacoes` on the `topico` table. All the data in the column will be lost.
  - You are about to drop the column `situacao_id` on the `topico` table. All the data in the column will be lost.
  - You are about to drop the `situacao_topico` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `topico` DROP FOREIGN KEY `topico_situacao_id_fkey`;

-- DropIndex
DROP INDEX `topico__situacao_id_fkey` ON `topico`;

-- AlterTable
ALTER TABLE `topico` DROP COLUMN `observacoes`,
    DROP COLUMN `situacao_id`;

-- DropTable
DROP TABLE `situacao_topico`;
