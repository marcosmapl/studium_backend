-- CreateTable
CREATE TABLE `unidade_federativa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,
    `sigla` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `unidade_federativa_descricao_key`(`descricao`),
    UNIQUE INDEX `unidade_federativa_sigla_key`(`sigla`),
    INDEX `unidade_federativa_descricao_idx`(`descricao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cidade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,
    `unidade_federativa_id` INTEGER NOT NULL,

    UNIQUE INDEX `cidade_descricao_key`(`descricao`),
    INDEX `cidade__unidade_federativa_id_fkey`(`unidade_federativa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genero_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `genero_usuario_descricao_key`(`descricao`),
    INDEX `genero_usuario_descricao_idx`(`descricao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situacao_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `situacao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `situacao_usuario_situacao_key`(`situacao`),
    INDEX `situacao_usuario_situacao_idx`(`situacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupo_usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `grupo_usuario_descricao_key`(`descricao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `sobrenome` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `data_nascimento` DATETIME(3) NULL,
    `ultimo_acesso` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fotoUrl` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `genero_id` INTEGER NOT NULL,
    `situacao_id` INTEGER NOT NULL,
    `cidade_id` INTEGER NOT NULL,
    `unidade_federativa_id` INTEGER NOT NULL,
    `grupo_usuario_id` INTEGER NOT NULL,

    UNIQUE INDEX `usuario_username_key`(`username`),
    UNIQUE INDEX `usuario_email_key`(`email`),
    INDEX `usuario_username_idx`(`username`),
    INDEX `usuario_email_idx`(`email`),
    INDEX `usuario__genero_id_fkey`(`genero_id`),
    INDEX `usuario__grupo_id_fkey`(`grupo_usuario_id`),
    INDEX `usuario__cidade_id_fkey`(`cidade_id`),
    INDEX `usuario__unidade_federativa_id_fkey`(`unidade_federativa_id`),
    INDEX `usuario__situacao_id_fkey`(`situacao_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situacao_plano` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `situacao_plano_descricao_key`(`descricao`),
    INDEX `situacao_plano_descricao_idx`(`descricao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plano_estudo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `questoes_acertos` INTEGER NOT NULL DEFAULT 0,
    `questoes_erros` INTEGER NOT NULL DEFAULT 0,
    `tempo_estudo` DOUBLE NOT NULL DEFAULT 0.0,
    `paginas_lidas` INTEGER NOT NULL DEFAULT 0,
    `progresso` INTEGER NOT NULL DEFAULT 0,
    `concluido` BOOLEAN NOT NULL DEFAULT false,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `situacao_id` INTEGER NOT NULL,

    INDEX `plano_estudo_titulo_idx`(`titulo`),
    INDEX `plano_estudo__usuario_id_fkey`(`usuario_id`),
    INDEX `plano_estudo__situacao_id_fkey`(`situacao_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disciplina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `cor` VARCHAR(191) NOT NULL,
    `importancia` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `conhecimento` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `prioridade` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `questoes_acertos` INTEGER NOT NULL DEFAULT 0,
    `questoes_erros` INTEGER NOT NULL DEFAULT 0,
    `tempo_estudo` DOUBLE NOT NULL DEFAULT 0.0,
    `paginas_lidas` INTEGER NOT NULL DEFAULT 0,
    `progresso` INTEGER NOT NULL DEFAULT 0,
    `concluido` BOOLEAN NOT NULL DEFAULT false,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `plano_id` INTEGER NOT NULL,

    INDEX `disciplina_titulo_idx`(`titulo`),
    INDEX `disciplina__plano_id_fkey`(`plano_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situacao_topico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `situacao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `situacao_topico_situacao_key`(`situacao`),
    INDEX `situacao_topico_situacao_idx`(`situacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `questoes_acertos` INTEGER NOT NULL DEFAULT 0,
    `questoes_erros` INTEGER NOT NULL DEFAULT 0,
    `tempo_estudo` DOUBLE NOT NULL DEFAULT 0.0,
    `paginas_lidas` INTEGER NOT NULL DEFAULT 0,
    `concluido` BOOLEAN NOT NULL DEFAULT false,
    `estabilidade` DOUBLE NOT NULL DEFAULT 1.0,
    `dificuldade` DOUBLE NOT NULL DEFAULT 5.0,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `plano_disciplina_id` INTEGER NOT NULL,
    `situacao_id` INTEGER NOT NULL,

    UNIQUE INDEX `topico_descricao_key`(`descricao`),
    INDEX `topico_titulo_idx`(`titulo`),
    INDEX `topico__disciplina_id_fkey`(`plano_disciplina_id`),
    INDEX `topico__situacao_id_fkey`(`situacao_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria_sessao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `categoria_sessao_categoria_key`(`categoria`),
    INDEX `categoria_sessao_categoria_idx`(`categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situacao_sessao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `situacao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `situacao_sessao_situacao_key`(`situacao`),
    INDEX `situacao_sessao_situacao_idx`(`situacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessao_estudo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_sessao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `questoes_acertos` INTEGER NOT NULL DEFAULT 0,
    `questoes_erros` INTEGER NOT NULL DEFAULT 0,
    `tempo_estudo` DOUBLE NOT NULL DEFAULT 0.0,
    `paginas_lidas` INTEGER NOT NULL DEFAULT 0,
    `topico_finalizado` BOOLEAN NOT NULL DEFAULT false,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `plano_estudo_id` INTEGER NOT NULL,
    `disciplina_id` INTEGER NOT NULL,
    `topico_id` INTEGER NOT NULL,
    `categoria_id` INTEGER NOT NULL,
    `situacao_id` INTEGER NOT NULL,

    INDEX `sessao_estudo_data_sessao_idx`(`data_sessao`),
    INDEX `sessao_estudo_topico_finalizado_idx`(`topico_finalizado`),
    INDEX `sessao_estudo__plano_estudo_id_fkey`(`plano_estudo_id`),
    INDEX `sessao_estudo__disciplina_id_fkey`(`disciplina_id`),
    INDEX `sessao_estudo__topico_id_fkey`(`topico_id`),
    INDEX `sessao_estudo__categoria_sessao_id_fkey`(`categoria_id`),
    INDEX `sessao_estudo__situacao_sessao_id_fkey`(`situacao_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria_revisao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `categoria_revisao_categoria_key`(`categoria`),
    INDEX `categoria_revisao_categoria_idx`(`categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situacao_revisao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `situacao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `situacao_revisao_situacao_key`(`situacao`),
    INDEX `situacao_revisao_situacao_idx`(`situacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revisao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_programada` DATETIME(3) NOT NULL,
    `data_realizada` DATETIME(3) NOT NULL,
    `numero` INTEGER NOT NULL,
    `desempenho` INTEGER NOT NULL,
    `categoria_id` INTEGER NOT NULL,
    `situacao_id` INTEGER NOT NULL,
    `plano_estudo_id` INTEGER NOT NULL,
    `disciplina_id` INTEGER NOT NULL,
    `topico_id` INTEGER NOT NULL,

    INDEX `revisao_data_programada_idx`(`data_programada`),
    INDEX `revisao_data_realizada_idx`(`data_realizada`),
    INDEX `revisao__categoria_revisao_id_fkey`(`categoria_id`),
    INDEX `revisao__situacao_revisao_id_fkey`(`situacao_id`),
    INDEX `revisao__plano_estudo_id_fkey`(`plano_estudo_id`),
    INDEX `revisao__disciplina_id_fkey`(`disciplina_id`),
    INDEX `revisao__topico_id_fkey`(`topico_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `plano_estudo` ADD CONSTRAINT `plano_estudo_situacao_id_fkey` FOREIGN KEY (`situacao_id`) REFERENCES `situacao_plano`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
