const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Added missing bcrypt import

// Supabase Connection
const supabaseUrl = 'https://zzexmtgabcdordnlvydc.supabase.co';
const supabaseKey = 'sb_publishable_Kaww3DjKSJIRo8b6mZxShg_4O9ibgn5';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors());
app.use(express.json());

// 1. Email Transporter (Gmail Service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'omxindia01@gmail.com',
        pass: 'dbtybhjyvdgmnttj' // App Password
    }
});

// ----------------------------------------------------
// ROUTE 1: Order Form Route
// ----------------------------------------------------
app.post('/send-order', async (req, res) => {
  const { name, email, phone, domain, service, budget, requirements, advanceAmount } = req.body;

  const mailOptions = {
    from: 'omxindia01@gmail.com',
    to: `omxindia01@gmail.com, ${email}`,
    subject: `New Order Request from ${name} - Omnia India`,
    text: `New Order Request Received:\n\n` +
          `👤 Name: ${name}\n` +
          `📞 Phone: ${phone}\n` +
          `✉️ Email: ${email}\n` +
          `🌐 Domain: ${domain}\n` +
          `📌 Service: ${service}\n` +
          `💰 Budget Plan: ${budget}\n` +
          `💳 Advance Token: ${advanceAmount}\n` +
          `📝 Requirements: ${requirements}\n\n` +
          `Thank you for reaching out to Omnia India!`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Order processed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// ROUTE 2: New Secure Login Route
// ----------------------------------------------------
const mockUser = {
  email: "omxindia01@gmail.com",
  passwordHash: "$2b$10$w82A3xK9...hashStringHere" 
};

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email aur Password required hain." });
  }

  if (email !== mockUser.email) {
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, mockUser.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }

  res.json({ success: true, message: "Login successful!" });
});

app.listen(3000, () => {
  console.log("Omnia India Server running on http://localhost:3000");
});