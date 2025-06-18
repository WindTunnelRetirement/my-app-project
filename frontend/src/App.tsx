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
  customOrder?: number;
}

interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', priority: 2, category: 'general', dueDate: '', tags: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', priority: null, category: '', search: '' });
  const [sortBy, setSortBy] = useState('priority');
  const [draggedTask, setDraggedTask] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);

  const configs = {
    priority: { 1: { name: '高', color: '#ff4757', emoji: '🔥' }, 2: { name: '中', color: '#ffa502', emoji: '⚡' }, 3: { name: '低', color: '#5352ed', emoji: '💫' } },
    category: { general: { name: '一般', color: '#6c5ce7', emoji: '📝' }, work: { name: '仕事', color: '#00b894', emoji: '💼' }, personal: { name: 'プライベート', color: '#fd79a8', emoji: '🏠' }, shopping: { name: '買い物', color: '#fdcb6e', emoji: '🛒' }, health: { name: '健康', color: '#00cec9', emoji: '💪' } }
  };

// テーマ設定を以下に置き換え
const theme = {
  background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0e4b99 100%)',
  card: 'rgba(255, 255, 255, 0.05)',
  cardHover: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  border: 'rgba(255, 255, 255, 0.1)',
  primary: '#64b5f6',
  success: '#81c784',
  destructive: '#e57373',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  glassMorphism: 'backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);'
};

// スタイル設定も更新
const styles = {
  input: { 
    width: '100%', 
    padding: '12px', 
    border: `1px solid ${theme.border}`, 
    borderRadius: '12px', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: theme.text, 
    fontSize: '16px', 
    boxSizing: 'border-box' as const, 
    outline: 'none', 
    minHeight: '44px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
    appearance: 'none'
  },
  button: (variant: 'primary' | 'secondary' | 'danger' = 'primary') => ({ 
    padding: '12px 16px', 
    border: 'none', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: '600', 
    minHeight: '44px', 
    backgroundColor: variant === 'primary' ? theme.primary : variant === 'danger' ? theme.destructive : 'rgba(255, 255, 255, 0.1)', 
    color: 'white',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    border: `1px solid ${variant === 'secondary' ? theme.border : 'transparent'}`
  }),
  card: { 
    backgroundColor: theme.card, 
    borderRadius: '20px', 
    padding: '24px', 
    marginBottom: '20px', 
    boxShadow: theme.shadow,
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: `1px solid ${theme.border}`,
    transition: 'all 0.3s ease'
  }
};

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
}

// 星空エフェクト用のコンポーネントを追加（メインコンポーネント内の最初に配置）
const StarField = () => {
  const [stars, setStars] = useState<Star[]>([]);

  // ローディング画面用のuseEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5秒のローディング時間

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // if (darkMode) の条件分岐を削除して、常に星を表示
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleDelay: Math.random() * 2
    }));
    setStars(newStars);
  }, []);
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0
    }}>

      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            opacity: star.opacity,
            animation: `twinkle 2s infinite ${star.twinkleDelay}s ease-in-out alternate`,
          }}
        />
      ))}
    </div>
  );
};

// ローディング画面コンポーネント
const LoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: theme.background,
      color: theme.text,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeOut 0.8s ease-in-out 1.7s forwards'
    }}>
      <StarField />
      
      {/* メインロゴ */}
      <div style={{
        fontSize: '4rem',
        fontWeight: '700',
        color: theme.primary,
        marginBottom: '2rem',
        textShadow: `0 0 30px ${theme.primary}40`,
        animation: 'glow 2s ease-in-out infinite alternate'
      }}>
        Focus
      </div>

      {/* サブタイトル */}
      <div style={{
        fontSize: '1.2rem',
        color: theme.textSecondary,
        marginBottom: '3rem',
        opacity: 0.8,
        animation: 'slideUp 1s ease-out 0.5s both'
      }}>
        星空の下でタスクを整理
      </div>

      {/* ローディングインジケーター */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        animation: 'slideUp 1s ease-out 1s both'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${theme.border}`,
          borderTop: `3px solid ${theme.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        
        <div style={{
          fontSize: '1rem',
          color: theme.textSecondary,
          minWidth: '100px'
        }}>
          読み込み中{dots}
        </div>
      </div>

      {/* 装飾的な要素 */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        display: 'flex',
        gap: '2rem',
        animation: 'slideUp 1s ease-out 1.5s both'
      }}>
        {['📝', '⭐', '🌙'].map((emoji, i) => (
          <div key={i} style={{
            fontSize: '2rem',
            opacity: 0.5,
            animation: `float 3s ease-in-out infinite ${i * 0.5}s`
          }}>
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

  const addNotification = (type: 'success' | 'error' | 'info', message: string, duration = 1000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message, timestamp: id }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), duration);
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
      customOrder: Date.now()
    };
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', priority: newTask.priority, category: newTask.category, dueDate: '', tags: '' });
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

  // デスクトップ用ドラッグ&ドロップ
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    moveTask(draggedTask, targetId);
  };

  // モバイル用タッチイベント
