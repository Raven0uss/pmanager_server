const getUserId = require("./getUserId");

module.exports = (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json("Denied !");
  }
};
