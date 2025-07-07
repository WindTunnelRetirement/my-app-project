// テーマ定義
export const theme = {
  background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0e4b99 100%)',
  card: 'rgba(255, 255, 255, 0.05)',
  cardHover: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  border: 'rgba(255, 255, 255, 0.1)',
  primary: '#64b5f6',
  success: '#81c784',
  destructive: '#e57373',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  glassMorphism: 'backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);'
};

// スタイル定義
export const createStyles = (themeObj: typeof theme) => ({
  input: { 
    width: '100%', 
    padding: '12px', 
    border: `1px solid ${theme.border}`, 
    borderRadius: '12px', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: theme.text, 
    fontSize: '16px', 
    boxSizing: 'border-box' as const, 
    outline: 'none', 
    minHeight: '44px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    WebkitAppearance: 'none' as const,
    MozAppearance: 'textfield' as const,
    appearance: 'none' as const
  },
  button: (variant: 'primary' | 'secondary' | 'danger' = 'primary') => ({ 
    padding: '12px 16px', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: '600', 
    minHeight: '44px', 
    backgroundColor: variant === 'primary' ? theme.primary : variant === 'danger' ? theme.destructive : 'rgba(255, 255, 255, 0.1)', 
    color: 'white',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    border: `1px solid ${variant === 'secondary' ? theme.border : 'transparent'}`
  }),
  card: { 
    backgroundColor: theme.card, 
    borderRadius: '20px', 
    padding: '24px', 
    marginBottom: '20px', 
    boxShadow: theme.shadow,
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: `1px solid ${theme.border}`,
    transition: 'all 0.3s ease'
  },
  selectWithArrow: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    color: '#ffffff',
    backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="%23ffffff" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px'
  },
  dateInput: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    color: '#ffffff',
    colorScheme: 'dark' as const,
    WebkitAppearance: 'none' as const,
    MozAppearance: 'textfield' as const,
    appearance: 'none' as const,
    position: 'relative' as const,
    paddingRight: '40px'
  }
});

// CSS-in-JS スタイル文字列
export const globalStyles = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.8); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fadeOut {
    to { opacity: 0; pointer-events: none; transform: scale(0.95); }
  }
  @keyframes glow {
    0% { text-shadow: 0 0 30px rgba(100, 181, 246, 0.3), 0 0 60px rgba(100, 181, 246, 0.1); }
    100% { text-shadow: 0 0 50px rgba(100, 181, 246, 0.6), 0 0 80px rgba(100, 181, 246, 0.2); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  * {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  input, textarea, select {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
  }
  
  /* モバイルでの表示調整 */
  @media (max-width: 767px) {
    input[type="date"] {
      background-color: rgba(26, 26, 46, 0.95) !important;
      color: #ffffff !important;
      padding: 12px 16px !important;
      font-size: 16px !important;
      min-height: 44px !important;
      box-sizing: border-box !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 12px !important;
      
      /* 日付テキストの表示を改善 */
      -webkit-text-fill-color: #ffffff !important;
      text-align: left !important;
      vertical-align: middle !important;
      line-height: 1.4 !important;
    }
    
    /* 日付入力フィールドの各部分 */
    input[type="date"]::-webkit-datetime-edit {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
      padding: 0 !important;
    }
    
    input[type="date"]::-webkit-datetime-edit-fields-wrapper {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
    }
    
    input[type="date"]::-webkit-datetime-edit-year-field,
    input[type="date"]::-webkit-datetime-edit-month-field,
    input[type="date"]::-webkit-datetime-edit-day-field {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
    }
    
    input[type="date"]::-webkit-datetime-edit-text {
      color: #b0b0b0 !important;
      -webkit-text-fill-color: #b0b0b0 !important;
    }
    
    /* カレンダーアイコンを維持 */
    input[type="date"]::-webkit-calendar-picker-indicator {
      background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%23ffffff" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></svg>') !important;
      background-size: 16px 16px !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      width: 20px !important;
      height: 20px !important;
      margin-left: 8px !important;
      cursor: pointer !important;
      opacity: 1 !important;
      filter: none !important;
    }
    
    /* フォーカス時の改善 */
    input[type="date"]:focus {
      border-color: #64b5f6 !important;
      outline: none !important;
      box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2) !important;
    }
  }
`;