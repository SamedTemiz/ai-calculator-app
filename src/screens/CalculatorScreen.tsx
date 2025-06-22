import React, { useState, useCallback } from 'react';
import CalcKey from '@/components/CalcKey';
import { 
  calculateResult, 
  validateCalculatorInput, 
  handleBackspace, 
  handleDecimalInput,
  formatNumber 
} from '@/utils';
import { CalculatorState, UnitFormat } from '@/types';
import { CALCULATOR_OPERATIONS, CALCULATOR_SPECIAL_KEYS } from '@/constants';
import { useCalculator } from '@/hooks/useCalculator';
import { useSettings } from '@/hooks/useSettings';
import { Card, CardContent } from '@/components/ui/card';

const CalculatorScreen: React.FC = () => {
  const { unitFormat } = useSettings();
  const { displayValue, handleKeyPress } = useCalculator(unitFormat);

  return (
    <div className="flex flex-col h-full bg-background-gradient">
      {/* Ekran */}
      <div className="flex-1 flex flex-col justify-end p-6 bg-display-background/50 rounded-t-lg">
        <div 
          className="text-right text-5xl font-light text-display-text break-all"
          aria-live="polite"
        >
          {displayValue}
        </div>
      </div>
      
      {/* Tuş Takımı */}
      <div className="grid grid-cols-4 gap-2 p-4">
        {/* Tuşlar burada sıralanacak */}
        <CalcKey value="C" onClick={() => handleKeyPress('C')} variant="special" />
        <CalcKey value="±" onClick={() => handleKeyPress('±')} variant="special" />
        <CalcKey value="%" onClick={() => handleKeyPress('%')} variant="special" />
        <CalcKey value="÷" onClick={() => handleKeyPress('÷')} variant="operator" />

        <CalcKey value="7" onClick={() => handleKeyPress('7')} />
        <CalcKey value="8" onClick={() => handleKeyPress('8')} />
        <CalcKey value="9" onClick={() => handleKeyPress('9')} />
        <CalcKey value="×" onClick={() => handleKeyPress('×')} variant="operator" />
        
        <CalcKey value="4" onClick={() => handleKeyPress('4')} />
        <CalcKey value="5" onClick={() => handleKeyPress('5')} />
        <CalcKey value="6" onClick={() => handleKeyPress('6')} />
        <CalcKey value="-" onClick={() => handleKeyPress('-')} variant="operator" />

        <CalcKey value="1" onClick={() => handleKeyPress('1')} />
        <CalcKey value="2" onClick={() => handleKeyPress('2')} />
        <CalcKey value="3" onClick={() => handleKeyPress('3')} />
        <CalcKey value="+" onClick={() => handleKeyPress('+')} variant="operator" />

        <CalcKey value="0" onClick={() => handleKeyPress('0')} size="wide" />
        <CalcKey value="." onClick={() => handleKeyPress('.')} />
        <CalcKey value="=" onClick={() => handleKeyPress('=')} variant="operator" />
      </div>
    </div>
  );
};

export default CalculatorScreen;
