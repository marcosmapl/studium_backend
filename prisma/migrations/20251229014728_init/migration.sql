/*
  Warnings:

  - You are about to drop the column `uf` on the `unidade_federativa` table. All the data in the column will be lost.
  - Added the required column `nome` to the `unidade_federativa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sigla` to the `unidade_federativa` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `unidade_federativa_uf_idx` ON `unidade_federativa`;

-- AlterTable
ALTER TABLE `unidade_federativa` DROP COLUMN `uf`,
    ADD COLUMN `nome` VARCHAR(191) NOT NULL,
    ADD COLUMN `sigla` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `unidade_federativa_nome_idx` ON `unidade_federativa`(`nome`);

-- CreateIndex
CREATE INDEX `unidade_federativa_sigla_idx` ON `unidade_federativa`(`sigla`);
