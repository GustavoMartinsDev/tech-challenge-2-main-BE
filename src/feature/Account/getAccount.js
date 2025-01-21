const Account = require("../../models/Account");

const getAccount = async ({ filter, repository }) => {
  const result = await repository.get(filter);
  return result?.map((user) => new Account(user));
};

const getByUserIdAccount = async ({ idUser, repository }) => {
  const filter = { userId: idUser };
  const result = await repository.get(filter);
  return result?.map((user) => new Account(user));
};

module.exports = getAccount;
module.exports = getByUserIdAccount;
