const express = require("express");
const router = express.Router();
const compraVeiculoController = require("../controllers/compraVeiculoController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/comprasVeiculos:
 *   post:
 *     summary: Cria uma nova compra de veículo
 *     tags: [Compras de Veículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - veiculoId
 *               - fornecedorId
 *               - unidadeId
 *               - dataCompra
 *               - valorCompra
 *               - tipoCompraId
 *               - custoAquisicao
 *               - valorAvaliado
 *               - situacaoCompraId
 *             properties:
 *               veiculoId:
 *                 type: integer
 *                 description: ID do veículo
 *                 example: 1
 *               fornecedorId:
 *                 type: integer
 *                 description: ID do fornecedor
 *                 example: 1
 *               unidadeId:
 *                 type: integer
 *                 description: ID da unidade
 *                 example: 1
 *               dataCompra:
 *                 type: string
 *                 format: date
 *                 description: Data da compra
 *                 example: "2025-12-04"
 *               dataEntrega:
 *                 type: string
 *                 format: date
 *                 description: Data de entrega (opcional)
 *                 example: "2025-12-10"
 *               valorCompra:
 *                 type: number
 *                 format: float
 *                 description: Valor da compra
 *                 example: 35000.00
 *               tipoCompraId:
 *                 type: integer
 *                 description: ID do tipo de compra
 *                 example: 1
 *               custoAquisicao:
 *                 type: number
 *                 format: float
 *                 description: Custo de aquisição
 *                 example: 35000.00
 *               custoOficina:
 *                 type: number
 *                 format: float
 *                 description: Custo de oficina (opcional)
 *                 example: 1500.00
 *               custoEstetica:
 *                 type: number
 *                 format: float
 *                 description: Custo de estética (opcional)
 *                 example: 800.00
 *               outrosCustos:
 *                 type: number
 *                 format: float
 *                 description: Outros custos (opcional)
 *                 example: 500.00
 *               taxaTransferencia:
 *                 type: number
 *                 format: float
 *                 description: Taxa de transferência (opcional)
 *                 example: 300.00
 *               taxaLeilao:
 *                 type: number
 *                 format: float
 *                 description: Taxa de leilão (opcional)
 *                 example: 200.00
 *               outrasTaxas:
 *                 type: number
 *                 format: float
 *                 description: Outras taxas (opcional)
 *                 example: 150.00
 *               valorAvaliado:
 *                 type: number
 *                 format: float
 *                 description: Valor avaliado do veículo
 *                 example: 40000.00
 *               situacaoCompraId:
 *                 type: integer
 *                 description: ID da situação da compra
 *                 example: 1
 *               observacoes:
 *                 type: string
 *                 description: Observações sobre a compra (opcional)
 *                 example: "Veículo em bom estado"
 *     responses:
 *       201:
 *         description: Compra de veículo criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 veiculoId:
 *                   type: integer
 *                 fornecedorId:
 *                   type: integer
 *                 unidadeId:
 *                   type: integer
 *                 dataCompra:
 *                   type: string
 *                   format: date-time
 *                 valorCompra:
 *                   type: number
 *                 veiculo:
 *                   type: object
 *                 fornecedor:
 *                   type: object
 *                 unidade:
 *                   type: object
 *                 tipoCompra:
 *                   type: object
 *                 situacaoCompra:
 *                   type: object
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todas as compras de veículos
 *     tags: [Compras de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros a retornar. Use 0 para retornar todos.
 *         example: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros a pular. Use limit=0 e offset=0 para retornar todos os registros.
 *         example: 0
 *     responses:
 *       200:
 *         description: Lista de compras de veículos ordenadas por razão social do fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   veiculoId:
 *                     type: integer
 *                   fornecedorId:
 *                     type: integer
 *                   dataCompra:
 *                     type: string
 *                     format: date-time
 *                   valorCompra:
 *                     type: number
 *                   veiculo:
 *                     type: object
 *                   fornecedor:
 *                     type: object
 *                   unidade:
 *                     type: object
 *                   tipoCompra:
 *                     type: object
 *                   situacaoCompra:
 *                     type: object
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, compraVeiculoController.createCompraVeiculo);
router.get("/", verifyToken, compraVeiculoController.findAllComprasVeiculo);
/**
 * @swagger
 * /api/comprasVeiculos/veiculo/{veiculoId}:
 *   get:
 *     summary: Busca compras de veículos por ID do veículo
 *     tags: [Compras de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: veiculoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do veículo
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de compras do veículo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/veiculo/:veiculoId",
  verifyToken,
  compraVeiculoController.findCompraVeiculoByVeiculoId
);

/**
 * @swagger
 * /api/comprasVeiculos/fornecedor/{fornecedorId}:
 *   get:
 *     summary: Busca compras de veículos por ID do fornecedor
 *     tags: [Compras de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fornecedorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de compras do fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/fornecedor/:fornecedorId",
  verifyToken,
  compraVeiculoController.findCompraVeiculoByFornecedorId
);

/**
 * @swagger
 * /api/comprasVeiculos/unidade/{unidadeId}:
 *   get:
 *     summary: Busca compras de veículos por ID da unidade
 *     tags: [Compras de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unidadeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da unidade
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de compras da unidade
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/unidade/:unidadeId",
  verifyToken,
  compraVeiculoController.findCompraVeiculoByUnidadeId
);

/**
 * @swagger
 * /api/comprasVeiculos/{id}:
 *   get:
 *     summary: Busca uma compra de veículo por ID
 *     tags: [Compras de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da compra
 *         example: 1
 *     responses:
 *       200:
 *         description: Compra de veículo encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 veiculoId:
 *                   type: integer
 *                 fornecedorId:
 *                   type: integer
 *                 dataCompra:
 *                   type: string
 *                   format: date-time
 *                 valorCompra:
 *                   type: number
 *                 veiculo:
 *                   type: object
 *                 fornecedor:
 *                   type: object
 *       404:
 *         description: Compra não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, compraVeiculoController.findCompraVeiculoById);

/**
 * @swagger
 * /api/comprasVeiculos/{id}:
 *   put:
 *     summary: Atualiza uma compra de veículo
 *     tags: [Compras de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da compra
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataCompra:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-05"
 *               dataEntrega:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-15"
 *               valorCompra:
 *                 type: number
 *                 format: float
 *                 example: 36000.00
 *               custoAquisicao:
 *                 type: number
 *                 format: float
 *                 example: 36000.00
 *               custoOficina:
 *                 type: number
 *                 format: float
 *                 example: 2000.00
 *               custoEstetica:
 *                 type: number
 *                 format: float
 *                 example: 1000.00
 *               outrosCustos:
 *                 type: number
 *                 format: float
 *                 example: 600.00
 *               taxaTransferencia:
 *                 type: number
 *                 format: float
 *                 example: 350.00
 *               taxaLeilao:
 *                 type: number
 *                 format: float
 *                 example: 250.00
 *               outrasTaxas:
 *                 type: number
 *                 format: float
 *                 example: 200.00
 *               valorAvaliado:
 *                 type: number
 *                 format: float
 *                 example: 42000.00
 *               situacaoCompraId:
 *                 type: integer
 *                 example: 2
 *               observacoes:
 *                 type: string
 *                 example: "Compra finalizada"
 *     responses:
 *       200:
 *         description: Compra atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Compra não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", verifyToken, compraVeiculoController.updateCompraVeiculo);

/**
 * @swagger
 * /api/comprasVeiculos/{id}:
 *   delete:
 *     summary: Exclui uma compra de veículo
 *     tags: [Compras de Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da compra
 *         example: 1
 *     responses:
 *       200:
 *         description: Compra excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Compra de veículo excluída com sucesso"
 *       404:
 *         description: Compra não encontrada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", verifyToken, compraVeiculoController.deleteCompraVeiculo);

module.exports = router;
