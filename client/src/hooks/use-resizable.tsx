import { useState, useEffect, useCallback, useRef } from 'react';

interface ResizableConfig {
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  storageKey: string;
  direction?: 'left' | 'right';
  disabled?: boolean;
}

export function useResizable({
  defaultWidth,
  minWidth,
  maxWidth,
  storageKey,
  direction = 'right',
  disabled = false
}: ResizableConfig) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const rafRef = useRef<number>();

  // Charger la largeur depuis le localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem(storageKey);
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth, 10);
      if (parsedWidth >= minWidth && parsedWidth <= maxWidth) {
        setWidth(parsedWidth);
      }
    }
  }, [storageKey, minWidth, maxWidth]);

  // Sauvegarder la largeur
  const saveWidth = useCallback((newWidth: number) => {
    localStorage.setItem(storageKey, newWidth.toString());
  }, [storageKey]);

  // Démarrer le redimensionnement
  const startResize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    startWidthRef.current = width;
    setIsResizing(true);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [disabled, width]);

  // Gérer le redimensionnement avec requestAnimationFrame
  const handleResize = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isResizing) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = direction === 'right' ? clientX - startXRef.current : startXRef.current - clientX;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidthRef.current + deltaX));
      setWidth(newWidth);
    });
  }, [isResizing, direction, maxWidth, minWidth]);

  // Arrêter le redimensionnement
  const stopResize = useCallback(() => {
    if (!isResizing) return;

    setIsResizing(false);
    saveWidth(width);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, [isResizing, width, saveWidth]);

  // Écouteurs d'événements
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => handleResize(e);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleResize(e);
    };
    const handleMouseUp = () => stopResize();
    const handleTouchEnd = () => stopResize();

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isResizing, handleResize, stopResize]);

  // Réinitialiser la largeur
  const resetWidth = useCallback(() => {
    setWidth(defaultWidth);
    saveWidth(defaultWidth);
  }, [defaultWidth, saveWidth]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    width,
    isResizing,
    isDragging: isResizing,
    startResize,
    resetWidth
  };
}