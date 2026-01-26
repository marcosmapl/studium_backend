/*
  Warnings:

  - You are about to drop the column `familiaridade` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `disciplina_planejamento` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `planejamento` table. All the data in the column will be lost.
  - You are about to drop the column `data_fim` on the `planejamento` table. All the data in the column will be lost.
  - You are about to drop the column `data_inicio` on the `planejamento` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade_dias` on the `planejamento` table. All the data in the column will be lost.
  - You are about to drop the column `total_horas_semana` on the `planejamento` table. All the data in the column will be lost.
  - You are about to drop the column `categoria_id` on the `revisao` table. All the data in the column will be lost.
  - You are about to drop the column `situacao_id` on the `revisao` table. All the data in the column will be lost.
  - You are about to drop the `alocacao_horario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categoria_revisao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dia_estudo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `situacao_revisao` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `revisao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `alocacao_horario` DROP FOREIGN KEY `alocacao_horario_dia_estudo_id_fkey`;

-- DropForeignKey
ALTER TABLE `alocacao_horario` DROP FOREIGN KEY `alocacao_horario_disciplina_cronograma_id_fkey`;

-- DropForeignKey
ALTER TABLE `dia_estudo` DROP FOREIGN KEY `dia_estudo_planejamento_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_categoria_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_situacao_id_fkey`;

-- DropIndex
DROP INDEX `revisao__categoria_revisao_id_fkey` ON `revisao`;

-- DropIndex
DROP INDEX `revisao__situacao_revisao_id_fkey` ON `revisao`;

-- AlterTable
ALTER TABLE `disciplina` DROP COLUMN `familiaridade`,
    DROP COLUMN `peso`,
    ADD COLUMN `cor` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF';

-- AlterTable
ALTER TABLE `disciplina_planejamento` DROP COLUMN `observacoes`;

-- AlterTable
ALTER TABLE `planejamento` DROP COLUMN `ativo`,
    DROP COLUMN `data_fim`,
    DROP COLUMN `data_inicio`,
    DROP COLUMN `quantidade_dias`,
    DROP COLUMN `total_horas_semana`,
    ADD COLUMN `domingo_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `domingo_horas` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `quarta_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quarta_horas` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `quinta_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quinta_horas` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `sabado_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sabado_horas` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `segunda_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `segunda_horas` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `sexta_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sexta_horas` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `terca_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `terca_horas` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `revisao` DROP COLUMN `categoria_id`,
    DROP COLUMN `situacao_id`,
    ADD COLUMN `concluida` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `alocacao_horario`;

-- DropTable
DROP TABLE `categoria_revisao`;

-- DropTable
DROP TABLE `dia_estudo`;

-- DropTable
DROP TABLE `situacao_revisao`;

-- CreateTable
CREATE TABLE `bloco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia_semana` TINYINT NOT NULL,
    `ordem` TINYINT NOT NULL,
    `horas_planejadas` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `disciplina_planejamento_id` INTEGER NOT NULL,

    INDEX `bloco_disciplina_planejamento_id_idx`(`disciplina_planejamento_id`),
    INDEX `bloco_dia_semana_idx`(`dia_semana`),
    UNIQUE INDEX `bloco_dia_semana_disciplina_planejamento_id_key`(`dia_semana`, `disciplina_planejamento_id`),
    UNIQUE INDEX `bloco_dia_semana_ordem_key`(`dia_semana`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bloco` ADD CONSTRAINT `bloco_disciplina_planejamento_id_fkey` FOREIGN KEY (`disciplina_planejamento_id`) REFERENCES `disciplina_planejamento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
