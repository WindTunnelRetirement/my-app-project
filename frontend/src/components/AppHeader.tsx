import React from 'react';
import { Theme } from '../types';
import { createStyles } from '../styles/theme';

interface AppHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  bulkMode: boolean;
  setBulkMode: (mode: boolean) => void;
  theme: Theme;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showFilters,
  setShowFilters,
  bulkMode,
  setBulkMode,
  theme
}) => {
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
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          style={{
            ...styles.button(showFilters ? 'primary' : 'secondary'), 
            padding: '12px', 
            minWidth: '44px'
          }}
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
        >
          ☑️
        </button>
      </div>
    </div>
  );
};