import React, { useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  color: string;
}

const StarField = React.memo(() => {
  // useStateの初期化でstatic参照を使用
  const [stars] = useState<Star[]>(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 0.5,
      opacity: Math.random() * 0.9 + 0.1,
      twinkleDelay: Math.random() * 3,
      color: ['#ffffff', '#64b5f6', '#81c784', '#ffb74d'][Math.floor(Math.random() * 4)]
    }));
  });
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            borderRadius: '50%',
            opacity: star.opacity,
            animation: `twinkle 3s infinite ${star.twinkleDelay}s ease-in-out alternate, float 8s infinite ${star.twinkleDelay * 2}s ease-in-out alternate`,
            boxShadow: `0 0 ${star.size * 3}px ${star.color}40`,
            filter: `blur(${star.size > 3 ? 0.5 : 0}px)`
          }}
        />
      ))}
      
      {/* 流れ星エフェクト */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-10px',
          width: '2px',
          height: '2px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          animation: 'shootingStar 8s infinite linear',
          boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff'
        }}
      />
    </div>
  );
});

StarField.displayName = 'StarField';

export default StarField;