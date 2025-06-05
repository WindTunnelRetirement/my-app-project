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

  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  const addTask = (): void => {
    if (!title.trim()) return;
    
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: { title } })
    })
      .then(res => res.json())
      .then((newTask: Task) => {
        setTasks([...tasks, newTask]);
        setTitle('');
      })
      .catch(err => console.error(err));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>タスク一覧</h1>
      <ul>
        {tasks.map((t: Task) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
      <div>
        <input
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="新しいタスク"
          onKeyPress={handleKeyPress}
        />
        <button onClick={addTask}>追加</button>
      </div>
    </div>
  );
}

export default App;