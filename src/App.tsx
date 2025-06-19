import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Páginas públicas
import Login from "./pages/Login";
import CadastroUsuario from "./pages/Cadastro";

// Páginas comuns
import Home from "./pages/Home";
import AbrirChamado from "./pages/AbrirChamado";
import MeusChamados from "./pages/MeusChamados";
import MeuPerfil from "./pages/MeuPerfil"; // ← NOVO

// Páginas exclusivas para ADMIN
import TodosChamados from "./pages/TodosChamados";
import TodosUsuarios from "./pages/TodosUsuarios";
import FilaChamados from "./pages/FilaChamado";
import MeusTrabalhos from "./pages/MeusTrabalhos";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />

          <Route path="/home" element={<Home />} />
          <Route path="/abrir-chamado" element={<AbrirChamado />} />
          <Route path="/meus-chamados" element={<MeusChamados />} />
          <Route path="/meu-perfil" element={<MeuPerfil />} />

          <Route path="/todos-chamados" element={<TodosChamados />} />
          <Route path="/todos-usuarios" element={<TodosUsuarios />} />
          <Route path="/fila-chamados" element={<FilaChamados />} />
          <Route path="/meus-trabalhos" element={<MeusTrabalhos />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Redireciona qualquer rota desconhecida para a página inicial */}
        </Routes>
      </BrowserRouter>

      <Toaster richColors position="top-right" />
    </>
  );
}
