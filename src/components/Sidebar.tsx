import { Link, useLocation } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Ticket,
  User,
  BookAIcon,
  Users,
  LogOut,
  ClipboardListIcon,
  BriefcaseBusiness,
  BriefcaseBusinessIcon,
  ChartBar,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
  const location = useLocation(); // pra saber a página atual

  useEffect(() => {
    const tipo = localStorage.getItem("tipo");
    setTipoUsuario(tipo);
  }, []);

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-blue-800"
      : "hover:bg-blue-800";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tipo");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col">
      <div className="text-2xl font-bold p-6 border-b border-blue-500">
        Helpdesk
      </div>

      <nav className="flex-1 p-6 space-y-4">

        {/* HOME */}
        <Link
          to="/home"
          className={`flex items-center space-x-2 p-2 rounded-md ${isActive("/home")}`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {/* NOVO CHAMADO */}
        <Link
          to="/abrir-chamado"
          className={`flex items-center space-x-2 p-2 rounded-md ${isActive("/abrir-chamado")}`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Novo Chamado</span>
        </Link>

        {/* MEUS CHAMADOS */}
        <Link
          to="/meus-chamados"
          className={`flex items-center space-x-2 p-2 rounded-md ${isActive("/meus-chamados")}`}
        >
          <Ticket className="w-5 h-5" />
          <span>Meus Chamados</span>
        </Link>

        {/* MEUS DADOS */}
        <Link
          to="/meu-perfil"
          className={`flex items-center space-x-2 p-2 rounded-md ${isActive("/meu-perfil")}`}
        >
          <User className="w-5 h-5" />
          <span>Meus Dados</span>
        </Link>

        {/* ADMIN */}
        {tipoUsuario === "ADMIN" && (
          <>
            <hr className="my-3 border-neutral-300" />
            <span className="text-sm text-neutral-300 uppercase">Admin</span>



            <Link
              to="/todos-chamados"
              className={`flex items-center space-x-2 p-2 rounded-md ${isActive("/todos-chamados")}`}
            >
              <BookAIcon className="w-5 h-5" />
              <span>Todos os Chamados</span>
            </Link>

            <Link
              to="/fila-chamados"
              className={`flex items-center space-x-2 p-2 rounded-md ${isActive("/fila-chamados")}`}>
              <ClipboardListIcon className="w-5 h-5" />
              <span>Fila de Chamados</span>
            </Link>

            <Link
              to="/meus-trabalhos"
              className={`flex items-center space-x-2 p-2 rounded-md ${isActive("/meus-trabalhos")}`}>
              <BriefcaseBusinessIcon className="w-5 h-5" />
              <span>Meus Trabalhos</span>
            </Link>

            <Link
              to="/todos-usuarios"
              className={`flex items-center space-x-2 p-2 rounded-md ${isActive("/todos-usuarios")}`}
            >
              <Users className="w-5 h-5" />
              <span>Todos os Usuários</span>
            </Link>

            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 p-2 rounded-md ${isActive("/dashboard")}`}>
              < ChartBar className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>


          </>
        )}
      </nav>

      {/* BOTÃO LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 p-2 rounded-md bg-red-600 hover:bg-red-700 mx-6 mb-6 text-sm"
      >
        <LogOut className="w-5 h-5" />
        <span>Sair</span>
      </button>
    </aside>
  );
}
