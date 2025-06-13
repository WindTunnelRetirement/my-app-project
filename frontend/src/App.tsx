import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: number;
  category: string;
  created_at: string;
  updated_at: string;
  dueDate?: string;
  tags: string[];
  subtasks: { id: number; title: string; done: boolean }[];
}

interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newTask, setNewTask] = useState({ title: '', priority: 2, category: 'general', dueDate: '', tags: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', priority: null, category: '', search: '' });
  const [sortBy, setSortBy] = useState('priority');
  const [draggedTask, setDraggedTask] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const configs = {
    priority: { 1: { name: '高', color: '#ff4757', emoji: '🔥' }, 2: { name: '中', color: '#ffa502', emoji: '⚡' }, 3: { name: '低', color: '#5352ed', emoji: '💫' } },
    category: { general: { name: '一般', color: '#6c5ce7', emoji: '📝' }, work: { name: '仕事', color: '#00b894', emoji: '💼' }, personal: { name: 'プライベート', color: '#fd79a8', emoji: '🏠' }, shopping: { name: '買い物', color: '#fdcb6e', emoji: '🛒' }, health: { name: '健康', color: '#00cec9', emoji: '💪' } }
  };

  const theme = {
    background: darkMode ? '#000000' : '#f2f2f7',
    card: darkMode ? '#1c1c1e' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    textSecondary: '#8e8e93',
    border: darkMode ? '#38383a' : '#c6c6c8',
    primary: darkMode ? '#0A84FF' : '#007AFF',
    success: darkMode ? '#30D158' : '#34C759',
    destructive: darkMode ? '#FF453A' : '#FF3B30',
    shadow: darkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
  };

  const styles = {
    input: { width: '100%', padding: '12px', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.card, color: theme.text, fontSize: '16px', boxSizing: 'border-box' as const, outline: 'none', minHeight: '44px' },
    button: (variant: 'primary' | 'secondary' | 'danger' = 'primary') => ({ padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', minHeight: '44px', backgroundColor: variant === 'primary' ? theme.primary : variant === 'danger' ? theme.destructive : theme.textSecondary, color: 'white' }),
    card: { backgroundColor: theme.card, borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: theme.shadow }
  };

  // タスクの永続化
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 通知システム
  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message, timestamp: id }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task));
    if (updates.done !== undefined) {
      addNotification('success', updates.done ? 'タスクを完了しました！' : 'タスクを未完了に戻しました');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    addNotification('info', 'タスクを削除しました');
  };

  const addTask = () => {
    if (!newTask.title.trim()) {
      addNotification('error', 'タスク名を入力してください');
      return;
    }
    const task: Task = { 
      id: Date.now(), 
      ...newTask, 
      done: false, 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString(), 
      dueDate: newTask.dueDate || undefined, 
      tags: newTask.tags.split(',').map(t => t.trim()).filter(Boolean), 
      subtasks: [] 
    };
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', priority: 2, category: 'general', dueDate: '', tags: '' });
    addNotification('success', 'タスクを追加しました！');
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditData({ title: task.title, priority: task.priority, category: task.category, dueDate: task.dueDate || '', tags: task.tags.join(', ') });
  };

  const saveEdit = () => {
    if (!editData.title?.trim() || !editingId) {
      addNotification('error', 'タスク名を入力してください');
      return;
    }
    updateTask(editingId, { ...editData, tags: typeof editData.tags === 'string' ? editData.tags.split(',').map(t => t.trim()).filter(Boolean) : editData.tags });
    setEditingId(null);
    setEditData({});
    addNotification('success', 'タスクを更新しました！');
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (!draggedTask || draggedTask === targetId) return;
    
    setTasks(prev => {
      const draggedIndex = prev.findIndex(t => t.id === draggedTask);
      const targetIndex = prev.findIndex(t => t.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      const newTasks = [...prev];
      const [draggedItem] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedItem);
      return newTasks;
    });
    addNotification('info', 'タスクを移動しました');
  };

  const addSubtask = (taskId: number, subtaskTitle: string) => {
    if (!subtaskTitle.trim()) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { subtasks: [...task.subtasks, { id: Date.now(), title: subtaskTitle, done: false }] });
    addNotification('success', 'サブタスクを追加しました！');
  };

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { subtasks: task.subtasks.map(st => st.id === subtaskId ? { ...st, done: !st.done } : st) });
  };

  const bulkActions = {
    delete: () => { 
      const count = selectedTasks.size;
      setTasks(prev => prev.filter(t => !selectedTasks.has(t.id))); 
      setSelectedTasks(new Set()); 
      addNotification('info', `${count}個のタスクを削除しました`);
    },
    toggle: () => {
      const allCompleted = Array.from(selectedTasks).every(id => tasks.find(t => t.id === id)?.done);
      selectedTasks.forEach(id => updateTask(id, { done: !allCompleted }));
      setSelectedTasks(new Set());
      addNotification('success', `${selectedTasks.size}個のタスクを${allCompleted ? '未完了' : '完了'}にしました`);
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      const { status, priority, category, search } = filters;
      return (status === 'all' || (status === 'completed' ? task.done : !task.done)) &&
             (showCompleted || !task.done) &&
             (!priority || task.priority === priority) &&
             (!category || task.category === category) &&
             (!search || task.title.toLowerCase().includes(search.toLowerCase()) || task.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));
    })
    .sort((a, b) => {
      if (sortBy === 'priority') return a.priority - b.priority;
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const isOverdue = (dueDate?: string) => dueDate && new Date(dueDate) < new Date();
  const completedCount = tasks.filter(t => t.done).length;

  useEffect(() => {
    document.documentElement.style.backgroundColor = theme.background;
    document.body.style.backgroundColor = theme.background;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [theme.background]);

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text, minHeight: '100vh', width: '100%', padding: '16px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', position: 'relative', boxSizing: 'border-box' }}>
      
      {/* 通知システム */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notifications.map(notification => (
          <div key={notification.id} 
               style={{ 
                 padding: '12px 16px', 
                 borderRadius: '8px', 
                 color: 'white',
                 backgroundColor: notification.type === 'success' ? theme.success : notification.type === 'error' ? theme.destructive : theme.primary,
                 boxShadow: theme.shadow,
                 minWidth: '250px',
                 animation: 'slideIn 0.3s ease-out',
                 fontSize: '14px',
                 fontWeight: '500'
               }}>
            {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'} {notification.message}
          </div>
        ))}
      </div>

      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '20px 0', borderBottom: `1px solid ${theme.border}` }}>
        <h1 style={{ margin: 0, color: theme.primary, fontSize: '28px' }}>✨ タスク</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { icon: '🔍', action: () => setShowFilters(!showFilters) },
            { icon: '☑️', action: () => setBulkMode(!bulkMode), active: bulkMode },
            { icon: darkMode ? '☀️' : '🌙', action: () => setDarkMode(!darkMode) }
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} 
                    style={{...styles.button(btn.active ? 'primary' : 'secondary'), padding: '12px', minWidth: '44px'}}>
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* 進捗 */}
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
          進捗: {completedCount}/{tasks.length} 完了
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: theme.border, borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%`, height: '100%', backgroundColor: theme.success, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* フィルター */}
      {showFilters && (
        <div style={styles.card}>
          <input placeholder="検索..." value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} style={{...styles.input, marginBottom: '12px'}} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
            <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} style={styles.input}>
              {[['all', 'すべて'], ['pending', '未完了'], ['completed', '完了済み']].map(([value, label]) => 
                <option key={value} value={value}>{label}</option>
              )}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.input}>
              {[['priority', '優先度順'], ['created_at', '作成日順'], ['dueDate', '期限順']].map(([value, label]) => 
                <option key={value} value={value}>{label}</option>
              )}
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />完了済みを表示
          </label>
        </div>
      )}

      {/* 一括操作 */}
      {bulkMode && selectedTasks.size > 0 && (
        <div style={{ ...styles.card, display: 'flex', gap: '8px' }}>
          <button onClick={bulkActions.toggle} style={styles.button('primary')}>一括切替 ({selectedTasks.size})</button>
          <button onClick={bulkActions.delete} style={styles.button('danger')}>一括削除</button>
          <button onClick={() => {setSelectedTasks(new Set()); setBulkMode(false);}} style={styles.button('secondary')}>キャンセル</button>
        </div>
      )}

      {/* タスク追加 */}
      <div style={styles.card}>
        <input placeholder="新しいタスク..." value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} onKeyPress={(e) => e.key === 'Enter' && addTask()} style={{...styles.input, marginBottom: '12px'}} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '12px' }}>
          <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: Number(e.target.value)})} style={styles.input}>
            {Object.entries(configs.priority).map(([key, config]) => <option key={key} value={key}>{config.emoji} {config.name}</option>)}
          </select>
          <select value={newTask.category} onChange={(e) => setNewTask({...newTask, category: e.target.value})} style={styles.input}>
            {Object.entries(configs.category).map(([key, config]) => <option key={key} value={key}>{config.emoji} {config.name}</option>)}
          </select>
          <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
                 style={{...styles.input, colorScheme: darkMode ? 'dark' : 'light'}} />
        </div>
        <input placeholder="タグ (カンマ区切り)" value={newTask.tags} onChange={(e) => setNewTask({...newTask, tags: e.target.value})} style={{...styles.input, marginBottom: '12px'}} />
        <button onClick={addTask} disabled={!newTask.title.trim()} style={{...styles.button('primary'), width: '100%', minHeight: '48px'}}>➕ タスクを追加</button>
      </div>

      {/* タスクリスト */}
      <div>
        {filteredTasks.map(task => (
          <div key={task.id} 
               draggable 
               onDragStart={(e) => handleDragStart(e, task.id)} 
               onDragOver={(e) => e.preventDefault()} 
               onDrop={(e) => handleDrop(e, task.id)}
               onDragEnd={() => setDraggedTask(null)}
               style={{ 
                 backgroundColor: theme.card, 
                 borderRadius: '12px', 
                 padding: '16px', 
                 marginBottom: '12px', 
                 borderLeft: `4px solid ${configs.priority[task.priority as keyof typeof configs.priority]?.color}`, 
                 boxShadow: theme.shadow, 
                 cursor: 'grab', 
                 opacity: draggedTask === task.id ? 0.5 : 1 
               }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {bulkMode && <input type="checkbox" checked={selectedTasks.has(task.id)} onChange={(e) => { 
                const newSelected = new Set(selectedTasks); 
                e.target.checked ? newSelected.add(task.id) : newSelected.delete(task.id); 
                setSelectedTasks(newSelected); 
              }} style={{ marginTop: '4px' }} />}
              
              <button onClick={() => updateTask(task.id, { done: !task.done })} 
                      style={{ 
                        width: '28px', height: '28px', borderRadius: '50%', 
                        border: `2px solid ${task.done ? theme.success : theme.border}`, 
                        backgroundColor: task.done ? theme.success : 'transparent', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', flexShrink: 0, marginTop: '2px', 
                        minWidth: '44px', minHeight: '44px' 
                      }}>
                {task.done && '✓'}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                  {[
                    { text: `${configs.priority[task.priority as keyof typeof configs.priority]?.emoji} ${configs.priority[task.priority as keyof typeof configs.priority]?.name}`, color: configs.priority[task.priority as keyof typeof configs.priority]?.color },
                    { text: `${configs.category[task.category as keyof typeof configs.category]?.emoji} ${configs.category[task.category as keyof typeof configs.category]?.name}`, color: configs.category[task.category as keyof typeof configs.category]?.color },
                    ...(task.dueDate ? [{ text: `📅 ${new Date(task.dueDate).toLocaleDateString()}`, color: isOverdue(task.dueDate) ? theme.destructive : theme.textSecondary }] : []),
                    ...task.tags.map(tag => ({ text: `#${tag}`, color: theme.textSecondary }))
                  ].map((badge, i) => (
                    <span key={i} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '12px', backgroundColor: badge.color, color: 'white' }}>
                      {badge.text}
                    </span>
                  ))}
                </div>

                {editingId === task.id ? (
                  <div style={{ marginBottom: '12px' }}>
                    <input value={editData.title || ''} onChange={(e) => setEditData({...editData, title: e.target.value})} onKeyPress={(e) => e.key === 'Enter' && saveEdit()} style={{...styles.input, marginBottom: '8px'}} autoFocus />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <select value={editData.priority || 2} onChange={(e) => setEditData({...editData, priority: Number(e.target.value)})} style={styles.input}>
                        {Object.entries(configs.priority).map(([key, config]) => <option key={key} value={key}>{config.emoji} {config.name}</option>)}
                      </select>
                      <select value={editData.category || 'general'} onChange={(e) => setEditData({...editData, category: e.target.value})} style={styles.input}>
                        {Object.entries(configs.category).map(([key, config]) => <option key={key} value={key}>{config.emoji} {config.name}</option>)}
                      </select>
                    </div>
                    <input type="date" value={editData.dueDate || ''} onChange={(e) => setEditData({...editData, dueDate: e.target.value})} 
                           style={{...styles.input, marginBottom: '8px', colorScheme: darkMode ? 'dark' : 'light'}} />
                    <input placeholder="タグ (カンマ区切り)" value={editData.tags || ''} onChange={(e) => setEditData({...editData, tags: e.target.value})} style={{...styles.input, marginBottom: '8px'}} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={saveEdit} style={styles.button('primary')}>保存</button>
                      <button onClick={() => setEditingId(null)} style={styles.button('secondary')}>キャンセル</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => startEdit(task)} style={{ fontSize: '16px', textDecoration: task.done ? 'line-through' : 'none', color: task.done ? theme.textSecondary : theme.text, cursor: 'pointer', marginBottom: '8px', lineHeight: '1.4' }}>
                    {task.title}
                  </div>
                )}

                {task.subtasks.length > 0 && (
                  <div style={{ marginLeft: '20px', marginBottom: '8px' }}>
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <button onClick={() => toggleSubtask(task.id, subtask.id)} style={{ width: '16px', height: '16px', borderRadius: '3px', border: `1px solid ${subtask.done ? theme.success : theme.border}`, backgroundColor: subtask.done ? theme.success : 'transparent', cursor: 'pointer', fontSize: '10px' }}>
                          {subtask.done && '✓'}
                        </button>
                        <span style={{ fontSize: '14px', textDecoration: subtask.done ? 'line-through' : 'none', color: subtask.done ? theme.textSecondary : theme.text }}>{subtask.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => { const title = prompt('サブタスクを追加:'); if (title) addSubtask(task.id, title); }} style={{...styles.button('secondary'), padding: '4px 8px', fontSize: '12px'}}>➕ サブタスク</button>
              </div>

              <button onClick={() => deleteTask(task.id)} style={{...styles.button('danger'), padding: '8px', flexShrink: 0}}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div style={{ textAlign: 'center', color: theme.textSecondary, fontSize: '16px', marginTop: '60px', padding: '40px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
          <p>タスクがありません</p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>新しいタスクを追加してください</p>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;