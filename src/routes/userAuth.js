const express = require("express");
const userAuthRouter = express.Router();

// Controllers - contains all auth related logic
const { signUp, login, logout } = require("../controllers/userAuth");

userAuthRouter.post("/sign-up", signUp);
userAuthRouter.post("/login", login);
userAuthRouter.post("/logout", logout);

module.exports = userAuthRouter;
