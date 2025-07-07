import React from 'react';
import { Theme } from '../types';

interface EmptyStateProps {
  theme: Theme;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ theme }) => {
  return (
    <div style={{ 
      textAlign: 'center', 
      color: theme.textSecondary, 
      fontSize: '16px', 
      marginTop: '60px', 
      padding: '40px 20px' 
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
      <p>タスクがありません</p>
      <p style={{ fontSize: '14px', opacity: 0.7 }}>新しいタスクを追加してください</p>
    </div>
  );
};
