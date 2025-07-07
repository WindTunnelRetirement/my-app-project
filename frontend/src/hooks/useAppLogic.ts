import { useState, useEffect } from 'react';
import { Task } from '../types';
import { theme } from '../styles/theme';
import { useTaskManager } from './useTaskManager';
import { useTaskSort } from './useTaskSort';
import { useBulkOperations } from './useBulkOperations';
import { useTaskActions } from './useTaskActions';

export const useAppLogic = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  const taskManager = useTaskManager();
  const { sortBy, setSortBy, filteredAndSortedTasks, draggedTask, setDraggedTask } = useTaskSort(
    taskManager.tasks, 
    taskManager.filters, 
    showCompleted
  );
  const bulkOperations = useBulkOperations(
    taskManager.tasks, 
    taskManager.setTasks, 
    taskManager.updateTask, 
    taskManager.addNotification
  );
  const taskActions = useTaskActions(taskManager, sortBy, setSortBy);

  // ローディング画面
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // 背景スタイル設定
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

  // 統計情報
  const completedCount = taskManager.tasks.filter(t => t.done).length;

  return {
    isLoading,
    taskManager: {
      ...taskManager,
      ...taskActions,
      sortBy,
      setSortBy,
      showCompleted,
      setShowCompleted,
      draggedTask,
      setDraggedTask
    },
    sortedTasks: filteredAndSortedTasks,
    bulkOperations,
    showFilters,
    setShowFilters,
    completedCount
  };
};