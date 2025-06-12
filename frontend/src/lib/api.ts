// API基本設定
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // レスポンスが空の場合の処理
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Todo API methods
  async getTodos() {
    return this.request('/api/v1/todos');
  }

  async createTodo(todo: { title: string; priority?: string; category?: string }) {
    return this.request('/api/v1/todos', {
      method: 'POST',
      body: JSON.stringify({ todo }),
    });
  }

  async updateTodo(id: number, todo: Partial<{ title: string; completed: boolean; priority: string; category: string }>) {
    return this.request(`/api/v1/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ todo }),
    });
  }

  async deleteTodo(id: number) {
    return this.request(`/api/v1/todos/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// デバッグ用
console.log('API Base URL:', API_BASE_URL);