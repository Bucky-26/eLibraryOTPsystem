require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const { sendEmail } = require('./emailService');
const { generateOTP, saveOTP, cleanupExpiredOTPs, checkOTPValidity } = require('./otpService');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 13000;

app.post('/v1/email-send', async (req, res) => {
  const { receiver } = req.body;

  try {
    const otp = generateOTP();
    await sendEmail(receiver, otp);
    saveOTP(receiver, otp);
const responseMessage = `Email sent successfully to ${receiver}.`;
    res.status(200).json({ message: responseMessage, otp });
    } catch (error) {
    console.error(error.message);
    res.status(500).send('Error sending email');
  }
});

app.post('/v1/otp-check', (req, res) => {
  const { email, otp } = req.body;

  try {
    const isValid = checkOTPValidity(email, otp);
    if (isValid) {
      res.status(200).json({ message: 'OTP is valid.', valid: true });
    } else {
      res.status(400).json({ message: 'Invalid OTP or expired.', valid: false });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error checking OTP' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Run OTP cleanup every hour
setInterval(cleanupExpiredOTPs, 60 * 60 * 1000);
