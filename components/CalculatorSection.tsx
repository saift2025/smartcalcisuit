import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorData } from '../types';
import { Calculator, Sparkles, Loader2, Info } from 'lucide-react';
import { getFinancialInsight } from '../services/geminiService';

interface CalculatorSectionProps {
  data: CalculatorData;
  calculate: (values: Record<string, number>) => number | null;
}

const CalculatorSection: React.FC<CalculatorSectionProps> = ({ data, calculate }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({
    [data.inputs[0].key]: '',
    [data.inputs[1].key]: '',
  });
  const [result, setResult] = useState<number | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Theme styles mapping
  const themeStyles = {
    blue: {
      bg: 'bg-white',
      header: 'bg-blue-50 text-blue-800',
      border: 'border-blue-100',
      ring: 'focus:ring-blue-500',
      icon: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700',
      highlight: 'bg-blue-50',
      textHighlight: 'text-blue-900'
    },
    orange: {
      bg: 'bg-white',
      header: 'bg-orange-50 text-orange-800',
      border: 'border-orange-100',
      ring: 'focus:ring-orange-500',
      icon: 'text-orange-500',
      button: 'bg-orange-600 hover:bg-orange-700',
      highlight: 'bg-orange-50',
      textHighlight: 'text-orange-900'
    },
    green: {
      bg: 'bg-white',
      header: 'bg-emerald-50 text-emerald-800',
      border: 'border-emerald-100',
      ring: 'focus:ring-emerald-500',
      icon: 'text-emerald-500',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      highlight: 'bg-emerald-50',
      textHighlight: 'text-emerald-900'
    },
    purple: {
      bg: 'bg-white',
      header: 'bg-purple-50 text-purple-800',
      border: 'border-purple-100',
      ring: 'focus:ring-purple-500',
      icon: 'text-purple-500',
      button: 'bg-purple-600 hover:bg-purple-700',
      highlight: 'bg-purple-50',
      textHighlight: 'text-purple-900'
    },
  };

  const currentTheme = themeStyles[data.theme];

  const handleInputChange = (key: string, value: string) => {
    // Allow only numbers and decimal points
    if (!/^\d*\.?\d*$/.test(value)) return;
    
    setInputs((prev) => ({ ...prev, [key]: value }));
    setAiInsight(null); // Clear old insight on change
  };

  // Calculate whenever inputs change
  useEffect(() => {
    const numValues: Record<string, number> = {};
    let allValid = true;

    data.inputs.forEach((input) => {
      const val = parseFloat(inputs[input.key]);
      if (isNaN(val)) {
        allValid = false;
      } else {
        numValues[input.key] = val;
      }
    });

    if (allValid) {
      const res = calculate(numValues);
      setResult(res);
    } else {
      setResult(null);
    }
  }, [inputs, calculate, data.inputs]);

  const handleAskAi = async () => {
    if (result === null) return;
    
    setIsLoadingAi(true);
    
    const numericInputs: Record<string, number> = {};
    data.inputs.forEach(input => {
      numericInputs[input.label] = parseFloat(inputs[input.key]);
    });

    const formattedResult = formatResult(result);
    
    try {
      const insight = await getFinancialInsight(data.title, numericInputs, formattedResult);
      setAiInsight(insight);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const formatResult = (val: number) => {
    const isPercentage = data.result.suffix === '%';
    if (isPercentage) {
      return val.toFixed(2);
    }
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={`rounded-2xl shadow-sm border ${currentTheme.border} ${currentTheme.bg} overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-md`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${currentTheme.border} ${currentTheme.header} flex items-center justify-between`}>
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            {data.title}
          </h3>
          <p className="text-xs opacity-80 mt-1 font-medium">{data.description}</p>
        </div>
        <Calculator className={`w-5 h-5 opacity-70`} />
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col gap-6">
        
        {/* Inputs */}
        <div className="space-y-4">
          {data.inputs.map((input) => (
            <div key={input.key} className="group">
              <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-1 transition-colors group-focus-within:text-gray-900">
                {input.label}
              </label>
              <div className="relative">
                {input.prefix && (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 sm:text-sm font-bold">{input.prefix}</span>
                  </div>
                )}
                <input
                  type="text" // Using text for better control over validation
                  inputMode="decimal"
                  value={inputs[input.key]}
                  onChange={(e) => handleInputChange(input.key, e.target.value)}
                  className={`block w-full rounded-lg border-gray-200 bg-gray-50 border text-gray-900 focus:bg-white focus:border-transparent focus:ring-2 ${currentTheme.ring} transition-all duration-200 sm:text-sm py-2.5 ${input.prefix ? 'pl-8' : 'pl-3'} ${input.suffix ? 'pr-8' : 'pr-3'}`}
                  placeholder="0.00"
                />
                {input.suffix && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 sm:text-sm font-bold">{input.suffix}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="border-dashed border-gray-200" />

        {/* Result Area */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {data.result.label}
            </span>
            {result !== null && (
               <button 
                onClick={handleAskAi}
                disabled={isLoadingAi}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${isLoadingAi ? 'bg-gray-100 text-gray-400' : `${currentTheme.highlight} ${currentTheme.icon} hover:bg-opacity-80`}`}
               >
                 {isLoadingAi ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                 {isLoadingAi ? 'Thinking...' : 'AI Insight'}
               </button>
            )}
          </div>
          
          <div className={`p-4 rounded-xl ${currentTheme.highlight} border ${currentTheme.border} flex items-center justify-center relative overflow-hidden min-h-[80px]`}>
             {result !== null ? (
                <div className="text-center z-10">
                  <span className={`text-3xl font-bold tracking-tight ${currentTheme.textHighlight}`}>
                    {data.result.prefix}{formatResult(result)}{data.result.suffix}
                  </span>
                </div>
             ) : (
               <span className="text-gray-400 text-sm italic">Enter values to calculate</span>
             )}
          </div>

          {/* AI Insight Result */}
          {aiInsight && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="bg-slate-800 text-slate-100 p-3 rounded-lg text-sm relative shadow-lg">
                <div className="absolute -top-2 right-6 w-4 h-4 bg-slate-800 rotate-45"></div>
                <div className="flex gap-2 items-start">
                  <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed opacity-90">{aiInsight}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorSection;