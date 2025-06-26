"use client";

import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Chamado = {
  protocolo: string;
  setorDestino: string;
  status: 'ABERTO' | 'ATRIBUIDO' | 'EM_ANDAMENTO' | 'REABERTO' | 'RESOLVIDO';
  dataAbertura: string;
  motivoAbertura?: string;
};

export default function MeusChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchChamados = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/chamados?page=${page}&size=10`, {
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
      setChamados(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
      toast.error("Erro ao carregar chamados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChamados();
  }, [page]);

  const statusesColor = {
    ABERTO: "bg-blue-600",
    EM_ANDAMENTO: "bg-yellow-500",
    RESOLVIDO: "bg-green-600",
    REABERTO: "bg-purple-600",
    ATRIBUIDO: "bg-orange-600",
  }

  const statuses = {
    ABERTO: "ABERTO",
    EM_ANDAMENTO: "EM ANDAMENTO",
    RESOLVIDO: "RESOLVIDO",
    REABERTO: "REABERTO",
    ATRIBUIDO: "ATRIBUIDO",
  }


  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-end px-6"></header>

            <div className="flex-1 p-10">
              <h1 className="text-3xl font-bold mb-6">Meus Chamados</h1>

              {loading ? (
                <p className="text-center">Carregando chamados...</p>
              ) : chamados.length === 0 ? (
                <p className="text-center">Nenhum chamado encontrado.</p>
              ) : (
                <>
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
                                className={`px-3 py-1 rounded-full text-white ${statusesColor[chamado.status]
                                  }`}
                              >
                                {statuses[chamado.status]}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-800">
                              {chamado.dataAbertura}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-800">
                              {chamado.motivoAbertura
                                ? chamado.motivoAbertura.length > 40
                                  ? chamado.motivoAbertura.slice(0, 40) + "..."
                                  : chamado.motivoAbertura
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginação */}
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage(page - 1)}
                      className="px-3 py-1 bg-neutral-200 rounded hover:bg-neutral-300 disabled:opacity-50 text-sm"
                    >
                      Anterior
                    </button>

                    <span className="text-sm">
                      Página {page + 1} de {totalPages}
                    </span>

                    <button
                      disabled={page + 1 >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-3 py-1 bg-neutral-200 rounded hover:bg-neutral-300 disabled:opacity-50 text-sm"
                    >
                      Próxima
                    </button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
