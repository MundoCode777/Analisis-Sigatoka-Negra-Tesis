const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendResetEmail = require("../utils/sendEmail");

// Registro con email y contraseña
const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      auth_provider: "email",
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// Login con email y contraseña
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      access_token: token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        photo_url: user.photo_url,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// Login o registro automático con Google (Firebase)
const googleAuth = async (req, res) => {
  try {
    const { firebase_uid, email, full_name, photo_url } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        full_name,
        email,
        auth_provider: "google",
        firebase_uid,
        photo_url,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      access_token: token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        photo_url: user.photo_url,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en autenticación con Google", error: error.message });
  }
};

// Solicitar recuperación de contraseña
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No existe una cuenta con ese correo" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.reset_token = hashedToken;
    user.reset_token_expires = Date.now() + 60 * 60 * 1000; // 1 hora
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendResetEmail(user.email, resetLink);

    res.json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    console.error("❌ ERROR DETALLADO AL ENVIAR CORREO:", error);
    res.status(500).json({ message: "Error al procesar la solicitud", error: error.message });
  }
};

// Restablecer la contraseña con el token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      reset_token: hashedToken,
      reset_token_expires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "El link expiró o no es válido" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al restablecer la contraseña", error: error.message });
  }
};

module.exports = { register, login, googleAuth, forgotPassword, resetPassword };