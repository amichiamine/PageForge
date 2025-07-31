import { useEffect, useRef } from 'react';

interface TouchDragConfig {
  onDragStart?: (e: TouchEvent) => void;
  onDragMove?: (e: TouchEvent, deltaX: number, deltaY: number) => void;
  onDragEnd?: (e: TouchEvent) => void;
  threshold?: number;
}

export function useTouchDrag(config: TouchDragConfig) {
  const elementRef = useRef<HTMLElement | null>(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const { onDragStart, onDragMove, onDragEnd, threshold = 10 } = config;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      startTime = Date.now();
      isDraggingRef.current = false;
      
      // Feedback haptique léger
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPosRef.current.x;
      const deltaY = touch.clientY - startPosRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > threshold && !isDraggingRef.current) {
        isDraggingRef.current = true;
        onDragStart?.(e);
      }

      if (isDraggingRef.current) {
        e.preventDefault();
        onDragMove?.(e, deltaX, deltaY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDraggingRef.current) {
        onDragEnd?.(e);
      }
      isDraggingRef.current = false;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onDragStart, onDragMove, onDragEnd, threshold]);

  return elementRef;
}