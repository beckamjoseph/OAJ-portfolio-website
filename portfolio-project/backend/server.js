// ─────────────────────────────────────────────────────────────────────────────
//  OAJ Portfolio — Backend Server
//  Stack : Express · Nodemailer (Gmail SMTP) · express-rate-limit
//  Start : npm install  →  npm run dev  (or npm start for production)
// ─────────────────────────────────────────────────────────────────────────────

require("dotenv").config();

const express     = require("express");
const cors        = require("cors");
const nodemailer  = require("nodemailer");
const rateLimit   = require("express-rate-limit");

const app  = express();
const PORT = process.env.PORT || 5000;
const rawEmailPass = (process.env.EMAIL_PASS || "").trim();
const hasEmailConfig = Boolean(
  process.env.EMAIL_USER &&
  rawEmailPass &&
  rawEmailPass !== "your_16_char_app_password_here" &&
  process.env.EMAIL_TO
);
const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const defaultDevOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5500",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5500",
];
const allowedOrigins = new Set([...configuredOrigins, ...defaultDevOrigins]);

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────

// CORS: allow configured frontend URL(s) + common local dev origins.
// ✅ SIMPLE & RELIABLE CORS CONFIG
// ✅ WORKING CORS CONFIG (use this)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://oaj-portfolio.netlify.app" // ✅ your real frontend
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate-limit the contact endpoint — max 5 emails per IP per 15 minutes
const contactLimiter = rateLimit({
  windowMs : 15 * 60 * 1000,   // 15 minutes
  max      : 5,
  message  : { success: false, message: "Too many requests. Please wait 15 minutes." },
});

// ── NODEMAILER TRANSPORTER ────────────────────────────────────────────────────
//
//  HOW TO GET YOUR GMAIL APP PASSWORD:
//  1. Go to myaccount.google.com/security
//  2. Enable 2-Step Verification (required)
//  3. Search "App Passwords" → Select app: Mail, Device: Windows Computer
//  4. Copy the 16-character password into your .env as EMAIL_PASS
//
const transporter = hasEmailConfig
  ? nodemailer.createTransport({
      service : "gmail",
      auth    : {
        user : process.env.EMAIL_USER,   // your Gmail address
        pass : process.env.EMAIL_PASS,   // 16-char App Password (NOT your real password)
      },
    })
  : null;

// Verify transporter connection on startup
if (!hasEmailConfig) {
  console.error("❌  Missing email configuration in backend/.env");
  console.error("    Required: EMAIL_USER, EMAIL_PASS, EMAIL_TO");
  console.error("    EMAIL_PASS must be a real Gmail App Password, not the placeholder value");
} else {
  transporter.verify((err) => {
    if (err) {
      console.error("❌  Email transporter error:", err.message);
      console.error("    Check EMAIL_USER and EMAIL_PASS in your .env file");
    } else {
      console.log("✅  Email transporter ready");
    }
  });
}

// ── ROUTES ────────────────────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.json({ status: "OAJ Portfolio API is running 🚀" });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    mailConfigured: hasEmailConfig,
  });
});

// ── POST /api/contact ─────────────────────────────────────────────────────────
//  Receives form data from the frontend and sends it to your Gmail inbox.
//  Body: { name, email, subject, message }
// ─────────────────────────────────────────────────────────────────────────────
app.post("/api/contact", contactLimiter, async (req, res) => {
  if (!hasEmailConfig) {
    return res.status(503).json({
      success : false,
      message : "Email service is not configured on the server yet.",
    });
  }

  const { name, email, subject, message } = req.body;

  // ── Basic validation ────────────────────────────────────────
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success : false,
      message : "All fields are required.",
    });
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success : false,
      message : "Please provide a valid email address.",
    });
  }

  // ── Build the email ─────────────────────────────────────────
  const mailOptions = {
    from    : `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to      : process.env.EMAIL_TO,          // your inbox
    replyTo : email,                          // so you can reply directly to the sender
    subject : `[Portfolio] ${subject}`,
    html    : `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:0;border-radius:8px;overflow:hidden;">
        <div style="background:#000;padding:32px 40px;">
          <h1 style="color:#fff;font-size:22px;margin:0;letter-spacing:2px;">OAJ PORTFOLIO</h1>
          <p style="color:#888;font-size:12px;margin:4px 0 0;letter-spacing:1px;">NEW MESSAGE RECEIVED</p>
        </div>
        <div style="padding:40px;background:#fff;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#999;font-size:12px;letter-spacing:1px;text-transform:uppercase;width:90px;">From</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111;font-size:15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#999;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111;font-size:15px;"><a href="mailto:${email}" style="color:#000;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#999;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Subject</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111;font-size:15px;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top:30px;">
            <p style="color:#999;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">Message</p>
            <p style="color:#333;font-size:15px;line-height:1.8;white-space:pre-wrap;">${message.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>
          </div>
        </div>
        <div style="background:#f5f5f5;padding:20px 40px;text-align:center;">
          <p style="color:#aaa;font-size:11px;margin:0;">Sent from your portfolio contact form · Reply directly to ${email}</p>
        </div>
      </div>
    `,
  };

  // ── Send the email ──────────────────────────────────────────
  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩  New contact from ${name} <${email}>`);
    return res.status(200).json({
      success : true,
      message : "Message sent successfully! I'll get back to you soon.",
    });
  } catch (err) {
    console.error("❌  Failed to send email:", err.message);
    return res.status(500).json({
      success : false,
      message : "Failed to send message. Please try emailing directly at seyij556@gmail.com",
    });
  }
});

// ── START SERVER ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Server running on http://localhost:${PORT}`);
  console.log(`📬  Contact endpoint: POST http://localhost:${PORT}/api/contact\n`);
});
