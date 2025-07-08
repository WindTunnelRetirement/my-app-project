import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../types';
import { createStyles } from '../styles/theme';

interface AppHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  bulkMode: boolean;
  setBulkMode: (mode: boolean) => void;
  theme: Theme;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showFilters,
  setShowFilters,
  bulkMode,
  setBulkMode,
  theme,
  onLoginClick,
  onRegisterClick
}) => {
  const { isAuthenticated, user, logout } = useAuth();
  const styles = createStyles(theme);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '20px', 
      padding: '20px 0', 
      borderBottom: `1px solid ${theme.border}` 
    }}>
      <h1 style={{ margin: 0, color: theme.primary, fontSize: '28px' }}>Focus</h1>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* 既存の機能ボタン */}
        <button 
          onClick={() => setShowFilters(!showFilters)}
          style={{
            ...styles.button(showFilters ? 'primary' : 'secondary'), 
            padding: '12px', 
            minWidth: '44px'
          }}
          title="フィルター"
        >
          🔍
        </button>
        <button 
          onClick={() => setBulkMode(!bulkMode)}
          style={{
            ...styles.button(bulkMode ? 'primary' : 'secondary'), 
            padding: '12px', 
            minWidth: '44px'
          }}
          title="一括操作"
        >
          ☑️
        </button>
        
        {/* 認証関連のボタン */}
        {isAuthenticated ? (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center',
            marginLeft: '16px'
          }}>
            <span style={{ 
              color: theme.text, 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {user?.name}さん
            </span>
            <button
              onClick={logout}
              style={{
                ...styles.button('secondary'),
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            marginLeft: '16px'
          }}>
            <button
              onClick={onLoginClick}
              style={{
                ...styles.button('primary'),
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ログイン
            </button>
            <button
              onClick={onRegisterClick}
              style={{
                ...styles.button('secondary'),
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              新規登録
            </button>
          </div>
        )}
      </div>
    </div>
  );
};