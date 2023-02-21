const mock_database = require("../../__mocks__/mock_database");
const mock_Project = require("../../__mocks__/models/mock_Project");
const {
  getProject,
  getProjects,
  createProject,
  deleteProjects,
  updateProject,
} = require("./projects");
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

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        query: {
          project_id: 1,
        },
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    getProject(Project)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(500);
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

  test("getProjects get empty array", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
    };
    const token = jwt.sign({ userId: 3 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = [];
    return expect(getProjects(Project)(input.req, input.res)).resolves.toEqual(
      expected
    );
  });

  test("getProjects get 3 projects only", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = 3;
    return expect(
      getProjects(Project)(input.req, input.res)
    ).resolves.toHaveLength(expected);
  });

  test("getProjects get error 500", () => {
    const Project = null;
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    getProjects(Project)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(500);
  });
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

  test("createProject get bad json", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      create: mock_Project(database).create,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: "01245",
          content: "cheesecakes are delicious right ?",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    createProject(Project)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("createProject empty name", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      create: mock_Project(database).create,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: "",
          content: '{"chocolate": "2"}',
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    createProject(Project)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("createProject bad request", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      create: mock_Project(database).create,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    createProject(Project)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("createProject name exist", async () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      create: mock_Project(database).create,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: database.project[0].name,
          content: '{"chocolate": "2"}',
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    createProject(Project)(input.req, input.res).then(() => {
      expect(statusCatchFunc).toHaveBeenCalledWith(400);
    });
  });

  test("createProject error 500", async () => {
    const Project = {
      findAll: mock_Project(database).findAll,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: "012345",
          content: '{"chocolate": "2"}',
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    createProject(Project)(input.req, input.res).then(() => {
      expect(statusCatchFunc).toHaveBeenCalledWith(500);
    });
  });

  test("createProject success", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      create: mock_Project(database).create,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: "012345",
          content: '{"chocolate": "2"}',
        },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = {
      ...input.req.body,
      user_id: 1,
    };

    return expect(
      createProject(Project)(input.req, input.res)
    ).resolves.toEqual(expected);
  });
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

  test("delete project get 500", () => {
    const Project = null;
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        query: {
          ids: "0;1",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    deleteProjects(Project)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(500);
  });

  // Can delete only one here because don't own the 2
  test("delete project can delete only one", () => {
    const Project = {
      destroy: mock_Project(database).destroy,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        query: {
          ids: "1;2",
        },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = [1];
    return expect(
      deleteProjects(Project)(input.req, input.res)
    ).resolves.toEqual(expected);
  });

  test("delete project one", () => {
    const Project = {
      destroy: mock_Project(database).destroy,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        query: {
          ids: "1",
        },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = [1];
    return expect(
      deleteProjects(Project)(input.req, input.res)
    ).resolves.toEqual(expected);
  });

  test("delete project can delete multiple", () => {
    const Project = {
      destroy: mock_Project(database).destroy,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        query: {
          ids: "1;3",
        },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = [2];
    return expect(
      deleteProjects(Project)(input.req, input.res)
    ).resolves.toEqual(expected);
  });

  test("delete project dont own project", () => {
    const Project = {
      destroy: mock_Project(database).destroy,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        query: {
          ids: "2",
        },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = [0];
    return expect(
      deleteProjects(Project)(input.req, input.res)
    ).resolves.toEqual(expected);
  });
});

// Testing update project
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

  test("updateProject get bad json", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      update: mock_Project(database).update,
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: "01245",
          content: "cheesecakes are delicious right ?",
        },
        query: { project_id: 1 },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    updateProject(Project)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("updateProject empty name", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      update: mock_Project(database).create,
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: "",
          content: '{"chocolate": "2"}',
        },
        query: { project_id: 1 },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    updateProject(Project)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("updateProject bad request", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      update: mock_Project(database).update,
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    updateProject(Project)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("updateProject name exist", async () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      update: mock_Project(database).update,
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: database.project[2].name,
          content: '{"chocolate": "2"}',
        },
        query: { project_id: 1 },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    updateProject(Project)(input.req, input.res).then(() => {
      expect(statusCatchFunc).toHaveBeenCalledWith(400);
    });
  });

  test("updateProject id project is not give", async () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      update: mock_Project(database).update,
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: database.project[0].name,
          content: '{"chocolate": "2"}',
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    updateProject(Project)(input.req, input.res).then(() => {
      expect(statusCatchFunc).toHaveBeenCalledWith(400);
    });
  });

  test("updateProject id project is not good or owner", async () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      update: mock_Project(database).update,
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: database.project[0].name,
          content: '{"chocolate": "2"}',
        },
        query: {
          project_id: 2,
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    updateProject(Project)(input.req, input.res).then(() => {
      expect(statusCatchFunc).toHaveBeenCalledWith(400);
    });
  });

  test("updateProject error 500", async () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: "012345",
          content: '{"chocolate": "2"}',
        },
        query: {
          project_id: 1,
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    updateProject(Project)(input.req, input.res).then(() => {
      expect(statusCatchFunc).toHaveBeenCalledWith(500);
    });
  });

  test("updateProject success", () => {
    const Project = {
      findAll: mock_Project(database).findAll,
      update: mock_Project(database).update,
      findOne: mock_Project(database).findOne,
    };
    const token = jwt.sign({ userId: 1 }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        headers: { authorization: `Bearer ${token}` },
        body: {
          name: "012345",
          content: '{"chocolate": "2"}',
        },
        query: { project_id: 1 },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    const expected = input.req.body;
    return expect(
      updateProject(Project)(input.req, input.res)
    ).resolves.toEqual(expected);
  });
});
