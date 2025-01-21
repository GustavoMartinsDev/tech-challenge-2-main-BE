const DetailedAccountModel = require("../../models/DetailedAccount");

const updateTransaction = async ({ transaction, updateData, repository }) => {
  const result = await repository.update(transaction, updateData);
  return new DetailedAccountModel(result);
};

module.exports = updateTransaction;
