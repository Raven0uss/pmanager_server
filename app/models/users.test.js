const User = require("./users");

describe("User datamodel", () => {
  const env = process.env;
  const dockerEnv = {
    PGUSER: "root",
    PGPASSWORD: "root",
    PGDATABASE: "root",
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env, ...dockerEnv };
  });

  afterEach(() => {
    process.env = env;
  });

  test("Check if User as been well init", () => {
    const input = new User();
    const expected = true;

    const result = Object.prototype.hasOwnProperty.call(input, "dataValues");
    expect(result).toBe(expected);
  });
});
