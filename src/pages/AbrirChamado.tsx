"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
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

const chamadoSchema = z.object({
  secretaria: z.string().min(1, "Secretaria é obrigatória"),
  setorTrabalha: z.string().min(1, "Setor onde trabalha é obrigatório"),
  setorDestino: z.string().min(1, "Setor de destino é obrigatório"),
  motivoAbertura: z
    .string()
    .min(1, "Motivo da abertura é obrigatório")
    .max(255, "Máximo 255 caracteres"),
  tipoProblema: z.string().min(1, "Tipo do problema é obrigatório"),
});

type ChamadoData = z.infer<typeof chamadoSchema>;

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

  useEffect(() => {
    // Simulando buscar nome e matrícula do localStorage
    const nomeLocal = localStorage.getItem("nome");
    const matriculaLocal = localStorage.getItem("matricula");

    if (nomeLocal) setNome(nomeLocal);
    if (matriculaLocal) setMatricula(matriculaLocal);
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao abrir chamado.");
      }

      const result = await response.json();

      toast.success(`Chamado aberto com sucesso! Protocolo: ${result.protocolo}`);
      form.reset();
      navigate("/meus-chamados");
    } catch (error) {
      console.error("Erro ao abrir chamado:", error);
      toast.error("Erro ao abrir chamado. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-end px-6">
          <div className="w-9 h-9 rounded-full bg-neutral-300" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Abrir Chamado</h1>

            <div className="mb-4 space-y-2">
              <p><strong>Nome:</strong> {nome}</p>
              <p><strong>Matrícula:</strong> {matricula}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                {/* SECRETARIA */}
                <FormField
                  control={form.control}
                  name="secretaria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secretaria</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a secretaria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="PAT">PAT</SelectItem>
                              <SelectItem value="SEDESP">SEDESP</SelectItem>
                              <SelectItem value="TI">TI</SelectItem>
                              <SelectItem value="RH">RH</SelectItem>
                              <SelectItem value="SENJ">SENJ</SelectItem>
                              <SelectItem value="SEF">SEF</SelectItem>
                              <SelectItem value="Licitação">Licitação</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SETOR TRABALHA */}
                <FormField
                  control={form.control}
                  name="setorTrabalha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor onde trabalha</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o setor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="PAT">PAT</SelectItem>
                              <SelectItem value="SEDESP">SEDESP</SelectItem>
                              <SelectItem value="TI">TI</SelectItem>
                              <SelectItem value="RH">RH</SelectItem>
                              <SelectItem value="SENJ">SENJ</SelectItem>
                              <SelectItem value="SEF">SEF</SelectItem>
                              <SelectItem value="Licitação">Licitação</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TIPO DO PROBLEMA */}
                <FormField
                  control={form.control}
                  name="tipoProblema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo do Problema</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="SOFTWARE">Software</SelectItem>
                              <SelectItem value="HARDWARE">Hardware</SelectItem>
                              <SelectItem value="REDE">Rede</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MOTIVO ABERTURA */}
                <FormField
                  control={form.control}
                  name="motivoAbertura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da Abertura</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o motivo do chamado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Abrir Chamado
                </Button>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}
