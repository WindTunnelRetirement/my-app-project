import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onBackToHome: () => void; // ホームに戻る機能を追加
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onBackToHome }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await login(formData);
    } catch (error) {
      // エラーはコンテキストで処理される
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: '48px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative'
  };

  const backButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '24px',
    left: '24px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.2s',
    fontWeight: '500'
  };

  const formContainerStyle: React.CSSProperties = {
    maxWidth: '400px',
    width: '100%',
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: '8px'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '24px'
  };

  const linkStyle: React.CSSProperties = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontFamily: 'inherit'
  };

  const buttonDisabledStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px'
  };

  const errorTextStyle: React.CSSProperties = {
    color: '#dc2626',
    fontSize: '14px',
    margin: 0
  };

  const passwordContainerStyle: React.CSSProperties = {
    position: 'relative',
    marginBottom: '16px'
  };

  const eyeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px'
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '16px'
  };

  return (
    <div style={containerStyle}>
      {/* ホームに戻るボタン */}
      <button
        style={backButtonStyle}
        onClick={onBackToHome}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f1f5f9';
          e.currentTarget.style.color = '#374151';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#64748b';
        }}
      >
        <span style={{ fontSize: '16px' }}>←</span>
        ホームに戻る
      </button>

      <div style={formContainerStyle}>
        <h2 style={titleStyle}>アカウントにログイン</h2>
        <p style={subtitleStyle}>
          アカウントをお持ちでない方は{' '}
          <span style={linkStyle} onClick={onSwitchToRegister}>
            新規登録
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>メールアドレス</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="example@email.com"
              required
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={passwordContainerStyle}>
            <label style={labelStyle}>パスワード</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
                placeholder="パスワードを入力"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                style={eyeButtonStyle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={errorStyle}>
              <p style={errorTextStyle}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !formData.email || !formData.password}
            style={isLoading || !formData.email || !formData.password ? buttonDisabledStyle : buttonStyle}
            onMouseOver={(e) => {
              if (!isLoading && formData.email && formData.password) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading && formData.email && formData.password) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></div>
                ログイン中...
              </div>
            ) : (
              'ログイン'
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};