const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.register = async (req, res) => {
  console.log("register: [POST] /register");
  try {
    console.log(req.body);
    if (!req.body.password || !req.body.username) {
      console.error("[ERROR] Password or Username are empty");
      return res.status(400).json("Bad Request");
    }
    bcrypt.hash(req.body.password, 10).then(async (hash) => {
      const USER_MODEL = {
        username: req.body.username,
        password: hash,
      };

      try {
        const user = await User.create(USER_MODEL);

        console.log("[OK]", user);
        return res.status(201).json(user);
      } catch (error) {
        console.error("[ERROR] controllers/register", error);
        return res.status(500).json(error);
      }
    });
  } catch (error) {
    return res.status(400).json("Bad Request");
  }
};

exports.login = async (req, res, next) => {
  console.log("login: [POST] /login");
  try {
    const username = req.body.username;
    const USER = await User.findOne({ where: { username } });
    if (!USER) {
      return res.status(401).json({
        error: new Error("User not found!"),
      });
    }
    const valid = await bcrypt.compare(req.body.password, USER.password);
    if (!valid) {
      return res.status(401).json({
        error: new Error("Incorrect password!"),
      });
    }
    const token = jwt.sign({ userId: USER.id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    });
    return res.status(200).json({
      userId: USER.id,
      token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
