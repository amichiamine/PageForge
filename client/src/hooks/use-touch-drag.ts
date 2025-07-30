
import { useState, useEffect, useCallback, useRef } from 'react';

interface TouchDragOptions {
  threshold?: number;
  delay?: number;
  enableHapticFeedback?: boolean;
}

interface TouchDragState {
  isDragging: boolean;
  startPosition: { x: number; y: number } | null;
  currentPosition: { x: number; y: number } | null;
  dragOffset: { x: number; y: number };
}

export function useTouchDrag(options: TouchDragOptions = {}) {
  const {
    threshold = 10,
    delay = 150,
    enableHapticFeedback = true
  } = options;

  const [dragState, setDragState] = useState<TouchDragState>({
    isDragging: false,
    startPosition: null,
    currentPosition: null,
    dragOffset: { x: 0, y: 0 }
  });

  const dragTimeoutRef = useRef<NodeJS.Timeout>();
  const elementRef = useRef<HTMLElement>();

  const triggerHapticFeedback = useCallback(() => {
    if (enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [enableHapticFeedback]);

  const startDrag = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    const startPos = { x: touch.clientX, y: touch.clientY };
    
    setDragState(prev => ({
      ...prev,
      startPosition: startPos,
      currentPosition: startPos
    }));

    dragTimeoutRef.current = setTimeout(() => {
      setDragState(prev => ({
        ...prev,
        isDragging: true
      }));
      triggerHapticFeedback();
    }, delay);

  }, [delay, triggerHapticFeedback]);

  const updateDrag = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch || !dragState.startPosition) return;

    const currentPos = { x: touch.clientX, y: touch.clientY };
    const offset = {
      x: currentPos.x - dragState.startPosition.x,
      y: currentPos.y - dragState.startPosition.y
    };

    // Vérifier si le seuil de déplacement est atteint
    const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
    
    if (distance > threshold && !dragState.isDragging) {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
      setDragState(prev => ({
        ...prev,
        isDragging: true
      }));
      triggerHapticFeedback();
    }

    setDragState(prev => ({
      ...prev,
      currentPosition: currentPos,
      dragOffset: offset
    }));

  }, [dragState.startPosition, dragState.isDragging, threshold, triggerHapticFeedback]);

  const endDrag = useCallback(() => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    setDragState({
      isDragging: false,
      startPosition: null,
      currentPosition: null,
      dragOffset: { x: 0, y: 0 }
    });
  }, []);

  const bindTouchEvents = useCallback((element: HTMLElement) => {
    elementRef.current = element;
    
    element.addEventListener('touchstart', startDrag, { passive: false });
    element.addEventListener('touchmove', updateDrag, { passive: false });
    element.addEventListener('touchend', endDrag);
    element.addEventListener('touchcancel', endDrag);

    return () => {
      element.removeEventListener('touchstart', startDrag);
      element.removeEventListener('touchmove', updateDrag);
      element.removeEventListener('touchend', endDrag);
      element.removeEventListener('touchcancel', endDrag);
    };
  }, [startDrag, updateDrag, endDrag]);

  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  return {
    dragState,
    bindTouchEvents,
    isDragging: dragState.isDragging,
    dragOffset: dragState.dragOffset
  };
}
