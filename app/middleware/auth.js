const { ACCESS_DENIED, INVALID_USERID } = require("../../statusMessages");
const getUserId = require("../functions/getUserId");

module.exports = (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (req.body.userId && req.body.userId !== userId) {
      throw INVALID_USERID;
    } else {
      next();
    }
  } catch {
    res.status(401).json(ACCESS_DENIED);
  }
};
