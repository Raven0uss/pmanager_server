module.exports = (database) => ({
  // Create a user
  create: (model) => {
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
