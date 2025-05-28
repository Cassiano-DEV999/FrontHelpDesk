"use client";

import { Link } from "react-router-dom";
import { PlusCircle, Ticket } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-end px-6">
          <div className="w-9 h-9 rounded-full bg-neutral-300" />
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 gap-6">
          <h1 className="text-3xl font-bold text-neutral-800">
            Welcome to the Helpdesk!
          </h1>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/abrir-chamado"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md transition"
            >
              <PlusCircle className="w-5 h-5" />
              Abrir novo Chamado
            </Link>

            <Link
              to="/meus-chamados"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md transition"
            >
              <Ticket className="w-5 h-5" />
              Ver meus Chamados
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
