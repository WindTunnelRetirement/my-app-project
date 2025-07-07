import React from 'react';
import { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  theme: any;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, theme }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px' 
    }}>
      {notifications.map(notification => (
        <div key={notification.id} 
             style={{ 
               padding: '12px 16px', 
               borderRadius: '8px', 
               color: 'white',
               backgroundColor: notification.type === 'success' ? theme.success : 
                              notification.type === 'error' ? theme.destructive : theme.primary,
               boxShadow: theme.shadow,
               minWidth: '250px',
               animation: 'slideIn 0.3s ease-out',
               fontSize: '14px',
               fontWeight: '500'
             }}>
          {notification.type === 'success' ? '✅' : 
           notification.type === 'error' ? '❌' : 'ℹ️'} {notification.message}
        </div>
      ))}
    </div>
  );
};