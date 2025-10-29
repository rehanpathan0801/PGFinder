const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Message = require("../models/Message");

// POST /api/messages → Save to DB and send Gmail notification
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Save message to database
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    // setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // mail options
    const mailOptions = {
      from: `PGFinder Contact Form <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Message from PGFinder Website`,
      text: `
📩 New Contact Form Submission

👤 Name: ${name}
📧 Email: ${email}
📝 Subject: ${subject}

💬 Message:
${message}
      `,
    };

    // send mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message saved and sent to Gmail successfully!" });
  } catch (error) {
    console.error("Error sending/saving message:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

// GET /api/messages → Fetch all messages for admin
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/messages/:id → Delete a message
router.delete("/:id", async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    await msg.remove();
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete message error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
