import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Chama sua API diretamente
      const response = await fetch(
        'https://backendpostagens.vercel.app/api/login?type=login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      const data = await response.json();

      if (data.success && data.token) {
        // Salva o token no localStorage
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', email);
        
        // Redireciona para admin
        navigate('/DhanteConfig');
      } else {
        setError(data.message || 'Login falhou');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Área Administrativa</h1>
        
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;