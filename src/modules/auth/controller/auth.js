import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../../utils/errorHandling.js";
import Jwt from "jsonwebtoken";
import { userModel } from "./../../../../database/models/user.model.js";
import generateOTP from "./../../../utils/otp.js";
import sendEmail from "./../../../utils/email.js";

// signUp
const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!email && !phone) {
    return next(new Error("Email or phone number is required"));
  }
  let user = null;

  if (email && email !== "") {
    user = await userModel.findOne({ email });
  } else if (phone && phone !== "") {
    user = await userModel.findOne({ phone });
  }

  if (user) {
    return next(new Error("User already exists"));
  }

  let OTP = generateOTP();
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP - Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        background-color: #f6f9fc;
      }
  
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 40px;
        box-sizing: border-box;
      }
  
      .logo {
        max-width: 150px;
        margin-bottom: 20px;
      }
  
      .header {
        font-size: 24px;
        color: #007bff;
        margin-bottom: 20px;
      }
  
      .verification-code {
        font-size: 36px;
        color: #007bff;
        margin: 20px 0;
      }
  
      .message {
        font-size: 16px;
        color: #555555;
        margin-bottom: 30px;
      }
  
      .cta-button {
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        text-align: center;
        text-decoration: none;
        border-radius: 6px;
        background-color: #007bff;
        color: #ffffff;
      }
  
      .cta-button:hover {
        background-color: #0056b3;
      }
  
      .footer {
        margin-top: 40px;
        font-size: 14px;
        color: #555555;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <img class="logo" src="https://yourwebsite.com/logo.png" alt=" Logo">
      <div class="header">Welcome to </div>
      <p class="message">
        Thank you for signing up with ! To complete your registration, please use the following verification code:
      </p>
      <div class="verification-code">${OTP}</div>
      <p class="message">
        If you didn't request this code, you can ignore this email.
      </p>
      <div class="footer">
        <p>Need help? Contact our support team at support@.com</p>
        <p>&copy; 2024  All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  if (email) {
    if (!(await sendEmail({ to: email, subject: "OTP-Code ", html }))) {
      return next(new Error("Email Rejected", { cause: 400 }));
    }
  }
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT);
  const User = new userModel({
    name,
    email,
    phone,
    OTP,
    password: hashedPassword,
  });
  await User.save();
  const token = Jwt.sign(
    {
      email: User.email,
      name: User.name,
      role: "customer",
      id: User._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7" }
  );
  return res.status(200).json({ message: "Register successfully", token });
});



const signIn = asyncHandler(async (req, res, next) => {
  const { email, phone, password } = req.body;
  let user;
  if (email) {
    user = await userModel.findOne({ email });
  } else if (phone) {
    user = await userModel.findOne({ phone });
  }
  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  if (user) {
    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      let token = Jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isVerified: user.isVerified,
        },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ message: "login successfully", token });
    } else {
      return next(new Error("Wrong Password ", { cause: 500 }));
    }
  }
});

const reSendOTP = asyncHandler(async (req, res, next) => {
  const { email, phone } = req.body;
  let user;
  if (email) {
    user = await userModel.findOne({ email });
  } else if (phone) {
    user = await userModel.findOne({ phone });
  }

  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  let OTP = generateOTP();
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>  Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        background-color: #f6f9fc;
      }
  
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 40px;
        box-sizing: border-box;
      }
  
      .logo {
        max-width: 150px;
        margin-bottom: 20px;
      }
  
      .header {
        font-size: 24px;
        color: #007bff;
        margin-bottom: 20px;
      }
  
      .verification-code {
        font-size: 36px;
        color: #007bff;
        margin: 20px 0;
      }
  
      .message {
        font-size: 16px;
        color: #555555;
        margin-bottom: 30px;
      }
  
      .cta-button {
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        text-align: center;
        text-decoration: none;
        border-radius: 6px;
        background-color: #007bff;
        color: #ffffff;
      }
  
      .cta-button:hover {
        background-color: #0056b3;
      }
  
      .footer {
        margin-top: 40px;
        font-size: 14px;
        color: #555555;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <img class="logo" src="https://yourwebsite.com/logo.png" alt=" Logo">
      <div class="header">Welcome to </div>
      <p class="message">
        Thank you for signing up with ! To complete your registration, please use the following verification code:
      </p>
      <div class="verification-code">${OTP}</div>
      <p class="message">
        If you didn't request this code, you can ignore this email.
      </p>
      <div class="footer">
        <p>Need help? Contact our support team at support@.com</p>
        <p>&copy; 2024  All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;
  user.OTP = OTP;
  await user.save();
  if (email) {
    sendEmail(email, html, "");
  }
  return res.status(200).json({ message: "OTP sent successfully" });
});

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, phone, OTP } = req.body;
  let user;
  if (email) {
    user = await userModel.findOne({ email });
  }
  if (!user && phone) {
    user = await userModel.findOne({ phone });
  }

  if (!user) {
    return next(new Error("User Not Found", 404));
  }

  const isOTPVerified = user.OTP == OTP;
  if (isOTPVerified) {
    user.OTP = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return next(new Error("Invalid OTP", { statusCode: 400 }));
  }
});

export { signUp, signIn, reSendOTP, verifyOTP };
