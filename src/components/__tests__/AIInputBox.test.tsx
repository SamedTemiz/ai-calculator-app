import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import AIInputBox from '../AIInputBox';
import React, { useState } from 'react';
import { AIInputBoxProps } from '@/types';

// A wrapper component to manage state for the controlled AIInputBox
const AIInputBoxStateWrapper = (props: Partial<Omit<AIInputBoxProps, 'value' | 'onValueChange'>>) => {
  const [value, setValue] = useState('');

  const handleSubmit = (prompt: string) => {
    props.onSubmit?.(prompt);
    // Clear input only on successful submission logic if needed
    // setValue('');
  };

  return (
    <AIInputBox
      value={value}
      onValueChange={setValue}
      onSubmit={handleSubmit}
      placeholder={props.placeholder}
      className={props.className}
    />
  );
};


describe('AIInputBox', () => {
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default placeholder', () => {
    render(<AIInputBox onSubmit={mockOnSubmit} value="" onValueChange={() => {}} />);
    
    expect(screen.getByPlaceholderText("Describe your theme (e.g., 'Batman', 'Galaxy')")).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom placeholder text';
    render(<AIInputBox onSubmit={mockOnSubmit} value="" onValueChange={() => {}} placeholder={customPlaceholder} />);
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('submits form with input value when button is clicked', async () => {
    render(<AIInputBoxStateWrapper onSubmit={mockOnSubmit} />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    await user.type(input, 'cyberpunk theme');
    expect(input).toHaveValue('cyberpunk theme');

    await user.click(button);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('cyberpunk theme');
    });
  });

  it('submits form when Enter key is pressed', async () => {
    const mockOnSubmit = vi.fn();
    render(<AIInputBoxStateWrapper onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText(/Describe your theme/);

    await user.type(input, 'hello enter');
    await user.keyboard('{enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith('hello enter');
  });

  it('does not submit empty input', async () => {
    const mockOnSubmit = vi.fn();
    render(<AIInputBoxStateWrapper onSubmit={mockOnSubmit} />);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('does not submit whitespace-only input', async () => {
    const mockOnSubmit = vi.fn();
    render(<AIInputBoxStateWrapper onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText(/Describe your theme/);
    const button = screen.getByRole('button');

    await user.type(input, '   ');
    await user.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles submission logic correctly', async () => {
    const handleSubmit = (val: string) => {
      expect(val).toBe('test value');
    };
    const TestComponent = () => {
      const [value, setValue] = useState('');
      return (
        <AIInputBox
          value={value}
          onValueChange={setValue}
          onSubmit={handleSubmit}
        />
      );
    };
    render(<TestComponent />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'test value');
    const button = screen.getByRole('button');
    await user.click(button);
  });

  it('applies custom className', () => {
    const mockOnSubmit = vi.fn();
    const customClass = 'my-custom-class';
    render(<AIInputBoxStateWrapper onSubmit={mockOnSubmit} className={customClass} />);

    const form = screen.getByTestId('ai-input-form');
    expect(form).toHaveClass(customClass);
  });
}); 