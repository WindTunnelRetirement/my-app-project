import React from 'react';
import { Filters } from '../types';

interface TaskFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  theme: any;
  styles: any;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  showCompleted,
  setShowCompleted,
  theme,
  styles
}) => {
  const selectStyle = {
    ...styles.input,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    color: '#ffffff',
    backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="%23ffffff" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px'
  };

  return (
    <div style={styles.card}>
      <input 
        placeholder="検索..." 
        value={filters.search} 
        onChange={(e) => setFilters({...filters, search: e.target.value})} 
        style={{...styles.input, marginBottom: '12px'}} 
      />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
        gap: '8px' 
      }}>
        <select 
          value={filters.status} 
          onChange={(e) => setFilters({...filters, status: e.target.value})} 
          style={selectStyle}
        >
          {[['all', 'すべて'], ['pending', '未完了'], ['completed', '完了済み']].map(([value, label]) => 
            <option key={value} value={value}>{label}</option>
          )}
        </select>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)} 
          style={selectStyle}
        >
          {[['priority', '優先度順'], ['created_at', '作成日順'], ['dueDate', '期限順'], ['custom', 'カスタム順序']].map(([value, label]) => 
            <option key={value} value={value}>{label}</option>
          )}
        </select>
      </div>
      <label style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginTop: '12px' 
      }}>
        <input 
          type="checkbox" 
          checked={showCompleted} 
          onChange={(e) => setShowCompleted(e.target.checked)} 
        />
        完了済みを表示
      </label>
      {sortBy !== 'custom' && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px', 
          backgroundColor: theme.border, 
          borderRadius: '4px', 
          fontSize: '12px', 
          color: theme.textSecondary 
        }}>
          💡 ヒント: タスクを長押し→他のタスクをタップして移動（モバイル）、ドラッグ&ドロップで移動（PC）
        </div>
      )}
    </div>
  );
};