const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const accountSid = process.env.accountSid;
const authToken = process.env.twilioAuthToken;

if (!accountSid || !authToken) {
  console.error("Twilio credentials are missing. Please check your .env file.");
  process.exit(1);
}

const client = require('twilio')(accountSid, authToken);

const sendSms = async (body, to) => {
  let msgOptions = {
    from: process.env.twilioNumber, 
    to,  
    body
  };

  try {
    const message = await client.messages.create(msgOptions);
    console.log(message);
  } catch (error) {
    console.error("Failed to send SMS:", error);
  }
};

module.exports = sendSms;
