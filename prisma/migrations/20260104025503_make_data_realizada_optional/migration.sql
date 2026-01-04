-- AlterTable
ALTER TABLE `revisao` MODIFY `data_realizada` DATETIME(3) NULL,
    MODIFY `desempenho` INTEGER NOT NULL DEFAULT 0;
