const mock_database = require("../../__mocks__/mock_database");
const mock_User = require("../../__mocks__/models/mock_User");
const jwt = require("jsonwebtoken");
const lodash = require("lodash");
const { register } = require("./users");
const mockStatusCatch = require("../../__mocks__/mockStatusCatch");

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
      findOne: mock_User(database).findOne,
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

  test.todo("register empty password");
  test.todo("register empty username");
  test.todo("register error 400");
  test.todo("register error 500");
});
