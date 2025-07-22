import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errors.js";
import { User } from "../Models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.avatar || !req.files.resume) {
    return next(new ErrorHandler("Avatar and Resume Files Are Required!", 400));
  }

  const avatar = req.files.avatar;
  const resume = req.files.resume;

  const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "AVATARS" }
  );

  if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
    return next(new ErrorHandler("Avatar Upload Failed", 500));
  }

  const cloudinaryResponseForresume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "RESUME" }
  );

  if (!cloudinaryResponseForresume || cloudinaryResponseForresume.error) {
    return next(new ErrorHandler("Resume Upload Failed", 500));
  }

  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfoliourl,
    githuburl,
    instagramurl,
    facebookurl,
    linkdenurl,
    twitterurl,
  } = req.body;

  if (!fullName || !email || !phone || !aboutMe || !password) {
    return next(new ErrorHandler("All required fields must be filled.", 400));
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfoliourl,
    githuburl,
    instagramurl,
    facebookurl,
    linkdenurl,
    twitterurl,
    avatar: {
      public_id: cloudinaryResponseForAvatar.public_id,
      url: cloudinaryResponseForAvatar.secure_url,
    },
    resume: {
      public_id: cloudinaryResponseForresume.public_id,
      url: cloudinaryResponseForresume.secure_url,
    },
  });

  generateToken(user, 201, "Register Successfully", res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("All Field Are Required!"));
  }
  const user = await User.findOne({ email }).select("+password");
  
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password!"));
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid Email or Password!"));
  }

  generateToken(user, 200, "Login Successfully", res);
});
export const loggout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Logout successfully!",
    });
});

export const getuser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const updatePortfolio = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    portfoliourl: req.body.portfoliourl,

    githuburl: req.body.githuburl,
    instagramurl: req.body.instagramurl,

    linkdenurl: req.body.linkdenurl,

    twitterurl: req.body.twitterurl,
  };

  const user = await User.findById(req.user.id);

  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;

    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "AVATARS",
      }
    );

    newUserData.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  if (req.files && req.files.resume) {
    const resume = req.files.resume;

    if (user.resume && user.resume.public_id) {
      await cloudinary.uploader.destroy(user.resume.public_id);
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath,
      {
        folder: "RESUME",
      }
    );

    newUserData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user: updatedUser,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentpassword, newPassword, confirmPassword } = req.body;

  if (!currentpassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("All Field Are Required!", 400));
  }
  const user = await User.findById(req.user.id).select("+password");
  const isMatch = await user.comparePassword(currentpassword);
  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Current Password", 400));
  }
  if (newPassword != confirmPassword) {
    return next(
      new ErrorHandler("Current Password And Confirm Password Not Match!", 400)
    );
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Password Updated!",
  });
});

export const getUserPortfolio = catchAsyncErrors(async (req, res, next) => {
  const id = "6851a592ce26c3fff665113c";
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

  const message = `Your reset password token is:- \n\n ${resetPasswordUrl} \n\n if you not use this please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Personal portfolio dashboard recovery password",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetToken = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token Is Invalid Or Expired!", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Passwor and Confirm password not match!", 400)
    );
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  user.save();
  generateToken(user, 200, "reset password successfully!", res);
});
