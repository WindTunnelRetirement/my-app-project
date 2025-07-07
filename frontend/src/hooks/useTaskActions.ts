import { useState } from 'react';
import { Task } from '../types';

export const useTaskActions = (taskManager: any, sortBy: string, setSortBy: (sort: string) => void) => {
  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});

  // 編集関連の処理
  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditData({ 
      title: task.title, 
      priority: task.priority, 
      category: task.category, 
      dueDate: task.dueDate || '', 
      tags: task.tags.join(', ') 
    });
  };

  const saveEdit = (data: Partial<Task>) => {
    if (!data.title?.trim() || !editingId) {
      taskManager.addNotification('error', 'タスク名を入力してください');
      return;
    }
    const processedData = {
      ...data,
      tags: typeof data.tags === 'string' ? 
        data.tags.split(',').map(t => t.trim()).filter(Boolean) : 
        data.tags
    };
    taskManager.updateTask(editingId, processedData);
    setEditingId(null);
    setEditData({});
    taskManager.addNotification('success', 'タスクを更新しました！');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // ドラッグ&ドロップ処理
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.effectAllowed = 'move';
    // draggedTaskの設定は親コンポーネントで行う
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    // ドロップ処理は親コンポーネントで行う
  };

  // タスクタップ処理
  const handleTaskTap = (taskId: number, bulkMode: boolean, toggleTaskSelection: (id: number) => void) => {
    // バルクモードの場合は選択切り替え
    if (bulkMode) {
      toggleTaskSelection(taskId);
      return;
    }

    // 入れ替えモードの場合
    if (selectedForSwap === null) {
      setSelectedForSwap(taskId);
      taskManager.addNotification('info', 'もう1つのタスクをタップして入れ替え');
    } else if (selectedForSwap === taskId) {
      setSelectedForSwap(null);
      taskManager.addNotification('info', '選択を解除しました');
    } else {
      taskManager.moveTask(selectedForSwap, taskId);
      setSelectedForSwap(null);
      if (sortBy !== 'custom') {
        setSortBy('custom');
        taskManager.addNotification('info', 'カスタム順序に切り替えました');
      }
    }
  };

  return {
    selectedForSwap,
    editingId,
    editData,
    setEditData,
    startEdit,
    saveEdit,
    cancelEdit,
    handleDragStart,
    handleDrop,
    handleTaskTap
  };
};