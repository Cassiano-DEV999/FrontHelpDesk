"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Sidebar from "../components/Sidebar";
import { toast } from "sonner";

interface Usuario {
  matricula: string;
  nome: string;
  tipo: string;
  online?: boolean;
}

export default function TodosUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [matriculaFiltro, setMatriculaFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("TODOS");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    carregarUsuarios();
  }, [matriculaFiltro, tipoFiltro, paginaAtual]);

  const carregarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      queryParams.append("page", String(paginaAtual));
      queryParams.append("size", "10");
      if (matriculaFiltro) queryParams.append("matricula", matriculaFiltro);
      if (tipoFiltro !== "TODOS") queryParams.append("tipo", tipoFiltro);

      const response = await fetch(
        `http://localhost:8080/api/usuarios/buscar?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Erro ao carregar usuários");
      const data = await response.json();
      setUsuarios(data.content || []);
      setTotalPaginas(data.totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar usuários.");
    }
  };

  const abrirModal = (usuario: Usuario) => {
    setUsuarioSelecionado({ ...usuario });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setUsuarioSelecionado(null);
  };

  const editarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${usuarioSelecionado?.matricula}/tipo`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tipo: usuarioSelecionado?.tipo }),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar tipo do usuário");

      toast.success("Usuário atualizado com sucesso!");
      fecharModal();
      carregarUsuarios();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar usuário.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-950">
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-blue-700 dark:text-white">
              Todos os Usuários
            </h1>

            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Buscar por matrícula"
                value={matriculaFiltro}
                onChange={(e) => {
                  setPaginaAtual(0);
                  setMatriculaFiltro(e.target.value);
                }}
              />
              <Select
                value={tipoFiltro}
                onValueChange={(value) => {
                  setPaginaAtual(0);
                  setTipoFiltro(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="COMUM">COMUM</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.matricula}>
                      <TableCell>{usuario.matricula}</TableCell>
                      <TableCell>{usuario.nome}</TableCell>
                      <TableCell>{usuario.tipo}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => abrirModal(usuario)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 0))}
                disabled={paginaAtual === 0}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-sm"
              >
                Anterior
              </button>
              <span className="self-center text-sm">
                Página {paginaAtual + 1} de {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPaginaAtual((prev) =>
                    prev + 1 < totalPaginas ? prev + 1 : prev
                  )
                }
                disabled={paginaAtual + 1 >= totalPaginas}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-sm"
              >
                Próxima
              </button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={modalAberto} onOpenChange={fecharModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            {usuarioSelecionado && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editarUsuario();
                }}
                className="space-y-4"
              >
                <Input
                  value={usuarioSelecionado.nome}
                  onChange={(e) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado,
                      nome: e.target.value,
                    })
                  }
                  placeholder="Nome"
                />
                <Select
                  value={usuarioSelecionado?.tipo || "COMUM"}
                  onValueChange={(value) =>
                    setUsuarioSelecionado({
                      ...usuarioSelecionado!,
                      tipo: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMUM">COMUM</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Salvar
                  </button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        <footer className="bg-white border-t border-neutral-200 text-black text-sm text-center py-4">
          <p>© {new Date().getFullYear()} MindDesk • Desenvolvido por Cassiano Melo</p>
        </footer>
      </main>
    </div>
  );
}
