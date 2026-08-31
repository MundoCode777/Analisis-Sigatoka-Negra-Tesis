import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

export default function Usuarios() {
  return (
    <div className="min-h-screen bg-[#f4f6f4]">
      <Sidebar />
      <Topbar titulo="Gestión de Usuarios" subtitulo="Administra los usuarios y roles del sistema" />
      <main className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-400">
          <span className="text-5xl block mb-3">👥</span>
          <p className="font-semibold text-gray-600">Módulo en construcción</p>
          <p className="text-sm mt-1">Próximamente disponible</p>
        </div>
      </main>
    </div>
  );
}