/*
  Warnings:

  - The primary key for the `categoria_revisao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `categoria_revisao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `categoria_sessao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `categoria_sessao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `cidade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `cidade` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `unidade_federativa_id` on the `cidade` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `disciplina` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `disciplina` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `plano_id` on the `disciplina` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `genero_usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `genero_usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `plano_estudo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `plano_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `usuario_id` on the `plano_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `situacao_id` on the `plano_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `revisao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `revisao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `categoria_id` on the `revisao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `situacao_id` on the `revisao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `plano_estudo_id` on the `revisao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `disciplina_id` on the `revisao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `topico_id` on the `revisao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `sessao_estudo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `sessao_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `plano_estudo_id` on the `sessao_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `disciplina_id` on the `sessao_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `topico_id` on the `sessao_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `categoria_id` on the `sessao_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `situacao_id` on the `sessao_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `situacao_plano_estudo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `situacao_plano_estudo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `situacao_revisao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `situacao_revisao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `situacao_sessao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `situacao_sessao` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `situacao_topico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `situacao_topico` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `situacao_usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `situacao_usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `topico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `topico` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `plano_disciplina_id` on the `topico` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `situacao_id` on the `topico` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `unidade_federativa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `unidade_federativa` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `unidadeFederativaId` on the `usuario` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `genero_id` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `cidade_id` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `situacao_id` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Added the required column `grupo_usuario_id` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidade_federativa_id` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cidade` DROP FOREIGN KEY `cidade_unidade_federativa_id_fkey`;

-- DropForeignKey
ALTER TABLE `disciplina` DROP FOREIGN KEY `disciplina_plano_id_fkey`;

-- DropForeignKey
ALTER TABLE `plano_estudo` DROP FOREIGN KEY `plano_estudo_situacao_id_fkey`;

-- DropForeignKey
ALTER TABLE `plano_estudo` DROP FOREIGN KEY `plano_estudo_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_categoria_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_disciplina_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_plano_estudo_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_situacao_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_topico_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_categoria_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_disciplina_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_plano_estudo_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_situacao_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_topico_id_fkey`;

-- DropForeignKey
ALTER TABLE `topico` DROP FOREIGN KEY `topico_plano_disciplina_id_fkey`;

-- DropForeignKey
ALTER TABLE `topico` DROP FOREIGN KEY `topico_situacao_id_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_cidade_id_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_genero_id_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_situacao_id_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_unidadeFederativaId_fkey`;

-- DropIndex
DROP INDEX `cidade_unidade_federativa_id_fkey` ON `cidade`;

-- DropIndex
DROP INDEX `usuario_unidadeFederativaId_fkey` ON `usuario`;

-- AlterTable
ALTER TABLE `categoria_revisao` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `categoria_sessao` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `cidade` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `unidade_federativa_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `disciplina` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `plano_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `genero_usuario` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `plano_estudo` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `usuario_id` INTEGER NOT NULL,
    MODIFY `situacao_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `revisao` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `categoria_id` INTEGER NOT NULL,
    MODIFY `situacao_id` INTEGER NOT NULL,
    MODIFY `plano_estudo_id` INTEGER NOT NULL,
    MODIFY `disciplina_id` INTEGER NOT NULL,
    MODIFY `topico_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sessao_estudo` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `plano_estudo_id` INTEGER NOT NULL,
    MODIFY `disciplina_id` INTEGER NOT NULL,
    MODIFY `topico_id` INTEGER NOT NULL,
    MODIFY `categoria_id` INTEGER NOT NULL,
    MODIFY `situacao_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `situacao_plano_estudo` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `situacao_revisao` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `situacao_sessao` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `situacao_topico` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `situacao_usuario` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `topico` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `plano_disciplina_id` INTEGER NOT NULL,
    MODIFY `situacao_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `unidade_federativa` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `usuario` DROP PRIMARY KEY,
    DROP COLUMN `unidadeFederativaId`,
    ADD COLUMN `grupo_usuario_id` INTEGER NOT NULL,
    ADD COLUMN `unidade_federativa_id` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `genero_id` INTEGER NOT NULL,
    MODIFY `cidade_id` INTEGER NOT NULL,
    MODIFY `situacao_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `grupo_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grupo` VARCHAR(191) NOT NULL,

    INDEX `grupo_usuario_grupo_idx`(`grupo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `usuario_grupo_id_fkey` ON `usuario`(`grupo_usuario_id`);

-- AddForeignKey
ALTER TABLE `cidade` ADD CONSTRAINT `cidade_unidade_federativa_id_fkey` FOREIGN KEY (`unidade_federativa_id`) REFERENCES `unidade_federativa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_genero_id_fkey` FOREIGN KEY (`genero_id`) REFERENCES `genero_usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_situacao_id_fkey` FOREIGN KEY (`situacao_id`) REFERENCES `situacao_usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_cidade_id_fkey` FOREIGN KEY (`cidade_id`) REFERENCES `cidade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_unidade_federativa_id_fkey` FOREIGN KEY (`unidade_federativa_id`) REFERENCES `unidade_federativa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_grupo_usuario_id_fkey` FOREIGN KEY (`grupo_usuario_id`) REFERENCES `grupo_usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plano_estudo` ADD CONSTRAINT `plano_estudo_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plano_estudo` ADD CONSTRAINT `plano_estudo_situacao_id_fkey` FOREIGN KEY (`situacao_id`) REFERENCES `situacao_plano_estudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disciplina` ADD CONSTRAINT `disciplina_plano_id_fkey` FOREIGN KEY (`plano_id`) REFERENCES `plano_estudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topico` ADD CONSTRAINT `topico_plano_disciplina_id_fkey` FOREIGN KEY (`plano_disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topico` ADD CONSTRAINT `topico_situacao_id_fkey` FOREIGN KEY (`situacao_id`) REFERENCES `situacao_topico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao_estudo` ADD CONSTRAINT `sessao_estudo_plano_estudo_id_fkey` FOREIGN KEY (`plano_estudo_id`) REFERENCES `plano_estudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao_estudo` ADD CONSTRAINT `sessao_estudo_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao_estudo` ADD CONSTRAINT `sessao_estudo_topico_id_fkey` FOREIGN KEY (`topico_id`) REFERENCES `topico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao_estudo` ADD CONSTRAINT `sessao_estudo_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categoria_sessao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao_estudo` ADD CONSTRAINT `sessao_estudo_situacao_id_fkey` FOREIGN KEY (`situacao_id`) REFERENCES `situacao_sessao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisao` ADD CONSTRAINT `revisao_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categoria_revisao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisao` ADD CONSTRAINT `revisao_situacao_id_fkey` FOREIGN KEY (`situacao_id`) REFERENCES `situacao_revisao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisao` ADD CONSTRAINT `revisao_plano_estudo_id_fkey` FOREIGN KEY (`plano_estudo_id`) REFERENCES `plano_estudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisao` ADD CONSTRAINT `revisao_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisao` ADD CONSTRAINT `revisao_topico_id_fkey` FOREIGN KEY (`topico_id`) REFERENCES `topico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
