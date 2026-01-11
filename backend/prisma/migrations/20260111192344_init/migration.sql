/*
  Warnings:

  - You are about to drop the column `descricao` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `paginas_lidas` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `questoes_acertos` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `questoes_erros` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `tempo_estudo` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `plano_estudo` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `plano_estudo` table. All the data in the column will be lost.
  - You are about to drop the column `paginas_lidas` on the `plano_estudo` table. All the data in the column will be lost.
  - You are about to drop the column `questoes_acertos` on the `plano_estudo` table. All the data in the column will be lost.
  - You are about to drop the column `questoes_erros` on the `plano_estudo` table. All the data in the column will be lost.
  - You are about to drop the column `tempo_estudo` on the `plano_estudo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `disciplina` DROP COLUMN `descricao`,
    DROP COLUMN `observacoes`,
    DROP COLUMN `paginas_lidas`,
    DROP COLUMN `questoes_acertos`,
    DROP COLUMN `questoes_erros`,
    DROP COLUMN `tempo_estudo`,
    ADD COLUMN `familiaridade` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `peso` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `plano_estudo` DROP COLUMN `descricao`,
    DROP COLUMN `observacoes`,
    DROP COLUMN `paginas_lidas`,
    DROP COLUMN `questoes_acertos`,
    DROP COLUMN `questoes_erros`,
    DROP COLUMN `tempo_estudo`,
    ADD COLUMN `banca` VARCHAR(191) NULL,
    ADD COLUMN `cargo` VARCHAR(191) NULL,
    ADD COLUMN `concurso` VARCHAR(191) NULL,
    ADD COLUMN `data_prova_at` DATETIME(3) NULL;
