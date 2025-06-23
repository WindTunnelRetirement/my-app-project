// API基本設定
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      LOGOUT: '/auth/logout',
    },
    TASKS: {
      INDEX: '/tasks',
      CREATE: '/tasks',
      UPDATE: (id: number) => `/tasks/${id}`,
      DELETE: (id: number) => `/tasks/${id}`,
      TOGGLE: (id: number) => `/tasks/${id}/toggle`,
    },
  },

// API呼び出し用のヘルパー関数
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// TODO API用の関数例
export const todoAPI = {
  getAll: () => apiCall('/api/todos'),
  create: (todo: any) => apiCall('/api/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  }),
  update: (id: number, todo: any) => apiCall(`/api/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todo),
  }),
  delete: (id: number) => apiCall(`/api/todos/${id}`, {
    method: 'DELETE',
  }),
};