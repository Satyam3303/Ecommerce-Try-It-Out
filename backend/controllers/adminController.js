const { findUserByEmail, findUserByUsername, findUserByPhone } = require("../models/Admin");
const { generateToken } = require("../utils/JWT");
const { Op } = require("sequelize");
const sendMail = require('../utils/sendMail');
const sendSms = require('../utils/sendSms');
const otpStore = {};
const messages = require('../utils/messages.json');
const logger = require('../utils/logger');  // Import the logger

const isPhoneNumberValid = (value) => /^[0-9]{10}$/.test(value);

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password, otpMethod } = req.body;
    logger.info(`Login attempt for email: ${email}`);

    const user = await findUserByEmail(email);
    if (!user) {
      logger.warn(`No user found for email: ${email}`);
      return res.status(404).send({
        status_code: 404,
        message: messages.en.Users.error.no_user_found,
      });
    }

    if (password !== user.password) {
      logger.warn(`Invalid password attempt for user: ${email}`);
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.invalid_Username_Or_Password,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    if (otpMethod === "email") {
      logger.info(`Sending OTP to email: ${email}`);
      sendMail(email, otp);
    } else if (otpMethod === "phone") {
      logger.info(`Sending OTP to phone: ${user.phone}`);
      sendSms(`Your OTP is ${otp}`, `+91${user.phone}`);
    }

    return res.status(200).send({
      status_code: 200,
      message: `OTP sent to ${otpMethod}`,
      success: true,
    });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error: error.message || error,
    });
  }
};

// OTP Verification
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      logger.warn(`Missing fields during OTP verification: email=${email}, otp=${otp}`);
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.empty_fields,
      });
    }

    if (otpStore[email] && otpStore[email] == otp) {
      const user = await findUserByEmail(email);
      if (!user) {
        logger.warn(`No user found during OTP verification: email=${email}`);
        return res.status(404).send({
          status_code: 404,
          message: messages.en.Users.error.no_user_found,
        });
      }

      const token = generateToken(user);
      delete otpStore[email];  // Clear OTP after successful verification

      logger.info(`OTP verified for user: ${email}`);
      return res.status(200).send({
        status_code: 200,
        message: messages.en.Users.success.otp,
        success: true,
        token,
      });
    } else {
      logger.warn(`Invalid OTP attempt for user: ${email}`);
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.otp,
      });
    }
  } catch (error) {
    logger.error(`Error during OTP verification: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error: error.message || error,
    });
  }
};

// Get User By Username
exports.getUserByUsername = async (req, res) => {
  try {
    const { user_name } = req.params;
    if (!user_name) {
      logger.warn(`Username is missing from request`);
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.user_Name_Required,
      });
    }

    logger.info(`Fetching user by username: ${user_name}`);
    const user = await findUserByUsername(user_name);
    if (!user) {
      logger.warn(`No user found with username: ${user_name}`);
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Users.error.User_Fetch,
      });
    }

    logger.info(`User fetched successfully by username: ${user_name}`);
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Users.success.User_Fetch,
      user,
    });
  } catch (error) {
    logger.error(`Error fetching user by username: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error: error.message || error,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { user_name } = req.params;
    const { name, email, password, phone } = req.body;

    logger.info(`Updating user: ${user_name}`);
    const user = await findUserByUsername(user_name);
    if (!user) {
      logger.warn(`No user found with username: ${user_name}`);
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Users.error.User_Fetch,
      });
    }

    const checkEmail = await findUserByEmail(email);
    const checkPhone = await findUserByPhone(phone);
    if ((checkEmail && checkEmail.user_name !== user_name) || (checkPhone && checkPhone.user_name !== user_name)) {
      logger.warn(`Email or phone number already registered with another username`);
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.email_phone_userName_already_registered,
      });
    }

    if (!isPhoneNumberValid(phone)) {
      logger.warn(`Invalid phone number: ${phone}`);
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.ten_digit_phone_number,
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.phone = phone || user.phone;
    await user.save();

    logger.info(`User updated successfully: ${user_name}`);
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Users.success.User_Update,
    });
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`, { stack: error.stack });
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error: error.message || error,
    });
  }
};
