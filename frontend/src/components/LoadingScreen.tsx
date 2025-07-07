import React, { useState, useEffect } from 'react';
import StarField from './StarField';

interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
}

interface LoadingScreenProps {
  theme: Theme;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ theme }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: theme.background,
      color: theme.text,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeOut 0.8s ease-in-out 1.7s forwards'
    }}>
      <StarField />
      
      {/* メインロゴ */}
      <div style={{
        fontSize: '4rem',
        fontWeight: '700',
        color: theme.primary,
        marginBottom: '2rem',
        textShadow: `0 0 30px ${theme.primary}40`,
        animation: 'glow 2s ease-in-out infinite alternate'
      }}>
        Focus
      </div>

      {/* サブタイトル */}
      <div style={{
        fontSize: '1.2rem',
        color: theme.textSecondary,
        marginBottom: '3rem',
        opacity: 0.8,
        animation: 'slideUp 1s ease-out 0.5s both'
      }}>
        星空の下でタスクを整理
      </div>

      {/* ローディングインジケーター */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        animation: 'slideUp 1s ease-out 1s both'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${theme.border}`,
          borderTop: `3px solid ${theme.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        
        <div style={{
          fontSize: '1rem',
          color: theme.textSecondary,
          minWidth: '100px'
        }}>
          読み込み中{dots}
        </div>
      </div>

      {/* 装飾的な要素 */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        display: 'flex',
        gap: '2rem',
        animation: 'slideUp 1s ease-out 1.5s both'
      }}>
        {['📝', '⭐', '🌙'].map((emoji, i) => (
          <div key={i} style={{
            fontSize: '2rem',
            opacity: 0.5,
            animation: `float 3s ease-in-out infinite ${i * 0.5}s`
          }}>
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;