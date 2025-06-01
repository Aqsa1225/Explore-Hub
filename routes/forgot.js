// Import required modules
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const crypto = require('crypto');
const sendOtp = require('../sendOtpEmail');  
const bcrypt = require('bcryptjs');  
const nodemailer = require('nodemailer');
// In-memory store to keep OTP and expiration time
const otpStore = new Map();
// Set up the email transporter using Gmail and environment credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// Route: Send OTP to user email
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  // Check if user exists
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
     // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // Store OTP with 5-minute expiration
    // Send OTP email
    await transporter.sendMail({
      from: `"Explore Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code for Password Reset',
      html: `<p>Your OTP is: <b>${otp}</b>. It expires in 5 minutes.</p>`
    });

    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});
// Route: Verify OTP and update user password
router.post('/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ error: 'Missing fields' });

  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ error: 'OTP not found or expired' });

  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' }); // Check if OTP matches
  // Check if OTP has expired
  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }
  // Hash new password and update in DB
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    otpStore.delete(email); // Clear the OTP from memory
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});
// Export the router for use in the app
module.exports = router;
