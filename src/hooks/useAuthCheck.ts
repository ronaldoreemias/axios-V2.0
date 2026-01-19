import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isTokenAboutToExpire } from '../services/auth';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      const isLoginPage = location.pathname === '/Login';
      const isAdminRoute = location.pathname.startsWith('/admin');
      
      // Se não está autenticado e tenta acessar rota admin
      if (!auth && isAdminRoute) {
        navigate('/Login', { 
          state: { from: location },
          replace: true 
        });
        return;
      }
      
      // Se está autenticado e na página de login
      if (auth && isLoginPage) {
        navigate('/DhanteConfig', { replace: true });
        return;
      }
      
      // Verifica se token está prestes a expirar
      if (auth && isTokenAboutToExpire()) {
        console.warn('Token prestes a expirar, considere renovar');
        // Você pode chamar refreshToken() automaticamente aqui
      }
    };

    checkAuth();
  }, [location, navigate]);
};
