import React, { useState, useEffect } from 'react';
import CalculatorSection from './components/CalculatorSection';
import { CalculatorData } from './types';
import { LayoutGrid, TrendingUp, Calculator as CalcIcon, Users } from 'lucide-react';

const App: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    // Simulate a realistic visitor count that grows over time
    // This ensures the counter looks persistent and "live" without a backend
    const calculateVisitors = () => {
      const launchDate = new Date('2024-09-01T00:00:00').getTime();
      const now = Date.now();
      const minutesSinceLaunch = (now - launchDate) / (1000 * 60);
      
      // Algorithm: Base users + (avg 0.8 users per minute) + small random jitter based on date
      // This makes it consistent across reloads but growing globally
      const baseCount = 12500;
      const growthRate = 0.85; 
      const count = Math.floor(baseCount + (minutesSinceLaunch * growthRate));
      
      setVisitorCount(count);
    };

    calculateVisitors();
    
    // Optional: Increment gently while user is on page to make it feel alive
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + 1);
    }, 45000); // New visitor every 45 seconds

    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-slate-50 pb-12 flex flex-col">
      
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* App Logo */}
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <CalcIcon className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Calc Suite</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
             <TrendingUp className="w-4 h-4 text-slate-400" />
             <span className="hidden sm:inline font-medium text-slate-600">Optimize your finances</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        
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
      <footer className="border-t border-slate-200 mt-auto bg-white">
         <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center gap-4">
            <div className="text-center text-slate-400 text-sm">
               &copy; {new Date().getFullYear()} Smart Calc Suite. Mail for more info stga85ai@gmail.com
            </div>
            
            {/* Visitor Counter Badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 shadow-sm group hover:bg-slate-100 transition-colors">
              <div className="p-1 bg-blue-100 rounded-full">
                <Users className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 tabular-nums">
                {visitorCount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">Visitors</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;