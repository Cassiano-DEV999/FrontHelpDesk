import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/Login";
import CadastroUsuario from "./pages/Cadastro";
import Home from "./pages/Home";
import AbrirChamado from "./pages/AbrirChamado";
import MeusChamados from "./pages/MeusChamados";

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
        </Routes>
      </BrowserRouter>

      <Toaster richColors position="top-right" />
    </>
  );
}
