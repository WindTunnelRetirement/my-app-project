import { useState, useCallback } from 'react';
import { Task } from '../types';

export const useBulkOperations = (
  tasks: Task[],
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void,
  updateTask: (id: number, updates: Partial<Task>) => void,
  addNotification: (type: 'success' | 'error' | 'info', message: string) => void
) => {
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

  const bulkDelete = useCallback(() => {
    const count = selectedTasks.size;
    setTasks(prev => prev.filter(t => !selectedTasks.has(t.id)));
    setSelectedTasks(new Set());
    addNotification('info', `${count}個のタスクを削除しました`);
  }, [selectedTasks, setTasks, addNotification]);

  const bulkToggle = useCallback(() => {
    const allCompleted = Array.from(selectedTasks).every(id => 
      tasks.find(t => t.id === id)?.done
    );
    selectedTasks.forEach(id => updateTask(id, { done: !allCompleted }));
    setSelectedTasks(new Set());
    addNotification('success', `${selectedTasks.size}個のタスクを${allCompleted ? '未完了' : '完了'}にしました`);
  }, [selectedTasks, tasks, updateTask, addNotification]);

  const exitBulkMode = useCallback(() => {
    setSelectedTasks(new Set());
    setBulkMode(false);
  }, []);

  const toggleTaskSelection = useCallback((taskId: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  }, [selectedTasks]);

  return {
    bulkMode,
    setBulkMode,
    selectedTasks,
    setSelectedTasks,
    bulkDelete,
    bulkToggle,
    exitBulkMode,
    toggleTaskSelection
  };
};