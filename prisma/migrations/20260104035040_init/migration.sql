/*
  Warnings:

  - You are about to drop the column `conhecimento` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `importancia` on the `disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `prioridade` on the `disciplina` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `disciplina` DROP COLUMN `conhecimento`,
    DROP COLUMN `importancia`,
    DROP COLUMN `prioridade`;

-- CreateTable
CREATE TABLE `disciplina_cronograma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `importancia` DECIMAL(10, 2) NOT NULL,
    `conhecimento` DECIMAL(10, 2) NOT NULL,
    `prioridade` DECIMAL(10, 2) NOT NULL,
    `horas_semanais` DOUBLE NOT NULL,
    `percentual_carga` DOUBLE NOT NULL,
    `observacoes` VARCHAR(191) NULL,
    `planejamento_id` INTEGER NOT NULL,
    `disciplina_id` INTEGER NOT NULL,

    INDEX `disciplina_cronograma_planejamento_id_idx`(`planejamento_id`),
    INDEX `disciplina_cronograma_disciplina_id_idx`(`disciplina_id`),
    INDEX `disciplina_cronograma_prioridade_idx`(`prioridade`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dia_estudo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia_semana` INTEGER NOT NULL,
    `horas_planejadas` DOUBLE NOT NULL,
    `horas_alocadas` DOUBLE NOT NULL DEFAULT 0.0,
    `cronograma_id` INTEGER NOT NULL,

    INDEX `dia_estudo_cronograma_id_idx`(`cronograma_id`),
    INDEX `dia_estudo_dia_semana_idx`(`dia_semana`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alocacao_horario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `horas_alocadas` DOUBLE NOT NULL,
    `hora_inicio` VARCHAR(191) NULL,
    `hora_fim` VARCHAR(191) NULL,
    `ordem` INTEGER NOT NULL,
    `observacoes` VARCHAR(191) NULL,
    `dia_estudo_id` INTEGER NOT NULL,
    `disciplina_cronograma_id` INTEGER NOT NULL,

    INDEX `alocacao_horario_dia_estudo_id_idx`(`dia_estudo_id`),
    INDEX `alocacao_horario_disciplina_cronograma_id_idx`(`disciplina_cronograma_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cronograma_semanal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_inicio` DATETIME(3) NOT NULL,
    `data_fim` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `total_horas_semana` DOUBLE NOT NULL DEFAULT 0.0,
    `quantidade_dias` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `plano_estudo_id` INTEGER NOT NULL,

    INDEX `cronograma_semanal_plano_estudo_id_idx`(`plano_estudo_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `disciplina_cronograma` ADD CONSTRAINT `disciplina_cronograma_planejamento_id_fkey` FOREIGN KEY (`planejamento_id`) REFERENCES `cronograma_semanal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disciplina_cronograma` ADD CONSTRAINT `disciplina_cronograma_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dia_estudo` ADD CONSTRAINT `dia_estudo_cronograma_id_fkey` FOREIGN KEY (`cronograma_id`) REFERENCES `cronograma_semanal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alocacao_horario` ADD CONSTRAINT `alocacao_horario_dia_estudo_id_fkey` FOREIGN KEY (`dia_estudo_id`) REFERENCES `dia_estudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alocacao_horario` ADD CONSTRAINT `alocacao_horario_disciplina_cronograma_id_fkey` FOREIGN KEY (`disciplina_cronograma_id`) REFERENCES `disciplina_cronograma`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cronograma_semanal` ADD CONSTRAINT `cronograma_semanal_plano_estudo_id_fkey` FOREIGN KEY (`plano_estudo_id`) REFERENCES `plano_estudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
