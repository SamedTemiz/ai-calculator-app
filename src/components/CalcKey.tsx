import React from 'react';
import { cn } from '@/lib/utils';
import { CalcKeyProps } from '@/types';
import { triggerHapticFeedback, playSoundEffect } from '@/utils';

const CalcKey: React.FC<CalcKeyProps> = ({ 
  value, 
  onClick, 
  className, 
  variant = 'number', 
  size = 'normal' 
}) => {
  const handleClick = () => {
    triggerHapticFeedback();
    playSoundEffect('click');
    onClick();
  };

  const variantStyles = {
    number: "bg-[var(--button-number)] text-[var(--button-number-text)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_8px_var(--shadow-color)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_12px_var(--shadow-color)] hover:bg-[var(--button-number)]/90",
    operator: "bg-[var(--button-operator)] text-[var(--button-operator-text)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_8px_var(--shadow-color)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_12px_var(--shadow-color)] hover:bg-[var(--button-operator)]/90",
    special: "bg-[var(--button-special)] text-[var(--button-special-text)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_8px_var(--shadow-color)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_12px_var(--shadow-color)] hover:bg-[var(--button-special)]/90"
  };
  
  const sizeStyles = {
    normal: "col-span-1",
    wide: "col-span-2"
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full h-full flex items-center justify-center font-semibold text-lg sm:text-xl transition-all duration-200 active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 select-none rounded-2xl overflow-hidden",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      aria-label={`Calculator key: ${value}`}
      data-testid={`calc-key-${value}`}
      type="button"
      style={{ touchAction: 'manipulation' }}
    >
      <span className="block w-full truncate text-center" style={{ fontSize: 'clamp(1.1rem, 4.5vw, 2.1rem)' }}>
        {value}
      </span>
    </button>
  );
};

export default CalcKey;
