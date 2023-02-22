const mock_database = require("../../__mocks__/mock_database");
const mock_User = require("../../__mocks__/models/mock_User");
const lodash = require("lodash");
const { register, token } = require("./users");
const mockStatusCatch = require("../../__mocks__/mockStatusCatch");
const { USER_ALREADY_EXIST } = require("../../statusMessages");

jest.mock("jsonwebtoken", () => ({ verify: jest.fn(() => true) }));

describe("register check suites", () => {
  let database = lodash.clone(mock_database);

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    database = lodash.clone(mock_database);
  });

  test("register success", async () => {
    const User = {
      create: mock_User(database).create,
    };

    const input = {
      req: {
        body: {
          username: "westworld",
          password: "isawesome",
        },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    return register(User)(input.req, input.res).then(async (result) => {
      expect(result).toEqual(
        expect.objectContaining({
          username: expect.stringMatching("westworld"),
          // Here it checks the string is not matching to be sure
          // this is a hash of bcrypt but key still exists :)
          password: expect.not.stringMatching("isawesome"),
        })
      );
    });
  });

  test("register user already registered", async () => {
    const User = {
      create: mock_User(database).create,
    };

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        body: {
          username: database.user[0].username,
          password: "who is mister robot ?",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    return register(User)(input.req, input.res).then((response) => {
      expect(response).toBe(USER_ALREADY_EXIST);
      return expect(statusCatchFunc).toHaveBeenCalledWith(400);
    });
  });

  test("register empty password", () => {
    const User = {
      create: mock_User(database).create,
    };

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        body: {
          username: "westworld",
          password: "",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    register(User)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("register empty username", () => {
    const User = {
      create: mock_User(database).create,
    };

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        body: {
          username: "",
          password: "fsociety",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    register(User)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("register error 400 main catch block", () => {
    const User = {
      create: mock_User(database).create,
    };

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        karada: {
          username: "cloud",
          password: "atlas",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    register(User)(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("register error 500", () => {
    const User = {};

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        body: {
          username: "joe_hisaishi",
          password: "rapyuta",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    return register(User)(input.req, input.res).then(() =>
      expect(statusCatchFunc).toHaveBeenCalledWith(500)
    );
  });
});

describe("Check Token validity controller", () => {
  const env = process.env;
  const dockerEnv = {
    TOKEN_SECRET: "ZAWARUDO",
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  test("token is nil", () => {
    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        body: {
          token: null,
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    token()(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(400);
  });

  test("token is verified by jwt", () => {
    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        body: {
          token: "yummy-token",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    token()(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(201);
  });

  test("token error 500", () => {
    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        query: {
          token: "oops, not in body D:",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    token()(input.req, input.res);
    expect(statusCatchFunc).toHaveBeenCalledWith(500);
  });
});
