import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Home from "./pages/dashboard/Home";
import Deteccion from "./pages/deteccion/Deteccion";
import Resultado from "./pages/deteccion/Resultado";
import Recomendaciones from "./pages/recomendaciones/Recomendaciones";
import Geolocalizacion from "./pages/geolocalizacion/Geolocalizacion";
import Informes from "./pages/informes/Informes";
import Usuarios from "./pages/usuarios/Usuarios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/deteccion" element={<Deteccion />} />
        <Route path="/resultado/:id" element={<Resultado />} />
        <Route path="/recomendaciones" element={<Recomendaciones />} />
        <Route path="/geolocalizacion" element={<Geolocalizacion />} />
        <Route path="/informes" element={<Informes />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;