// Import nodemailer for sending emails
const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,   
  },
});

// Function to send OTP email
async function sendOtp(email, otp) {
  const mailOptions = {
    from: `"Explore Space" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code for Password Reset',
    html: `<h2>OTP Verification</h2>
           <p>Your OTP is: <strong>${otp}</strong></p>
           <p>This OTP will expire in 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);    // Send email using the configured transporter
}

// Export the function so it can be used in routes
module.exports = sendOtp;
