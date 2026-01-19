import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./Components/comentarios";
import Contato from "./pages/contato";
import Notificacao from "./pages/Notificacao";
import Vagas from "./pages/Vagas";
import DhanteConfig from "./pages/dhanteconfig";
import PostagemDetalhe from "./Components/PostagemDetalhe";
import Newsletter from "./Components/Newsletter";
import Forum from "./pages/Forum";
import Login from "./pages/Login";
import ControleComentarios from "./Components/ControleComentarios" 

// Componente SUPER SIMPLES de rota protegida
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Verifica se tem token no localStorage
  const token = localStorage.getItem('admin_token');
  
  // Se não tiver token, redireciona para login
  if (!token) {
    return <Navigate to="/Login" replace />;
  }
  
  // Se tiver token, renderiza o conteúdo
  return <>{children}</>;
};

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========== ROTAS PÚBLICAS ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/Comentarios" element={<Chat />} />
        <Route path="/Notficacao" element={<Notificacao />} />
        <Route path="/Vagas" element={<Vagas />} />
        <Route path="/postagensgeral/:id" element={<PostagemDetalhe />} />
        <Route path="/Newsletter" element={<Newsletter />} />
        <Route path="/Forum" element={<Forum />} />
        
        {/* ========== LOGIN (pública) ========== */}
        <Route path="/Login" element={<Login />} />
        
        {/* ========== ROTAS ADMINISTRATIVAS PROTEGIDAS ========== */}
        <Route 
          path="/DhanteConfig" 
          element={
            <ProtectedRoute>
              <DhanteConfig />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ControleComentarios" 
          element={
            <ProtectedRoute>
              <ControleComentarios />
            </ProtectedRoute>
          } 
        />
        
        {/* ========== ROTA 404 ========== */}
        <Route 
          path="*" 
          element={
            <div style={{ 
              padding: '40px', 
              textAlign: 'center',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>404</h1>
              <p style={{ fontSize: '18px', color: '#666' }}>
                Página não encontrada
              </p>
              <a 
                href="/" 
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  background: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px'
                }}
              >
                Voltar para Home
              </a>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;