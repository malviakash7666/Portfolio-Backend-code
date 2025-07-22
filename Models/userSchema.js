import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name required!"],
  },
  email: {
    type: String,
    required: [true, "Email required!"],
    validate: {
      validator: validator.isEmail,
      message: "Invalid Email format",
    },
  },
  phone: {
    type: String,
    required: [true, "Mobile Number required!"],
  },
  aboutMe: {
    type: String,
    required: [true, "About Me Feild Is required!"],
  },
  password: {
    type: String,
    required: [true, "Password Is required!"],
    minLength: [4, "The minimum length is required!"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resume: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  githuburl: String,
  portfoliourl:String,
  instagramurl: String,
  facebookurl: String,
  linkdenurl: String,
  twitterurl: String,
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  } else {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

userSchema.methods.getJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire =new Date(Date.now() + 15 * 60 * 1000);
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
