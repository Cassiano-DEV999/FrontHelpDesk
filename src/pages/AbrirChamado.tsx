"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chamadoSchema = z.object({
  secretaria: z.string().min(1, "Secretaria é obrigatória"),
  setorTrabalha: z.string().min(1, "Setor onde trabalha é obrigatório"),
  setorDestino: z.string().min(1, "Setor de destino é obrigatório"),
  motivoAbertura: z.string().min(1, "Motivo é obrigatório").max(255),
  tipoProblema: z.string().min(1, "Tipo é obrigatório"),
});

type ChamadoData = z.infer<typeof chamadoSchema>;

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

export default function AbrirChamado() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");

  const form = useForm<ChamadoData>({
    resolver: zodResolver(chamadoSchema),
    defaultValues: {
      secretaria: "",
      setorTrabalha: "",
      setorDestino: "TI",
      motivoAbertura: "",
      tipoProblema: "",
    },
  });

  const secretariaSelecionada = useWatch({ control: form.control, name: "secretaria" });

  useEffect(() => {
    setNome(localStorage.getItem("nome") || "");
    setMatricula(localStorage.getItem("matricula") || "");
  }, []);

  const onSubmit = async (data: ChamadoData) => {
    try {
      const response = await fetch("http://localhost:8080/api/chamados/novo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao abrir chamado.");

      const result = await response.json();
      toast.success(`Chamado aberto com sucesso! Protocolo: ${result.protocolo}`);
      form.reset();
      navigate("/meus-chamados");
    } catch (error) {
      toast.error("Erro ao abrir chamado. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />

      <main className="flex-1 px-10 py-16">
        <h1 className="text-3xl font-bold text-blue-700">Abrir Chamado</h1>
        <p className="text-black-600 mb-8">Descreva seu problema e nossa equipe técnica irá ajudá-lo</p>

        {/* Card: Info Usuário */}
        <div className="bg-gray-100 rounded-xl p-6 shadow mb-8">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Informações do Usuário</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
            <div><strong>Nome:</strong> {nome || "Não informado"}</div>
            <div><strong>Matrícula:</strong> {matricula || "Não informado"}</div>
          </div>
        </div>

        {/* Card: Detalhes do Chamado */}
        <div className="bg-gray-100 rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold text-blue-700 mb-4"> Detalhes do Chamado</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              <FormField control={form.control} name="secretaria" render={({ field }) => (
                <FormItem>
                  <FormLabel>Secretaria</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a secretaria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.keys(setoresPorSecretaria).map(sigla => (
                            <SelectItem key={sigla} value={sigla}>{sigla}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="setorTrabalha" render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor onde trabalha</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {(setoresPorSecretaria[secretariaSelecionada] || []).map(setor => (
                            <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="tipoProblema" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo do Problema</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="HARDWARE">Hardware</SelectItem>
                          <SelectItem value="SOFTWARE">Software</SelectItem>
                          <SelectItem value="REDE">Rede</SelectItem>
                          <SelectItem value="INTERNET">Internet</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="motivoAbertura" render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da Abertura</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o problema detalhadamente..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full bg-blue-700 hover:bg--800 text-white">
                Abrir Chamado
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
