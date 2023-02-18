module.exports = (database) => ({
  findOne: ({ where }) => {
    if (!where) {
      throw Error;
    }
    let result = null;
    let table = database.project;
    const keys = Object.keys(where);

    keys.forEach((key) => {
      table = table.filter((project) => project[key] === where[key]);
    });

    if (table.length === 1) result = table[0];
    return Promise.resolve(result);
  },
});
