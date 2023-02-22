const mock_database = require("../../__mocks__/mock_database");
const mock_User = require("../../__mocks__/models/mock_User");
const lodash = require("lodash");
const { login } = require("./users");
const mockStatusCatch = require("../../__mocks__/mockStatusCatch");
const { PASSWORD_INCORRECT, USER_NOT_FOUND } = require("../../statusMessages");

jest.mock("bcrypt", () => ({
  compare: (a, b) => Promise.resolve(a === b),
}));

jest.mock("jsonwebtoken", () => ({ sign: jest.fn(() => "yummy-token") }));

describe("login check suites", () => {
  let database = lodash.clone(mock_database);

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    database = lodash.clone(mock_database);
  });

  test("login successfuly", () => {
    const User = {
      findOne: mock_User(database).findOne,
    };

    const input = {
      req: {
        body: {
          username: database.user[0].username,
          password: database.user[0].password,
        },
      },
      res: {
        status: mockStatusCatch,
      },
    };

    return login(User)(input.req, input.res).then(async (result) => {
      expect(result).toEqual(
        expect.objectContaining({
          userId: database.user[0].id,
          token: "yummy-token",
        })
      );
    });
  });

  test("user does not exist", () => {
    const User = {
      findOne: mock_User(database).findOne,
    };

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        body: {
          username: "hisoka",
          password: "bungeegum",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    return login(User)(input.req, input.res).then((response) => {
      expect(response).toBe(USER_NOT_FOUND);
      return expect(statusCatchFunc).toHaveBeenCalledWith(401);
    });
  });

  test("password invalid", () => {
    const User = {
      findOne: mock_User(database).findOne,
    };

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        body: {
          username: database.user[0].username,
          password: "neko neko neko",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    return login(User)(input.req, input.res).then((response) => {
      expect(response).toBe(PASSWORD_INCORRECT);
      return expect(statusCatchFunc).toHaveBeenCalledWith(401);
    });
  });

  test("error 500", () => {
    const User = {
      findOne: mock_User(database).findOne,
    };

    const statusCatchFunc = jest.fn(mockStatusCatch);

    const input = {
      req: {
        jojo: {
          username: "jojo",
          password: "isjojo",
        },
      },
      res: {
        status: statusCatchFunc,
      },
    };

    return login(User)(input.req, input.res).then(() =>
      expect(statusCatchFunc).toHaveBeenCalledWith(500)
    );
  });
});
