const Project = require("./projects");

describe("Project datamodel", () => {
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

  test("Check if Project as been well init", () => {
    const input = new Project();
    const expected = true;

    const result = Object.prototype.hasOwnProperty.call(input, "dataValues");
    expect(result).toBe(expected);
  });
});
