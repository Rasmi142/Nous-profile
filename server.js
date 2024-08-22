const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Change 'uploads/' to your preferred directory
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define your transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rasmiayoub25@gmail.com",
    pass: "edxo izcm duxw eies",
  },
});

// Handle form submission
app.post("/send-email", upload.array("attachments[]"), (req, res) => {
  const { name, email, mess, service, budget } = req.body;

  // Check if `service` is an array
  const serviceList = Array.isArray(service) ? service.join(", ") : "";

  // Prepare email options
  const mailOptions = {
    from: "your-email@gmail.com",
    to: "recipient-email@gmail.com",
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${mess}\nServices: ${serviceList}\nBudget: ${budget}`,
    attachments: req.files.map((file) => ({
      filename: file.originalname,
      path: file.path,
    })),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email: " + error.toString());
    }
    // Cleanup uploaded files after sending email
    req.files.forEach((file) => fs.unlinkSync(file.path));
    res.status(200).send("Email sent: " + info.response);
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
