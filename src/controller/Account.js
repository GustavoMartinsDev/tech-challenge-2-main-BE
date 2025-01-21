const TransactionDTO = require("../models/DetailedAccount");

class AccountController {
  constructor(di = {}) {
    this.di = Object.assign(
      {
        userRepository: require("../infra/mongoose/repository/userRepository"),
        accountRepository: require("../infra/mongoose/repository/accountRepository"),
        cardRepository: require("../infra/mongoose/repository/cardRepository"),
        transactionRepository: require("../infra/mongoose/repository/detailedAccountRepository"),

        saveCard: require("../feature/Card/saveCard"),
        salvarUsuario: require("../feature/User/salvarUsuario"),
        saveAccount: require("../feature/Account/saveAccount"),
        getUserByID: require("../feature/User/getUser"),
        getAccount: require("../feature/Account/getAccount"),
        getByUserIdAccount: require("../feature/Account/getAccount"),
        saveTransaction: require("../feature/Transaction/saveTransaction"),
        updateTransaction: require("../feature/Transaction/updateTransaction"),
        deleteTransaction: require("../feature/Transaction/deleteTransaction"),
        getTransaction: require("../feature/Transaction/getTransaction"),
        getCard: require("../feature/Card/getCard"),
      },
      di
    );
  }

  async find(req, res) {
    const {
      accountRepository,
      getAccount,
      getCard,
      getTransaction,
      transactionRepository,
      cardRepository,
    } = this.di;

    try {
      const userId = req.user.id;
      const account = await getAccount({
        repository: accountRepository,
        filter: { userId },
      });
      const transactions = await getTransaction({
        filter: { accountId: account[0].id },
        repository: transactionRepository,
      });
      const currentBalance = transactions.reduce((acc, transaction) => {
        return acc + transaction.value;
      }, 0);
      const cards = await getCard({
        filter: { accountId: account[0].id },
        repository: cardRepository,
      });

      res.status(200).json({
        message: "Conta encontrada carregado com sucesso",
        result: {
          account,
          transactions,
          cards,
          balance: currentBalance,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro no servidor",
      });
    }
  }

  async findByUserId(req, res) {
    const {
      accountRepository,
      getByUserIdAccount,
      getCard,
      getTransaction,
      getUserByID,
      transactionRepository,
      cardRepository,
      userRepository,
    } = this.di;

    try {
      const userId = req.params.id;

      const account = await getByUserIdAccount({
        idUser: userId,
        repository: accountRepository,
      });
      if (!account || account.length === 0) {
        return res.status(404).json({ message: "Conta não encontrada" });
      }

      const transactions = await getTransaction({
        filter: { accountId: account[0].id },
        repository: transactionRepository,
      });
      const currentBalance = transactions.reduce((acc, transaction) => {
        return acc + transaction.value;
      }, 0);
      const cards = await getCard({
        filter: { accountId: account[0].id },
        repository: cardRepository,
      });

      const user = await getUserByID({
        id: userId,
        repository: userRepository,
      });

      res.status(200).json({
        message: "Conta encontrada carregada com sucesso",
        result: {
          account,
          transactions,
          cards,
          balance: currentBalance,
          fullName: user[0].username,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro no servidor",
      });
    }
  }

  async createTransaction(req, res) {
    const { saveTransaction, transactionRepository } = this.di;
    const { accountId, value, type, from, to } = req.body;
    const transactionDTO = new TransactionDTO({
      accountId,
      value,
      from,
      to,
      type,
      date: new Date(),
    });

    const transaction = await saveTransaction({
      transaction: transactionDTO,
      repository: transactionRepository,
    });

    res.status(201).json({
      message: "Transação criada com sucesso",
      result: transaction,
    });
  }

  async updateTransaction(req, res) {
    const { updateTransaction, transactionRepository } = this.di;
    const { transactionId } = req.params;
    const updateData = req.body;

    try {
      const transaction = await updateTransaction({
        transaction: { _id: transactionId },
        updateData,
        repository: transactionRepository,
      });

      res.status(200).json({
        message: "Transação atualizada com sucesso",
        result: transaction,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao atualizar a transação",
        error: error.message,
      });
    }
  }

  async deleteTransaction(req, res) {
    const { deleteTransaction, transactionRepository } = this.di;
    const { transactionId } = req.params;

    try {
      const transaction = await deleteTransaction({
        transaction: { _id: transactionId },
        repository: transactionRepository,
      });

      res.status(200).json({
        message: "Transação deletada com sucesso",
        result: transaction,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao deletar a transação",
        error: error.message,
      });
    }
  }

  async getStatment(req, res) {
    const { getTransaction, transactionRepository } = this.di;

    const { accountId } = req.params;

    const transactions = await getTransaction({
      filter: { accountId },
      repository: transactionRepository,
    });
    const currentBalance = transactions.reduce((acc, transaction) => {
      return acc + transaction.value;
    }, 0);
    res.status(201).json({
      message: "Transação criada com sucesso",
      result: {
        transactions,
        balance: currentBalance,
      },
    });
  }
}

module.exports = AccountController;
