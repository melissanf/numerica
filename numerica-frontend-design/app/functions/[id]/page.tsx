import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';

interface FunctionData {
  id: string;
  title: string;
  functionExpr: string;
  color: 'blue' | 'yellow' | 'green' | 'red' | 'pink';
  algorithm: string;
  inputs: { label: string; value: string }[];
  interval: { start: number; end: number };
  results: {
    root: string;
    iterations: number;
    error: number;
  };
}

const functionsData: Record<string, FunctionData> = {
  function1: {
    id: '1',
    title: 'Function 1',
    functionExpr: 'f(x) = x^2 + 3x + 5',
    color: 'blue',
    algorithm: 'Dichotomie (Binary Search)',
    inputs: [
      { label: 'f(x)', value: 'x^2 + 3x + 5' },
      { label: 'Tolerance', value: '1e-8' },
      { label: 'Max Iterations', value: '100' },
    ],
    interval: { start: -10, end: 10 },
    results: {
      root: 1.4142135623730951,
      iterations: 45,
      error: 0.00000001,
    },
  },
  function2: {
    id: '2',
    title: 'Function 2',
    functionExpr: 'f(x) = x^2 + 3x + 5',
    color: 'yellow',
    algorithm: 'Newton-Raphson Method',
    inputs: [
      { label: 'f(x)', value: 'x^2 + 3x + 5' },
      { label: "f'(x)", value: '2x + 3' },
      { label: 'Initial Guess (x0)', value: '-5' },
      { label: 'Tolerance', value: '1e-9' },
    ],
    interval: { start: -5, end: 0 },
    results: {
      root: 1.4142135623730951,
      iterations: 8,
      error: 0.000000001,
    },
  },
  function3: {
    id: '3',
    title: 'Function 3',
    functionExpr: 'f(x) = x^2 + 3x + 5',
    color: 'red',
    algorithm: 'Secant Method',
    inputs: [
      { label: 'f(x)', value: 'x^2 + 3x + 5' },
      { label: 'First Point (x0)', value: '-6' },
      { label: 'Second Point (x1)', value: '-4' },
      { label: 'Tolerance', value: '1e-8' },
    ],
    interval: { start: -6, end: -4 },
    results: {
      root: 1.4142135623730951,
      iterations: 12,
      error: 0.00000001,
    },
  },
  function4: {
    id: '4',
    title: 'Function 4',
    functionExpr: 'f(x) = x^2 + 3x + 5',
    color: 'green',
    algorithm: 'Lagrange Interpolation',
    inputs: [
      { label: 'Points', value: '(0,5), (1,9), (2,15), (3,23)' },
      { label: 'Interpolation Point (x)', value: '1.5' },
    ],
    interval: { start: 0, end: 3 },
    results: {
      root: 2.5,
      iterations: 1,
      error: 0,
    },
  },
};

const getColorBg = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10',
    red: 'bg-red-500/10',
    green: 'bg-green-500/10',
    yellow: 'bg-yellow-500/10',
    pink: 'bg-pink-500/10',
  };
  return colors[color] || 'bg-blue-500/10';
};

const getColorBorder = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'border-blue-500/30',
    red: 'border-red-500/30',
    green: 'border-green-500/30',
    yellow: 'border-yellow-500/30',
    pink: 'border-pink-500/30',
  };
  return colors[color] || 'border-blue-500/30';
};

const getColorText = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'text-blue-400',
    red: 'text-red-400',
    green: 'text-green-400',
    yellow: 'text-yellow-300',
    pink: 'text-pink-400',
  };
  return colors[color] || 'text-blue-400';
};

export default function FunctionDetailsPage({ params }: { params: { id: string } }) {
  const functionData = functionsData[params.id];

  if (!functionData) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-32">
          <Header title="Function Details" />
          <div className="px-8 py-12">
            <p className="text-foreground/60">Function not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-32">
        <Header title="NUMERICA" />

        {/* Back Button and Title */}
        <div className="px-8 py-6 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h2 className={`text-3xl font-bold ${getColorText(functionData.color)}`}>
            {functionData.title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-8 pb-12">
          <div className="max-w-4xl space-y-8">
            {/* Function Expression */}
            <div className={`${getColorBg(functionData.color)} border ${getColorBorder(functionData.color)} rounded-2xl p-6`}>
              <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wide mb-3">
                Function Expression
              </h3>
              <p className={`text-2xl font-mono font-semibold ${getColorText(functionData.color)}`}>
                {functionData.functionExpr}
              </p>
            </div>

            {/* Algorithm Used */}
            <div className={`${getColorBg(functionData.color)} border ${getColorBorder(functionData.color)} rounded-2xl p-6`}>
              <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wide mb-3">
                Algorithm
              </h3>
              <p className={`text-lg font-semibold ${getColorText(functionData.color)}`}>
                {functionData.algorithm}
              </p>
            </div>

            {/* Inputs */}
            <div className={`${getColorBg(functionData.color)} border ${getColorBorder(functionData.color)} rounded-2xl p-6`}>
              <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wide mb-4">
                Inputs
              </h3>
              <div className="space-y-3">
                {functionData.inputs.map((input, idx) => (
                  <div key={idx} className="flex items-start justify-between py-2 border-b border-foreground/10 last:border-b-0">
                    <span className="text-foreground/70">{input.label}</span>
                    <span className={`font-mono text-sm ${getColorText(functionData.color)}`}>
                      {input.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interval */}
            <div className={`${getColorBg(functionData.color)} border ${getColorBorder(functionData.color)} rounded-2xl p-6`}>
              <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wide mb-3">
                Search Interval
              </h3>
              <div className="flex items-center justify-center gap-4">
                <span className={`text-2xl font-mono font-semibold ${getColorText(functionData.color)}`}>
                  [{functionData.interval.start}, {functionData.interval.end}]
                </span>
              </div>
            </div>

            {/* Results */}
            <div className={`${getColorBg(functionData.color)} border ${getColorBorder(functionData.color)} rounded-2xl p-6`}>
              <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wide mb-6">
                Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-xs text-foreground/60 mb-2">Root Value</p>
                  <p className={`text-xl font-mono font-semibold ${getColorText(functionData.color)}`}>
                    {functionData.results.root}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-foreground/60 mb-2">Iterations</p>
                  <p className={`text-xl font-semibold ${getColorText(functionData.color)}`}>
                    {functionData.results.iterations}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-foreground/60 mb-2">Error Margin</p>
                  <p className={`text-xl font-mono font-semibold ${getColorText(functionData.color)}`}>
                    {functionData.results.error.toExponential(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link
                href="/"
                className="flex-1 px-6 py-3 rounded-lg bg-foreground/10 text-foreground font-semibold hover:bg-foreground/20 transition-colors text-center"
              >
                Back to Home
              </Link>
              <button className={`flex-1 px-6 py-3 rounded-lg ${getColorText(functionData.color)} bg-${functionData.color}-500/20 hover:bg-${functionData.color}-500/30 font-semibold transition-colors`}>
                Visualize
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
