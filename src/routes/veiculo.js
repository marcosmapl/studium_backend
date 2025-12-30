const express = require("express");
const router = express.Router();
const controller = require("../controllers/veiculoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/veiculos:
 *   get:
 *     summary: Lista todos os veículos com paginação
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros a retornar (0 retorna todos)
 *         example: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros a pular
 *         example: 0
 *       - in: query
 *         name: unidadeId
 *         schema:
 *           type: integer
 *         description: ID da unidade para filtrar os veículos
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de veículos ordenados por modelo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   marca:
 *                     type: string
 *                     example: "Toyota"
 *                   modelo:
 *                     type: string
 *                     example: "Corolla"
 *                   anoFabricacao:
 *                     type: integer
 *                     example: 2022
 *                   anoModelo:
 *                     type: integer
 *                     example: 2023
 *                   placa:
 *                     type: string
 *                     example: "ABC-1234"
 *                   chassi:
 *                     type: string
 *                     example: "9BWZZZ377VT004251"
 *                   renavam:
 *                     type: string
 *                     example: "12345678901"
 *                   cor:
 *                     type: string
 *                     example: "Prata"
 *                   quilometragem:
 *                     type: integer
 *                     example: 15000
 *                   valorCompra:
 *                     type: number
 *                     format: double
 *                     example: 85000.00
 *                   valorVenda:
 *                     type: number
 *                     format: double
 *                     example: 95000.00
 *                   observacoes:
 *                     type: string
 *                     nullable: true
 *                     example: "Veículo em perfeito estado"
 *                   unidadeId:
 *                     type: integer
 *                     example: 1
 *                   categoriaVeiculoId:
 *                     type: integer
 *                     example: 1
 *                   estadoVeiculoId:
 *                     type: integer
 *                     example: 1
 *                   situacaoVeiculoId:
 *                     type: integer
 *                     example: 1
 *                   tipoCombustivelId:
 *                     type: integer
 *                     example: 1
 *                   tipoDirecaoId:
 *                     type: integer
 *                     example: 1
 *                   tipoTransmissaoId:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 *   post:
 *     summary: Cria um novo veículo
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - marca
 *               - modelo
 *               - anoFabricacao
 *               - anoModelo
 *               - placa
 *               - chassi
 *               - renavam
 *               - cor
 *               - quilometragem
 *               - valorCompra
 *               - valorVenda
 *               - unidadeId
 *               - categoriaVeiculoId
 *               - estadoVeiculoId
 *               - situacaoVeiculoId
 *               - tipoCombustivelId
 *               - tipoDirecaoId
 *               - tipoTransmissaoId
 *             properties:
 *               marca:
 *                 type: string
 *                 example: "Toyota"
 *               modelo:
 *                 type: string
 *                 example: "Corolla"
 *               anoFabricacao:
 *                 type: integer
 *                 example: 2022
 *               anoModelo:
 *                 type: integer
 *                 example: 2023
 *               placa:
 *                 type: string
 *                 example: "ABC-1234"
 *               chassi:
 *                 type: string
 *                 example: "9BWZZZ377VT004251"
 *               renavam:
 *                 type: string
 *                 example: "12345678901"
 *               cor:
 *                 type: string
 *                 example: "Prata"
 *               quilometragem:
 *                 type: integer
 *                 example: 15000
 *               valorCompra:
 *                 type: number
 *                 format: double
 *                 example: 85000.00
 *               valorVenda:
 *                 type: number
 *                 format: double
 *                 example: 95000.00
 *               observacoes:
 *                 type: string
 *                 nullable: true
 *                 example: "Veículo em perfeito estado"
 *               unidadeId:
 *                 type: integer
 *                 example: 1
 *               categoriaVeiculoId:
 *                 type: integer
 *                 example: 1
 *               estadoVeiculoId:
 *                 type: integer
 *                 example: 1
 *               situacaoVeiculoId:
 *                 type: integer
 *                 example: 1
 *               tipoCombustivelId:
 *                 type: integer
 *                 example: 1
 *               tipoDirecaoId:
 *                 type: integer
 *                 example: 1
 *               tipoTransmissaoId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Veículo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 marca:
 *                   type: string
 *                 modelo:
 *                   type: string
 *                 anoFabricacao:
 *                   type: integer
 *                 anoModelo:
 *                   type: integer
 *                 placa:
 *                   type: string
 *                 chassi:
 *                   type: string
 *                 renavam:
 *                   type: string
 *                 cor:
 *                   type: string
 *                 quilometragem:
 *                   type: integer
 *                 valorCompra:
 *                   type: number
 *                   format: double
 *                 valorVenda:
 *                   type: number
 *                   format: double
 *                 observacoes:
 *                   type: string
 *                   nullable: true
 *                 unidadeId:
 *                   type: integer
 *                 categoriaVeiculoId:
 *                   type: integer
 *                 estadoVeiculoId:
 *                   type: integer
 *                 situacaoVeiculoId:
 *                   type: integer
 *                 tipoCombustivelId:
 *                   type: integer
 *                 tipoDirecaoId:
 *                   type: integer
 *                 tipoTransmissaoId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       409:
 *         description: Veículo já cadastrado (placa, chassi ou renavam duplicado)
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", verifyToken, controller.findAllVeiculos);
router.post("/", verifyToken, controller.createVeiculo);

/**
 * @swagger
 * /api/veiculos/situacao/{descricao}:
 *   get:
 *     summary: Busca veículos por situação
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: descricao
 *         required: true
 *         schema:
 *           type: string
 *         description: Descrição da situação do veículo
 *         example: "Disponível"
 *     responses:
 *       200:
 *         description: Lista de veículos com a situação especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   marca:
 *                     type: string
 *                   modelo:
 *                     type: string
 *                   anoFabricacao:
 *                     type: integer
 *                   anoModelo:
 *                     type: integer
 *                   placa:
 *                     type: string
 *                   chassi:
 *                     type: string
 *                   renavam:
 *                     type: string
 *                   cor:
 *                     type: string
 *                   quilometragem:
 *                     type: integer
 *                   valorCompra:
 *                     type: number
 *                     format: double
 *                   valorVenda:
 *                     type: number
 *                     format: double
 *                   observacoes:
 *                     type: string
 *                     nullable: true
 *                   unidadeId:
 *                     type: integer
 *                   categoriaVeiculoId:
 *                     type: integer
 *                   estadoVeiculoId:
 *                     type: integer
 *                   situacaoVeiculoId:
 *                     type: integer
 *                   tipoCombustivelId:
 *                     type: integer
 *                   tipoDirecaoId:
 *                     type: integer
 *                   tipoTransmissaoId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Nenhum veículo encontrado com esta situação
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/situacao/:descricao",
  verifyToken,
  controller.findVeiculosBySituacao
);

/**
 * @swagger
 * /api/veiculos/{id}:
 *   get:
 *     summary: Busca um veículo por ID
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo
 *         example: 1
 *     responses:
 *       200:
 *         description: Veículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 marca:
 *                   type: string
 *                 modelo:
 *                   type: string
 *                 anoFabricacao:
 *                   type: integer
 *                 anoModelo:
 *                   type: integer
 *                 placa:
 *                   type: string
 *                 chassi:
 *                   type: string
 *                 renavam:
 *                   type: string
 *                 cor:
 *                   type: string
 *                 quilometragem:
 *                   type: integer
 *                 valorCompra:
 *                   type: number
 *                   format: double
 *                 valorVenda:
 *                   type: number
 *                   format: double
 *                 observacoes:
 *                   type: string
 *                   nullable: true
 *                 unidadeId:
 *                   type: integer
 *                 categoriaVeiculoId:
 *                   type: integer
 *                 estadoVeiculoId:
 *                   type: integer
 *                 situacaoVeiculoId:
 *                   type: integer
 *                 tipoCombustivelId:
 *                   type: integer
 *                 tipoDirecaoId:
 *                   type: integer
 *                 tipoTransmissaoId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Veículo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza um veículo
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *                 example: "Honda"
 *               modelo:
 *                 type: string
 *                 example: "Civic"
 *               anoFabricacao:
 *                 type: integer
 *                 example: 2023
 *               anoModelo:
 *                 type: integer
 *                 example: 2024
 *               placa:
 *                 type: string
 *                 example: "XYZ-5678"
 *               chassi:
 *                 type: string
 *                 example: "9BWZZZ377VT004252"
 *               renavam:
 *                 type: string
 *                 example: "98765432109"
 *               cor:
 *                 type: string
 *                 example: "Preto"
 *               quilometragem:
 *                 type: integer
 *                 example: 20000
 *               valorCompra:
 *                 type: number
 *                 format: double
 *                 example: 90000.00
 *               valorVenda:
 *                 type: number
 *                 format: double
 *                 example: 100000.00
 *               observacoes:
 *                 type: string
 *                 nullable: true
 *                 example: "Veículo revisado"
 *               unidadeId:
 *                 type: integer
 *                 example: 2
 *               categoriaVeiculoId:
 *                 type: integer
 *                 example: 1
 *               estadoVeiculoId:
 *                 type: integer
 *                 example: 2
 *               situacaoVeiculoId:
 *                 type: integer
 *                 example: 2
 *               tipoCombustivelId:
 *                 type: integer
 *                 example: 1
 *               tipoDirecaoId:
 *                 type: integer
 *                 example: 2
 *               tipoTransmissaoId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 marca:
 *                   type: string
 *                 modelo:
 *                   type: string
 *                 anoFabricacao:
 *                   type: integer
 *                 anoModelo:
 *                   type: integer
 *                 placa:
 *                   type: string
 *                 chassi:
 *                   type: string
 *                 renavam:
 *                   type: string
 *                 cor:
 *                   type: string
 *                 quilometragem:
 *                   type: integer
 *                 valorCompra:
 *                   type: number
 *                   format: double
 *                 valorVenda:
 *                   type: number
 *                   format: double
 *                 observacoes:
 *                   type: string
 *                   nullable: true
 *                 unidadeId:
 *                   type: integer
 *                 categoriaVeiculoId:
 *                   type: integer
 *                 estadoVeiculoId:
 *                   type: integer
 *                 situacaoVeiculoId:
 *                   type: integer
 *                 tipoCombustivelId:
 *                   type: integer
 *                 tipoDirecaoId:
 *                   type: integer
 *                 tipoTransmissaoId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Veículo não encontrado
 *       409:
 *         description: Placa, chassi ou renavam já cadastrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um veículo
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo
 *         example: 1
 *     responses:
 *       200:
 *         description: Veículo excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veículo excluído com sucesso"
 *       404:
 *         description: Veículo não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, controller.findVeiculoById);
router.put("/:id", verifyToken, controller.updateVeiculo);
router.delete("/:id", verifyToken, controller.deleteVeiculo);

module.exports = router;
