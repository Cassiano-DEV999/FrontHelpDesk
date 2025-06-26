import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ModalResolucao } from "@/components/ModalResolucao";
import ModalHistorico from "@/components/ModalHistorico";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
            const response = await fetch(
                `http://localhost:8080/api/chamados/iniciar/${id}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

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

    const corStatus = {
        ATRIBUIDO: "bg-yellow-400",
        EM_ANDAMENTO: "bg-blue-400",
        RESOLVIDO: "bg-green-500",
        REABERTO: "bg-red-500",
    };

    return (
        <div className="flex min-h-screen bg-neutral-100">
            <Sidebar />
            <main className="flex-1 p-8 space-y-6">
                <h1 className="text-2xl font-bold text-blue-700">Meus Trabalhos</h1>

                {chamados.length === 0 && (
                    <p className="text-center text-neutral-600">
                        Nenhum chamado atribuído no momento.
                    </p>
                )}

                {chamados.map((chamado) => (
                    <Card
                        key={chamado.id}
                        className="border border-neutral-200 rounded-xl shadow-sm"
                    >
                        <CardContent className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-blue-700">
                                        #{chamado.protocolo}
                                    </span>
                                    <Badge
                                        className={cn(
                                            "w-3 h-3 rounded-full",
                                            corStatus[chamado.status as keyof typeof corStatus]
                                        )}
                                    />
                                </div>

                                <p className="text-sm text-neutral-700">
                                    Setor: <strong>{chamado.setorTrabalha}</strong>
                                </p>
                                <p className="text-sm text-neutral-700">
                                    Destino: <strong>{chamado.setorDestino}</strong>
                                </p>
                                <p className="text-sm text-neutral-700">
                                    Motivo: <strong>{chamado.motivoAbertura}</strong>
                                </p>
                                <p className="text-sm text-neutral-700">
                                    Data: <strong>{chamado.dataAbertura}</strong>
                                </p>
                            </div>

                            <div className="flex items-center">
                                <ModalHistorico chamadoId={chamado.id} />
                            </div>

                            <div className="flex items-center">
                                {chamado.status === "ATRIBUIDO" && (
                                    <Button
                                        onClick={() => iniciarChamado(chamado.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                                    >
                                        Iniciar
                                    </Button>
                                )}

                                {chamado.status === "EM_ANDAMENTO" && (
                                    <Dialog
                                        open={modalResolucaoAberto}
                                        onOpenChange={setModalResolucaoAberto}
                                    >
                                        <DialogTrigger asChild>
                                            <Button className="bg-green-600 hover:bg-green-700 text-white text-xs px-4">
                                                Finalizar
                                            </Button>
                                        </DialogTrigger>
                                        <ModalResolucao
                                            chamadoId={chamado.id}
                                            carregarChamados={carregarMeusTrabalhos}
                                        />
                                    </Dialog>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <div className="flex justify-end gap-4 mt-4">
                    <Button
                        variant="outline"
                        disabled={page === 0}
                        onClick={() => irParaPagina(page - 1)}
                    >
                        Anterior
                    </Button>
                    <span className="self-center text-sm">
                        Página {page + 1} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page + 1 >= totalPages}
                        onClick={() => irParaPagina(page + 1)}
                    >
                        Próxima
                    </Button>
                </div>
            </main>
        </div>
    );
}