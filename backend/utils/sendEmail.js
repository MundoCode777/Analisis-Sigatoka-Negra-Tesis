require("dotenv").config();
console.log("EMAIL_USER cargado:", process.env.EMAIL_USER);
console.log("EMAIL_PASS cargado:", process.env.EMAIL_PASS ? "Sí tiene valor" : "Está vacío");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (toEmail, resetLink) => {
  const mailOptions = {
    from: `"Detección Sigatoka 🌿" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Restablece tu contraseña",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #3d5e35;">Restablece tu contraseña</h2>
        <p style="color: #555; font-size: 14px;">
          Recibimos una solicitud para restablecer tu contraseña en Detección Sigatoka.
        </p>
        <a href="${resetLink}" 
           style="display: inline-block; background-color: #3d5e35; color: white; 
                  padding: 12px 24px; border-radius: 10px; text-decoration: none; 
                  font-weight: 500; margin: 20px 0;">
          Restablecer contraseña
        </a>
        <p style="color: #999; font-size: 12px;">
          Este link expira en 1 hora. Si no solicitaste esto, ignora este correo.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;