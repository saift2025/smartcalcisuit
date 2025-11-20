export interface CalculatorData {
  id: string;
  title: string;
  theme: 'blue' | 'orange' | 'green' | 'purple';
  inputs: {
    label: string;
    key: string;
    prefix?: string;
    suffix?: string;
  }[];
  result: {
    label: string;
    prefix?: string;
    suffix?: string;
  };
  description: string;
}

export interface CalculationResult {
  value: number | null;
  formatted: string;
}

export type CalcType = 'appraisal' | 'expectation' | 'discount' | 'increase';
