const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Email Config (Apna Gmail aur App Password dalein)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'omxindia01@gmail.com',     // Aapka Gmail
    pass: 'omxindia@8114'    // App Password
  }
});

app.post('/send-order', async (req, res) => {
  const { name, email, phone, domain, service, budget, requirements, advanceAmount } = req.body;

  const mailOptions = {
    from: 'omxindia01@gmail.com',
    to: `omxindia01@gmail.com, ${email}`, // Aapko aur User dono ko Mail jayega
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
    // Automatic Email Send
    await transporter.sendMail(mailOptions);
    
    // NOTE: Automatic WhatsApp ke liye Twilio ya UltraMsg API use ki jaati hai.
    console.log("Email sent successfully to user and admin!");

    res.json({ success: true, message: "Order processed successfully!" });
  } catch (error) {
    console.error("Error sending order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Omnia India Backend Server is running on http://localhost:3000");
});