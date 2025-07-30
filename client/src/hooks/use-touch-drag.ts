
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
    threshold = 8,
    delay = 100,
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
  const isDragConfirmedRef = useRef(false);

  const triggerHapticFeedback = useCallback(() => {
    if (enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }, [enableHapticFeedback]);

  const startDrag = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    // Empêcher le scroll par défaut
    e.preventDefault();
    
    const startPos = { x: touch.clientX, y: touch.clientY };
    isDragConfirmedRef.current = false;
    
    setDragState(prev => ({
      ...prev,
      startPosition: startPos,
      currentPosition: startPos,
      isDragging: false
    }));

    // Délai plus court pour démarrer le drag
    dragTimeoutRef.current = setTimeout(() => {
      if (!isDragConfirmedRef.current) {
        isDragConfirmedRef.current = true;
        setDragState(prev => ({
          ...prev,
          isDragging: true
        }));
        triggerHapticFeedback();
      }
    }, delay);

  }, [delay, triggerHapticFeedback]);

  const updateDrag = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch || !dragState.startPosition) return;

    e.preventDefault();
    
    const currentPos = { x: touch.clientX, y: touch.clientY };
    const offset = {
      x: currentPos.x - dragState.startPosition.x,
      y: currentPos.y - dragState.startPosition.y
    };

    // Vérifier si le seuil de déplacement est atteint
    const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
    
    if (distance > threshold && !isDragConfirmedRef.current) {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
      isDragConfirmedRef.current = true;
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

  }, [dragState.startPosition, threshold, triggerHapticFeedback]);

  const endDrag = useCallback(() => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    isDragConfirmedRef.current = false;
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
    element.addEventListener('touchend', endDrag, { passive: false });
    element.addEventListener('touchcancel', endDrag, { passive: false });

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
