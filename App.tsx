import React from 'react';
import CalculatorSection from './components/CalculatorSection';
import { CalculatorData } from './types';
import { LayoutGrid, TrendingUp, Calculator as CalcIcon } from 'lucide-react';

const App: React.FC = () => {

  // Configuration for the 4 calculators based on the user screenshot
  const calculators: { data: CalculatorData; calculate: (values: any) => number | null }[] = [
    {
      data: {
        id: 'appraisal',
        title: 'Appraisal Hike',
        description: 'Calculate percentage increase between old and new salary.',
        theme: 'blue',
        inputs: [
          { label: 'Old Salary', key: 'old' },
          { label: 'New Salary', key: 'new' },
        ],
        result: { label: 'Hike Percentage', suffix: '%' },
      },
      calculate: (values) => {
        const { old, new: newSal } = values;
        if (old === 0) return 0;
        return ((newSal - old) / old) * 100;
      },
    },
    {
      data: {
        id: 'salary-expectation',
        title: 'Salary Expectation',
        description: 'Determine total salary based on current pay and expected %.',
        theme: 'orange',
        inputs: [
          { label: 'Current Salary', key: 'current' },
          { label: 'Expected Hike', key: 'percent', suffix: '%' },
        ],
        result: { label: 'Total Expected Salary' },
      },
      calculate: (values) => {
        const { current, percent } = values;
        return current + (current * (percent / 100));
      },
    },
    {
      data: {
        id: 'discount',
        title: 'Discount Calculator',
        description: 'Calculate final price after applying a discount percentage.',
        theme: 'green',
        inputs: [
          { label: 'Original Amount', key: 'amount' },
          { label: 'Discount', key: 'percent', suffix: '%' },
        ],
        result: { label: 'Discounted Amount' },
      },
      calculate: (values) => {
        const { amount, percent } = values;
        return amount - (amount * (percent / 100));
      },
    },
    {
      data: {
        id: 'increase',
        title: 'Price Increase',
        description: 'Calculate total value after adding a percentage increase.',
        theme: 'purple',
        inputs: [
          { label: 'Original Amount', key: 'amount' },
          { label: 'Increase', key: 'percent', suffix: '%' },
        ],
        result: { label: 'Total Amount' },
      },
      calculate: (values) => {
        const { amount, percent } = values;
        return amount + (amount * (percent / 100));
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <CalcIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Calc Suite</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
             <TrendingUp className="w-4 h-4" />
             <span className="hidden sm:inline">Optimize your finances</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-3">
            Financial Calculators
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Perform quick salary, discount, and hike calculations. Tap the AI button for instant insights on your numbers.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {calculators.map((calc) => (
            <CalculatorSection 
              key={calc.data.id} 
              data={calc.data} 
              calculate={calc.calculate} 
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 py-8 bg-white">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Smart Calc Suite. Mail for more info stga85ai@gmail.com
         </div>
      </footer>
    </div>
  );
};

export default App;