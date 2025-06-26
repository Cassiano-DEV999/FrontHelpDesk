import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import ModalHistorico from "@/components/ModalHistorico";

const setoresPorSecretaria: Record<string, string[]> = {
  SEA: ["Protocolo", "Recursos Humanos", "Licitação", "Segurança do Trabalho", "Patrimônio", "Almoxarifado", "Vigilância", "Compras", "Expedição"],
  SEF: ["Contabilidade", "Planejamento Orçamentário"],
  SESP: ["Manutenção", "Frota", "Serviços Gerais"],
  SESA: ["Unidade de Pronto Atendimento", "Clínico Geral", "Odontologia", "Saúde Coletiva", "Hospital Municipal"],
  SENJ: ["Contencioso Geral", "Dívida Ativa", "Execução Fiscal", "Patrimônio Imóvel", "Regularização Fundiária"],
  SEMA: ["SEMA"],
  SECI: ["SECI"],
  SECTUR: ["SECTUR"],
  SEED: ["SEED"],
  SEDESP: ["SEDESP"],
  SEG: ["SEG"],
  SOURB: ["SOURB"],
  SPD: ["SPD"],
  SEMU: ["SEMU"],
  VOTOPREV: ["VOTOPREV"],
};

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
  const [secretariaSelecionada, setSecretariaSelecionada] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const setoresDisponiveis = secretariaSelecionada ? setoresPorSecretaria[secretariaSelecionada] || [] : [];

  const carregarChamados = async (_pagina: number = page) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      return;
    }

    const queryParams = new URLSearchParams(
      Object.entries(filtros).filter(([_, v]) => v.trim() !== "")
    );
    queryParams.append("page", _pagina.toString());
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
                onClick={() => toast("Exportar PDF ainda não implementado")}
                className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 text-sm"
              >
                Exportar PDF
              </button>
            </div>

            <div className="grid grid-cols-5 gap-4 bg-white p-4 rounded-xl shadow mb-8">
              <select
                name="secretaria"
                value={secretariaSelecionada}
                onChange={(e) => setSecretariaSelecionada(e.target.value)}
                className="border rounded p-2 text-sm"
              >
                <option value="">Todas as Secretarias</option>
                {Object.keys(setoresPorSecretaria).map((sigla) => (
                  <option key={sigla} value={sigla}>{sigla}</option>
                ))}
              </select>

              <select
                name="setor"
                value={filtros.setor}
                onChange={handleFiltroChange}
                className="border rounded p-2 text-sm"
              >
                <option value="">Todos os Setores</option>
                {setoresDisponiveis.map((setor) => (
                  <option key={setor} value={setor}>{setor}</option>
                ))}
              </select>

              <input name="status" placeholder="Status" value={filtros.status} onChange={handleFiltroChange} className="border rounded p-2 text-sm" />
              <input name="atribuidoA" placeholder="Técnico" value={filtros.atribuidoA} onChange={handleFiltroChange} className="border rounded p-2 text-sm" />
              <input name="usuario" placeholder="Solicitante" value={filtros.usuario} onChange={handleFiltroChange} className="border rounded p-2 text-sm" />

              <div className="col-span-5 flex gap-2 mt-2">
                <button onClick={aplicarFiltros} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">Filtrar</button>
                <button
                  onClick={() => {
                    setFiltros({ status: "", setor: "", atribuidoA: "", usuario: "" });
                    setSecretariaSelecionada("");
                    setPage(0);
                  }}
                  className="bg-neutral-200 text-sm rounded px-3 py-2 hover:bg-neutral-300"
                >
                  Limpar
                </button>
              </div>
            </div>

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
                    <th className="px-4 py-3 text-center">Ações</th>
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
                      <td className="px-4 py-3 text-center">
                        <ModalHistorico chamadoId={chamado.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
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