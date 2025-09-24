// Error handling middleware
const { ErrorHandler } = require("../middlewares/error");
const catchAsyncError = require("../middlewares/catchAsyncError");

// models -databse schema
const User = require("../models/user");

// password hashing
const bcrypt = require("bcrypt");

// API response support module
const { APIResponse } = require("../supports/apiResponse");

const signUp = catchAsyncError(async (req, res, next) => {
  try {
    const { emailId, password, fullName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!emailId || !password) {
      return next(new ErrorHandler("Please fill out all the fields.", 400));
    }

    const isUserExist = await User.findOne({ emailId });
    if (isUserExist) {
      return next(new ErrorHandler("This Email ID already exist", 400));
    }

    const newUser = await User.create({
      emailId,
      password: hashedPassword,
      fullName,
    });
    delete newUser.password;

    APIResponse.created({
      newUser,
      message: "Your registration is successfull",
    }).renderResponse(res);
  } catch (error) {
    return next(new ErrorHandler(error.response.data.message, 500));
  }
});

const login = catchAsyncError(async (req, res, next) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return next(new ErrorHandler("Please fill out all the fields.", 401));
    }

    const user = await User.findOne({ emailId }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (!user.isActive) {
      return next(new ErrorHandler("Please contact the admin.", 401));
    }
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please enter the valid credentials.", 401));
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });

    APIResponse.success({
      user,
      message: "Successfull Login",
    }).renderResponse(res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const logout = catchAsyncError(async (req, res, next) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(),
      })
      .send("Logout Successful!!!");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  signUp,
  login,
  logout,
};
