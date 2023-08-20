const express = require('express');
const { registerUser, loginuser, getAllUsers } = require('../controllers/UserController');
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginuser);
router.route("/getall").get(getAllUsers);

module.exports = router;