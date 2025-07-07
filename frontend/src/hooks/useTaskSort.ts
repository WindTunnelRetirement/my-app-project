import { useState, useMemo } from 'react';
import { Task, Filters } from '../types';

export const useTaskSort = (tasks: Task[], filters: Filters, showCompleted: boolean) => {
  const [sortBy, setSortBy] = useState('priority');
  const [draggedTask, setDraggedTask] = useState<number | null>(null);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const { status, priority, category, search } = filters;
        return (status === 'all' || (status === 'completed' ? task.done : !task.done)) &&
               (showCompleted || !task.done) &&
               (!priority || task.priority === priority) &&
               (!category || task.category === category) &&
               (!search || task.title.toLowerCase().includes(search.toLowerCase()) || 
                task.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));
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
  }, [tasks, filters, showCompleted, sortBy]);

  return {
    sortBy,
    setSortBy,
    filteredAndSortedTasks,
    draggedTask,
    setDraggedTask
  };
};