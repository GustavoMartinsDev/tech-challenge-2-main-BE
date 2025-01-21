const DetailedAccountModel = require("../../models/DetailedAccount");

const deleteTransaction = async ({ transaction, repository }) => {
  const result = await repository.delete(transaction);
  return new DetailedAccountModel(result);
};

module.exports = deleteTransaction;
