const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const { verifyToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Criar novo cliente
 *     description: Cadastra um novo cliente no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cpf
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João da Silva
 *                 description: Nome completo do cliente
 *               cpf:
 *                 type: string
 *                 example: 123.456.789-00
 *                 description: CPF do cliente (deve ser único)
 *               rg:
 *                 type: string
 *                 example: 12.345.678-9
 *                 description: RG do cliente
 *               cnh:
 *                 type: string
 *                 example: 12345678900
 *                 description: CNH do cliente
 *               telefone:
 *                 type: string
 *                 example: (85) 98765-4321
 *                 description: Telefone do cliente
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *                 description: E-mail do cliente
 *               endereco:
 *                 type: string
 *                 example: Rua Principal, 123
 *                 description: Endereço completo
 *               cidade:
 *                 type: string
 *                 example: Fortaleza
 *               estado:
 *                 type: string
 *                 example: CE
 *               cep:
 *                 type: string
 *                 example: 60000-000
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     cpf:
 *                       type: string
 *                     telefone:
 *                       type: string
 *       400:
 *         description: Dados inválidos ou CPF já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", verifyToken, clienteController.createCliente);

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Listar todos os clientes
 *     description: Retorna lista de clientes ordenados por nome. Use limit=0 e offset=0 para retornar todos os registros.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Quantidade máxima de registros a retornar (0 = todos)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros a pular (0 = começar do início)
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso (ordenada por nome ascendente)
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
 *                   nomeCompleto:
 *                     type: string
 *                     example: João da Silva
 *                   cpf:
 *                     type: string
 *                     example: 12345678900
 *                   cnh:
 *                     type: string
 *                     example: 12345678900
 *                   telefone1:
 *                     type: string
 *                     example: 85987654321
 *                   telefone2:
 *                     type: string
 *                     example: 85912345678
 *                   email:
 *                     type: string
 *                     example: joao@email.com
 *                   endereco:
 *                     type: string
 *                     example: Rua Principal, 123
 *                   cidade:
 *                     type: string
 *                     example: Fortaleza
 *                   uf:
 *                     type: string
 *                     example: CE
 *                   cep:
 *                     type: string
 *                     example: 60000-000
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", verifyToken, clienteController.findAllClientes);

/**
 * @swagger
 * /api/clientes/nome/{nome}:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Buscar cliente por nome
 *     description: Busca clientes que contenham o nome informado (busca parcial)
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome ou parte do nome do cliente
 *         example: João
 *     responses:
 *       200:
 *         description: Clientes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 clientes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *                       cpf:
 *                         type: string
 *                       telefone:
 *                         type: string
 *       404:
 *         description: Nenhum cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/nome/:nome", verifyToken, clienteController.findClienteByNome);

/**
 * @swagger
 * /api/clientes/cpf/{cpf}:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Buscar cliente por CPF
 *     description: Busca um cliente específico pelo CPF
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente (com ou sem formatação)
 *         example: 123.456.789-00
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     cpf:
 *                       type: string
 *                     rg:
 *                       type: string
 *                     cnh:
 *                       type: string
 *                     telefone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     endereco:
 *                       type: string
 *                     cidade:
 *                       type: string
 *                     estado:
 *                       type: string
 *                     cep:
 *                       type: string
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/cpf/:cpf", verifyToken, clienteController.findClienteByCpf);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Buscar cliente por ID
 *     description: Retorna um cliente específico pelo seu ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     cpf:
 *                       type: string
 *                     rg:
 *                       type: string
 *                     cnh:
 *                       type: string
 *                     telefone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     endereco:
 *                       type: string
 *                     cidade:
 *                       type: string
 *                     estado:
 *                       type: string
 *                     cep:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", verifyToken, clienteController.findClienteById);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     tags:
 *       - Clientes
 *     summary: Atualizar cliente
 *     description: Atualiza os dados de um cliente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente a ser atualizado
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João da Silva Santos
 *               cpf:
 *                 type: string
 *                 example: 123.456.789-00
 *               rg:
 *                 type: string
 *                 example: 12.345.678-9
 *               cnh:
 *                 type: string
 *                 example: 12345678900
 *               telefone:
 *                 type: string
 *                 example: (85) 98765-4321
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao.silva@email.com
 *               endereco:
 *                 type: string
 *                 example: Rua Principal, 123, Apto 45
 *               cidade:
 *                 type: string
 *                 example: Fortaleza
 *               estado:
 *                 type: string
 *                 example: CE
 *               cep:
 *                 type: string
 *                 example: 60000-000
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     cpf:
 *                       type: string
 *                     telefone:
 *                       type: string
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", verifyToken, clienteController.updateCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     tags:
 *       - Clientes
 *     summary: Excluir cliente
 *     description: Remove um cliente do sistema (apenas se não houver vendas associadas)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente a ser excluído
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cliente excluído com sucesso
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Cliente possui vendas associadas e não pode ser excluído
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", verifyToken, clienteController.deleteCliente);

module.exports = router;
