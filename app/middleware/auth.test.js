const jwt = require("jsonwebtoken");

const authMiddleware = require("./auth");

describe("Testing middleware auth check", () => {
  const env = process.env;
  const dockerEnv = {
    TOKEN_SECRET: "ZAWARUDO",
  };

  // Mocks
  const mockNext = jest.fn(() => {});
  const mockStatusCatch = jest.fn((statusCode) => {
    void statusCode;
    return { json: () => {} };
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  afterEach(() => {
    process.env = env;
  });

  test("Denied access middleware", () => {
    const input = {
      req: { body: { userId: 1 } },
      res: {
        status: mockStatusCatch,
      },
    };

    authMiddleware(input.req, input.res, mockNext);
    expect(mockStatusCatch).toHaveBeenCalledWith(401);
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
      expect(error).toHaveProperty("message", "Invalid user ID");
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
      expect(error).toHaveProperty("message", "Invalid user ID");
    }
  });
});
