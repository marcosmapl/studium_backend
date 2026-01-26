-- AlterTable
ALTER TABLE `topico` ADD COLUMN `edital` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX `topico_concluido_idx` ON `topico`(`concluido`);

-- CreateIndex
CREATE INDEX `topico_edital_idx` ON `topico`(`edital`);
