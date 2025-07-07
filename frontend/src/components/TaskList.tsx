import React from 'react';
import { Task, Theme } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  taskManager: any;
  bulkOperations: any;
  theme: Theme;
  styles: any;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  taskManager,
  bulkOperations,
  theme,
  styles
}) => {
  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={taskManager.updateTask}
          onDelete={taskManager.deleteTask}
          onTap={taskManager.handleTaskTap}
          onDragStart={taskManager.handleDragStart}
          onDrop={taskManager.handleDrop}
          bulkMode={bulkOperations.bulkMode}
          isSelected={bulkOperations.selectedTasks.has(task.id)}
          selectedForSwap={taskManager.selectedForSwap}
          theme={theme}
          styles={styles}
          isEditing={taskManager.editingId === task.id}
          editData={taskManager.editData}
          onStartEdit={() => taskManager.startEdit(task)}
          onSaveEdit={taskManager.saveEdit}
          onCancelEdit={taskManager.cancelEdit}
          onEditDataChange={taskManager.setEditData}
        />
      ))}
    </div>
  );
};