/*
  Warnings:

  - You are about to drop the column `unidade_federativa_id` on the `cidade` table. All the data in the column will be lost.
  - You are about to drop the column `situacao_id` on the `plano_estudo` table. All the data in the column will be lost.
  - You are about to alter the column `numero` on the `revisao` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `desempenho` on the `revisao` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(3,1)`.
  - You are about to drop the column `categoria_id` on the `sessao_estudo` table. All the data in the column will be lost.
  - You are about to drop the column `situacao_id` on the `sessao_estudo` table. All the data in the column will be lost.
  - You are about to drop the column `fotoUrl` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `genero_id` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `situacao_id` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `bloco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categoria_sessao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disciplina_planejamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `genero_usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planejamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `situacao_plano` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `situacao_sessao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `situacao_usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `unidade_federativa` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[descricao,unidadeFederativa]` on the table `cidade` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero,topico_id]` on the table `revisao` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unidadeFederativa` to the `cidade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horas_semanais` to the `disciplina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situacao` to the `plano_estudo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situacao_revisao` to the `revisao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoriaSessao` to the `sessao_estudo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situacaoSessao` to the `sessao_estudo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generoUsuario` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situacaoUsuario` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bloco` DROP FOREIGN KEY `bloco_disciplina_planejamento_id_fkey`;

-- DropForeignKey
ALTER TABLE `cidade` DROP FOREIGN KEY `cidade_unidade_federativa_id_fkey`;

-- DropForeignKey
ALTER TABLE `disciplina_planejamento` DROP FOREIGN KEY `disciplina_planejamento_disciplina_id_fkey`;

-- DropForeignKey
ALTER TABLE `disciplina_planejamento` DROP FOREIGN KEY `disciplina_planejamento_planejamento_id_fkey`;

-- DropForeignKey
ALTER TABLE `planejamento` DROP FOREIGN KEY `planejamento_plano_estudo_id_fkey`;

-- DropForeignKey
ALTER TABLE `plano_estudo` DROP FOREIGN KEY `plano_estudo_situacao_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_categoria_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_situacao_id_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_genero_id_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_situacao_id_fkey`;

-- DropIndex
DROP INDEX `cidade__unidade_federativa_id_fkey` ON `cidade`;

-- DropIndex
DROP INDEX `cidade_descricao_unidade_federativa_id_key` ON `cidade`;

-- DropIndex
DROP INDEX `plano_estudo__situacao_id_fkey` ON `plano_estudo`;

-- DropIndex
DROP INDEX `sessao_estudo__categoria_sessao_id_fkey` ON `sessao_estudo`;

-- DropIndex
DROP INDEX `sessao_estudo__situacao_sessao_id_fkey` ON `sessao_estudo`;

-- DropIndex
DROP INDEX `usuario__genero_id_fkey` ON `usuario`;

-- DropIndex
DROP INDEX `usuario__situacao_id_fkey` ON `usuario`;

-- AlterTable
ALTER TABLE `cidade` DROP COLUMN `unidade_federativa_id`,
    ADD COLUMN `unidadeFederativa` ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO') NOT NULL;

-- AlterTable
ALTER TABLE `disciplina` ADD COLUMN `conhecimento` DECIMAL(3, 1) NOT NULL DEFAULT 0,
    ADD COLUMN `horas_semanais` DECIMAL(4, 2) NOT NULL,
    ADD COLUMN `importancia` DECIMAL(3, 1) NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `plano_estudo` DROP COLUMN `situacao_id`,
    ADD COLUMN `domingo_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `domingo_horas` DECIMAL(4, 2) NOT NULL DEFAULT 0.0,
    ADD COLUMN `quarta_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quarta_horas` DECIMAL(4, 2) NOT NULL DEFAULT 0.0,
    ADD COLUMN `quinta_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `quinta_horas` DECIMAL(4, 2) NOT NULL DEFAULT 0.0,
    ADD COLUMN `sabado_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sabado_horas` DECIMAL(4, 2) NOT NULL DEFAULT 0.0,
    ADD COLUMN `segunda_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `segunda_horas` DECIMAL(4, 2) NOT NULL DEFAULT 0.0,
    ADD COLUMN `sexta_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sexta_horas` DECIMAL(4, 2) NOT NULL DEFAULT 0.0,
    ADD COLUMN `situacao` ENUM('NOVO', 'EM_ANDAMENTO', 'CONCLUIDO', 'EXCLUIDO') NOT NULL,
    ADD COLUMN `terca_ativo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `terca_horas` DECIMAL(4, 2) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `revisao` ADD COLUMN `situacao_revisao` ENUM('AGENDADA', 'IGNORADA', 'CANCELADA', 'EM_ANDAMENTO', 'PAUSADA', 'CONCLUIDA') NOT NULL,
    MODIFY `numero` TINYINT NOT NULL,
    MODIFY `tempo_estudo` DECIMAL(4, 2) NOT NULL DEFAULT 0.0,
    MODIFY `desempenho` DECIMAL(3, 1) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `sessao_estudo` DROP COLUMN `categoria_id`,
    DROP COLUMN `situacao_id`,
    ADD COLUMN `blocoEstudoId` INTEGER NULL,
    ADD COLUMN `categoriaSessao` ENUM('TEORIA', 'REVISAO', 'RESOLUCAO_QUESTOES', 'LEITURA', 'OUTROS') NOT NULL,
    ADD COLUMN `concluida` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `situacaoSessao` ENUM('AGENDADA', 'CANCELADA', 'EM_ANDAMENTO', 'PAUSADA', 'CONCLUIDA') NOT NULL,
    MODIFY `data_termino` DATETIME(3) NULL,
    MODIFY `tempo_estudo` DECIMAL(4, 2) NOT NULL DEFAULT 0.0,
    MODIFY `observacoes` TEXT NULL;

-- AlterTable
ALTER TABLE `topico` MODIFY `estabilidade` DECIMAL(2, 1) NOT NULL DEFAULT 1.0,
    MODIFY `dificuldade` DECIMAL(2, 1) NOT NULL DEFAULT 5.0;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `fotoUrl`,
    DROP COLUMN `genero_id`,
    DROP COLUMN `situacao_id`,
    ADD COLUMN `generoUsuario` ENUM('FEMININO', 'MASCULINO', 'OUTRO') NOT NULL,
    ADD COLUMN `situacaoUsuario` ENUM('ATIVO', 'BLOQUEADO', 'INATIVO', 'EXCLUIDO') NOT NULL;

-- DropTable
DROP TABLE `bloco`;

-- DropTable
DROP TABLE `categoria_sessao`;

-- DropTable
DROP TABLE `disciplina_planejamento`;

-- DropTable
DROP TABLE `genero_usuario`;

-- DropTable
DROP TABLE `planejamento`;

-- DropTable
DROP TABLE `situacao_plano`;

-- DropTable
DROP TABLE `situacao_sessao`;

-- DropTable
DROP TABLE `situacao_usuario`;

-- DropTable
DROP TABLE `unidade_federativa`;

-- CreateTable
CREATE TABLE `bloco_estudo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordem` TINYINT NOT NULL,
    `dia_semana` TINYINT NOT NULL,
    `total_horas_planejadas` DECIMAL(4, 2) NOT NULL,
    `concluido` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `plano_estudo_id` INTEGER NOT NULL,
    `disciplina_id` INTEGER NOT NULL,

    INDEX `bloco_estudo__plano_estudo_id_fkey`(`plano_estudo_id`),
    INDEX `bloco_estudo__disciplina_id_fkey`(`disciplina_id`),
    INDEX `bloco_estudo_dia_semana_idx`(`dia_semana`),
    UNIQUE INDEX `bloco_estudo_plano_estudo_id_dia_semana_ordem_key`(`plano_estudo_id`, `dia_semana`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `cidade__unidade_federativa_idx` ON `cidade`(`unidadeFederativa`);

-- CreateIndex
CREATE UNIQUE INDEX `cidade_descricao_unidadeFederativa_key` ON `cidade`(`descricao`, `unidadeFederativa`);

-- CreateIndex
CREATE INDEX `plano_estudo__concurso_idx` ON `plano_estudo`(`concurso`);

-- CreateIndex
CREATE INDEX `plano_estudo__banca_idx` ON `plano_estudo`(`banca`);

-- CreateIndex
CREATE INDEX `plano_estudo__situacao_idx` ON `plano_estudo`(`situacao`);

-- CreateIndex
CREATE UNIQUE INDEX `revisao_numero_topico_id_key` ON `revisao`(`numero`, `topico_id`);

-- CreateIndex
CREATE INDEX `sessao_estudo__categoria_idx` ON `sessao_estudo`(`categoriaSessao`);

-- CreateIndex
CREATE INDEX `sessao_estudo__situacao_idx` ON `sessao_estudo`(`situacaoSessao`);

-- CreateIndex
CREATE INDEX `sessao_estudo__bloco_estudo_id_fkey` ON `sessao_estudo`(`blocoEstudoId`);

-- AddForeignKey
ALTER TABLE `sessao_estudo` ADD CONSTRAINT `sessao_estudo_blocoEstudoId_fkey` FOREIGN KEY (`blocoEstudoId`) REFERENCES `bloco_estudo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bloco_estudo` ADD CONSTRAINT `bloco_estudo_plano_estudo_id_fkey` FOREIGN KEY (`plano_estudo_id`) REFERENCES `plano_estudo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bloco_estudo` ADD CONSTRAINT `bloco_estudo_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `plano_estudo` RENAME INDEX `plano_estudo_titulo_idx` TO `plano_estudo__titulo_idx`;

-- RenameIndex
ALTER TABLE `revisao` RENAME INDEX `revisao_data_programada_idx` TO `revisao__data_programada_idx`;

-- RenameIndex
ALTER TABLE `revisao` RENAME INDEX `revisao_data_realizada_idx` TO `revisao__data_realizada_idx`;

-- RenameIndex
ALTER TABLE `sessao_estudo` RENAME INDEX `sessao_estudo_data_inicio_idx` TO `sessao_estudo__data_inicio_idx`;

-- RenameIndex
ALTER TABLE `sessao_estudo` RENAME INDEX `sessao_estudo_data_termino_idx` TO `sessao_estudo__data_termino_idx`;

-- RenameIndex
ALTER TABLE `sessao_estudo` RENAME INDEX `sessao_estudo_topico_finalizado_idx` TO `sessao_estudo__topico_finalizado_idx`;
