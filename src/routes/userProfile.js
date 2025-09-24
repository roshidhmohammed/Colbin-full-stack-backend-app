const express = require("express");
const profileRouter = express.Router();

// User Authentication middleware
const { isUserAuthenticated } = require("../middlewares/auth");

// controllers - contains all user profile related logic
const { getProfile } = require("../controllers/userProfile");

profileRouter.get("/view", isUserAuthenticated, getProfile);

module.exports = profileRouter;
