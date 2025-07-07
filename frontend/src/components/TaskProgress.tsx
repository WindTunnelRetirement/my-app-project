import React from 'react';

interface TaskProgressProps {
  completedCount: number;
  totalCount: number;
  theme: any;
  styles: any;
}

export const TaskProgress: React.FC<TaskProgressProps> = ({ 
  completedCount, 
  totalCount, 
  theme, 
  styles 
}) => {
  const progressPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* 円形進捗 */}
        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
          <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
            <circle 
              cx="30" 
              cy="30" 
              r="25" 
              fill="none" 
              stroke={theme.border} 
              strokeWidth="4"
            />
            <circle 
              cx="30" 
              cy="30" 
              r="25" 
              fill="none" 
              stroke={theme.success} 
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 25}`}
              strokeDashoffset={`${2 * Math.PI * 25 * (1 - (totalCount ? completedCount / totalCount : 0))}`}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: '12px',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            {progressPercentage}%
          </div>
        </div>
        
        {/* 情報 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            {completedCount}/{totalCount} 完了
          </div>
          <div style={{ fontSize: '13px', color: theme.textSecondary }}>
            {totalCount === completedCount && totalCount > 0 ? 
              '🎉 お疲れ様でした！' : 
              `今日の目標まであと ${Math.max(0, totalCount - completedCount)} 個`
            }
          </div>
        </div>
      </div>
    </div>
  );
};