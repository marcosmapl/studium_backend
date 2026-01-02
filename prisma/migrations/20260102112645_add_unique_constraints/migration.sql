/*
  Warnings:

  - A unique constraint covering the columns `[cidade]` on the table `cidade` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[genero]` on the table `genero_usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[grupo]` on the table `grupo_usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `unidade_federativa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sigla]` on the table `unidade_federativa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `cidade_cidade_idx` ON `cidade`;

-- DropIndex
DROP INDEX `genero_usuario_genero_idx` ON `genero_usuario`;

-- DropIndex
DROP INDEX `grupo_usuario_grupo_idx` ON `grupo_usuario`;

-- DropIndex
DROP INDEX `unidade_federativa_sigla_idx` ON `unidade_federativa`;

-- CreateIndex
CREATE UNIQUE INDEX `cidade_cidade_key` ON `cidade`(`cidade`);

-- CreateIndex
CREATE UNIQUE INDEX `genero_usuario_genero_key` ON `genero_usuario`(`genero`);

-- CreateIndex
CREATE UNIQUE INDEX `grupo_usuario_grupo_key` ON `grupo_usuario`(`grupo`);

-- CreateIndex
CREATE UNIQUE INDEX `unidade_federativa_nome_key` ON `unidade_federativa`(`nome`);

-- CreateIndex
CREATE UNIQUE INDEX `unidade_federativa_sigla_key` ON `unidade_federativa`(`sigla`);
