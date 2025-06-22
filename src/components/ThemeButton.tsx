import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeButtonProps } from '@/types';
import { triggerHapticFeedback, playSoundEffect } from '@/utils';

const ThemeButton: React.FC<ThemeButtonProps> = ({ 
  children, 
  onClick, 
  className, 
  variant = 'primary', 
  isActive = false 
}) => {
  const handleClick = () => {
    triggerHapticFeedback();
    playSoundEffect('click');
    onClick();
  };

  const baseStyles = "px-6 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-blue-500 text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.4)] hover:bg-blue-600",
    secondary: "bg-white/80 text-gray-700 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_12px_rgba(0,0,0,0.15)] hover:bg-white/90",
    ghost: "bg-transparent text-gray-600 hover:bg-white/50 hover:text-gray-800"
  };
  
  const activeStyles = isActive ? "ring-2 ring-blue-400 ring-offset-2 bg-blue-50" : "";

  return (
    <button
      onClick={handleClick}
      className={cn(
        baseStyles,
        variantStyles[variant],
        activeStyles,
        className
      )}
      type="button"
    >
      {children}
    </button>
  );
};

export default ThemeButton;
