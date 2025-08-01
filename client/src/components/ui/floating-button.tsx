import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  disabled?: boolean;
  title?: string;
}

export function FloatingButton({
  children,
  onClick,
  className,
  size = 'md',
  variant = 'default',
  disabled = false,
  title
}: FloatingButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 p-0',
    md: 'h-10 w-10 p-0',
    lg: 'h-12 w-12 p-0'
  };

  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      title={title}
      className={cn(
        'rounded-full shadow-lg hover:shadow-xl transition-all duration-200',
        'backdrop-blur-sm border border-white/20',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Button>
  );
}