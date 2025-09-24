// Error handling middleware
const { ErrorHandler } = require("../middlewares/error");
const catchAsyncError = require("../middlewares/catchAsyncError");

// API response support module
const { APIResponse } = require("../supports/apiResponse");

const getProfile = catchAsyncError(async (req, res, next) => {
  try {
    const user = req.user;

    APIResponse.success({
      user,
      message: "Successfully fetched the user profile info",
    }).renderResponse(res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  getProfile,
};
