const { Router } = require("express");
const AccountController = require("./controller/Account");
const accountController = new AccountController({});
const router = Router();

/**
 * @swagger
 * /account/user/{id}:
 *   get:
 *     summary: Busca conta por id do usuário
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de contas encontradas
 */
router.get(
  "/account/user/:id",
  accountController.findByUserId.bind(accountController)
);

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Busca contas
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contas encontradas
 */
router.get("/account", accountController.find.bind(accountController));

/**
 * @swagger
 * /account/transaction/id/{transactionId}:
 *   post:
 *     summary: Cria uma nova transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: transaction
 *         required: true
 *         description: Dados para criar a transação
 *         schema:
 *           type: object
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 */
router.post(
  "/account/transaction",
  accountController.createTransaction.bind(accountController)
);

/**
 * @swagger
 * /account/transaction:
 *   put:
 *     summary: Atualiza uma transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: number
 *       - in: body
 *         name: updateData
 *         required: true
 *         description: Dados para atualizar a transação
 *         schema:
 *           type: object
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *       401:
 *         description: Token inválido
 */
router.put(
  "/account/transaction/id/:transactionId",
  accountController.updateTransaction.bind(accountController)
);

/**
 * @swagger
 * /account/transaction/id/{transactionId}:
 *   delete:
 *     summary: Deleta uma transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Transação deletada com sucesso
 *       401:
 *         description: Token inválido
 */
router.delete(
  "/account/transaction/id/:transactionId",
  accountController.deleteTransaction.bind(accountController)
);

/**
 * @swagger
 * /account/{accountId}/statement:
 *   get:
 *     summary: Obtém extrato da conta
 *     tags: [Extratos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         description: ID da conta
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Extrato encontrado
 *       401:
 *         description: Token invalido
 */
router.get(
  "/account/:accountId/statement",
  accountController.getStatment.bind(accountController)
);

module.exports = router;
