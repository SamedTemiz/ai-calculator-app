import { useState, useCallback } from 'react';
import { CalculatorState, UnitFormat } from '@/types';
import { 
  calculateResult, 
  validateCalculatorInput, 
  handleBackspace, 
  handleDecimalInput,
  formatNumber 
} from '@/utils';
import { CALCULATOR_OPERATIONS, CALCULATOR_SPECIAL_KEYS } from '@/constants';

export const useCalculator = (unitFormat: UnitFormat = 'decimal') => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
  });

  const inputNumber = useCallback((num: string) => {
    setState(prevState => {
      if (prevState.waitingForNewValue) {
        return {
          ...prevState,
          display: num,
          waitingForNewValue: false,
        };
      } else {
        const newDisplay = prevState.display === '0' ? num : prevState.display + num;
        if (validateCalculatorInput(newDisplay)) {
          return {
            ...prevState,
            display: newDisplay,
          };
        }
        return prevState;
      }
    });
  }, []);

  const inputOperation = useCallback((nextOperation: string) => {
    setState(prevState => {
      if (prevState.previousValue === null) {
        return {
          ...prevState,
          previousValue: prevState.display,
          waitingForNewValue: true,
          operation: nextOperation,
        };
      } else if (prevState.operation) {
        const currentValue = prevState.previousValue || '0';
        const newValue = calculateResult(currentValue, prevState.display, prevState.operation);
        const formattedValue = formatNumber(newValue, unitFormat);
        
        return {
          ...prevState,
          display: formattedValue,
          previousValue: formattedValue,
          waitingForNewValue: true,
          operation: nextOperation,
        };
      }
      
      return {
        ...prevState,
        waitingForNewValue: true,
        operation: nextOperation,
      };
    });
  }, [unitFormat]);

  const performCalculation = useCallback(() => {
    setState(prevState => {
      if (prevState.previousValue !== null && prevState.operation) {
        const newValue = calculateResult(prevState.previousValue, prevState.display, prevState.operation);
        const formattedValue = formatNumber(newValue, unitFormat);
        
        return {
          ...prevState,
          display: formattedValue,
          previousValue: null,
          operation: null,
          waitingForNewValue: true,
        };
      }
      return prevState;
    });
  }, [unitFormat]);

  const clear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
    });
  }, []);

  const clearEntry = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: '0',
    }));
  }, []);

  const handleBackspaceClick = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: handleBackspace(prevState.display),
    }));
  }, []);

  const handleDecimalClick = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: handleDecimalInput(prevState.display),
    }));
  }, []);

  return {
    state,
    inputNumber,
    inputOperation,
    performCalculation,
    clear,
    clearEntry,
    handleBackspaceClick,
    handleDecimalClick,
  };
}; 