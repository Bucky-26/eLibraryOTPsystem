const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendEmail(receiver, otp) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'easyapi0@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: 'PNS eLIBRARY SYSTEM (Admin) <easyapi0@gmail.com>',
      to: receiver,
      subject: 'OTP from PNS eLIBRARY SYSTEM',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Email</title>
          <!-- Your email HTML content here -->
        </head>
        <body>
          <div>
            <h1>PNS eLIBRARY SYSTEM</h1>
            <p>Your OTP for verification is: <strong>${otp}</strong></p>
          </div>
          <div>
            <p>Powered by EASY API: Adonis Jr S.</p>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transport.sendMail(mailOptions);
    console.log('Email sent:', result);
    return result;
  } catch (error) {
    throw new Error('Error sending email');
  }
}

module.exports = { sendEmail };
