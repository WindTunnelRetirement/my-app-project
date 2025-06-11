import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  done: boolean | null;
  priority: number; // 1=高, 2=中, 3=低
  category: string;
  created_at: string;
  updated_at: string;
}

type FilterStatus = 'all' | 'completed' | 'pending';
type SortBy = 'priority' | 'created_at';

function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<number>(2);
  const [category, setCategory] = useState<string>('general');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingPriority, setEditingPriority] = useState<number>(2);
  const [editingCategory, setEditingCategory] = useState<string>('general');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // フィルター状態
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('priority');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const priorityConfig = {
    1: { name: '高', color: '#ff4757', emoji: '🔥' },
    2: { name: '中', color: '#ffa502', emoji: '⚡' },
    3: { name: '低', color: '#5352ed', emoji: '💫' }
  };

  const categoryConfig = {
    general: { name: '一般', color: '#6c5ce7', emoji: '📝' },
    work: { name: '仕事', color: '#00b894', emoji: '💼' },
    personal: { name: 'プライベート', color: '#fd79a8', emoji: '🏠' },
    shopping: { name: '買い物', color: '#fdcb6e', emoji: '🛒' },
    health: { name: '健康', color: '#00cec9', emoji: '💪' }
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.style.backgroundColor = darkMode ? '#1a1a1a' : '#ffffff';
  }, [darkMode]);

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority, filterCategory, sortBy]);

  const fetchTasks = () => {
    const params = new URLSearchParams();
    if (filterStatus !== 'all') params.append('status', filterStatus);
    if (filterPriority) params.append('priority', filterPriority.toString());
    if (filterCategory) params.append('category', filterCategory);
    params.append('sort', sortBy);

    const url = `${API_URL}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    
    fetch(url)
      .then(res => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch(err => console.error(err));
  };

  const theme = {
    light: {
      background: '#ffffff',
      cardBackground: '#f8f9fa',
      text: '#000000',
      textSecondary: '#6c757d',
      border: '#e9ecef',
      inputBorder: '#ccc',
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      filterBackground: '#ffffff'
    },
    dark: {
      background: '#1a1a1a',
      cardBackground: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      border: '#404040',
      inputBorder: '#555',
      shadow: '0 2px 4px rgba(0,0,0,0.3)',
      filterBackground: '#2d2d2d'
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  const addTask = (): void => {
    if (!title.trim()) return;
    
    fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        task: { 
          title, 
          priority, 
          category 
        } 
      })
    })
      .then(res => res.json())
      .then((newTask: Task) => {
        setTasks([newTask, ...tasks]);
        setTitle('');
        setPriority(2);
        setCategory('general');
      })
      .catch(err => console.error(err));
  };

  const deleteTask = (id: number): void => {
    setDeletingId(id);
    
    setTimeout(() => {
      fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          setTasks(tasks.filter(task => task.id !== id));
          setDeletingId(null);
        })
        .catch(err => {
          console.error(err);
          setDeletingId(null);
        });
    }, 300);
  };

  const toggleTask = (id: number): void => {
    fetch(`${API_URL}/tasks/${id}/toggle`, {
      method: 'PATCH'
    })
      .then(res => res.json())
      .then((updatedTask: Task) => {
        setTasks(tasks.map(task => 
          task.id === id ? updatedTask : task
        ));
      })
      .catch(err => console.error(err));
  };

  const startEditing = (task: Task): void => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingPriority(task.priority);
    setEditingCategory(task.category);
  };

  const saveEdit = (id: number): void => {
    if (!editingTitle.trim()) return;
    
    fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        task: { 
          title: editingTitle,
          priority: editingPriority,
          category: editingCategory
        } 
      })
    })
      .then(res => res.json())
      .then((updatedTask: Task) => {
        setTasks(tasks.map(task => 
          task.id === id ? updatedTask : task
        ));
        setEditingId(null);
        setEditingTitle('');
        setEditingPriority(2);
        setEditingCategory('general');
      })
      .catch(err => console.error(err));
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditingTitle('');
    setEditingPriority(2);
    setEditingCategory('general');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: number): void => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const getPriorityColor = (priority: number): string => {
    return priorityConfig[priority as keyof typeof priorityConfig]?.color || '#6c757d';
  };

  const getCategoryColor = (category: string): string => {
    return categoryConfig[category as keyof typeof categoryConfig]?.color || '#6c5ce7';
  };

  // スタイル定義
  const appStyles: React.CSSProperties = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: currentTheme.background,
    color: currentTheme.text,
    minHeight: '100vh',
    transition: 'all 0.3s ease',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  };

  const titleStyles: React.CSSProperties = {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 'bold',
    color: darkMode ? '#8b5cf6' : '#3b82f6',
    textShadow: darkMode 
      ? '0 0 20px rgba(139, 92, 246, 0.3)'
      : '0 0 20px rgba(59, 130, 246, 0.3)',
  };

  const darkModeButtonStyles: React.CSSProperties = {
    padding: '10px',
    backgroundColor: 'transparent',
    border: `2px solid ${currentTheme.border}`,
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease',
    color: currentTheme.text,
  };

  const filterContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    padding: '20px',
    backgroundColor: currentTheme.filterBackground,
    borderRadius: '12px',
    border: `1px solid ${currentTheme.border}`,
    marginBottom: '24px',
    boxShadow: currentTheme.shadow,
  };

  const selectStyles: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: `1px solid ${currentTheme.inputBorder}`,
    backgroundColor: currentTheme.background,
    color: currentTheme.text,
    fontSize: '14px',
    cursor: 'pointer',
  };

  const inputContainerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto auto',
    gap: '12px',
    marginBottom: '30px',
    animation: 'fadeInUp 0.5s ease-out',
  };

  const inputStyles: React.CSSProperties = {
    padding: '12px 16px',
    border: `2px solid ${currentTheme.inputBorder}`,
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: currentTheme.background,
    color: currentTheme.text,
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const addButtonStyles: React.CSSProperties = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    transform: 'translateY(0)',
  };

  const getTaskItemStyles = (task: Task): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    margin: '12px 0',
    backgroundColor: currentTheme.cardBackground,
    borderRadius: '12px',
    border: `1px solid ${currentTheme.border}`,
    borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
    boxShadow: currentTheme.shadow,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: deletingId === task.id ? 'translateX(-100%) scale(0.8)' : 'translateX(0) scale(1)',
    opacity: deletingId === task.id ? 0 : 1,
    animation: 'fadeInUp 0.4s ease-out',
  });

  const priorityBadgeStyles = (priority: number): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: getPriorityColor(priority),
    color: 'white',
    marginRight: '8px',
  });

  const categoryBadgeStyles = (category: string): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: getCategoryColor(category),
    color: 'white',
    marginRight: '12px',
  });

  const animationStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .add-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
    }

    .task-item:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(0,0,0,${darkMode ? '0.3' : '0.15'}) !important;
    }

    .delete-button:hover {
      transform: scale(1.05) !important;
      background-color: #ff3838 !important;
    }

    .dark-mode-button:hover {
      transform: rotate(180deg) !important;
      border-color: #667eea !important;
    }

    .task-input:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }
  `;

  const completedCount = tasks.filter(task => task.done).length;
  const totalCount = tasks.length;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={appStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>✨ タスク一覧</h1>
          <button
            className="dark-mode-button"
            style={darkModeButtonStyles}
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* 進捗表示 */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: currentTheme.text 
          }}>
            進捗: {completedCount}/{totalCount} 完了
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: currentTheme.border,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* フィルター */}
        <div style={filterContainerStyles}>
          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>🔍 フィルター:</label>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            style={selectStyles}
          >
            <option value="all">すべて</option>
            <option value="pending">未完了</option>
            <option value="completed">完了済み</option>
          </select>

          <select
            value={filterPriority || ''}
            onChange={(e) => setFilterPriority(e.target.value ? Number(e.target.value) : null)}
            style={selectStyles}
          >
            <option value="">全優先度</option>
            <option value="1">🔥 高</option>
            <option value="2">⚡ 中</option>
            <option value="3">💫 低</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={selectStyles}
          >
            <option value="">全カテゴリ</option>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.emoji} {config.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            style={selectStyles}
          >
            <option value="priority">優先度順</option>
            <option value="created_at">作成日順</option>
          </select>
        </div>
        
        {/* タスク追加フォーム */}
        <div style={inputContainerStyles}>
          <input
            className="task-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="新しいタスクを入力..."
            onKeyPress={handleKeyPress}
            style={inputStyles}
          />
          
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            style={{ ...selectStyles, ...inputStyles }}
          >
            <option value={1}>🔥 高</option>
            <option value={2}>⚡ 中</option>
            <option value={3}>💫 低</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...selectStyles, ...inputStyles }}
          >
            {Object.entries(categoryConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.emoji} {config.name}
              </option>
            ))}
          </select>

          <button 
            className="add-button"
            onClick={addTask}
            style={addButtonStyles}
          >
            ➕ 追加
          </button>
        </div>

        {/* タスクリスト */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tasks.map((task: Task) => (
            <li 
              key={task.id} 
              className="task-item"
              style={getTaskItemStyles(task)}
            >
              <input
                type="checkbox"
                checked={task.done || false}
                onChange={() => toggleTask(task.id)}
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  marginRight: '12px', 
                  cursor: 'pointer', 
                  accentColor: getPriorityColor(task.priority) 
                }}
              />
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={priorityBadgeStyles(task.priority)}>
                    {priorityConfig[task.priority as keyof typeof priorityConfig]?.emoji}
                    {priorityConfig[task.priority as keyof typeof priorityConfig]?.name}
                  </span>
                  <span style={categoryBadgeStyles(task.category)}>
                    {categoryConfig[task.category as keyof typeof categoryConfig]?.emoji}
                    {categoryConfig[task.category as keyof typeof categoryConfig]?.name}
                  </span>
                </div>
                
                {editingId === task.id ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                      onBlur={() => saveEdit(task.id)}
                      autoFocus
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '2px solid #667eea',
                        borderRadius: '6px',
                        fontSize: '16px',
                        backgroundColor: currentTheme.background,
                        color: currentTheme.text,
                        outline: 'none',
                      }}
                    />
                    <select
                      value={editingPriority}
                      onChange={(e) => setEditingPriority(Number(e.target.value))}
                      style={{ ...selectStyles, padding: '6px' }}
                    >
                      <option value={1}>🔥 高</option>
                      <option value={2}>⚡ 中</option>
                      <option value={3}>💫 低</option>
                    </select>
                    <select
                      value={editingCategory}
                      onChange={(e) => setEditingCategory(e.target.value)}
                      style={{ ...selectStyles, padding: '6px' }}
                    >
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.emoji} {config.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span 
                    onClick={() => startEditing(task)}
                    style={{ 
                      textDecoration: task.done ? 'line-through' : 'none',
                      color: task.done ? currentTheme.textSecondary : currentTheme.text,
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: task.done ? 'normal' : '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {task.title}
                  </span>
                )}
              </div>
              
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                style={{
                  marginLeft: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#ff4757',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                }}
                disabled={deletingId === task.id}
              >
                🗑️ 削除
              </button>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: currentTheme.textSecondary,
            fontSize: '18px',
            marginTop: '60px',
            animation: 'fadeIn 0.5s ease-out',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <p>タスクがありません</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              上の入力フィールドから新しいタスクを追加してください
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;