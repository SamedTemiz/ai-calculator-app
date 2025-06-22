import React, { useRef, useEffect, useState } from 'react';
import CalcKey from '@/components/CalcKey';
import { useCalculator } from '@/hooks/useCalculator';
import { useSettings } from '@/hooks/useSettings';
import { History, X } from 'lucide-react';

const MAX_HISTORY = 5;

const CalculatorScreen: React.FC = () => {
  const { unitFormat } = useSettings();
  const {
    state,
    inputNumber,
    inputOperation,
    performCalculation,
    clear,
    handleDecimalClick,
    handlePercentClick,
    handlePlusMinusClick,
    // Optionally: handleBackspaceClick, clearEntry
  } = useCalculator(unitFormat);
  const displayRef = useRef<HTMLDivElement>(null);

  // History state: array of strings like '12 + 12 = 24'
  const [history, setHistory] = useState<string[]>([]);
  // Track the last calculation for correct history
  const [pendingHistory, setPendingHistory] = useState<{expr: string, prevResult: string} | null>(null);
  // Modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [state.display]);

  // Helper to route key presses
  const handleKeyPress = (key: string) => {
    if (/^[0-9]$/.test(key)) {
      inputNumber(key);
    } else if (["+", "-", "×", "÷"].includes(key)) {
      inputOperation(key);
    } else if (key === "=") {
      // Prepare to add to history after calculation
      if (state.previousValue !== null && state.operation) {
        const expr = `${state.previousValue} ${state.operation} ${state.display}`;
        setPendingHistory({ expr, prevResult: state.display });
      }
      performCalculation();
    } else if (key === "C") {
      clear();
    } else if (key === ".") {
      handleDecimalClick();
    } else if (key === "%") {
      handlePercentClick();
    } else if (key === "±") {
      handlePlusMinusClick();
    }
  };

  // Add to history after calculation result is updated
  useEffect(() => {
    if (pendingHistory) {
      // Only add if display changed (i.e. calculation performed)
      if (state.display !== pendingHistory.prevResult) {
        setHistory(prev => [
          `${pendingHistory.expr} = ${state.display}`,
          ...prev
        ].slice(0, MAX_HISTORY));
        setPendingHistory(null);
      }
    }
  }, [state.display, pendingHistory]);

  // Build current expression string
  let currentExpression = '';
  if (state.previousValue !== null && state.operation) {
    currentExpression = `${state.previousValue} ${state.operation} ${state.waitingForNewValue ? '' : state.display}`.trim();
  }

  // Clear history and close modal
  const handleClearHistory = () => {
    setHistory([]);
    setShowHistoryModal(false);
  };

  return (
    <div className="flex flex-col h-screen min-h-screen bg-background-gradient relative">
      {/* Mini History (top left) */}
      {history.length > 0 && (
        <div className="absolute left-0 top-0 z-20 mt-4 ml-4 max-w-xs">
          <div className="bg-background/80 rounded-xl shadow-lg p-2 mb-2 border border-border backdrop-blur-sm">
            <ul className="space-y-1 text-xs font-medium text-muted-foreground">
              {history.slice(0, MAX_HISTORY).map((item, idx) => (
                <li key={idx} className="truncate max-w-[180px] select-text" title={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {/* History Button (top right) */}
      <div className="flex items-center justify-end px-4 pt-6 pb-2">
        <button
          onClick={() => setShowHistoryModal(true)}
          className="p-2 rounded-full hover:bg-primary/10 transition"
          title="Tüm Geçmişi Gör"
          aria-label="Tüm Geçmişi Gör"
        >
          <History className="w-6 h-6 text-primary" />
        </button>
      </div>
      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="relative bg-background/95 rounded-3xl shadow-xl shadow-black/20 border border-border/60 max-w-md w-[95vw] max-h-[80vh] flex flex-col animate-scale-fade-in">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 px-8 pt-8 pb-4 border-b border-border/40">
              <History className="w-6 h-6 text-primary" />
              <span className="font-bold text-2xl tracking-wide text-center flex-1">Tüm Geçmiş</span>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-muted/60 transition"
                aria-label="Kapat"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {/* History List */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground py-12 text-lg">Geçmiş boş</div>
              ) : (
                <ul className="space-y-5 text-base">
                  {history.map((item, idx) => (
                    <li
                      key={idx}
                      className="break-words px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer select-text shadow-sm text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-border/40 px-8 py-6 bg-background/95 rounded-b-3xl">
              <button
                onClick={handleClearHistory}
                className="flex-1 sm:flex-none px-6 py-2 rounded-xl border-2 border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition text-base shadow-sm outline-none focus:ring-2 focus:ring-red-400"
              >
                Tümünü Temizle
              </button>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="flex-1 sm:flex-none px-6 py-2 rounded-xl border-2 border-muted text-muted-foreground font-semibold hover:bg-muted hover:text-foreground transition text-base shadow-sm outline-none focus:ring-2 focus:ring-muted"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Formula/Expression line */}
      <div className="px-4 text-right text-2xl font-semibold text-primary min-h-[2.2em] select-all mb-2 tracking-wide">
        {currentExpression}
      </div>
      {/* Display Area */}
      <div className="flex-1 flex items-end w-full px-2 pt-2 pb-2 min-h-0">
        <div
          ref={displayRef}
          className="w-full h-full flex items-end justify-end overflow-x-auto overflow-y-hidden rounded-xl bg-display-background/60 px-6 py-8 shadow-inner"
          style={{ WebkitOverflowScrolling: 'touch', minHeight: '100px' }}
          data-testid="calc-display-container"
        >
          <span
            className="block text-right font-light select-all whitespace-pre min-w-0 max-w-full"
            style={{
              fontSize: `clamp(3rem, 10vw, 5rem)`,
              lineHeight: 1.1,
              color: 'var(--display-text, #1D2129)',
              wordBreak: 'break-all',
              textShadow: '0 1px 2px rgba(0,0,0,0.08)',
              direction: 'ltr',
            }}
            aria-live="polite"
            data-testid="calc-display"
          >
            {state.display || '0'}
          </span>
        </div>
      </div>

      {/* Keypad - Uses a flexible height and has a bottom margin for the nav bar */}
      <div className="flex-shrink-0 w-full h-[60%] max-h-[420px] mb-[88px]">
        <div className="grid grid-cols-4 grid-rows-5 gap-3 p-3 w-full h-full max-w-md mx-auto">
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
    </div>
  );
};

export default CalculatorScreen;
