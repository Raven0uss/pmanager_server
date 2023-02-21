const { intersectionWith } = require("lodash");

module.exports = (database) => ({
  // Return only one element which match with where
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
  // Return all the elements which match with where
  findAll: ({ where }) => {
    let table = database.project;
    if (!where) {
      return Promise.resolve(table);
    }
    const keys = Object.keys(where);

    keys.forEach((key) => {
      table = table.filter((project) => project[key] === where[key]);
    });

    const result = table;
    return Promise.resolve(result);
  },
  // return directly the model
  create: (model) => {
    return Promise.resolve(model);
  },
  // Return the number of element which has been deleted
  destroy: ({ where }) => {
    if (!where || !where.id) {
      throw Error;
    }
    let table = database.project;
    const keys = Object.keys(where);

    keys
      .filter((key) => key !== "id")
      .forEach((key) => {
        table = table.filter((project) => project[key] === where[key]);
      });

    table = intersectionWith(where.id, table, (id, project) => {
      // Use the == operator instead === to not compare the types
      return id == project.id;
    });

    const result = table.length;
    return Promise.resolve([result]);
  },
  // Return the number of elements which has been modified
  update: (model, { where }) => {
    if (!where) {
      throw Error;
    }
    let table = database.project;
    const keys = Object.keys(where);

    keys.forEach((key) => {
      table = table.filter((project) => project[key] === where[key]);
    });

    if (table.length > 1) {
      throw Error;
    }

    // Behaviour of sequelize when we use the props to return obj
    // on update request instead of n element modified
    return Promise.resolve([null, model]);
  },
});
