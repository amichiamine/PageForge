import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-bottom';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  showLabel?: boolean;
}

export function FloatingButton({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  size = 'md',
  variant = 'default',
  className,
  showLabel = false
}: FloatingButtonProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center-bottom': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14'
  };

  return (
    <Button
      onClick={onClick}
      variant={variant}
      size="icon"
      className={cn(
        'fixed z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300',
        'bg-theme-primary hover:bg-theme-secondary text-white',
        'hover:scale-110 active:scale-95',
        positionClasses[position],
        sizeClasses[size],
        showLabel && 'px-4 w-auto gap-2',
        className
      )}
      title={label}
    >
      {icon}
      {showLabel && label && (
        <span className="text-sm font-medium">{label}</span>
      )}
    </Button>
  );
}