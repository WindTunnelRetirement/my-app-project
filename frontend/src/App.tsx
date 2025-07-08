import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useAppLogic } from './hooks/useAppLogic';
import { AppHeader } from './components/AppHeader';
import { TaskManager } from './components/TaskManager';
import { EmptyState } from './components/EmptyState';
import StarField from './components/StarField';
import LoadingScreen from './components/LoadingScreen';
import { Notifications } from './components/Notifications';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { theme, globalStyles } from './styles/theme';

const App = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  
  const {
    isLoading,
    taskManager,
    sortedTasks,
    bulkOperations,
    showFilters,
    setShowFilters,
    completedCount
  } = useAppLogic();

  // ホームに戻る機能
  const handleBackToHome = () => {
    setAuthMode(null);
  };

  // 認証フォームの表示
  if (!isAuthenticated && authMode === 'login') {
    return (
      <LoginForm 
        onSwitchToRegister={() => setAuthMode('register')}
        onBackToHome={handleBackToHome}
      />
    );
  }
  
  if (!isAuthenticated && authMode === 'register') {
    return (
      <RegisterForm 
        onSwitchToLogin={() => setAuthMode('login')}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (isLoading || authLoading) {
    return <LoadingScreen theme={theme} />;
  }

  return (
    <div style={{ 
      background: theme.background, 
      color: theme.text, 
      minHeight: '100vh', 
      width: '100%', 
      padding: '16px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', 
      position: 'relative', 
      boxSizing: 'border-box',
      animation: 'fadeIn 0.8s ease-in-out'
    }}>
      <StarField />
      <Notifications notifications={taskManager.notifications} theme={theme} />
      
      <AppHeader 
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        bulkMode={bulkOperations.bulkMode}
        setBulkMode={bulkOperations.setBulkMode}
        theme={theme}
        onLoginClick={() => setAuthMode('login')}
        onRegisterClick={() => setAuthMode('register')}
      />

      <TaskManager 
        taskManager={taskManager}
        sortedTasks={sortedTasks}
        bulkOperations={bulkOperations}
        showFilters={showFilters}
        completedCount={completedCount}
        theme={theme}
      />

      {sortedTasks.length === 0 && <EmptyState theme={theme} />}

      <style>{globalStyles}</style>
    </div>
  );
};

export default App;