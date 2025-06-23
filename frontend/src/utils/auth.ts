export const authUtils = {
  // トークンをローカルストレージに保存
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  // トークンを取得
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // トークンを削除
  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  // ユーザー情報を保存
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // ユーザー情報を取得
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // ユーザー情報を削除
  removeUser(): void {
    localStorage.removeItem('user');
  },

  // ログイン状態を確認
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // ログアウト処理
  logout(): void {
    this.removeToken();
    this.removeUser();
  }
};