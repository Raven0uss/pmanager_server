const mock_database = require("../../__mocks__/mock_database");
const mock_User = require("../../__mocks__/models/mock_User");
const jwt = require("jsonwebtoken");
const lodash = require("lodash");
const { register, login } = require("./users");
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

describe("login check suites", () => {
  let database = lodash.clone(mock_database);
  jest.mock("jsonwebtoken", () => ({ sign: jest.fn(() => "yummy-token") }));
  jest.mock("bcrypt", () => ({
    compare: jest.fn((a, b) => {
      console.log("bcrypt compare !");
      Promise.resolve(a === b);
    }),
  }));

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    database = lodash.clone(mock_database);
  });

  // test("login successfuly", () => {
  //   const User = {
  //     findOne: mock_User(database).findOne,
  //   };

  //   const input = {
  //     req: {
  //       body: {
  //         username: database.user[0].username,
  //         password: database.user[0].password,
  //       },
  //     },
  //     res: {
  //       status: mockStatusCatch,
  //     },
  //   };

  //   return login(User)(input.req, input.res).then(async (result) => {
  //     expect(result).toEqual(
  //       expect.objectContaining({
  //         userId: expect.stringMatching(`${database.user[0].id}`),
  //         token: expect.stringMatching("yummy-token"),
  //       })
  //     );
  //   });
  // });

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

    return login(User)(input.req, input.res).then(() =>
      expect(statusCatchFunc).toHaveBeenCalledWith(401)
    );
  });

  test.todo("password invalid");

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
