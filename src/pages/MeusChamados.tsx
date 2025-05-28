// src/pages/MeusChamados.tsx

"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Chamado = {
  protocolo: string;
  setorDestino: string;
  status: string;
  dataAbertura: string;
  motivoAbertura: string;
};

export default function MeusChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChamados = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/chamados", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao buscar chamados.");
      }

      const data = await response.json();
      setChamados(data);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
      toast.error("Erro ao carregar chamados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChamados();
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-end px-6">
          <div className="w-9 h-9 rounded-full bg-neutral-300" />
        </header>

        <div className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">Meus Chamados</h1>

          {loading ? (
            <p className="text-center">Carregando chamados...</p>
          ) : chamados.length === 0 ? (
            <p className="text-center">Nenhum chamado encontrado.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow bg-white">
              <table className="min-w-full table-auto">
                <thead className="bg-blue-700">
                  <tr>
                    {["Protocolo", "Setor Destino", "Status", "Data Abertura", "Motivo"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-semibold text-white uppercase"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((chamado) => (
                    <tr
                      key={chamado.protocolo}
                      className="border-b last:border-b-0 hover:bg-neutral-100"
                    >
                      <td className="px-6 py-4 text-sm text-neutral-800">
                        {chamado.protocolo}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-800">
                        {chamado.setorDestino}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-white ${
                            chamado.status === "ABERTO"
                              ? "bg-blue-600"
                              : chamado.status === "EM_ANDAMENTO"
                              ? "bg-yellow-500"
                              : chamado.status === "RESOLVIDO"
                              ? "bg-green-600"
                              : chamado.status === "REABERTO"
                              ? "bg-purple-600"
                              : chamado.status === "ATRIBUIDO"
                              ? "bg-orange-600"
                              : "bg-gray-600"
                          }`}
                        >
                          {chamado.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-800">
                        {chamado.dataAbertura}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-800">
                        {chamado.motivoAbertura}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
