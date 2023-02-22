const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  BAD_REQUEST,
  USERNAME_PASSWORD_INVALID,
  USER_NOT_FOUND,
  PASSWORD_INCORRECT,
  USER_ALREADY_EXIST,
} = require("../../statusMessages");
const { get } = require("lodash");

// Register controller function
exports.register = (User) => async (req, res) => {
  console.log("register: [POST] /register");
  try {
    // Avoiding an error form hash function of bcrypt
    if (!req.body.password || !req.body.username) {
      console.error("[ERROR] Password or Username are empty");
      return res.status(400).json(USERNAME_PASSWORD_INVALID);
    }

    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const USER_MODEL = {
        username: req.body.username,
        password: hash,
      };
      const user = await User.create(USER_MODEL);
      return res.status(201).json(user);
    } catch (error) {
      console.error("[ERROR] controllers/register", error);
      if (get(error, "name") === "SequelizeUniqueConstraintError")
        return res.status(500).json(USER_ALREADY_EXIST);
      return res.status(500).json(error);
    }
  } catch (error) {
    return res.status(400).json(BAD_REQUEST);
  }
};

// Login controller function
exports.login = (User) => async (req, res) => {
  console.log("login: [POST] /login");
  try {
    const username = req.body.username;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json(USER_NOT_FOUND);
    }

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json(PASSWORD_INCORRECT);
    }

    const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      userId: user.id,
      token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.token = () => async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(400).json(null);
    }
    const check = jwt.verify(token, process.env.TOKEN_SECRET);
    return res.status(201).json(check);
  } catch (error) {
    return res.status(500).json(error);
  }
};
