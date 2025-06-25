"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Ticket } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import logo from "@/assets/LogoS.jpeg";

interface Chamado {
  id: number;
  protocolo: string;
  status: string;
  motivoAbertura: string;
}

export default function HomePage() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const nome = localStorage.getItem("nome");
    if (nome) {
      setNomeUsuario(nome);
    }

    const carregarChamadosRecentes = async () => {
      try {
        const token = localStorage.getItem("token");
        const matricula = localStorage.getItem("matricula");

        if (!matricula) {
          console.error("Matrícula não encontrada no localStorage");
          return;
        }

        const response = await fetch("http://localhost:8080/api/chamados?page=0&size=3", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setChamados(data.content);
        } else {
          console.error("Erro ao buscar chamados recentes");
        }
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
      }
    };

    carregarChamadosRecentes();
  }, []);

  const irParaMeusChamados = () => {
    navigate("/meus-chamados");
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-end px-6">
          <div className="w-12 h-16 rounded-full bg-neutral-300 overflow-hidden flex items-center justify-center">
            <img src={logo} alt="LogoMinimalista" className="h-full w-full object-cover" />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-start text-center px-4 gap-8 mt-12">
          {/* Título com Nome */}
          <h1 className="text-4xl font-bold text-neutral-800">
            Bem-vindo ao MindDesk{nomeUsuario ? `, ${nomeUsuario}!` : "!"}
          </h1>

          {/* Botões principais */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/abrir-chamado"
              className="flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white px-8 py-5 rounded-xl shadow-lg text-lg min-w-[250px] transition duration-300"
            >
              <PlusCircle className="w-6 h-6" />
              Abrir novo Chamado
            </Link>

            <Link
              to="/meus-chamados"
              className="flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white px-8 py-5 rounded-xl shadow-lg text-lg min-w-[250px] transition duration-300"
            >
              <Ticket className="w-6 h-6" />
              Ver meus Chamados
            </Link>
          </div>

          {/* Últimos chamados */}
          <div className="mt-10 w-full max-w-3xl">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Seus últimos chamados</h2>

            {chamados.length === 0 ? (
              <p className="text-neutral-600">Você ainda não abriu nenhum chamado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {chamados.map((chamado) => (
                  <div
                    key={chamado.id}
                    onClick={irParaMeusChamados}
                    className="bg-white rounded-lg shadow-md p-4 text-left cursor-pointer hover:shadow-lg transition"
                  >
                    <p className="font-bold text-blue-800">Protocolo: {chamado.protocolo}</p>
                    <p className="text-sm text-neutral-700">Status: {chamado.status}</p>
                    <p className="text-sm text-neutral-600 truncate">Motivo: {chamado.motivoAbertura}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <footer className="bg-white border-t border-neutral-200 text-black text-sm text-center py-4">
          <p>© {new Date().getFullYear()} MindDesk • Desenvolvido por Cassiano Melo</p>
        </footer>
      </div>
    </div>
  );
}
