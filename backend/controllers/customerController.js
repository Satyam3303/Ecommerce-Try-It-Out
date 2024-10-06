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
const logger = require('../utils/logger'); // Importing logger

const isPhoneNumberValid = (value) => /^[0-9]{10}$/.test(value);

// Register a Customer
exports.registerCustomer = async (req, res) => {
try {
const { user_name, name, email, password, phone } = req.body;

if (!user_name || !name || !email || !password || !phone) {
logger.warn('Customer registration failed: missing fields');
return res.status(400).send({
  status_code: 400,
  success: false,
  message: messages.en.Users.error.empty_fields,
});
}

const checkEmail = await findCustomerByEmail(email);
const checkPhone = await findCustomerByPhone(phone);
const checkUser = await findCustomerByUsername(user_name);

if (checkEmail || checkPhone || checkUser) {
logger.warn(`Customer registration failed: email, phone or username already registered - email: ${email}, phone: ${phone}, username: ${user_name}`);
return res.status(400).send({
  status_code: 400,
  success: false,
  message: messages.en.Users.error.email_phone_userName_already_registered,
});
}

if (!isPhoneNumberValid(phone)) {
logger.warn(`Customer registration failed: invalid phone number - ${phone}`);
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

logger.info(`Customer created successfully: ${user_name}`);
return res.status(201).send({
status_code: 201,
success: true,
message: messages.en.Users.success.User_Create,
});
} catch (error) {
logger.error('Error during customer registration', error);
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
logger.warn('Fetch customer failed: user_name required');
return res.status(400).send({
  status_code: 400,
  success: false,
  message: messages.en.Users.error.user_Name_Required,
});
}

const customer = await findCustomerByUsername(user_name);

if (!customer) {
logger.warn(`Fetch customer failed: no customer found with username - ${user_name}`);
return res.status(404).send({
  status_code: 404,
  success: false,
  message: messages.en.Users.error.User_Fetch,
});
}

logger.info(`Customer fetched successfully: ${user_name}`);
return res.status(200).send({
status_code: 200,
success: true,
message: messages.en.Users.success.User_Fetch,
customer
});
} catch (error) {
logger.error('Error during fetching customer by username', error);
return res.status(500).send({
status_code: 500,
success: false,
message: messages.en.Users.error.internal_server_error,
error: error.message || error,
});
}
};

// Delete a Customer
exports.deleteCustomer = async (req, res) => {
try {
const { user_name } = req.params;

const customer = await findCustomerByUsername(user_name);

if (!customer) {
logger.warn(`Delete customer failed: no customer found with username - ${user_name}`);
return res.status(404).send({
  status_code: 404,
  success: false,
  message: messages.en.Users.error.User_Fetch,
});
}

await deleteCustomerByUsername(user_name);
logger.info(`Customer deleted successfully: ${user_name}`);

return res.status(200).send({
status_code: 200,
success: true,
message: messages.en.Users.success.User_Delete,
});
} catch (error) {
logger.error('Error during customer deletion', error);
return res.status(500).send({
status_code: 500,
success: false,
message: messages.en.Users.error.internal_server_error,
error,
});
}
};

// Update a Customer
exports.updateCustomer = async (req, res) => {
try {
const { user_name } = req.params;
const { name, email, password, phone } = req.body;

const customer = await findCustomerByUsername(user_name);

if (!customer) {
logger.warn(`Update customer failed: no customer found with username - ${user_name}`);
return res.status(404).send({
  status_code: 404,
  success: false,
  message: messages.en.Users.error.User_Fetch,
});
}

const checkEmail = await findCustomerByEmail(email);
const checkPhone = await findCustomerByPhone(phone);

if ((checkEmail && checkEmail.user_name !== user_name) || (checkPhone && checkPhone.user_name !== user_name)) {
logger.warn(`Update customer failed: email or phone already registered - email: ${email}, phone: ${phone}`);
return res.status(400).send({
  status_code: 400,
  success: false,
  message: messages.en.Users.error.email_phone_userName_already_registered,
});
}

if (!isPhoneNumberValid(phone)) {
logger.warn(`Update customer failed: invalid phone number - ${phone}`);
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
logger.info(`Customer updated successfully: ${user_name}`);

return res.status(200).send({
status_code: 200,
success: true,
message: messages.en.Users.success.User_Update,
});
} catch (error) {
logger.error('Error during customer update', error);
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
logger.warn(`Login failed: no customer found with email - ${email}`);
return res.status(404).send({
  status_code: 404,
  message: messages.en.Users.error.no_user_found,
});
}

if (password !== customer.password) {
logger.warn(`Login failed: invalid password for email - ${email}`);
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

logger.info(`Login successful: OTP sent via ${otpMethod} for email - ${email}`);
return res.status(200).send({
status_code: 200,
message: `OTP sent to ${otpMethod}`,
success: true,
});
} catch (error) {
logger.error('Error during customer login', error);
return res.status(500).send({
status_code: 500,
success: false,
message: messages.en.Users.error.internal_server_error,
error,
});
}
};

// Get All Customers
exports.getAllCustomers = async (req, res) => {
try {
const customers = await getAllCustomers();

logger.info('Fetched all customers successfully');
return res.status(200).send({
status_code: 200,
success: true,
message: messages.en.Users.success.All_Users_Fetch,
customers,
});
} catch (error) {
logger.error('Error during fetching all customers', error);
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
logger.warn('OTP verification failed: missing fields');
return res.status(400).send({
  status_code: 400,
  success: false,
  message: messages.en.Users.error.invalid_OTP,
});
}

const storedOtp = otpStore[email];

if (!storedOtp) {
logger.warn(`OTP verification failed: no OTP found for email - ${email}`);
return res.status(400).send({
  status_code: 400,
  success: false,
  message: messages.en.Users.error.invalid_OTP,
});
}

if (storedOtp !== otp) {
logger.warn(`OTP verification failed: invalid OTP for email - ${email}`);
return res.status(400).send({
  status_code: 400,
  success: false,
  message: messages.en.Users.error.invalid_OTP,
});
}

const token = generateToken({ email });

delete otpStore[email];
logger.info(`OTP verified successfully for email - ${email}`);
return res.status(200).send({
status_code: 200,
message: messages.en.Users.success.OTP_Verification,
token,
success: true,
});
} catch (error) {
logger.error('Error during OTP verification', error);
return res.status(500).send({
status_code: 500,
success: false,
message: messages.en.Users.error.internal_server_error,
error,
});
}
};
