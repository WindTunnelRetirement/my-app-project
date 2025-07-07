import React from 'react';
import { Theme } from '../types';

interface SwapModeIndicatorProps {
  selectedForSwap: number | null;
  theme: Theme;
  styles: any;
}

export const SwapModeIndicator: React.FC<SwapModeIndicatorProps> = ({
  selectedForSwap,
  theme,
  styles
}) => {
  if (!selectedForSwap) return null;

  return (
    <div style={{ 
      ...styles.card, 
      backgroundColor: theme.primary, 
      color: 'white', 
      textAlign: 'center',
      animation: 'pulse 1.5s infinite'
    }}>
      🔄 入れ替え先のタスクをタップしてください
    </div>
  );
};