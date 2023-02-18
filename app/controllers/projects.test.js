const mock_database = require("../../__mocks__/mock_database");
const mock_Project = require("../../__mocks__/models/mock_Project");
const { getProject } = require("./projects");
const jwt = require("jsonwebtoken");
const lodash = require("lodash");
const mockStatusCatch = require("../../__mocks__/mockStatusCatch");

// getProject
describe("Testing getProject controllers", () => {
  const env = process.env;
  const dockerEnv = {
    TOKEN_SECRET: "ZAWARUDO",
  };
  let database = lodash.clone(mock_database);

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  afterEach(() => {
    database = lodash.clone(mock_database);
  });

  test("getProject error 500", () => {
    const Project = null;
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        query: {
          project_id: 1,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    getProject(Project)(input.req, input.res);
    expect(mockStatusCatch).toHaveBeenCalledWith(500);
  });

  test("getProject success 200", () => {
    const Project = {
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        query: {
          project_id: 1,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = database.project[0];
    return expect(getProject(Project)(input.req, input.res)).resolves.toEqual(
      expected
    );
  });

  test("getProject get none", () => {
    const Project = {
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        query: {
          project_id: "oops",
        },
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = null;
    return expect(getProject(Project)(input.req, input.res)).resolves.toEqual(
      expected
    );
  });
});

// getProjects
describe("Testing getProjects controllers", () => {
  const env = process.env;
  const dockerEnv = {
    TOKEN_SECRET: "ZAWARUDO",
  };
  let database = lodash.clone(mock_database);

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  afterEach(() => {
    database = lodash.clone(mock_database);
  });

  test("getProject get none", () => {});
});

// createProject
describe("Testing createProject controllers", () => {
  const env = process.env;
  const dockerEnv = {
    TOKEN_SECRET: "ZAWARUDO",
  };
  let database = lodash.clone(mock_database);

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  afterEach(() => {
    database = lodash.clone(mock_database);
  });

  test("getProject get none", () => {});
});

// deleteProject
describe("Testing deleteProjects controllers", () => {
  const env = process.env;
  const dockerEnv = {
    TOKEN_SECRET: "ZAWARUDO",
  };
  let database = lodash.clone(mock_database);

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  afterEach(() => {
    database = lodash.clone(mock_database);
  });

  test("getProject get none", () => {});
});

// updateProject
describe("Testing updateProject controllers", () => {
  const env = process.env;
  const dockerEnv = {
    TOKEN_SECRET: "ZAWARUDO",
  };
  let database = lodash.clone(mock_database);

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  afterEach(() => {
    database = lodash.clone(mock_database);
  });

  test("getProject get none", () => {});
});
