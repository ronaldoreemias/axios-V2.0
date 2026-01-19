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
import { isAuthenticated } from "./services/auth";

// Componente de Rota Protegida
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = true }: ProtectedRouteProps) => {
  const auth = isAuthenticated();
  
  if (!auth) {
    // Redireciona para login se não estiver autenticado
    return <Navigate to="/Login" replace />;
  }
  
  // Se precisar de admin e o usuário não for admin (você pode implementar verificação de role)
  if (requireAdmin) {
    // Aqui você pode verificar se o usuário tem role de admin
    // const userRole = getUserRole();
    // if (userRole !== 'admin') return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Componente para Rotas Públicas (apenas para não autenticados)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = isAuthenticated();
  
  if (auth) {
    // Se já estiver autenticado, redireciona para dashboard
    return <Navigate to="/DhanteConfig" replace />;
  }
  
  return <>{children}</>;
};

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/Comentarios" element={<Chat />} />
        <Route path="/Notficacao" element={<Notificacao />} />
        <Route path="/Vagas" element={<Vagas />} />
        <Route path="/postagensgeral/:id" element={<PostagemDetalhe />} />
        <Route path="/Newsletter" element={<Newsletter />} />
        <Route path="/Forum" element={<Forum />} />
        
        {/* Rota de Login (apenas para não autenticados) */}
        <Route path="/Login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        {/* Rotas Administrativas Protegidas */}
        <Route path="/admin">
          
          {/* Configurações do Site */}
          <Route path="configuracoes" element={
            <ProtectedRoute>
              <DhanteConfig />
            </ProtectedRoute>
          } />
          
          {/* Pode adicionar outras rotas admin aqui */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* Rota antiga para configurações (mantida para compatibilidade) */}
        <Route path="/DhanteConfig" element={
          <ProtectedRoute>
            <DhanteConfig />
          </ProtectedRoute>
        } />
        
        {/* Rota 404 - Página não encontrada */}
        <Route path="*" element={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>404 - Página não encontrada</h1>
            <p>A página que você está procurando não existe.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;