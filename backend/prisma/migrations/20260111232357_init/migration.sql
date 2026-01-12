-- DropForeignKey
ALTER TABLE `dia_estudo` DROP FOREIGN KEY `dia_estudo_planejamento_id_fkey`;

-- DropForeignKey
ALTER TABLE `disciplina` DROP FOREIGN KEY `disciplina_plano_id_fkey`;

-- DropForeignKey
ALTER TABLE `disciplina_planejamento` DROP FOREIGN KEY `disciplina_planejamento_disciplina_id_fkey`;

-- DropForeignKey
ALTER TABLE `disciplina_planejamento` DROP FOREIGN KEY `disciplina_planejamento_planejamento_id_fkey`;

-- DropForeignKey
ALTER TABLE `planejamento` DROP FOREIGN KEY `planejamento_plano_estudo_id_fkey`;

-- DropForeignKey
ALTER TABLE `plano_estudo` DROP FOREIGN KEY `plano_estudo_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_disciplina_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_plano_estudo_id_fkey`;

-- DropForeignKey
ALTER TABLE `revisao` DROP FOREIGN KEY `revisao_topico_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_disciplina_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_plano_estudo_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessao_estudo` DROP FOREIGN KEY `sessao_estudo_topico_id_fkey`;

-- DropForeignKey
ALTER TABLE `topico` DROP FOREIGN KEY `topico_disciplina_id_fkey`;

-- AddForeignKey
ALTER TABLE `disciplina` ADD CONSTRAINT `disciplina_plano_id_fkey` FOREIGN KEY (`plano_id`) REFERENCES `plano_estudo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topico` ADD CONSTRAINT `topico_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao_estudo` ADD CONSTRAINT `sessao_estudo_plano_estudo_id_fkey` FOREIGN KEY (`plano_estudo_id`) REFERENCES `plano_estudo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao_estudo` ADD CONSTRAINT `sessao_estudo_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao_estudo` ADD CONSTRAINT `sessao_estudo_topico_id_fkey` FOREIGN KEY (`topico_id`) REFERENCES `topico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisao` ADD CONSTRAINT `revisao_plano_estudo_id_fkey` FOREIGN KEY (`plano_estudo_id`) REFERENCES `plano_estudo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisao` ADD CONSTRAINT `revisao_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisao` ADD CONSTRAINT `revisao_topico_id_fkey` FOREIGN KEY (`topico_id`) REFERENCES `topico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plano_estudo` ADD CONSTRAINT `plano_estudo_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disciplina_planejamento` ADD CONSTRAINT `disciplina_planejamento_planejamento_id_fkey` FOREIGN KEY (`planejamento_id`) REFERENCES `planejamento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disciplina_planejamento` ADD CONSTRAINT `disciplina_planejamento_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dia_estudo` ADD CONSTRAINT `dia_estudo_planejamento_id_fkey` FOREIGN KEY (`planejamento_id`) REFERENCES `planejamento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planejamento` ADD CONSTRAINT `planejamento_plano_estudo_id_fkey` FOREIGN KEY (`plano_estudo_id`) REFERENCES `plano_estudo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
