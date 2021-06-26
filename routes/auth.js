const router = require("express").Router();
const { createUser, userLogin, refreshToken } = require("../controller/auth");

//REGISTER
router.post("/register", createUser);

//LOGIN
router.post("/login", userLogin);

//REFRESH TOKEN
router.post("/refresh", refreshToken);

module.exports = router;
