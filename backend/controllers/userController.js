const { createUser, 
        findUserByEmail, 
        findUserByPhone, 
        findUserByUsername, 
        deleteUserByUsername, 
        getAllUsers } = require("../models/User");
        
const { generateToken } = require("../utils/JWT");
const { Op } = require("sequelize");
const sendMail = require('../utils/sendMail');
const sendSms = require('../utils/sendSms');
const otpStore = {};
const messages = require('../utils/messages.json');

const isPhoneNumberValid = (value) => /^[0-9]{10}$/.test(value);

// Register a user
exports.registerUser = async (req, res) => {
  try {
    const { user_name, name, email, password, phone } = req.body;

    if (!user_name || !name || !email || !password || !phone) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.empty-fields,
      });
    }

    const checkEmail = await findUserByEmail(email);
    const checkPhone = await findUserByPhone(phone);
    const checkUser = await findUserByUsername(user_name);

    if (checkEmail || checkPhone || checkUser) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.email_phone_userName_already_registered,
      });
    }

    if (!isPhoneNumberValid(phone)) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.ten_digit_phone_number,
      });
    }

    const newUser = await createUser({
      user_name,
      name,
      email,
      password,
      phone,
      createdAt: new Date(),
    });

    return res.status(201).send({
      status_code: 201,
      success: true,
      message: messages.en.Users.success.User_Create,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error,
    });
  }
};

// Get User By Username
exports.getUserByUsername = async (req, res) => {
  try {
    const { user_name } = req.params;

    if (!user_name) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.user_Name_Required,
      });
    }

    const user = await findUserByUsername(user_name);

    if (!user) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Users.error.User_Fetch,
      });
    }

    const token = generateToken(user);

    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Users.success.User_Fetch,
      token,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error: error.message || error,
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { user_name } = req.params;

    const user = await findUserByUsername(user_name);

    if (!user) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Users.error.User_Fetch,
      });
    }

    await deleteUserByUsername(user_name);

    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Users.success.User_Delete,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { user_name } = req.params;
    const { name, email, password, phone } = req.body;

    const user = await findUserByUsername(user_name);

    if (!user) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Users.error.User_Fetch,
      });
    }

    const checkEmail = await findUserByEmail(email);
    const checkPhone = await findUserByPhone(phone);

    if ((checkEmail && checkEmail.user_name !== user_name) || (checkPhone && checkPhone.user_name !== user_name)) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.email_phone_userName_already_registered,
      });
    }

    if (!isPhoneNumberValid(phone)) {
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

    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Users.success.User_Update,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error,
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password, otpMethod } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).send({
        status_code: 404,
        message: messages.en.Users.error.no_user_found,
      });
    }

    if (password !== user.password) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.invalid_Username_Or_Password,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    if (otpMethod === "email") {
      sendMail(email, otp);
    } else if (otpMethod === "phone") {
      sendSms(`Your OTP is ${otp}`, `+91${user.phone}`);
    }

    return res.status(200).send({
      status_code: 200,
      message: `OTP sent to ${otpMethod}`,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error,
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Users.success.All_Users_Fetch,
      users,
    });
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error,
    });
  }
};

// OTP Verification
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.empty_fields,
      });
    }

    // Check if the OTP is correct
    if (otpStore[email] && otpStore[email] == otp) {
      const user = await findUserByEmail(email);

      if (!user) {
        return res.status(404).send({
          status_code: 404,
          message: messages.en.Users.error.no_user_found,
        });
      }

      const token = generateToken(user);

      // Clear the OTP from the store after successful verification
      delete otpStore[email];

      return res.status(200).send({
        status_code: 200,
        message: messages.en.Users.success.otp,
        success: true,
        token,
      });
    } else {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.otp,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status_code: 500,
      success: false,
      message: messages.en.Users.error.internal_server_error,
      error: error.message || error,
    });
  }
};
