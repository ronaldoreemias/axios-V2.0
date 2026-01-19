import api from './api';

const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || 'Ax1osJ0urn@l2024Secr3t';

export const login = async (
  username: string,
  passwordHash: string,
  timestamp: number,
  requestHash: string
): Promise<boolean> => {
  try {
    const response = await api.post('/admin/login', {
      username,
      password: passwordHash,
      timestamp,
      requestHash,
    });

    if (response.data.success && response.data.token) {
      // Salva token e informações
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', response.data.user.username);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      localStorage.setItem('token_expiry', (Date.now() + (response.data.expiresIn * 1000)).toString());
      
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Erro no login:', error.response?.data || error.message);
    
    // Trata erros específicos
    if (error.response?.data?.code === 'RATE_LIMITED') {
      throw new Error(`Bloqueado: ${error.response.data.error}`);
    }
    
    throw error;
  }
};

// Função para gerar hash da requisição (use no frontend)
export const generateRequestHash = (
  username: string, 
  timestamp: number
): string => {
  // Use crypto-js no frontend
  const CryptoJS = require('crypto-js');
  return CryptoJS.HmacSHA256(
    `${username}${timestamp}`,
    CLIENT_SECRET
  ).toString();
};