import React from 'react';
import { Theme } from '../types';

interface BulkOperationsProps {
  bulkOperations: any;
  theme: Theme;
  styles: any;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  bulkOperations,
  theme,
  styles
}) => {
  if (!bulkOperations.bulkMode || bulkOperations.selectedTasks.size === 0) {
    return null;
  }

  return (
    <div style={{ ...styles.card, display: 'flex', gap: '8px' }}>
      <button 
        onClick={bulkOperations.bulkToggle} 
        style={styles.button('primary')}
      >
        一括切替 ({bulkOperations.selectedTasks.size})
      </button>
      <button 
        onClick={bulkOperations.bulkDelete} 
        style={styles.button('danger')}
      >
        一括削除
      </button>
      <button 
        onClick={bulkOperations.exitBulkMode} 
        style={styles.button('secondary')}
      >
        キャンセル
      </button>
    </div>
  );
};