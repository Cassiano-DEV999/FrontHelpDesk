import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ModalResolucao } from "@/components/ModalResolucao";
import { Card, CardContent } from "@/components/ui/card";

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

export default function TodosChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [filtros, setFiltros] = useState({
    status: "",
    setor: "",
    atribuidoA: "",
    usuario: "",
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalResolucaoAberto, setModalResolucaoAberto] = useState(false);

  const carregarChamados = async (_pagina: number = page) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      return;
    }

    const queryParams = new URLSearchParams(
      Object.entries(filtros).filter(([_, v]) => v.trim() !== "")
    );
    queryParams.append("page", page.toString());
    queryParams.append("size", "10");

    try {
      const response = await fetch(`http://localhost:8080/api/chamados?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();

      const data: ChamadoPage = await response.json();
      setChamados(data.content);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Erro ao buscar chamados.");
    }
  };

  const aplicarFiltros = () => {
    setPage(0);
    carregarChamados(0);
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const exportarPDF = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      return;
    }

    const query = new URLSearchParams(
      Object.entries(filtros).filter(([_, v]) => v.trim() !== "")
    ).toString();

    try {
      const response = await fetch(`http://localhost:8080/api/chamados/relatorio/pdf?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "relatorio-chamados.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Erro ao exportar PDF.");
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
        carregarChamados();
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
    carregarChamados();
  }, [page]);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-blue-700">Todos os Chamados</h1>
              <button
                onClick={exportarPDF}
                className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 text-sm"
              >
                Exportar PDF
              </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-5 gap-4 bg-white p-4 rounded-xl shadow mb-8">
              <select
                name="setor"
                value={filtros.setor}
                onChange={handleFiltroChange}
                className="border rounded p-2 text-sm"
              >
                <option value="">Todos os Setores</option>
                <option value="PAT">PAT</option>
                <option value="SEDESP">SEDESP</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="SENJ">SENJ</option>
                <option value="SEF">SEF</option>
                <option value="Licitação">Licitação</option>
              </select>

              <input name="status" placeholder="Status" value={filtros.status} onChange={handleFiltroChange} className="border rounded p-2 text-sm" />
              <input name="atribuidoA" placeholder="Técnico" value={filtros.atribuidoA} onChange={handleFiltroChange} className="border rounded p-2 text-sm" />
              <input name="usuario" placeholder="Solicitante" value={filtros.usuario} onChange={handleFiltroChange} className="border rounded p-2 text-sm" />

              <div className="flex gap-2">
                <button onClick={aplicarFiltros} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">Filtrar</button>
                <button
                  onClick={() => {
                    setFiltros({ status: "", setor: "", atribuidoA: "", usuario: "" });
                    setPage(0);
                  }}
                  className="bg-neutral-200 text-sm rounded px-3 py-2 hover:bg-neutral-300"
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto bg-white shadow rounded-xl">
              <table className="w-full text-left text-sm text-neutral-700">
                <thead className="bg-neutral-200 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Protocolo</th>
                    <th className="px-4 py-3">Solicitante</th>
                    <th className="px-4 py-3">Setor</th>
                    <th className="px-4 py-3">Destino</th>
                    <th className="px-4 py-3">Motivo</th>
                    <th className="px-4 py-3">Técnico</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-6">Nenhum chamado encontrado.</td>
                    </tr>
                  )}
                  {chamados.map((chamado) => (
                    <tr key={chamado.id} className="border-t hover:bg-neutral-100">
                      <td className="px-4 py-3 font-mono text-blue-700">{chamado.protocolo}</td>
                      <td className="px-4 py-3">{chamado.nome}</td>
                      <td className="px-4 py-3">{chamado.setorTrabalha}</td>
                      <td className="px-4 py-3">{chamado.setorDestino}</td>
                      <td className="px-4 py-3">{chamado.motivoAbertura}</td>
                      <td className="px-4 py-3">{chamado.tecnicoAtribuido || "-"}</td>
                      <td className="px-4 py-3 font-semibold">{chamado.status}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{chamado.dataAbertura}</td>
                      <td className="px-4 py-3 flex gap-2">
                        {chamado.status === "ABERTO" && (
                          <button onClick={() => iniciarChamado(chamado.id)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">
                            Iniciar
                          </button>
                        )}
                        {chamado.status === "EM_ANDAMENTO" && (
                          <Dialog open={modalResolucaoAberto} onOpenChange={setModalResolucaoAberto}>
                            <DialogTrigger asChild>
                              <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">
                                Finalizar
                              </button>
                            </DialogTrigger>
                            <ModalResolucao carregarChamados={carregarChamados} chamadoId={chamado.id} />
                          </Dialog>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
