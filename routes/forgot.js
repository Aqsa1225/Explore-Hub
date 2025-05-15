const express = require('express');
const router = express.Router();
const User = require('../models/user');
const crypto = require('crypto');
const sendOtp = require('../sendOtpEmail');  // Adjust path if needed
const bcrypt = require('bcryptjs');  // <--- Make sure this is imported
const nodemailer = require('nodemailer');

const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

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

router.post('/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ error: 'Missing fields' });

  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ error: 'OTP not found or expired' });

  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    otpStore.delete(email);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
