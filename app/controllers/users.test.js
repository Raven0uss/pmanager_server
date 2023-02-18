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

  //   test("register empty password", () => {});

  //   test("register empty username", () => {});

//   test("register success", async () => {
//     const User = {
//       create: mock_User(database).create,
//       //   findOne: mock_User(database).findOne,
//     };

//     const input = {
//       req: {
//         body: {
//           username: "westworld",
//           password: "isawesome",
//         },
//       },
//       res: {
//         status: mockStatusCatch,
//       },
//     };

//     register(User)(input.req, input.res).then((result) => {
//       console.log(result);
//       expect(result).toEqual(
//         undefined
//         // expect.objectContaining({
//         //   username: expect.stringMatching("westworld"),
//         //   password: expect.not.stringMatching("isawesome"),
//         // })
//       );
//     });
//   });

  //   test("register error 400", () => {});

  //   test("register error 500", () => {});
});
