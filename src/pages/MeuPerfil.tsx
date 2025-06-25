"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";
import { User } from "lucide-react";

type Usuario = {
  nome: string;
  tipo: string;
  matricula: string;
};

export default function MeuPerfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/perfil", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setUsuario)
      .catch(() => alert("Erro ao carregar seus dados"));
  }, []);

  const alterarSenha = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8080/api/perfil/senha", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senhaAtual,
        novaSenha,
      }),
    });

    if (response.ok) {
      toast.success("Senha alterada com sucesso!");
      setShowModal(false);
      setSenhaAtual("");
      setNovaSenha("");
    } else {
      const error = await response.text();
      toast.error(error || "Erro ao alterar senha.");
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* Faixa azul - altura preservada */}
        <div className="bg-blue-700 h-40 rounded-xl relative mb-20 shadow-md" />

        {/* Card principal */}
        <div className="bg-white shadow-2xl  p-10 flex gap-12 max-w-6xl mx-auto relative -top-28">
          {/* Coluna da esquerda */}
          <div className="w-1/3 flex flex-col items-center text-center border-r pr-6">
            <div className="w-32 h-32 rounded-full bg-neutral-200 flex items-center justify-center mb-4 shadow-lg">
              <User className="w-16 h-16 text-neutral-500" />
            </div>

            <h2 className="text-2xl font-bold text-neutral-900">{usuario?.nome}</h2>
            <p className="text-sm text-neutral-600 uppercase tracking-wide">{usuario?.tipo}</p>

            <div className="mt-4 space-y-1 text-sm text-neutral-700">
              <p><span className="font-semibold">Matrícula:</span> {usuario?.matricula}</p>
            </div>
          </div>

          {/* Coluna da direita */}
          <div className="w-2/3">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Informações da Conta</h3>
            <p className="text-sm text-neutral-600 mb-6">Gerencie e visualize os seus dados de acesso ao sistema.</p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-800">Nome</label>
                <input
                  value={usuario?.nome || ""}
                  disabled
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 text-neutral-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800">Matrícula</label>
                <input
                  value={usuario?.matricula || ""}
                  disabled
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 text-neutral-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800">Tipo de Usuário</label>
                <input
                  value={usuario?.tipo || ""}
                  disabled
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 text-neutral-800"
                />
              </div>
            </div>

            <button
              type="button"
              className="mt-8 bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-md font-semibold transition"
              onClick={() => setShowModal(true)}
            >
              Alterar Senha
            </button>
          </div>
        </div>

        {/* MODAL DE SENHA */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold text-blue-700 mb-4">Alterar Senha</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-800">Senha atual</label>
                  <input
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="mt-1 w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-800">Nova senha</label>
                  <input
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="mt-1 w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md bg-neutral-200 text-sm hover:bg-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={alterarSenha}
                  className="px-4 py-2 rounded-md bg-blue-700 text-white text-sm hover:bg-blue-800"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
