import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { NotepadText, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface FollowUp {
  autor: string;
  data: string;
  descricao: string;
}

interface ChamadoHistorico {
  protocolo: string;
  matriculaSolicitante: string;
  nomeSolicitante: string;
  setorTrabalha: string;
  tipoProblema: string;
  motivoAbertura: string;
  statusAtual: string;
  motivoSolucao?: string;
  dataAbertura: string;
  followups: FollowUp[];
}

interface HistoricoModalProps {
  chamadoId: number;
}

export default function HistoricoModal({ chamadoId }: HistoricoModalProps) {
  const [open, setOpen] = useState(false);
  const [historico, setHistorico] = useState<ChamadoHistorico | null>(null);
  const [descricao, setDescricao] = useState("");
  const tipoUsuario = localStorage.getItem("tipo");


  const carregarHistorico = async () => {
    console.log("📡 Buscando histórico...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/chamados/${chamadoId}/historico`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Erro ao carregar histórico");
      const data = await res.json();
      setHistorico(data);
    } catch (error) {
      toast.error("Erro ao buscar histórico do chamado");
    }
  };

  const adicionarFollowUp = async () => {
    if (!descricao.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/chamados/${chamadoId}/followups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descricao }),
      });

      if (!res.ok) throw new Error("Erro ao adicionar follow-up");
      toast.success("Comentário adicionado com sucesso");
      setDescricao("");
      carregarHistorico();
    } catch (error) {
      toast.error("Não foi possível adicionar o comentário");
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        carregarHistorico();
      }, 100);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(state) => {
      setOpen(state);
    }}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("")}
        >
          <NotepadText className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogTitle>Histórico do Chamado</DialogTitle>
        <DialogDescription>
          Veja os detalhes e comentários já feitos neste chamado.
        </DialogDescription>

        {!historico && (
          <p className="text-sm mt-4 text-muted-foreground">
            Carregando histórico...
          </p>
        )}

        {historico && (
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Protocolo:</strong> {historico.protocolo}</p>
              <p><strong>Status:</strong> {historico.statusAtual}</p>
              <p><strong>Solicitante:</strong> {historico.nomeSolicitante} ({historico.matriculaSolicitante})</p>
              <p><strong>Setor:</strong> {historico.setorTrabalha}</p>
              <p className="col-span-2"><strong>Motivo:</strong> {historico.motivoAbertura}</p>
              <p className="col-span-2"><strong>Tipo:</strong> {historico.tipoProblema}</p>
              {historico.motivoSolucao && (
                <p className="col-span-2"><strong>Motivo da Solução:</strong> {historico.motivoSolucao}</p>
              )}
              <p className="col-span-2"><strong>Data de Abertura:</strong> {format(new Date(historico.dataAbertura), "dd/MM/yyyy", { locale: ptBR })}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Follow-ups</h3>
              <ScrollArea className="h-48 pr-3">
                <div className="space-y-2">
                  {historico.followups.length > 0 ? (
                    historico.followups.map((f, i) => (
                      <div key={i} className="border rounded p-2">
                        <p className="text-sm text-muted-foreground">
                          <strong>{f.autor}</strong> — {format(new Date(f.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                        <p className="mt-1">{f.descricao}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm italic text-muted-foreground">
                      Nenhum comentário registrado ainda.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>

            {tipoUsuario === "ADMIN" && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Adicionar comentário</span>
                </div>
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Escreva um comentário..."
                />
                <Button onClick={adicionarFollowUp}>Salvar comentário</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
