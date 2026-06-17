require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail(
  {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // se manda a ti mismo para probar
    subject: "Prueba de correo",
    text: "Si recibes esto, Nodemailer funciona correctamente",
  },
  (error, info) => {
    if (error) {
      console.log("❌ ERROR:", error);
    } else {
      console.log("✅ Correo enviado:", info.response);
    }
  }
);