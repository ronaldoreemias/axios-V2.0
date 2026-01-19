import api from '../api';

// Interfaces para tipagem
export interface LoginCredentials {
  username: string;
  password: string;
  timestamp: number;
  requestHash: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  token: string | null;
}

/**
 * Realiza o login do administrador
 * @param username Nome de usuário
 * @param passwordHash Hash SHA256 da senha
 * @param timestamp Timestamp da requisição
 * @param requestHash Hash de verificação da requisição
 * @returns Promise<boolean> true se login for bem-sucedido
 */
export const login = async (
  username: string,
  passwordHash: string,
  timestamp: number,
  requestHash: string
): Promise<boolean> => {
  try {
    const response = await api.post<LoginResponse>('/admin/login', {
      username,
      password: passwordHash,
      timestamp,
      requestHash,
    });

    if (response.data.token) {
      // Armazena os dados de autenticação de forma segura
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', username);
      
      // Calcula o tempo de expiração
      const expiryTime = Date.now() + (response.data.expiresIn * 1000);
      localStorage.setItem('token_expiry', expiryTime.toString());
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro no login:', error);
    return false;
  }
};

/**
 * Realiza logout do usuário
 * Remove todos os dados de autenticação e redireciona para login
 */
export const logout = (): void => {
  // Remove dados do localStorage
  const itemsToRemove = [
    'admin_token',
    'admin_user',
    'token_expiry',
    'login_attempts',
    'last_attempt_time',
  ];

  itemsToRemove.forEach((item) => localStorage.removeItem(item));

  // Limpa sessionStorage
  sessionStorage.clear();

  // Redireciona para página de login
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

/**
 * Verifica se o usuário está autenticado
 * @returns boolean true se estiver autenticado e token for válido
 */
export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('admin_token');
    const expiry = localStorage.getItem('token_expiry');

    // Verifica se token existe
    if (!token || !expiry) {
      return false;
    }

    // Verifica se o token expirou
    const expiryTime = parseInt(expiry, 10);
    if (Date.now() > expiryTime) {
      logout(); // Faz logout automático
      return false;
    }

    // Token válido (pode adicionar validação JWT aqui se necessário)
    return true;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

/**
 * Obtém o token de autenticação atual
 * @returns string | null Token JWT ou null
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

/**
 * Obtém o nome do usuário atual
 * @returns string | null Nome do usuário ou null
 */
export const getUser = (): string | null => {
  return localStorage.getItem('admin_user');
};

/**
 * Obtém o estado completo da autenticação
 * @returns AuthState Estado atual da autenticação
 */
export const getAuthState = (): AuthState => {
  return {
    isAuthenticated: isAuthenticated(),
    user: getUser(),
    token: getAuthToken(),
  };
};

/**
 * Verifica se o token está próximo de expirar
 * @param thresholdMinutos Minutos para considerar como "próximo a expirar"
 * @returns boolean true se o token estiver próximo de expirar
 */
export const isTokenAboutToExpire = (thresholdMinutos: number = 5): boolean => {
  const expiry = localStorage.getItem('token_expiry');
  
  if (!expiry) return true;

  const expiryTime = parseInt(expiry, 10);
  const thresholdMs = thresholdMinutos * 60 * 1000;
  
  return Date.now() > (expiryTime - thresholdMs);
};

/**
 * Renova o token de autenticação (se necessário)
 * @returns Promise<boolean> true se o token foi renovado
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const response = await api.post<LoginResponse>('/admin/refresh', {
      token,
    });

    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      
      const expiryTime = Date.now() + (response.data.expiresIn * 1000);
      localStorage.setItem('token_expiry', expiryTime.toString());
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return false;
  }
};

/**
 * Valida o formato do token JWT (básico)
 * @param token Token JWT a ser validado
 * @returns boolean true se o token parecer válido
 */
export const isValidTokenFormat = (token: string | null): boolean => {
  if (!token) return false;
  
  // Verifica formato básico de JWT: header.payload.signature
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Limpa tentativas de login falhas
 */
export const clearFailedAttempts = (): void => {
  localStorage.removeItem('login_attempts');
  localStorage.removeItem('last_attempt_time');
};