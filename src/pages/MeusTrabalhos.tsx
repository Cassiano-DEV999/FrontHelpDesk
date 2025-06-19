import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ModalResolucao } from "@/components/ModalResolucao";

interface Chamado {
    id: number;
    protocolo: string;
    nome: string;
    setorTrabalha: string;
    setorDestino: string;
    motivoAbertura: string;
    status: string;
    tecnicoAtribuido: string;
    dataAbertura: string;
}

interface ChamadoPage {
    content: Chamado[];
    totalPages: number;
    number: number;
}

export default function MeusTrabalhos() {
    const [chamados, setChamados] = useState<Chamado[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [modalResolucaoAberto, setModalResolucaoAberto] = useState(false);

    const carregarMeusTrabalhos = async (_pagina = page) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Token não encontrado. Faça login novamente.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/chamados/meus-trabalhos?page=${_pagina}&size=10`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) throw new Error();

            const data: ChamadoPage = await response.json();
            setChamados(data.content);
            setTotalPages(data.totalPages);
        } catch {
            toast.error("Erro ao carregar seus chamados.");
        }
    };

    const iniciarChamado = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/chamados/iniciar/${id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                toast.success("Chamado iniciado!");
                carregarMeusTrabalhos();
            } else {
                toast.error("Erro ao iniciar chamado.");
            }
        } catch {
            toast.error("Falha na requisição.");
        }
    };

    const irParaPagina = (novaPagina: number) => {
        if (novaPagina >= 0 && novaPagina < totalPages) {
            setPage(novaPagina);
        }
    };

    useEffect(() => {
        carregarMeusTrabalhos();
    }, [page]);

    return (
        <div className="flex min-h-screen bg-neutral-100">
            <Sidebar />
            <main className="flex-1 p-8 space-y-6">
                <h1 className="text-2xl font-bold text-blue-700">Meus Trabalhos</h1>

                {chamados.length === 0 && (
                    <p className="text-center text-neutral-600">Nenhum chamado atribuído no momento.</p>
                )}

                {chamados.map((chamado) => (
                    <Card key={chamado.id} className="shadow rounded-xl border border-neutral-200">
                        <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="font-bold text-blue-800">Protocolo: {chamado.protocolo}</h2>
                                    <p className="text-sm text-neutral-700">Setor: {chamado.setorTrabalha}</p>
                                    <p className="text-sm text-neutral-700">Destino: {chamado.setorDestino}</p>
                                    <p className="text-sm text-neutral-700">Motivo: {chamado.motivoAbertura}</p>
                                    <p className="text-sm text-neutral-700">Status: <span className="font-semibold">{chamado.status}</span></p>
                                    <p className="text-sm text-neutral-700">Data: {chamado.dataAbertura}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {chamado.status === "ATRIBUIDO" && (
                                        <button
                                            onClick={() => iniciarChamado(chamado.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                                        >
                                            Iniciar
                                        </button>
                                    )}

                                    {chamado.status === "EM_ANDAMENTO" && (
                                        <Dialog open={modalResolucaoAberto} onOpenChange={setModalResolucaoAberto}>
                                            <DialogTrigger asChild>
                                                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
                                                    Finalizar
                                                </button>
                                            </DialogTrigger>
                                            <ModalResolucao
                                                chamadoId={chamado.id}
                                                carregarChamados={carregarMeusTrabalhos}
                                            />
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Paginação */}
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        disabled={page === 0}
                        onClick={() => irParaPagina(page - 1)}
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="self-center text-sm">
                        Página {page + 1} de {totalPages}
                    </span>
                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => irParaPagina(page + 1)}
                        className="px-3 py-1 bg-gray rounded disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>
            </main>
        </div>
    );
}
