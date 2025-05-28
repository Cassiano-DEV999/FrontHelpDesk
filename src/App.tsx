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
        </Routes>
      </BrowserRouter>

      <Toaster richColors position="top-right" />
    </>
  );
}
