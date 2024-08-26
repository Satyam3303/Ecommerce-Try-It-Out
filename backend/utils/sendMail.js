const nodemailer = require("nodemailer");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const email = process.env.nodemailerEmail;
const pass = process.env.nodemailerPass;

const transporter = nodemailer.createTransport({
  service: process.env.nodemailerService,
  host: process.env.nodemailerHost ,
  port: process.env.nodemailerPort,
  secure: false,
  auth: {
    user: email,
    pass: pass,
  },
});

const sendMail = async (to, otp) => {
  const mailOptions = {
    from: {
      name: 'Shivam',
      address: email,
    },
    to: to,
    subject: "Email Test Login",
    text: `Your OTP is ${otp}`,
    html: `<b>Your OTP is ${otp}</b>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email has been sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;
