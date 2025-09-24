const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Email is not valid: ${value}`);
        }
      },
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Full name must be at least 2 characters long"],
      maxLength: [30, "Full name cannot exceed 30 characters"],
      validate(value) {
        if (!/^[A-Za-z\s]+$/.test(value)) {
          throw new Error(`The name is required ${value}`);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a strong password");
        }
      },
    },
    role: {
      type: String,
      default: "user",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

// JWT generation
userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET_KEY, {
    expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
  });
};

// Comparing user input password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;

  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    return false;
  }
};

// Strip sensitive fields from API responses
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    delete ret.role;
    delete ret.isActive;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
