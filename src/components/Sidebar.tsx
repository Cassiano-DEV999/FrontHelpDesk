import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Ticket, User } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-blue-800"
      : "hover:bg-blue-800";

  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col">
      <div className="text-2xl font-bold p-6 border-b border-blue-500">
        Helpdesk
      </div>
      <nav className="flex-1 p-6 space-y-4">
        <Link
          to="/home"
          className={`flex items-center space-x-2 p-2 rounded-md ${isActive(
            "/home"
          )}`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/abrir-chamado"
          className={`flex items-center space-x-2 p-2 rounded-md ${isActive(
            "/abrir-chamado"
          )}`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Ticket</span>
        </Link>

        <Link
          to="/meus-chamados"
          className={`flex items-center space-x-2 p-2 rounded-md ${isActive(
            "/meus-chamados"
          )}`}
        >
          <Ticket className="w-5 h-5" />
          <span>My Tickets</span>
        </Link>

        <Link
          to="/meu-perfil"
          className={`flex items-center space-x-2 p-2 rounded-md ${isActive(
            "/meu-perfil"
          )}`}
        >
          <User className="w-5 h-5" />
          <span>My Profile</span>
        </Link>
      </nav>
    </aside>
  );
}
