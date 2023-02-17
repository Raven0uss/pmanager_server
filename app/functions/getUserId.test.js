const jwt = require("jsonwebtoken");
const getUserId = require("./getUserId");

describe("getUserId function", () => {
  const env = process.env;
  const dockerEnv = {
    TOKEN_SECRET: "ZAWARUDO",
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  afterEach(() => {
    process.env = env;
  });

  test("decoding existing token with good userId", () => {
    const token = jwt.sign({ userId: "test" }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });
    const input = { headers: { authorization: `Bearer ${token}` } };
    const expected = "test";

    const result = getUserId(input);
    expect(result).toBe(expected);
  });

  test("decoding existing token with wrong userId", () => {
    const token = jwt.sign({ userId: "test" }, process.env.TOKEN_SECRET, {
      expiresIn: 3000,
    });
    const input = { headers: { authorization: `Bearer ${token}` } };
    const expected = "cheese";

    const result = getUserId(input);
    expect(result).not.toBe(expected);
  });
});
