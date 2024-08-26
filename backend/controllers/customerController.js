const { createCustomer, 
        findCustomerByEmail, 
        findCustomerByPhone, 
        findCustomerByUsername, 
        deleteCustomerByUsername, 
        getAllCustomers } = require("../models/Customer");
        
const { generateToken } = require("../utils/JWT");
const { Op } = require("sequelize");
const sendMail = require('../utils/sendMail');
const sendSms = require('../utils/sendSms');
const otpStore = {};
const messages = require('../utils/messages.json');

const isPhoneNumberValid = (value) => /^[0-9]{10}$/.test(value);

// Register a Customer
exports.registerCustomer = async (req, res) => {
  try {
    const { user_name, name, email, password, phone } = req.body;

    if (!user_name || !name || !email || !password || !phone) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.empty-fields,
      });
    }

    const checkEmail = await findCustomerByEmail(email);
    const checkPhone = await findCustomerByPhone(phone);
    const checkUser = await findCustomerByUsername(user_name);

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

    const newCustomer = await createCustomer({
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

// Get Customer By Username
exports.getCustomerByUsername = async (req, res) => {
  try {
    const { user_name } = req.params;

    if (!user_name) {
      return res.status(400).send({
        status_code: 400,
        success: false,
        message: messages.en.Users.error.user_Name_Required,
      });
    }

    const customer = await findCustomerByUsername(user_name);

    if (!customer) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Users.error.User_Fetch,
      });
    }


    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Users.success.User_Fetch,
      customer
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
exports.deleteCustomer = async (req, res) => {
  try {
    const { user_name } = req.params;

    const customer = await findCustomerByUsername(user_name);

    if (!customer) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Users.error.User_Fetch,
      });
    }

    await deleteCustomerByUsername(user_name);

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
exports.updateCustomer = async (req, res) => {
  try {
    const { user_name } = req.params;
    const { name, email, password, phone } = req.body;

    const customer = await findCustomerByUsername(user_name);

    if (!customer) {
      return res.status(404).send({
        status_code: 404,
        success: false,
        message: messages.en.Users.error.User_Fetch,
      });
    }

    const checkEmail = await findCustomerByEmail(email);
    const checkPhone = await findCustomerByPhone(phone);

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

    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.password = password || customer.password;
    customer.phone = phone || customer.phone;

    await customer.save();

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

// Login Customer
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password, otpMethod } = req.body;

    const customer = await findCustomerByEmail(email);

    if (!customer) {
      return res.status(404).send({
        status_code: 404,
        message: messages.en.Users.error.no_user_found,
      });
    }

    if (password !== customer.password) {
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
      sendSms(`Your OTP is ${otp}`, `+91${customer.phone}`);
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
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomers();

    return res.status(200).send({
      status_code: 200,
      success: true,
      message: messages.en.Users.success.All_Users_Fetch,
      customers,
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
      const customer = await findCustomerByEmail(email);

      if (!customer) {
        return res.status(404).send({
          status_code: 404,
          message: messages.en.Users.error.no_user_found,
        });
      }

      const token = generateToken(customer);

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
