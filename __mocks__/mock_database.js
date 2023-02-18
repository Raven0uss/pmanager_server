const faker = require("faker");

const createProjects = () => {
  let index = 0;
  const size = 6;
  const project = [];

  while (index < size) {
    project.push({
      id: index + 1,
      user_id: index % 2 + 1,
      name: faker.name.firstName(),
      content: faker.datatype.json(),
    });
    index++;
  }

  return project;
};

const createUsers = () => {
  let index = 1;
  const size = 2;
  const project = [];

  while (index <= size) {
    project.push({
      id: index,
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });
    index++;
  }

  return project;
};

module.exports = {
  project: createProjects(),
  user: createUsers(),
};