const handleTaskTap = (taskId: number) => {
  // バルクモードの場合は選択切り替えのみ
  if (bulkMode) {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
    return;
  }

  // 入れ替えモードの場合のみ処理
  if (selectedForSwap === null) {
    setSelectedForSwap(taskId);
    addNotification('info', 'もう1つのタスクをタップして入れ替え');
  } else if (selectedForSwap === taskId) {
    setSelectedForSwap(null);
    addNotification('info', '選択を解除しました');
  } else {
    moveTask(selectedForSwap, taskId);
    setSelectedForSwap(null);
  }
};

// moveTask関数は既存のものをそのまま使用（ドラッグ関連のパラメータ名は変更）
const moveTask = (sourceId: number, targetId: number) => {
  if (!sourceId || sourceId === targetId) return;
  
  setTasks(prev => {
    const sourceIndex = prev.findIndex(t => t.id === sourceId);
    const targetIndex = prev.findIndex(t => t.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return prev;
    
    const newTasks = [...prev];
    const [sourceItem] = newTasks.splice(sourceIndex, 1);
    newTasks.splice(targetIndex, 0, sourceItem);
    
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      customOrder: Date.now() + index
    }));
    
    return updatedTasks;
  });
  
  if (sortBy !== 'custom') {
    setSortBy('custom');
    addNotification('info', 'カスタム順序に切り替えました');
  } else {
    addNotification('success', 'タスクを入れ替えました！');
  }
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
      if (sortBy === 'custom') {
        return (a.customOrder || 0) - (b.customOrder || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const isOverdue = (dueDate?: string) => dueDate && new Date(dueDate) < new Date();
  const completedCount = tasks.filter(t => t.done).length;

  useEffect(() => {
    document.documentElement.style.background = theme.background;
    document.body.style.background = theme.background;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, []);

  // ローディング中の場合
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ 
      background: theme.background, 
      color: theme.text, 
      minHeight: '100vh', 
      width: '100%', 
      padding: '16px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', 
      position: 'relative', 
      boxSizing: 'border-box',
      animation: 'fadeIn 0.8s ease-in-out'
    }}>
      <StarField />
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
        <h1 style={{ margin: 0, color: theme.primary, fontSize: '28px' }}>Focus</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { icon: '🔍', action: () => setShowFilters(!showFilters), active: showFilters },
            { icon: '☑️', action: () => setBulkMode(!bulkMode), active: bulkMode }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* 円形進捗 */}
          <div style={{ position: 'relative', width: '60px', height: '60px' }}>
            <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="30" cy="30" r="25" fill="none" stroke={theme.border} strokeWidth="4"/>
              <circle 
                cx="30" cy="30" r="25" fill="none" 
                stroke={theme.success} strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * (1 - (tasks.length ? completedCount / tasks.length : 0))}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%
            </div>
          </div>
          
          {/* 情報 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              {completedCount}/{tasks.length} 完了
            </div>
            <div style={{ fontSize: '13px', color: theme.textSecondary }}>
              {tasks.length === completedCount && tasks.length > 0 ? 
                '🎉 お疲れ様でした！' : 
                `今日の目標まであと ${Math.max(0, tasks.length - completedCount)} 個`
              }
            </div>
          </div>
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
              {[['priority', '優先度順'], ['created_at', '作成日順'], ['dueDate', '期限順'], ['custom', 'カスタム順序']].map(([value, label]) => 
                <option key={value} value={value}>{label}</option>
              )}
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />完了済みを表示
          </label>
          {sortBy !== 'custom' && (
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: theme.border, borderRadius: '4px', fontSize: '12px', color: theme.textSecondary }}>
              💡 ヒント: タスクを長押し→他のタスクをタップして移動（モバイル）、ドラッグ&ドロップで移動（PC）
            </div>
          )}
        </div>
      )}

      {selectedForSwap && (
        <div style={{ 
          ...styles.card, 
          backgroundColor: theme.primary, 
          color: 'white', 
          textAlign: 'center',
          animation: 'pulse 1.5s infinite'
        }}>
          🔄 入れ替え先のタスクをタップしてください
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
                style={{
                  ...styles.input, 
                  colorScheme: 'dark',
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                  appearance: 'none',
                  position: 'relative',
                  paddingRight: '40px'
                }} />
        </div>
        <input placeholder="タグ (カンマ区切り)" value={newTask.tags} onChange={(e) => setNewTask({...newTask, tags: e.target.value})} style={{...styles.input, marginBottom: '12px'}} />
        <button onClick={addTask} disabled={!newTask.title.trim()} style={{...styles.button('primary'), width: '100%', minHeight: '48px'}}>➕ タスクを追加</button>
      </div>

      {/* タスクリスト */}
      <div>
        {filteredTasks.map(task => (
          <div key={task.id} 
               data-taskid={task.id}
               onClick={() => handleTaskTap(task.id)}
               draggable
               onDragStart={(e) => handleDragStart(e, task.id)}
               onDrop={(e) => handleDrop(e, task.id)}
               onDragOver={(e) => e.preventDefault()}
               style={{ 
                  background: theme.card,
                  borderRadius: '20px', 
                  padding: '20px', 
                  marginBottom: '16px', 
                  borderLeft: `4px solid ${configs.priority[task.priority as keyof typeof configs.priority]?.color}`, 
                  boxShadow: theme.shadow,
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  border: `1px solid ${selectedForSwap === task.id ? theme.primary : theme.border}`,
                  cursor: 'pointer', 
                  transform: selectedForSwap === task.id ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1
               }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {bulkMode && <input type="checkbox" checked={selectedTasks.has(task.id)} onChange={(e) => { 
                const newSelected = new Set(selectedTasks); 
                e.target.checked ? newSelected.add(task.id) : newSelected.delete(task.id); 
                setSelectedTasks(newSelected); 
              }} style={{ marginTop: '4px' }} />}
              
              <button onClick={(e) => { e.stopPropagation(); updateTask(task.id, { done: !task.done }); }} 
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
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
                           style={{...styles.input, marginBottom: '8px', colorScheme: 'dark'}} />
                    <input placeholder="タグ (カンマ区切り)" value={editData.tags || ''} onChange={(e) => setEditData({...editData, tags: e.target.value})} style={{...styles.input, marginBottom: '8px'}} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={(e) => { e.stopPropagation(); saveEdit(); }} style={styles.button('primary')}>保存</button>
                      <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} style={styles.button('secondary')}>キャンセル</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '20px', fontWeight: '600', textDecoration: task.done ? 'line-through' : 'none', color: task.done ? theme.textSecondary : theme.text, marginBottom: '8px', lineHeight: '1.4' }}>
                    {task.title}
                  </div>
                )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); startEdit(task); }} style={{...styles.button('secondary'), padding: '8px', flexShrink: 0, marginRight: '8px'}}>✏️</button>
              <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} style={{...styles.button('danger'), padding: '8px', flexShrink: 0}}>🗑️</button>
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          to { opacity: 0; pointer-events: none; }
        }
        @keyframes glow {
          0% { text-shadow: 0 0 30px rgba(100, 181, 246, 0.3); }
          100% { text-shadow: 0 0 50px rgba(100, 181, 246, 0.6), 0 0 70px rgba(100, 181, 246, 0.3); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        input, textarea, select {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
        select {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }
        select option {
          background-color: #1a1a2e !important;
          color: #ffffff !important;
          padding: 8px !important;
        }
        select option:checked {
          background-color: #64b5f6 !important;
          color: #ffffff !important;
        }

        input[type="date"] {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          padding: 12px !important;
          font-size: 16px !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
          font-variant-numeric: tabular-nums !important;
          position: relative !important;
          /* デスクトップでのみappearanceを調整 */
        }

        /* デスクトップ（大画面）での表示調整 */
        @media (min-width: 768px) {
          input[type="date"] {
            -webkit-appearance: none !important;
            -moz-appearance: textfield !important;
            appearance: none !important;
          }
        }

        /* iOS Safari専用の調整 */
        @media (max-width: 767px) {
          input[type="date"] {
            /* iOSでのネイティブ表示を優先 */
            -webkit-appearance: textfield !important;
            appearance: textfield !important;
            
            /* 基本スタイル */
            background-color: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 12px !important;
            padding: 14px 16px !important;
            font-size: 16px !important;
            color: #ffffff !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            
            /* iOSでのテキスト表示を強制 */
            -webkit-text-fill-color: #ffffff !important;
            -webkit-opacity: 1 !important;
            opacity: 1 !important;
            
            /* フォーカス時のスタイル */
            outline: none !important;
            transition: all 0.3s ease !important;
          }
          
          input[type="date"]:focus {
            border-color: #64b5f6 !important;
            box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2) !important;
          }
          
          /* iOS Safariでの日付表示部分の調整 */
          input[type="date"]::-webkit-datetime-edit {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            opacity: 1 !important;
            -webkit-opacity: 1 !important;
            padding: 0 !important;
            font-size: 16px !important;
            line-height: 1.4 !important;
            display: inline-block !important;
          }
          
          input[type="date"]::-webkit-datetime-edit-fields-wrapper {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            opacity: 1 !important;
            -webkit-opacity: 1 !important;
          }
          
          input[type="date"]::-webkit-datetime-edit-year-field {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            font-weight: 500 !important;
            opacity: 1 !important;
            -webkit-opacity: 1 !important;
          }
          
          input[type="date"]::-webkit-datetime-edit-month-field {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            font-weight: 500 !important;
            opacity: 1 !important;
            -webkit-opacity: 1 !important;
          }
          
          input[type="date"]::-webkit-datetime-edit-day-field {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            font-weight: 500 !important;
            opacity: 1 !important;
            -webkit-opacity: 1 !important;
          }
          
          input[type="date"]::-webkit-datetime-edit-text {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
            font-weight: 400 !important;
            opacity: 1 !important;
            -webkit-opacity: 1 !important;
          }
          
          /* カレンダーピッカーアイコンの調整 */
          input[type="date"]::-webkit-calendar-picker-indicator {
            color: #ffffff !important;
            background: transparent !important;
            cursor: pointer !important;
            font-size: 16px !important;
            opacity: 0.7 !important;
            margin-left: 8px !important;
            filter: invert(1) !important;
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator:hover {
            opacity: 1 !important;
          }
          
          /* 値が設定されていない場合の表示調整 */
          input[type="date"]:not(:focus):not([value]):not(:invalid) {
            color: #b0b0b0 !important;
            -webkit-text-fill-color: #b0b0b0 !important;
          }
          
          /* プレースホルダー風の表示（iOS Safari用） */
          input[type="date"]:not([value]):before {
            content: "期限日を選択" !important;
            color: #b0b0b0 !important;
            -webkit-text-fill-color: #b0b0b0 !important;
            position: absolute !important;
            left: 16px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            pointer-events: none !important;
            font-size: 16px !important;
          }
          
          /* 値が設定されている場合はプレースホルダーを非表示 */
          input[type="date"][value]:before,
          input[type="date"]:focus:before {
            display: none !important;
          }
        }
        
        /* iOS Safari 15+での追加調整 */
        @supports (-webkit-touch-callout: none) {
          @media (max-width: 767px) {
            input[type="date"] {
              /* iOS Safari固有の調整 */
              -webkit-text-fill-color: #ffffff !important;
              color: #ffffff !important;
              opacity: 1 !important;
              -webkit-opacity: 1 !important;
              
              /* 背景を再調整 */
              background-color: rgba(255, 255, 255, 0.1) !important;
              background-image: none !important;
            }
            
            /* iOS Safariでの全ての日付関連要素を白色に */
            input[type="date"]::-webkit-datetime-edit,
            input[type="date"]::-webkit-datetime-edit-fields-wrapper,
            input[type="date"]::-webkit-datetime-edit-year-field,
            input[type="date"]::-webkit-datetime-edit-month-field,
            input[type="date"]::-webkit-datetime-edit-day-field,
            input[type="date"]::-webkit-datetime-edit-text {
              color: #ffffff !important;
              -webkit-text-fill-color: #ffffff !important;
              opacity: 1 !important;
              -webkit-opacity: 1 !important;
              text-shadow: none !important;
              background: transparent !important;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default App;