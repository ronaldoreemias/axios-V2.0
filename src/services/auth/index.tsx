export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('admin_token');
  return !!token; 
};

/**
 * Faz logout removendo o token
 */
export const logout = (): void => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  // Recarrega a página para limpar estado
  window.location.href = '/Login';
};

/**
 * Obtém o token atual
 */
export const getToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

/**
 * Obtém o usuário atual
 */
export const getUser = (): string | null => {
  return localStorage.getItem('admin_user');
};