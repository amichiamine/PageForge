import React from 'react';
import { cn } from '@/lib/utils';
import { useResizable } from '@/hooks/use-resizable';
import { GripVertical, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  storageKey: string;
  direction?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  showResetButton?: boolean;
  title?: string;
  onWidthChange?: (width: number) => void;
}

export function ResizablePanel({
  children,
  defaultWidth,
  minWidth,
  maxWidth,
  storageKey,
  direction = 'right',
  className,
  disabled = false,
  showResetButton = true,
  title,
  onWidthChange
}: ResizablePanelProps) {
  const {
    width,
    isResizing,
    startResize,
    resetWidth
  } = useResizable({
    defaultWidth,
    minWidth,
    maxWidth,
    storageKey,
    direction,
    disabled
  });

  // Notifier les changements de largeur
  React.useEffect(() => {
    onWidthChange?.(width);
  }, [width, onWidthChange]);

  const handleStyle = direction === 'left' ? 'left-0' : 'right-0';

  return (
    <div 
      className={cn(
        'relative bg-white border-gray-200 overflow-hidden',
        direction === 'left' ? 'border-r' : 'border-l',
        isResizing ? 'transition-none' : 'transition-all duration-200',
        className
      )}
      style={{ width: `${width}px` }}
    >
      {/* Contenu du panneau */}
      <div className="h-full overflow-hidden">
        {children}
      </div>

      {/* Handle de redimensionnement */}
      {!disabled && (
        <div
          className={cn(
            'absolute top-0 bottom-0 w-2 group cursor-col-resize z-50',
            'hover:bg-blue-500/20 transition-colors duration-200',
            isResizing && 'bg-blue-500/30',
            handleStyle
          )}
          onMouseDown={startResize}
          onTouchStart={startResize}
        >
          {/* Indicateur visuel */}
          <div className={cn(
            'absolute top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gray-300 rounded-full',
            'group-hover:bg-blue-500 transition-colors duration-200',
            isResizing && 'bg-blue-500',
            direction === 'left' ? 'right-0.5' : 'left-0.5'
          )} />
          
          {/* Icône de redimensionnement */}
          <div className={cn(
            'absolute top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100',
            'transition-opacity duration-200 pointer-events-none',
            isResizing && 'opacity-100',
            direction === 'left' ? 'right-1' : 'left-1'
          )}>
            <GripVertical className="w-3 h-3 text-blue-500" />
          </div>
        </div>
      )}

      {/* Bouton de réinitialisation */}
      {showResetButton && !disabled && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetWidth}
                className={cn(
                  'absolute top-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100',
                  'hover:bg-gray-100 transition-opacity duration-200',
                  direction === 'left' ? 'right-2' : 'left-2'
                )}
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Réinitialiser la largeur{title ? ` de ${title}` : ''}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Overlay pendant le redimensionnement */}
      {isResizing && (
        <div className="absolute inset-0 bg-transparent z-40 cursor-col-resize" />
      )}
    </div>
  );
}

// Composant wrapper pour les panneaux responsifs
interface ResponsiveResizablePanelProps extends ResizablePanelProps {
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
  collapsedWidth?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ResponsiveResizablePanel({
  mobileBreakpoint = 768,
  tabletBreakpoint = 1024,
  collapsedWidth = 48,
  isCollapsed = false,
  onToggleCollapse,
  ...props
}: ResponsiveResizablePanelProps) {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adaptation responsive
  const isMobile = windowWidth < mobileBreakpoint;
  const isTablet = windowWidth >= mobileBreakpoint && windowWidth < tabletBreakpoint;

  // Ajuster les valeurs selon l'écran
  const responsiveProps = React.useMemo(() => {
    if (isMobile) {
      return {
        ...props,
        defaultWidth: Math.min(props.defaultWidth, windowWidth * 0.8),
        maxWidth: Math.min(props.maxWidth, windowWidth * 0.9),
        minWidth: Math.max(props.minWidth, 200)
      };
    } else if (isTablet) {
      return {
        ...props,
        defaultWidth: Math.min(props.defaultWidth, windowWidth * 0.4),
        maxWidth: Math.min(props.maxWidth, windowWidth * 0.5),
        minWidth: Math.max(props.minWidth, 240)
      };
    }
    return props;
  }, [props, isMobile, isTablet, windowWidth]);

  // Mode collapsed
  if (isCollapsed) {
    return (
      <div 
        className={cn(
          'relative bg-white overflow-hidden transition-all duration-300',
          props.direction === 'left' ? 'border-r border-gray-200' : 'border-l border-gray-200',
          props.className
        )}
        style={{ width: `${collapsedWidth}px` }}
      >
        <div className="h-full flex flex-col items-center py-2">
          {/* Bouton pour déplier */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-8 h-8 p-0 mb-2"
          >
            <GripVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return <ResizablePanel {...responsiveProps} />;
}