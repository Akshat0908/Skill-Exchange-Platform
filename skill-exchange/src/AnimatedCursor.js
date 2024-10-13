import React, { useEffect, useState } from 'react';

const AnimatedCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateCursorPosition);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'rgba(124, 58, 237, 0.5)',
        transform: `translate(${position.x - 10}px, ${position.y - 10}px)`,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

export default AnimatedCursor;
