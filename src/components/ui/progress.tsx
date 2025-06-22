"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { useAppSelector } from '@/store/hooks';
import { getThemeColors } from '@/theme/themes';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  color?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, color, ...props }, ref) => {
  // Get current theme from Redux
  const currentTheme = useAppSelector(state => state.theme.currentTheme);
  const currentAIColors = useAppSelector(state => state.theme.currentAIColors);
  const themeColors = getThemeColors(currentTheme, currentAIColors);
  const indicatorColor = color || themeColors.primary;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: indicatorColor,
          minWidth: value === 0 ? '2px' : undefined,
        }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress }
