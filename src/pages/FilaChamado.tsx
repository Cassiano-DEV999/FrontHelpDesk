"use client";

import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Chamado = {
    id: number;
    protocolo: string;
    setorDestino: string;
    status: string;
    dataAbertura: string;
    motivoAbertura?: string;
};

export default function FilaChamados() {
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchChamados = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/chamados/fila?page=${page}&size=10`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erro ao buscar chamados da fila.");
            }

            const data = await response.json();
            setChamados(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Erro ao buscar fila de chamados:", error);
            toast.error("Erro ao carregar fila de chamados.");
        } finally {
            setLoading(false);
        }
    };

    const assumirChamado = async (id: number) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/api/chamados/atribuir/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    loginTecnico: localStorage.getItem("matricula"),
                }),
            });

            if (response.ok) {
                toast.success("Chamado assumido com sucesso!");
                fetchChamados();
            } else {
                toast.error("Erro ao assumir chamado.");
            }
        } catch (error) {
            console.error("Erro ao assumir chamado:", error);
            toast.error("Falha ao tentar assumir o chamado.");
        }
    };

    useEffect(() => {
        fetchChamados();
    }, [page]);

    return (
        <div className="flex min-h-screen bg-neutral-100">
            <Sidebar />

            <main className="flex-1 flex flex-col">
                <Card className="shadow-md rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex-1 p-10">
                            <h1 className="text-3xl  text-blue-700 font-bold mb-6">Fila de Chamados</h1>

                            {loading ? (
                                <p className="text-center">Carregando chamados...</p>
                            ) : chamados.length === 0 ? (
                                <p className="text-center">Nenhum chamado na fila.</p>
                            ) : (
                                <>
                                    <div className="overflow-x-auto rounded-xl shadow bg-white">
                                        <table className="min-w-full table-auto">
                                            <thead className="bg-blue-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Protocolo</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Setor Destino</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Data Abertura</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Motivo</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {chamados.map((chamado) => (
                                                    <tr
                                                        key={chamado.protocolo}
                                                        className="border-b last:border-b-0 hover:bg-neutral-100"
                                                    >
                                                        <td className="px-6 py-4 text-sm text-neutral-800">{chamado.protocolo}</td>
                                                        <td className="px-6 py-4 text-sm text-neutral-800">{chamado.setorDestino}</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-white ${chamado.status === "ABERTO"
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
                                                        <td className="px-6 py-4 text-sm text-neutral-800">{chamado.dataAbertura}</td>
                                                        <td className="px-6 py-4 text-sm text-neutral-800">
                                                            {chamado.motivoAbertura
                                                                ? chamado.motivoAbertura.length > 40
                                                                    ? chamado.motivoAbertura.slice(0, 40) + "..."
                                                                    : chamado.motivoAbertura
                                                                : "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <button
                                                                onClick={() => assumirChamado(chamado.id)}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                                                            >
                                                                Assumir
                                                            </button>
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
