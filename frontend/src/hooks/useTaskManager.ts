import { useState, useCallback } from 'react';
import { Task, NewTask, Filters, Notification } from '../types';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({ 
    title: '', 
    priority: 3, 
    category: 'general', 
    dueDate: '', 
    tags: '' 
  });
  const [filters, setFilters] = useState<Filters>({ 
    status: 'all', 
    priority: null, 
    category: '', 
    search: '' 
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: 'success' | 'error' | 'info', message: string, duration = 1000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message, timestamp: id }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), duration);
  }, []);

  const updateTask = useCallback((id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
    ));
    if (updates.done !== undefined) {
      addNotification('success', updates.done ? 'タスクを完了しました！' : 'タスクを未完了に戻しました');
    }
  }, [addNotification]);

  const deleteTask = useCallback((id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    addNotification('info', 'タスクを削除しました');
  }, [addNotification]);

  const addTask = useCallback(() => {
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
  }, [newTask, addNotification]);

  const moveTask = useCallback((sourceId: number, targetId: number) => {
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
    
    addNotification('success', 'タスクを入れ替えました！');
  }, [addNotification]);

  return {
    tasks,
    setTasks,
    newTask,
    setNewTask,
    filters,
    setFilters,
    notifications,
    setNotifications,
    addTask,
    updateTask,
    deleteTask,
    addNotification,
    moveTask
  };
};