const express = require('express');
const router = express.Router();

const User = require("../models/users");

const usersController = require('../controllers/users');

router.post('/register', usersController.register(User));
router.post('/login', usersController.login(User));
router.post('/verify-token', usersController.token());

module.exports = router;