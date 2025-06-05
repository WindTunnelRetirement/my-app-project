import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  const addTask = () => {
    if (!title.trim()) return;
    
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: { title } })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask]);
        setTitle('');
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>タスク一覧</h1>
      <ul>
        {tasks.map(t => <li key={t.id}>{t.title}</li>)}
      </ul>
      <div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="新しいタスク"
          onKeyPress={e => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>追加</button>
      </div>
    </div>
  );
}

export default App;