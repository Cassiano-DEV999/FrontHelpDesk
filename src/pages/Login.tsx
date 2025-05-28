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
        body: JSON.stringify({
          matricula: data.matricula,
          senha: data.senha,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro no login");
      }

      const result = await response.json();
      console.log("Login realizado:", result);

      // Salvar token no localStorage (simples, depois podemos melhorar)
      localStorage.setItem("token", result.token);
      localStorage.setItem("tipo", result.tipo)

      alert("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao realizar login. Verifique seus dados e tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Helpdesk</h1>
        <h2 className="text-lg font-semibold text-center mb-6">LOGIN</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Matrícula */}
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

            {/* Senha */}
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
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

            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            to="/cadastro"
            className="underline text-blue-700 hover:text-blue-900"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
