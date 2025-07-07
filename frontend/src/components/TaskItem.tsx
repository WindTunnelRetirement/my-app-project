import React, { useState } from 'react';
import { Task } from '../types';
import { configs } from '../constants/configs';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  onDelete: (id: number) => void;
  onTap: (id: number) => void;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onDrop: (e: React.DragEvent, targetId: number) => void;
  bulkMode: boolean;
  isSelected: boolean;
  selectedForSwap: number | null;
  theme: any;
  styles: any;
  isEditing: boolean;
  editData: Partial<Task>;
  onStartEdit: () => void;
  onSaveEdit: (data: Partial<Task>) => void;
  onCancelEdit: () => void;
  onEditDataChange: (data: Partial<Task>) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdate,
  onDelete,
  onTap,
  onDragStart,
  onDrop,
  bulkMode,
  isSelected,
  selectedForSwap,
  theme,
  styles,
  isEditing,
  editData,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditDataChange
}) => {
  const isOverdue = (dueDate?: string) => dueDate && new Date(dueDate) < new Date();

  const selectStyle = {
    ...styles.input,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    color: '#ffffff',
    backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="%23ffffff" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px'
  };

  const dateInputStyle = {
    ...styles.input,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    color: '#ffffff',
    colorScheme: 'dark',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
    appearance: 'none',
    position: 'relative',
    paddingRight: '40px'
  };

  const handleBulkSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    // この処理は親コンポーネントで行われるため、ここでは何もしない
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSaveEdit(editData);
    }
  };

  return (
    <div
      data-taskid={task.id}
      onClick={() => onTap(task.id)}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDrop={(e) => onDrop(e, task.id)}
      onDragOver={(e) => e.preventDefault()}
      style={{
        background: theme.card,
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px',
        borderLeft: `4px solid ${configs.priority[task.priority as keyof typeof configs.priority]?.color}`,
        boxShadow: theme.shadow,
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: `1px solid ${selectedForSwap === task.id ? theme.primary : theme.border}`,
        cursor: 'pointer',
        transform: selectedForSwap === task.id ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* バルクモード用チェックボックス */}
        {bulkMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleBulkSelection}
            style={{ marginTop: '4px' }}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* 完了ボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate(task.id, { done: !task.done });
          }}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: `2px solid ${task.done ? theme.success : theme.border}`,
            backgroundColor: task.done ? theme.success : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
            minWidth: '44px',
            minHeight: '44px'
          }}
        >
          {task.done && '✓'}
        </button>

        {/* メインコンテンツ */}
        <div style={{ flex: 1 }}>
          {/* バッジ */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
            {[
              { 
                text: `${configs.priority[task.priority as keyof typeof configs.priority]?.emoji} ${configs.priority[task.priority as keyof typeof configs.priority]?.name}`, 
                color: configs.priority[task.priority as keyof typeof configs.priority]?.color 
              },
              { 
                text: `${configs.category[task.category as keyof typeof configs.category]?.emoji} ${configs.category[task.category as keyof typeof configs.category]?.name}`, 
                color: configs.category[task.category as keyof typeof configs.category]?.color 
              },
              ...(task.dueDate ? [{ 
                text: `📅 ${new Date(task.dueDate).toLocaleDateString()}`, 
                color: isOverdue(task.dueDate) ? theme.destructive : theme.textSecondary 
              }] : []),
              ...task.tags.map(tag => ({ 
                text: `#${tag}`, 
                color: theme.textSecondary 
              }))
            ].map((badge, i) => (
              <span 
                key={i} 
                style={{ 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '12px', 
                  backgroundColor: badge.color, 
                  color: 'white' 
                }}
              >
                {badge.text}
              </span>
            ))}
          </div>

          {/* 編集フォーム または タスクタイトル */}
          {isEditing ? (
            <div style={{ marginBottom: '12px' }}>
              <input 
                value={editData.title || ''} 
                onChange={(e) => onEditDataChange({...editData, title: e.target.value})} 
                onKeyPress={handleKeyPress}
                style={{...styles.input, marginBottom: '8px'}} 
                autoFocus 
              />
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '8px', 
                marginBottom: '8px' 
              }}>
                <select 
                  value={editData.priority || 2} 
                  onChange={(e) => onEditDataChange({...editData, priority: Number(e.target.value)})} 
                  style={selectStyle}
                >
                  {Object.entries(configs.priority).map(([key, config]) => 
                    <option key={key} value={key}>{config.emoji} {config.name}</option>
                  )}
                </select>
                <select 
                  value={editData.category || 'general'} 
                  onChange={(e) => onEditDataChange({...editData, category: e.target.value})} 
                  style={selectStyle}
                >
                  {Object.entries(configs.category).map(([key, config]) => 
                    <option key={key} value={key}>{config.emoji} {config.name}</option>
                  )}
                </select>
              </div>
              <input 
                type="date" 
                value={editData.dueDate || ''} 
                onChange={(e) => onEditDataChange({...editData, dueDate: e.target.value})} 
                placeholder="期限日を選択"
                style={dateInputStyle as React.CSSProperties}
              />
              <input 
                placeholder="タグ (カンマ区切り)" 
                value={editData.tags || ''} 
                onChange={(e) => onEditDataChange({...editData, tags: e.target.value})} 
                style={{...styles.input, marginBottom: '8px'}} 
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onSaveEdit(editData); 
                  }} 
                  style={styles.button('primary')}
                >
                  保存
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onCancelEdit(); 
                  }} 
                  style={styles.button('secondary')}
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              textDecoration: task.done ? 'line-through' : 'none', 
              color: task.done ? theme.textSecondary : theme.text, 
              marginBottom: '8px', 
              lineHeight: '1.4' 
            }}>
              {task.title}
            </div>
          )}
        </div>

        {/* アクションボタン */}
        {!isEditing && (
          <>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onStartEdit(); 
              }} 
              style={{
                ...styles.button('secondary'), 
                padding: '8px', 
                flexShrink: 0, 
                marginRight: '8px'
              }}
            >
              ✏️
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onDelete(task.id); 
              }} 
              style={{
                ...styles.button('danger'), 
                padding: '8px', 
                flexShrink: 0
              }}
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};