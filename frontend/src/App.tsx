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
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "プロジェクトの企画書を作成", done: false, priority: 1, category: "work", created_at: "2024-01-01", updated_at: "2024-01-01" },
    { id: 2, title: "牛乳を買いに行く", done: true, priority: 3, category: "shopping", created_at: "2024-01-02", updated_at: "2024-01-02" },
    { id: 3, title: "ジムで運動する", done: false, priority: 2, category: "health", created_at: "2024-01-03", updated_at: "2024-01-03" }
  ]);
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<number>(2);
  const [category, setCategory] = useState<string>('general');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingPriority, setEditingPriority] = useState<number>(2);
  const [editingCategory, setEditingCategory] = useState<string>('general');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // フィルター状態
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('priority');

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

  const theme = {
    light: {
      background: '#f2f2f7',
      cardBackground: '#ffffff',
      text: '#000000',
      textSecondary: '#8e8e93',
      border: '#c6c6c8',
      inputBorder: '#c6c6c8',
      shadow: '0 1px 3px rgba(0,0,0,0.1)',
      filterBackground: '#ffffff',
      primaryColor: '#007AFF',
      successColor: '#34C759',
      destructiveColor: '#FF3B30',
      titleColor: '#007AFF'
    },
    dark: {
      background: '#000000',
      cardBackground: '#1c1c1e',
      text: '#ffffff',
      textSecondary: '#8e8e93',
      border: '#38383a',
      inputBorder: '#38383a',
      shadow: '0 1px 3px rgba(0,0,0,0.3)',
      filterBackground: '#1c1c1e',
      primaryColor: '#0A84FF',
      successColor: '#30D158',
      destructiveColor: '#FF453A',
      titleColor: '#0A84FF'
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  const addTask = (): void => {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),
      title,
      done: false,
      priority,
      category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setTasks([newTask, ...tasks]);
    setTitle('');
    setPriority(2);
    setCategory('general');
  };

  const deleteTask = (id: number): void => {
    setDeletingId(id);
    
    setTimeout(() => {
      setTasks(tasks.filter(task => task.id !== id));
      setDeletingId(null);
    }, 300);
  };

  const toggleTask = (id: number): void => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const startEditing = (task: Task): void => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingPriority(task.priority);
    setEditingCategory(task.category);
  };

  const saveEdit = (id: number): void => {
    if (!editingTitle.trim()) return;
    
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        title: editingTitle,
        priority: editingPriority,
        category: editingCategory,
        updated_at: new Date().toISOString()
      } : task
    ));
    
    setEditingId(null);
    setEditingTitle('');
    setEditingPriority(2);
    setEditingCategory('general');
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
    return priorityConfig[priority as keyof typeof priorityConfig]?.color || '#8e8e93';
  };

  const getCategoryColor = (category: string): string => {
    return categoryConfig[category as keyof typeof categoryConfig]?.color || '#6c5ce7';
  };

  // フィルタリング処理
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'completed' && !task.done) return false;
    if (filterStatus === 'pending' && task.done) return false;
    if (filterPriority && task.priority !== filterPriority) return false;
    if (filterCategory && task.category !== filterCategory) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      return a.priority - b.priority;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const completedCount = tasks.filter(task => task.done).length;
  const totalCount = tasks.length;

  return (
    <div style={{
      backgroundColor: currentTheme.background,
      color: currentTheme.text,
      minHeight: '100vh',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'max(16px, env(safe-area-inset-left))',
      paddingRight: 'max(16px, env(safe-area-inset-right))',
      transition: 'all 0.3s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0',
        borderBottom: `1px solid ${currentTheme.border}`,
        marginBottom: '20px',
        position: 'sticky',
        top: 0,
        backgroundColor: currentTheme.background,
        zIndex: 10,
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: '700',
          color: currentTheme.titleColor,
          textShadow: darkMode ? '0 0 10px rgba(10, 132, 255, 0.3)' : '0 0 10px rgba(0, 122, 255, 0.2)',
        }}>
          ✨ タスク
        </h1>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '12px',
              backgroundColor: showFilters ? currentTheme.primaryColor : 'transparent',
              border: `2px solid ${currentTheme.border}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              color: showFilters ? 'white' : currentTheme.text,
              transition: 'all 0.3s ease',
              minWidth: '44px',
              minHeight: '44px',
            }}
          >
            🔍
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '12px',
              backgroundColor: 'transparent',
              border: `2px solid ${currentTheme.border}`,
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              color: currentTheme.text,
              transition: 'all 0.3s ease',
              minWidth: '44px',
              minHeight: '44px',
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* 進捗表示 */}
      <div style={{
        padding: '20px',
        backgroundColor: currentTheme.cardBackground,
        borderRadius: '16px',
        marginBottom: '20px',
        border: `1px solid ${currentTheme.border}`,
        boxShadow: currentTheme.shadow,
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '12px',
          textAlign: 'center',
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
            backgroundColor: currentTheme.successColor,
            transition: 'width 0.3s ease',
            borderRadius: '4px',
          }} />
        </div>
      </div>

      {/* フィルター (モバイル対応) */}
      {showFilters && (
        <div style={{
          backgroundColor: currentTheme.cardBackground,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          border: `1px solid ${currentTheme.border}`,
          boxShadow: currentTheme.shadow,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: `1px solid ${currentTheme.inputBorder}`,
                backgroundColor: currentTheme.background,
                color: currentTheme.text,
                fontSize: '16px',
                minHeight: '44px',
              }}
            >
              <option value="all">すべて</option>
              <option value="pending">未完了</option>
              <option value="completed">完了済み</option>
            </select>

            <select
              value={filterPriority || ''}
              onChange={(e) => setFilterPriority(e.target.value ? Number(e.target.value) : null)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: `1px solid ${currentTheme.inputBorder}`,
                backgroundColor: currentTheme.background,
                color: currentTheme.text,
                fontSize: '16px',
                minHeight: '44px',
              }}
            >
              <option value="">全優先度</option>
              <option value="1">🔥 高</option>
              <option value="2">⚡ 中</option>
              <option value="3">💫 低</option>
            </select>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: `1px solid ${currentTheme.inputBorder}`,
                backgroundColor: currentTheme.background,
                color: currentTheme.text,
                fontSize: '16px',
                minHeight: '44px',
              }}
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
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: `1px solid ${currentTheme.inputBorder}`,
                backgroundColor: currentTheme.background,
                color: currentTheme.text,
                fontSize: '16px',
                minHeight: '44px',
              }}
            >
              <option value="priority">優先度順</option>
              <option value="created_at">作成日順</option>
            </select>
          </div>
        </div>
      )}
      
      {/* タスク追加フォーム (モバイル最適化) */}
      <div style={{
        backgroundColor: currentTheme.cardBackground,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: `1px solid ${currentTheme.border}`,
        boxShadow: currentTheme.shadow,
      }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          onKeyPress={handleKeyPress}
          style={{
            width: '100%',
            padding: '16px',
            border: `2px solid ${currentTheme.inputBorder}`,
            borderRadius: '12px',
            fontSize: '17px',
            backgroundColor: currentTheme.background,
            color: currentTheme.text,
            outline: 'none',
            marginBottom: '12px',
            minHeight: '44px',
            boxSizing: 'border-box',
          }}
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: `1px solid ${currentTheme.inputBorder}`,
              backgroundColor: currentTheme.background,
              color: currentTheme.text,
              fontSize: '16px',
              minHeight: '44px',
            }}
          >
            <option value={1}>🔥 高</option>
            <option value={2}>⚡ 中</option>
            <option value={3}>💫 低</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: `1px solid ${currentTheme.inputBorder}`,
              backgroundColor: currentTheme.background,
              color: currentTheme.text,
              fontSize: '16px',
              minHeight: '44px',
            }}
          >
            {Object.entries(categoryConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.emoji} {config.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={addTask}
          disabled={!title.trim()}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: title.trim() ? currentTheme.primaryColor : currentTheme.border,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: '600',
            cursor: title.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            minHeight: '50px',
          }}
        >
          ➕ タスクを追加
        </button>
      </div>

      {/* タスクリスト */}
      <div>
        {filteredTasks.map((task: Task) => (
          <div 
            key={task.id}
            style={{
              backgroundColor: currentTheme.cardBackground,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '12px',
              border: `1px solid ${currentTheme.border}`,
              borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
              boxShadow: currentTheme.shadow,
              transition: 'all 0.3s ease',
              transform: deletingId === task.id ? 'translateX(-100%)' : 'translateX(0)',
              opacity: deletingId === task.id ? 0 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <button
                onClick={() => toggleTask(task.id)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: `2px solid ${task.done ? currentTheme.successColor : currentTheme.border}`,
                  backgroundColor: task.done ? currentTheme.successColor : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0,
                  marginTop: '2px',
                  minWidth: '44px',
                  minHeight: '44px',
                }}
              >
                {task.done && '✓'}
              </button>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: '8px', 
                  marginBottom: '12px' 
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: getPriorityColor(task.priority),
                    color: 'white',
                  }}>
                    {priorityConfig[task.priority as keyof typeof priorityConfig]?.emoji}
                    {priorityConfig[task.priority as keyof typeof priorityConfig]?.name}
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: getCategoryColor(task.category),
                    color: 'white',
                  }}>
                    {categoryConfig[task.category as keyof typeof categoryConfig]?.emoji}
                    {categoryConfig[task.category as keyof typeof categoryConfig]?.name}
                  </span>
                </div>
                
                {editingId === task.id ? (
                  <div style={{ marginBottom: '12px' }}>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                      onBlur={() => saveEdit(task.id)}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${currentTheme.primaryColor}`,
                        borderRadius: '8px',
                        fontSize: '17px',
                        backgroundColor: currentTheme.background,
                        color: currentTheme.text,
                        outline: 'none',
                        marginBottom: '8px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                    }}>
                      <select
                        value={editingPriority}
                        onChange={(e) => setEditingPriority(Number(e.target.value))}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          border: `1px solid ${currentTheme.inputBorder}`,
                          backgroundColor: currentTheme.background,
                          color: currentTheme.text,
                          fontSize: '14px',
                        }}
                      >
                        <option value={1}>🔥 高</option>
                        <option value={2}>⚡ 中</option>
                        <option value={3}>💫 低</option>
                      </select>
                      <select
                        value={editingCategory}
                        onChange={(e) => setEditingCategory(e.target.value)}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          border: `1px solid ${currentTheme.inputBorder}`,
                          backgroundColor: currentTheme.background,
                          color: currentTheme.text,
                          fontSize: '14px',
                        }}
                      >
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.emoji} {config.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => startEditing(task)}
                    style={{ 
                      fontSize: '17px',
                      fontWeight: task.done ? '400' : '500',
                      textDecoration: task.done ? 'line-through' : 'none',
                      color: task.done ? currentTheme.textSecondary : currentTheme.text,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {task.title}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => saveEdit(task.id)}
                    style={{
                      display: editingId === task.id ? 'block' : 'none',
                      padding: '8px 16px',
                      backgroundColor: currentTheme.successColor,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      minHeight: '36px',
                    }}
                  >
                    保存
                  </button>
                  <button
                    onClick={() => cancelEdit()}
                    style={{
                      display: editingId === task.id ? 'block' : 'none',
                      padding: '8px 16px',
                      backgroundColor: currentTheme.textSecondary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      minHeight: '36px',
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  padding: '12px',
                  backgroundColor: currentTheme.destructiveColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  minWidth: '44px',
                  minHeight: '44px',
                }}
                disabled={deletingId === task.id}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: currentTheme.textSecondary,
          fontSize: '17px',
          marginTop: '60px',
          padding: '40px 20px',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
          <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
            {tasks.length === 0 ? 'タスクがありません' : 'フィルター条件に一致するタスクがありません'}
          </p>
          <p style={{ fontSize: '15px', opacity: 0.7, margin: 0 }}>
            {tasks.length === 0 ? '新しいタスクを追加してください' : 'フィルターを変更してみてください'}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;