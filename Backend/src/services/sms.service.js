const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log('SMS sent:', message.sid);
    return message;
  } catch (error) {
    console.error('SMS error:', error);
    throw error;
  }
};

const sendOTP = async (to, otp) => {
  const body = `Your Hisably verification code is: ${otp}. Valid for 5 minutes.`;
  return sendSMS(to, body);
};

module.exports = {
  sendSMS,
  sendOTP,
};
