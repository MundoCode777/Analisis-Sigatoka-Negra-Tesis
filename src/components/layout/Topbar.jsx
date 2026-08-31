import { useAuth } from "../../context/AuthContext";

export default function Topbar({ titulo, subtitulo }) {
  const { user } = useAuth();

  const fullName = user?.displayName || user?.email?.split("@")[0] || "Usuario";
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Espacio para el botón hamburguesa */}
      <div className="flex items-center gap-3 pl-12">
        <div>
          <h1 className="font-bold text-base sm:text-lg text-gray-900 leading-tight">{titulo}</h1>
          {subtitulo && <p className="text-xs text-gray-400 hidden sm:block">{subtitulo}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
          🔔
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
        </button>

        <div className="flex items-center gap-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              referrerPolicy="no-referrer"
              alt=""
              className="w-9 h-9 rounded-full object-cover border-2 border-green-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{fullName}</p>
            <p className="text-xs text-gray-400">Técnico de Campo</p>
          </div>
        </div>
      </div>
    </header>
  );
}