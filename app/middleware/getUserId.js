const jwt = require("jsonwebtoken");

module.exports = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  console.log(decodedToken);
  const userId = decodedToken.userId;
  console.log(userId);
  return userId;
};
