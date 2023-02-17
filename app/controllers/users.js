const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Register controller function
exports.register = async (req, res) => {
  console.log("register: [POST] /register");
  try {
    // Avoiding an error form hash function of bcrypt
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

// Login controller function
exports.login = async (req, res) => {
  console.log("login: [POST] /login");
  try {
    const username = req.body.username;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        error: new Error("User not found!"),
      });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({
        error: new Error("Incorrect password!"),
      });
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
