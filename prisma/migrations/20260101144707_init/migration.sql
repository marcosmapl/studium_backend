/*
  Warnings:

  - You are about to drop the column `uf_id` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `unidade_federativa_id` to the `cidade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_uf_id_fkey`;

-- DropIndex
DROP INDEX `usuario_uf_id_fkey` ON `usuario`;

-- AlterTable
ALTER TABLE `cidade` ADD COLUMN `unidade_federativa_id` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `uf_id`,
    ADD COLUMN `unidadeFederativaId` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `cidade` ADD CONSTRAINT `cidade_unidade_federativa_id_fkey` FOREIGN KEY (`unidade_federativa_id`) REFERENCES `unidade_federativa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_unidadeFederativaId_fkey` FOREIGN KEY (`unidadeFederativaId`) REFERENCES `unidade_federativa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
