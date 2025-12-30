const express = require("express");
const router = express.Router();
const vendaVeiculoController = require("../controllers/vendaVeiculoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/vendasVeiculos:
 *   get:
 *     summary: Lista todas as vendas de veículos com paginação
 *     tags: [Vendas de Veículos]
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
 *     responses:
 *       200:
 *         description: Lista de vendas ordenadas por nome do cliente
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
 *                   dataVenda:
 *                     type: string
 *                     format: date-time
 *                   valorVenda:
 *                     type: number
 *                     format: double
 *                     example: 95000.00
 *                   observacoes:
 *                     type: string
 *                     nullable: true
 *                     example: "Venda à vista com desconto"
 *                   clienteId:
 *                     type: integer
 *                     example: 1
 *                   veiculoId:
 *                     type: integer
 *                     example: 1
 *                   unidadeId:
 *                     type: integer
 *                     example: 1
 *                   tipoVendaId:
 *                     type: integer
 *                     example: 1
 *                   situacaoVendaId:
 *                     type: integer
 *                     example: 1
 *                   cliente:
 *                     type: object
 *                     properties:
 *                       nomeCompleto:
 *                         type: string
 *                         example: "João Silva"
 *                   veiculo:
 *                     type: object
 *                     properties:
 *                       marca:
 *                         type: string
 *                         example: "Toyota"
 *                       modelo:
 *                         type: string
 *                         example: "Corolla"
 *                   unidade:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         example: "Unidade Central"
 *                   tipoVenda:
 *                     type: object
 *                     properties:
 *                       descricao:
 *                         type: string
 *                         example: "À VISTA"
 *                   situacaoVenda:
 *                     type: object
 *                     properties:
 *                       descricao:
 *                         type: string
 *                         example: "Concluída"
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
 *     summary: Cria uma nova venda de veículo
 *     tags: [Vendas de Veículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dataVenda
 *               - valorVenda
 *               - clienteId
 *               - veiculoId
 *               - unidadeId
 *               - tipoVendaId
 *               - situacaoVendaId
 *             properties:
 *               dataVenda:
 *                 type: string
 *                 format: date
 *                 description: Data da venda
 *                 example: "2023-12-04"
 *               valorVenda:
 *                 type: number
 *                 format: double
 *                 description: Valor da venda
 *                 example: 95000.00
 *               observacoes:
 *                 type: string
 *                 nullable: true
 *                 description: Observações sobre a venda
 *                 example: "Venda à vista com desconto"
 *               clienteId:
 *                 type: integer
 *                 description: ID do cliente
 *                 example: 1
 *               veiculoId:
 *                 type: integer
 *                 description: ID do veículo
 *                 example: 1
 *               unidadeId:
 *                 type: integer
 *                 description: ID da unidade
 *                 example: 1
 *               tipoVendaId:
 *                 type: integer
 *                 description: ID do tipo de venda
 *                 example: 1
 *               situacaoVendaId:
 *                 type: integer
 *                 description: ID da situação da venda
 *                 example: 1
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 dataVenda:
 *                   type: string
 *                   format: date-time
 *                 valorVenda:
 *                   type: number
 *                   format: double
 *                 observacoes:
 *                   type: string
 *                   nullable: true
 *                 clienteId:
 *                   type: integer
 *                 veiculoId:
 *                   type: integer
 *                 unidadeId:
 *                   type: integer
 *                 tipoVendaId:
 *                   type: integer
 *                 situacaoVendaId:
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
 *         description: Conflito - Veículo já vendido
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, vendaVeiculoController.createVendaVeiculo);
router.get("/", verifyToken, vendaVeiculoController.getVendasVeiculo);

/**
 * @swagger
 * /api/vendasVeiculos/{id}:
 *   get:
 *     summary: Busca uma venda de veículo por ID
 *     tags: [Vendas de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *         example: 1
 *     responses:
 *       200:
 *         description: Venda encontrada com detalhes relacionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 dataVenda:
 *                   type: string
 *                   format: date-time
 *                 valorVenda:
 *                   type: number
 *                   format: double
 *                 observacoes:
 *                   type: string
 *                   nullable: true
 *                 clienteId:
 *                   type: integer
 *                 veiculoId:
 *                   type: integer
 *                 unidadeId:
 *                   type: integer
 *                 tipoVendaId:
 *                   type: integer
 *                 situacaoVendaId:
 *                   type: integer
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     nomeCompleto:
 *                       type: string
 *                 veiculo:
 *                   type: object
 *                   properties:
 *                     marca:
 *                       type: string
 *                     modelo:
 *                       type: string
 *                 unidade:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                 tipoVenda:
 *                   type: object
 *                   properties:
 *                     descricao:
 *                       type: string
 *                 situacaoVenda:
 *                   type: object
 *                   properties:
 *                     descricao:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualiza uma venda de veículo
 *     tags: [Vendas de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataVenda:
 *                 type: string
 *                 format: date
 *                 description: Nova data da venda
 *                 example: "2023-12-05"
 *               valorVenda:
 *                 type: number
 *                 format: double
 *                 description: Novo valor da venda
 *                 example: 92000.00
 *               observacoes:
 *                 type: string
 *                 nullable: true
 *                 description: Novas observações
 *                 example: "Valor negociado"
 *               clienteId:
 *                 type: integer
 *                 example: 2
 *               veiculoId:
 *                 type: integer
 *                 example: 1
 *               unidadeId:
 *                 type: integer
 *                 example: 1
 *               tipoVendaId:
 *                 type: integer
 *                 example: 2
 *               situacaoVendaId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Venda atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 dataVenda:
 *                   type: string
 *                   format: date-time
 *                 valorVenda:
 *                   type: number
 *                   format: double
 *                 observacoes:
 *                   type: string
 *                   nullable: true
 *                 clienteId:
 *                   type: integer
 *                 veiculoId:
 *                   type: integer
 *                 unidadeId:
 *                   type: integer
 *                 tipoVendaId:
 *                   type: integer
 *                 situacaoVendaId:
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
 *         description: Venda não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui uma venda de veículo
 *     tags: [Vendas de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da venda
 *         example: 1
 *     responses:
 *       200:
 *         description: Venda excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Venda de veículo excluída com sucesso"
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, vendaVeiculoController.getVendaVeiculoById);
router.put("/:id", verifyToken, vendaVeiculoController.updateVendaVeiculo);
router.delete("/:id", verifyToken, vendaVeiculoController.deleteVendaVeiculo);

module.exports = router;
