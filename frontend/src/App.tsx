import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  done: boolean | null;
  created_at: string;
  updated_at: string;
}

function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then(res => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  const addTask = (): void => {
    if (!title.trim()) return;
    
    fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: { title } })
    })
      .then(res => res.json())
      .then((newTask: Task) => {
        setTasks([newTask, ...tasks]);
        setTitle('');
      })
      .catch(err => console.error(err));
  };

  const deleteTask = (id: number): void => {
    fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(err => console.error(err));
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
  };

  const saveEdit = (id: number): void => {
    if (!editingTitle.trim()) return;
    
    fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: { title: editingTitle } })
    })
      .then(res => res.json())
      .then((updatedTask: Task) => {
        setTasks(tasks.map(task => 
          task.id === id ? updatedTask : task
        ));
        setEditingId(null);
        setEditingTitle('');
      })
      .catch(err => console.error(err));
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditingTitle('');
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

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>タスク一覧</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="新しいタスク"
          onKeyPress={handleKeyPress}
          style={{ 
            padding: '8px', 
            marginRight: '8px', 
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={addTask}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          追加
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task: Task) => (
          <li key={task.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px',
            margin: '5px 0',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #e9ecef'
          }}>
            <input
              type="checkbox"
              checked={task.done || false}
              onChange={() => toggleTask(task.id)}
              style={{ marginRight: '10px', cursor: 'pointer' }}
            />
            
            {editingId === task.id ? (
              <input
                value={editingTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
                onKeyPress={(e) => handleEditKeyPress(e, task.id)}
                onBlur={() => saveEdit(task.id)}
                autoFocus
                style={{
                  flex: 1,
                  padding: '4px',
                  border: '1px solid #007bff',
                  borderRadius: '2px'
                }}
              />
            ) : (
              <span 
                onClick={() => startEditing(task)}
                style={{ 
                  flex: 1, 
                  textDecoration: task.done ? 'line-through' : 'none',
                  color: task.done ? '#6c757d' : '#000',
                  cursor: 'pointer'
                }}
              >
                {task.title}
              </span>
            )}
            
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                marginLeft: '10px',
                padding: '4px 8px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6c757d' }}>
          タスクがありません。新しいタスクを追加してください。
        </p>
      )}
    </div>
  );
}

export default App;