const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // your gmail address from .env
    pass: process.env.EMAIL_PASS,   // your generated app password from .env
  },
});

async function sendOtp(email, otp) {
  const mailOptions = {
    from: `"Explore Space" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code for Password Reset',
    html: `<h2>OTP Verification</h2>
           <p>Your OTP is: <strong>${otp}</strong></p>
           <p>This OTP will expire in 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendOtp;
