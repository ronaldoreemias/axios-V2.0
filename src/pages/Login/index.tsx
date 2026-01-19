// src/pages/Login/index.tsx
import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, isAuthenticated } from '../../services/auth';
import styles from './style.module.css';
import CryptoJS from 'crypto-js';

// Interface para o estado location
interface LocationState {
  from?: {
    pathname: string;
  };
}

function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/DhanteConfig');
    }
  }, [navigate]);

  // Hash da senha no cliente (SHA-256)
  const hashPassword = (password: string): string => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  };

  // Verifica se há tentativas excessivas
  const checkAttempts = (): boolean => {
    const storedAttempts = localStorage.getItem('login_attempts');
    const lastAttempt = localStorage.getItem('last_attempt_time');
    const currentTime = Date.now();

    // Converte storedAttempts para número, tratando null
    const attemptsNumber = storedAttempts ? parseInt(storedAttempts, 10) : 0;
    const lastAttemptTime = lastAttempt ? parseInt(lastAttempt, 10) : 0;

    if (attemptsNumber >= 5) {
      if (lastAttemptTime && (currentTime - lastAttemptTime) < 900000) { // 15 minutos
        return false;
      } else {
        // Reseta após 15 minutos
        localStorage.removeItem('login_attempts');
        localStorage.removeItem('last_attempt_time');
      }
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    
    if (!checkAttempts()) {
      setError('Muitas tentativas falhas. Tente novamente em 15 minutos.');
      return;
    }

    setLoading(true);

    try {
      // Hash da senha antes de enviar
      const hashedPassword: string = hashPassword(password);
      
      // Adiciona timestamp para prevenir replay attacks
      const timestamp: number = Date.now();
      const requestHash: string = CryptoJS.HmacSHA256(
        `${username}${timestamp}`, 
        import.meta.env.VITE_CLIENT_SECRET || 'client-secret'
      ).toString();

      const success: boolean = await login(username, hashedPassword, timestamp, requestHash);

      if (success) {
        // Reseta tentativas em sucesso
        localStorage.removeItem('login_attempts');
        localStorage.removeItem('last_attempt_time');
        
        // Redireciona para a página original ou dashboard
        const locationState = location.state as LocationState;
        const from = locationState?.from?.pathname || '/DhanteConfig';
        navigate(from, { replace: true });
      } else {
        // Incrementa tentativas falhas
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('login_attempts', newAttempts.toString());
        localStorage.setItem('last_attempt_time', Date.now().toString());
        
        setError('Credenciais inválidas');
        
        // Delay adicional após múltiplas falhas
        if (newAttempts >= 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = (): void => {
    const input = document.getElementById('password') as HTMLInputElement | null;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Logo/Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Área Administrativa</h1>
          <p className={styles.subtitle}>Acesso restrito</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* CSRF Token */}
          <input 
            type="hidden" 
            name="csrf_token" 
            value={import.meta.env.VITE_CSRF_TOKEN || ''} 
          />

          {/* Campo Usuário */}
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
              autoComplete="username"
              className={styles.input}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Campo Senha */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
                autoComplete="current-password"
                className={styles.input}
                disabled={loading}
              />
              {/* Botão para mostrar/ocultar senha */}
              <button
                type="button"
                className={styles.showPassword}
                onClick={togglePasswordVisibility}
                aria-label={password ? "Mostrar senha" : "Ocultar senha"}
              >
                👁️
              </button>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className={styles.errorAlert} role="alert">
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          {/* Botão de Login */}
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading || !username || !password}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Verificando...
              </>
            ) : (
              'Entrar'
            )}
          </button>

          {/* Informações de segurança */}
          {attempts > 0 && (
            <div className={styles.attemptsWarning}>
              Tentativas falhas: {attempts}/5
            </div>
          )}
        </form>

        {/* Dicas de segurança */}
        <div className={styles.securityTips}>
          <h3 className={styles.securityTitle}>Dicas de segurança:</h3>
          <ul className={styles.securityList}>
            <li>✓ Use senhas fortes e únicas</li>
            <li>✓ Não compartilhe suas credenciais</li>
            <li>✓ Sempre saia ao terminar</li>
            <li>✓ Verifique o URL (deve ser HTTPS)</li>
          </ul>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Em caso de problemas, contate o administrador.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;