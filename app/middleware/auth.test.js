const jwt = require("jsonwebtoken");
const { INVALID_USERID } = require("../../statusMessages");
const mockStatusCatch = require("../../__mocks__/mockStatusCatch");

const authMiddleware = require("./auth");

describe("Testing middleware auth check", () => {
  const env = process.env;
  const dockerEnv = {
    TOKEN_SECRET: "ZAWARUDO",
  };

  // Mocks
  const mockNext = jest.fn(() => {});
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  afterEach(() => {
    process.env = env;
  });

  const statusCatchFunc = jest.fn(mockStatusCatch)

  test("Denied access middleware", () => {
    const input = {
      req: { body: { userId: 1 } },
      res: {
        status: statusCatchFunc,
      },
    };

    authMiddleware(input.req, input.res, mockNext);
    expect(statusCatchFunc).toHaveBeenCalledWith(401);
  });

  test("Authorize access middleware", () => {
    const token = jwt.sign({ userId: "test" }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        body: { userId: "test" },
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    authMiddleware(input.req, input.res, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test("Throw error, no userId in body", () => {
    const token = jwt.sign({ userId: "banana" }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        body: {},
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    try {
      authMiddleware(input.req, input.res, mockNext);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
      expect(error).toHaveProperty("message", INVALID_USERID);
    }
  });

  test("Throw error, userId is wrong in body", () => {
    const token = jwt.sign({ userId: "banana" }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });

    const input = {
      req: {
        body: { userId: "ringo" },
        headers: { authorization: `Bearer ${token}` },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    try {
      authMiddleware(input.req, input.res, mockNext);
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
      expect(error).toHaveProperty("message", INVALID_USERID);
    }
  });
});
