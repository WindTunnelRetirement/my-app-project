import React from 'react';
import { Task, Theme } from '../types';
import { createStyles } from '../styles/theme';
import { TaskProgress } from './TaskProgress';
import { TaskFilters } from './TaskFilters';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { SwapModeIndicator } from './SwapModeIndicator';
import { BulkOperations } from './BulkOperations';

interface TaskManagerProps {
  taskManager: any;
  sortedTasks: Task[];
  bulkOperations: any;
  showFilters: boolean;
  completedCount: number;
  theme: Theme;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  taskManager,
  sortedTasks,
  bulkOperations,
  showFilters,
  completedCount,
  theme
}) => {
  const styles = createStyles(theme);

  return (
    <>
      <TaskProgress 
        completedCount={completedCount}
        totalCount={taskManager.tasks.length}
        theme={theme}
        styles={styles}
      />

      {showFilters && (
        <TaskFilters
          filters={taskManager.filters}
          setFilters={taskManager.setFilters}
          sortBy={taskManager.sortBy}
          setSortBy={taskManager.setSortBy}
          showCompleted={taskManager.showCompleted}
          setShowCompleted={taskManager.setShowCompleted}
          theme={theme}
          styles={styles}
        />
      )}

      <SwapModeIndicator 
        selectedForSwap={taskManager.selectedForSwap}
        theme={theme}
        styles={styles}
      />

      <BulkOperations 
        bulkOperations={bulkOperations}
        theme={theme}
        styles={styles}
      />

      <TaskForm
        newTask={taskManager.newTask}
        setNewTask={taskManager.setNewTask}
        onAddTask={taskManager.addTask}
        theme={theme}
        styles={styles}
      />

      <TaskList
        tasks={sortedTasks}
        taskManager={taskManager}
        bulkOperations={bulkOperations}
        theme={theme}
        styles={styles}
      />
    </>
  );
};