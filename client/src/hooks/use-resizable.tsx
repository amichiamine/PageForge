import { useState, useEffect, useCallback, useRef } from 'react';

interface ResizableConfig {
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  storageKey: string;
  direction?: 'left' | 'right';
  disabled?: boolean;
}

interface ResizableState {
  width: number;
  isResizing: boolean;
  isDragging: boolean;
}

export function useResizable({
  defaultWidth,
  minWidth,
  maxWidth,
  storageKey,
  direction = 'right',
  disabled = false
}: ResizableConfig) {
  const [state, setState] = useState<ResizableState>({
    width: defaultWidth,
    isResizing: false,
    isDragging: false
  });

  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Charger la largeur depuis le localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem(storageKey);
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= minWidth && width <= maxWidth) {
        setState(prev => ({ ...prev, width }));
      }
    }
  }, [storageKey, minWidth, maxWidth]);

  // Sauvegarder la largeur dans le localStorage
  const saveWidth = useCallback((width: number) => {
    localStorage.setItem(storageKey, width.toString());
  }, [storageKey]);

  // Démarrer le redimensionnement
  const startResize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    startWidthRef.current = state.width;

    setState(prev => ({ 
      ...prev, 
      isResizing: true, 
      isDragging: true 
    }));

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [disabled, state.width]);

  // Gérer le redimensionnement
  const handleResize = useCallback((e: MouseEvent | TouchEvent) => {
    if (!state.isResizing) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startXRef.current;
    
    let newWidth;
    if (direction === 'left') {
      newWidth = startWidthRef.current + deltaX;
    } else {
      newWidth = startWidthRef.current + deltaX;
    }

    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

    setState(prev => ({ ...prev, width: newWidth }));
  }, [state.isResizing, direction, minWidth, maxWidth]);

  // Terminer le redimensionnement
  const stopResize = useCallback(() => {
    if (!state.isResizing) return;

    setState(prev => ({ 
      ...prev, 
      isResizing: false, 
      isDragging: false 
    }));

    saveWidth(state.width);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [state.isResizing, state.width, saveWidth]);

  // Événements globaux pour le redimensionnement
  useEffect(() => {
    if (state.isResizing) {
      const handleMouseMove = (e: MouseEvent) => handleResize(e);
      const handleTouchMove = (e: TouchEvent) => handleResize(e);
      const handleMouseUp = () => stopResize();
      const handleTouchEnd = () => stopResize();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [state.isResizing, handleResize, stopResize]);

  // Réinitialiser à la largeur par défaut
  const resetWidth = useCallback(() => {
    setState(prev => ({ ...prev, width: defaultWidth }));
    saveWidth(defaultWidth);
  }, [defaultWidth, saveWidth]);

  return {
    width: state.width,
    isResizing: state.isResizing,
    isDragging: state.isDragging,
    startResize,
    resetWidth,
    setWidth: (width: number) => {
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
      setState(prev => ({ ...prev, width: clampedWidth }));
      saveWidth(clampedWidth);
    }
  };
}