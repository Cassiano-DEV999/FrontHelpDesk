"use client";

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
} from "@/components/ui/select"
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
  nome: z.string().min(1, "Nome é obrigatório"),
  setorTrabalha: z.string().min(1, "Setor onde trabalha é obrigatório"),
  setorDestino: z.string().min(1, "Setor de destino é obrigatório"),
  motivoAbertura: z
    .string()
    .min(1, "Motivo da abertura é obrigatório")
    .max(255, "Máximo 255 caracteres"),
});

type ChamadoData = z.infer<typeof chamadoSchema>;

export default function AbrirChamado() {
  const navigate = useNavigate();

  const form = useForm<ChamadoData>({
    resolver: zodResolver(chamadoSchema),
    defaultValues: {
      nome: "",
      setorTrabalha: "",
      setorDestino: "TI",
      motivoAbertura: "",
    },
  });

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

      toast.success(
        `Chamado aberto com sucesso! Protocolo: ${result.protocolo}`
      );

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
            <h1 className="text-2xl font-bold mb-6 text-center">
              Abrir Chamado
            </h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="setorTrabalha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor onde trabalha</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecione Seu Setor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Setores</SelectLabel>
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

                <FormField
                  control={form.control}
                  name="setorDestino"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor de destino</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: TI, Administrativo, Suporte"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motivoAbertura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da abertura</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o motivo do chamado (máx 255 caracteres)"
                          {...field}
                        />
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
