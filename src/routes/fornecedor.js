const express = require("express");
const router = express.Router();
const fornecedorController = require("../controllers/fornecedorController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/fornecedores:
 *   post:
 *     summary: Cria um novo fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razaoSocial
 *               - cpfCnpj
 *               - tipo
 *               - endereco
 *               - cidade
 *               - uf
 *               - cep
 *               - telefone1
 *               - email
 *               - situacao
 *             properties:
 *               razaoSocial:
 *                 type: string
 *                 description: Razão social do fornecedor
 *                 example: "Fornecedor XYZ Ltda"
 *               cpfCnpj:
 *                 type: string
 *                 description: CPF (11 dígitos) ou CNPJ (14 dígitos)
 *                 example: "12345678901234"
 *               tipo:
 *                 type: string
 *                 enum: [PF, PJ]
 *                 description: Tipo de pessoa (PF ou PJ)
 *                 example: "PJ"
 *               endereco:
 *                 type: string
 *                 description: Endereço completo
 *                 example: "Rua Exemplo, 123"
 *               cidade:
 *                 type: string
 *                 description: Cidade
 *                 example: "São Paulo"
 *               uf:
 *                 type: string
 *                 description: Unidade federativa (sigla do estado)
 *                 example: "SP"
 *               cep:
 *                 type: string
 *                 description: CEP
 *                 example: "12345678"
 *               telefone1:
 *                 type: string
 *                 description: Telefone principal
 *                 example: "(11) 1234-5678"
 *               telefone2:
 *                 type: string
 *                 description: Telefone secundário (opcional)
 *                 example: "(11) 9876-5432"
 *               site:
 *                 type: string
 *                 description: Site do fornecedor (opcional)
 *                 example: "www.fornecedor.com.br"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do fornecedor
 *                 example: "contato@fornecedor.com.br"
 *               situacao:
 *                 type: string
 *                 description: Situação do fornecedor
 *                 example: "ATIVO"
 *               observacoes:
 *                 type: string
 *                 description: Observações sobre o fornecedor (opcional)
 *                 example: "Fornecedor preferencial"
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 razaoSocial:
 *                   type: string
 *                 cpfCnpj:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado
 *       409:
 *         description: CPF/CNPJ ou email já cadastrado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Lista todos os fornecedores
 *     tags: [Fornecedores]
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
 *         description: Lista de fornecedores ordenados por razão social
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   razaoSocial:
 *                     type: string
 *                   cpfCnpj:
 *                     type: string
 *                   tipo:
 *                     type: string
 *                   email:
 *                     type: string
 *                   situacao:
 *                     type: string
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", verifyToken, fornecedorController.createFornecedor);
router.get("/", verifyToken, fornecedorController.findAllFornecedores);

/**
 * @swagger
 * /api/fornecedores/razao/{razaoSocial}:
 *   get:
 *     summary: Busca fornecedores por razão social
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: razaoSocial
 *         required: true
 *         schema:
 *           type: string
 *         description: Razão social para busca (aceita correspondência parcial)
 *         example: "XYZ"
 *     responses:
 *       200:
 *         description: Lista de fornecedores encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Razão social inválida
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/razao/:razaoSocial",
  verifyToken,
  fornecedorController.findByRazaoSocial
);

/**
 * @swagger
 * /api/fornecedores/cpfcnpj/{cpfCnpj}:
 *   get:
 *     summary: Busca fornecedor por CPF ou CNPJ
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cpfCnpj
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF ou CNPJ do fornecedor
 *         example: "12345678901234"
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 razaoSocial:
 *                   type: string
 *                 cpfCnpj:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: CPF/CNPJ inválido
 *       404:
 *         description: Fornecedor não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  "/cpfcnpj/:cpfCnpj",
  verifyToken,
  fornecedorController.findByCpfCnpj
);

/**
 * @swagger
 * /api/fornecedores/email/{email}:
 *   get:
 *     summary: Busca fornecedor por email
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email do fornecedor
 *         example: "contato@fornecedor.com.br"
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Email inválido
 *       404:
 *         description: Fornecedor não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/email/:email", verifyToken, fornecedorController.findByEmail);

/**
 * @swagger
 * /api/fornecedores/{id}:
 *   get:
 *     summary: Busca fornecedor por ID
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor
 *         example: 1
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 razaoSocial:
 *                   type: string
 *                 cpfCnpj:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 endereco:
 *                   type: string
 *                 cidade:
 *                   type: string
 *                 uf:
 *                   type: string
 *                 cep:
 *                   type: string
 *                 telefone1:
 *                   type: string
 *                 email:
 *                   type: string
 *                 situacao:
 *                   type: string
 *       404:
 *         description: Fornecedor não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", verifyToken, fornecedorController.findFornecedorById);

/**
 * @swagger
 * /api/fornecedores/{id}:
 *   put:
 *     summary: Atualiza um fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razaoSocial:
 *                 type: string
 *                 example: "Fornecedor XYZ Ltda - Atualizado"
 *               cpfCnpj:
 *                 type: string
 *                 example: "12345678901234"
 *               tipo:
 *                 type: string
 *                 enum: [PF, PJ]
 *                 example: "PJ"
 *               endereco:
 *                 type: string
 *                 example: "Rua Nova, 456"
 *               cidade:
 *                 type: string
 *                 example: "Rio de Janeiro"
 *               uf:
 *                 type: string
 *                 example: "RJ"
 *               cep:
 *                 type: string
 *                 example: "87654321"
 *               telefone1:
 *                 type: string
 *                 example: "(21) 9876-5432"
 *               telefone2:
 *                 type: string
 *                 example: "(21) 1234-5678"
 *               site:
 *                 type: string
 *                 example: "www.fornecedor-novo.com.br"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "novo@fornecedor.com.br"
 *               situacao:
 *                 type: string
 *                 example: "INATIVO"
 *               observacoes:
 *                 type: string
 *                 example: "Fornecedor atualizado"
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Fornecedor não encontrado
 *       409:
 *         description: CPF/CNPJ ou email já cadastrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Exclui um fornecedor
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor
 *         example: 1
 *     responses:
 *       200:
 *         description: Fornecedor excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Fornecedor excluído com sucesso"
 *       404:
 *         description: Fornecedor não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", verifyToken, fornecedorController.updateFornecedor);
router.delete("/:id", verifyToken, fornecedorController.deleteFornecedor);

module.exports = router;
