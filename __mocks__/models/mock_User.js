const { get } = require("lodash");

module.exports = (database) => ({
  // Create a user
  create: (model) => {
    if (
      database.user.find(
        (user) => user.username === get(model, "username", null)
      )
    )
      // Simulate the behaviour of sequelize when we try to add existant user in DB
      throw { name: "SequelizeUniqueConstraintError" };
    return Promise.resolve(model);
  },
  // Find User
  findOne: ({ where }) => {
    if (!where) {
      throw Error;
    }
    let result = null;
    let table = database.user;
    const keys = Object.keys(where);

    keys.forEach((key) => {
      table = table.filter((user) => user[key] === where[key]);
    });

    if (table.length === 1) result = table[0];
    return Promise.resolve(result);
  },
});
