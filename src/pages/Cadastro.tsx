"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const cadastroSchema = z
  .object({
    matricula: z.string().min(1, "Matrícula obrigatória"),
    nome: z.string().min(1, "Nome obrigatório"),
    cpf: z.string().min(11, "CPF obrigatório"),
    telefone: z.string().min(1, "Telefone obrigatório"),
    dataNascimento: z.string().min(1, "Data de nascimento obrigatória"),
    senha: z.string().min(6, "Senha com no mínimo 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type CadastroData = z.infer<typeof cadastroSchema>;

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const form = useForm<CadastroData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      matricula: "",
      nome: "",
      cpf: "",
      telefone: "",
      dataNascimento: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = async (data: CadastroData) => {
    const payload = {
      ...data,
      dataNascimento: formatDate(data.dataNascimento),
    };

    try {
      const response = await fetch("http://localhost:8080/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao cadastrar usuário");
      }

      const result = await response.json();
      console.log("Cadastro realizado:", result);

      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao realizar cadastro. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#304f8a] via-[#3f5fb5] to-[#4e6fdc] px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-center text-[#304f8a] mb-2">MindDesk</h1>
        <p className="text-center text-gray-600 mb-8">Crie sua conta para acessar o sistema</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite sua matrícula" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repita a senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#304f8a] hover:bg-[#253d6b] text-white transition duration-200"
            >
              Cadastrar
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já possui uma conta?{" "}
          <Link
            to="/login"
            className="underline text-blue-700 hover:text-blue-900"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
