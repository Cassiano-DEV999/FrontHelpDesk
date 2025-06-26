"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
import logo from "@/assets/MindDeskLogoM.png";

const loginSchema = z.object({
  matricula: z.string().min(1, "Matrícula obrigatória"),
  senha: z.string().min(6, "Senha com no mínimo 6 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      matricula: "",
      senha: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro no login");
      }

      const result = await response.json();

      localStorage.setItem("token", result.token);
      localStorage.setItem("nome", result.nome);
      localStorage.setItem("matricula", result.matricula);
      localStorage.setItem("tipo", result.tipo);

      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      toast.error("Falha ao realizar login. Verifique seus dados.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#304f8a] via-[#3f5fb5] to-[#4e6fdc] px-4">

      {/* Grid com 2 colunas lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">

        {/* Coluna 1 - Logo */}
        <div className="bg-white flex items-center justify-center rounded-xl shadow-lg p-8">
          <img src={logo} alt="Logo MindDesk" className="h-130 w-auto" />
        </div>

        {/* Coluna 2 - Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Acesse o MindDesk</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Entre usando sua matrícula e senha cadastrados
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Matrícula */}
              <FormField
                control={form.control}
                name="matricula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Matrícula</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite sua matrícula" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Senha */}
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite sua senha"
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
                Entrar
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Ainda não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="underline text-blue-700 hover:text-blue-900"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
