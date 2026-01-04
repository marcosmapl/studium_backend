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

    INDEX `cidade__unidade_federativa_id_fkey`(`unidade_federativa_id`),
    UNIQUE INDEX `cidade_descricao_unidade_federativa_id_key`(`descricao`, `unidade_federativa_id`),
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
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `situacao_usuario_descricao_key`(`descricao`),
    INDEX `situacao_usuario_descricao_idx`(`descricao`),
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
    `grupo_usuario_id` INTEGER NOT NULL,

    UNIQUE INDEX `usuario_username_key`(`username`),
    UNIQUE INDEX `usuario_email_key`(`email`),
    INDEX `usuario_username_idx`(`username`),
    INDEX `usuario_email_idx`(`email`),
    INDEX `usuario__genero_id_fkey`(`genero_id`),
    INDEX `usuario__grupo_id_fkey`(`grupo_usuario_id`),
    INDEX `usuario__cidade_id_fkey`(`cidade_id`),
    INDEX `usuario__situacao_id_fkey`(`situacao_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disciplina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `cor` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
    `questoes_acertos` INTEGER NOT NULL DEFAULT 0,
    `questoes_erros` INTEGER NOT NULL DEFAULT 0,
    `tempo_estudo` DOUBLE NOT NULL DEFAULT 0.0,
    `paginas_lidas` INTEGER NOT NULL DEFAULT 0,
    `concluido` BOOLEAN NOT NULL DEFAULT false,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `plano_id` INTEGER NOT NULL,

    INDEX `disciplina_titulo_idx`(`titulo`),
    INDEX `disciplina__plano_id_fkey`(`plano_id`),
    UNIQUE INDEX `disciplina_titulo_plano_id_key`(`titulo`, `plano_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situacao_topico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `situacao_topico_descricao_key`(`descricao`),
    INDEX `situacao_topico_descricao_idx`(`descricao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `concluido` BOOLEAN NOT NULL DEFAULT false,
    `estabilidade` DOUBLE NOT NULL DEFAULT 1.0,
    `dificuldade` DOUBLE NOT NULL DEFAULT 5.0,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `disciplina_id` INTEGER NOT NULL,
    `situacao_id` INTEGER NOT NULL,

    INDEX `topico_titulo_idx`(`titulo`),
    INDEX `topico__disciplina_id_fkey`(`disciplina_id`),
    INDEX `topico__situacao_id_fkey`(`situacao_id`),
    UNIQUE INDEX `topico_titulo_disciplina_id_key`(`titulo`, `disciplina_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria_sessao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `categoria_sessao_descricao_key`(`descricao`),
    INDEX `categoria_sessao_descricao_idx`(`descricao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situacao_sessao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `situacao_sessao_descricao_key`(`descricao`),
    INDEX `situacao_sessao_descricao_idx`(`descricao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessao_estudo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_termino` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
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

    INDEX `sessao_estudo_data_inicio_idx`(`data_inicio`),
    INDEX `sessao_estudo_data_termino_idx`(`data_termino`),
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
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `categoria_revisao_descricao_key`(`descricao`),
    INDEX `categoria_revisao_descricao_idx`(`descricao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situacao_revisao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `situacao_revisao_descricao_key`(`descricao`),
    INDEX `situacao_revisao_descricao_idx`(`descricao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revisao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` INTEGER NOT NULL,
    `data_programada` DATETIME(3) NOT NULL,
    `data_realizada` DATETIME(3) NULL,
    `tempo_estudo` DOUBLE NOT NULL DEFAULT 0.0,
    `questoes_acertos` INTEGER NOT NULL DEFAULT 0,
    `questoes_erros` INTEGER NOT NULL DEFAULT 0,
    `desempenho` INTEGER NOT NULL DEFAULT 0,
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
    `descricao` VARCHAR(191) NULL,
    `questoes_acertos` INTEGER NOT NULL DEFAULT 0,
    `questoes_erros` INTEGER NOT NULL DEFAULT 0,
    `tempo_estudo` DOUBLE NOT NULL DEFAULT 0.0,
    `paginas_lidas` INTEGER NOT NULL DEFAULT 0,
    `concluido` BOOLEAN NOT NULL DEFAULT false,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `situacao_id` INTEGER NOT NULL,

    INDEX `plano_estudo_titulo_idx`(`titulo`),
    INDEX `plano_estudo__usuario_id_fkey`(`usuario_id`),
    INDEX `plano_estudo__situacao_id_fkey`(`situacao_id`),
    UNIQUE INDEX `plano_estudo_titulo_usuario_id_key`(`titulo`, `usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disciplina_planejamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `importancia` DECIMAL(10, 2) NOT NULL,
    `conhecimento` DECIMAL(10, 2) NOT NULL,
    `horas_semanais` DOUBLE NOT NULL,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `planejamento_id` INTEGER NOT NULL,
    `disciplina_id` INTEGER NOT NULL,

    INDEX `disciplina_planejamento_planejamento_id_idx`(`planejamento_id`),
    INDEX `disciplina_planejamento_disciplina_id_idx`(`disciplina_id`),
    UNIQUE INDEX `disciplina_planejamento_planejamento_id_disciplina_id_key`(`planejamento_id`, `disciplina_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dia_estudo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia_semana` TINYINT NOT NULL,
    `horas_planejadas` DOUBLE NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `planejamento_id` INTEGER NOT NULL,

    INDEX `dia_estudo_planejamento_id_idx`(`planejamento_id`),
    INDEX `dia_estudo_dia_semana_idx`(`dia_semana`),
    UNIQUE INDEX `dia_estudo_dia_semana_planejamento_id_key`(`dia_semana`, `planejamento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alocacao_horario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `horas_alocadas` DOUBLE NOT NULL,
    `ordem` INTEGER NOT NULL,
    `observacoes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `dia_estudo_id` INTEGER NOT NULL,
    `disciplina_cronograma_id` INTEGER NOT NULL,

    INDEX `alocacao_horario_dia_estudo_id_idx`(`dia_estudo_id`),
    INDEX `alocacao_horario_disciplina_cronograma_id_idx`(`disciplina_cronograma_id`),
    INDEX `alocacao_horario_dia_estudo_id_ordem_idx`(`dia_estudo_id`, `ordem`),
    UNIQUE INDEX `alocacao_horario_dia_estudo_id_disciplina_cronograma_id_key`(`dia_estudo_id`, `disciplina_cronograma_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planejamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_inicio` DATETIME(3) NOT NULL,
    `data_fim` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `total_horas_semana` DOUBLE NOT NULL DEFAULT 0.0,
    `quantidade_dias` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `plano_estudo_id` INTEGER NOT NULL,

    INDEX `planejamento_plano_estudo_id_idx`(`plano_estudo_id`),
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
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_grupo_usuario_id_fkey` FOREIGN KEY (`grupo_usuario_id`) REFERENCES `grupo_usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disciplina` ADD CONSTRAINT `disciplina_plano_id_fkey` FOREIGN KEY (`plano_id`) REFERENCES `plano_estudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topico` ADD CONSTRAINT `topico_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `plano_estudo` ADD CONSTRAINT `plano_estudo_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plano_estudo` ADD CONSTRAINT `plano_estudo_situacao_id_fkey` FOREIGN KEY (`situacao_id`) REFERENCES `situacao_plano`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disciplina_planejamento` ADD CONSTRAINT `disciplina_planejamento_planejamento_id_fkey` FOREIGN KEY (`planejamento_id`) REFERENCES `planejamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disciplina_planejamento` ADD CONSTRAINT `disciplina_planejamento_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dia_estudo` ADD CONSTRAINT `dia_estudo_planejamento_id_fkey` FOREIGN KEY (`planejamento_id`) REFERENCES `planejamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alocacao_horario` ADD CONSTRAINT `alocacao_horario_dia_estudo_id_fkey` FOREIGN KEY (`dia_estudo_id`) REFERENCES `dia_estudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alocacao_horario` ADD CONSTRAINT `alocacao_horario_disciplina_cronograma_id_fkey` FOREIGN KEY (`disciplina_cronograma_id`) REFERENCES `disciplina_planejamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planejamento` ADD CONSTRAINT `planejamento_plano_estudo_id_fkey` FOREIGN KEY (`plano_estudo_id`) REFERENCES `plano_estudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
