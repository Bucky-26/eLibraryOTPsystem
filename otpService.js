const fs = require('fs');

const OTP_DATA_FILE = 'otp_data.json';
let otpData = [];

function loadOTPData() {
  if (fs.existsSync(OTP_DATA_FILE)) {
    otpData = JSON.parse(fs.readFileSync(OTP_DATA_FILE));
  }
}

function saveOTPData() {
  fs.writeFileSync(OTP_DATA_FILE, JSON.stringify(otpData, null, 2));
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function saveOTP(email, otp) {
  const now = Date.now();
  const expirationTime = now + 5 * 60 * 1000;
  otpData.push({
    email,
    otp,
    timestamp: now,
    expiresAt: expirationTime,
  });
  saveOTPData();
}

function cleanupExpiredOTPs() {
  const now = Date.now();
  otpData = otpData.filter((otp) => otp.expiresAt > now);
  saveOTPData();
}

function checkOTPValidity(email, otp) {
  const now = Date.now();
  const userOTP = otpData.find(
    (item) => item.email === email && item.otp === otp && item.expiresAt > now
  );
  return !!userOTP;
}

loadOTPData(); // Load OTP data on startup

module.exports = { generateOTP, saveOTP, cleanupExpiredOTPs, checkOTPValidity };
