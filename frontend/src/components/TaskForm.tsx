import React from 'react';
import { NewTask } from '../types';
import { configs } from '../constants/configs';

interface TaskFormProps {
  newTask: NewTask;
  setNewTask: (task: NewTask) => void;
  onAddTask: () => void;
  theme: any;
  styles: any;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  newTask,
  setNewTask,
  onAddTask,
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

  const dateInputStyle = {
    ...styles.input, 
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    color: '#ffffff',
    colorScheme: 'dark',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
    appearance: 'none',
    position: 'relative',
    paddingRight: '40px'
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAddTask();
    }
  };

  return (
    <div style={styles.card}>
      <input 
        placeholder="新しいタスク..." 
        value={newTask.title} 
        onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
        onKeyPress={handleKeyPress}
        style={{...styles.input, marginBottom: '12px'}} 
      />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
        gap: '8px', 
        marginBottom: '12px' 
      }}>
        <select 
          value={newTask.priority} 
          onChange={(e) => setNewTask({...newTask, priority: Number(e.target.value)})} 
          style={selectStyle}
        >
          {Object.entries(configs.priority).map(([key, config]) => 
            <option key={key} value={key}>{config.emoji} {config.name}</option>
          )}
        </select>
        <select 
          value={newTask.category} 
          onChange={(e) => setNewTask({...newTask, category: e.target.value})} 
          style={selectStyle}
        >
          {Object.entries(configs.category).map(([key, config]) => 
            <option key={key} value={key}>{config.emoji} {config.name}</option>
          )}
        </select>
        <input 
          type="date" 
          value={newTask.dueDate} 
          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
          placeholder="期限日を選択"
          style={dateInputStyle as React.CSSProperties}
        />
      </div>
      <input 
        placeholder="タグ (カンマ区切り)" 
        value={newTask.tags} 
        onChange={(e) => setNewTask({...newTask, tags: e.target.value})} 
        style={{...styles.input, marginBottom: '12px'}} 
      />
      <button 
        onClick={onAddTask} 
        disabled={!newTask.title.trim()} 
        style={{...styles.button('primary'), width: '100%', minHeight: '48px'}}
      >
        ➕ タスクを追加
      </button>
    </div>
  );
};