import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { playSoundEffect } from '@/utils';
import { AIInputBoxProps } from '@/types';
import { cn } from '@/lib/utils';

const AIInputBox: React.FC<AIInputBoxProps> = ({ 
  onSubmit, 
  value,
  onValueChange,
  placeholder = "Describe your theme (e.g., 'Batman', 'Galaxy')", 
  className 
}) => {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      className={cn('flex items-center gap-2', className)} 
      onSubmit={handleSubmit}
      data-testid="ai-input-form"
    >
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-grow"
      />
      <Button type="submit" size="icon">
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default AIInputBox;
