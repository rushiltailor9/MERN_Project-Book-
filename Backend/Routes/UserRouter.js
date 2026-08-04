const express =require("express");
const router = express.Router();
const {registerValidation, loginValidation} = require("../Middleware/UserValidation");
const { registerUser, loginUser } = require("../Controllers/UserController");

router.post("/login",loginValidation,loginUser);

router.post("/register",registerValidation,registerUser);

module.exports = router;