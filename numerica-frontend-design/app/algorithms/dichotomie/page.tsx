'use client';

import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function DichotomiePage() {
  const [functionInput, setFunctionInput] = useState('x**2 - 4');
  const [a, setA] = useState('-5');
  const [b, setB] = useState('5');
  const [tolerance, setTolerance] = useState('0.0001');
  const [result, setResult] = useState<any>(null);

  const handleSolve = () => {
    // Simulate algorithm execution with mock data
    const mockResult = {
      root: 2.0000152587890625,
      iterations: 15,
      error: 0.00008392333984375,
      convergenceData: [
        { iteration: 0, error: 2.5, value: 0 },
        { iteration: 1, error: 1.25, value: 1.25 },
        { iteration: 2, error: 0.625, value: 1.875 },
        { iteration: 3, error: 0.3125, value: 2.1875 },
        { iteration: 4, error: 0.15625, value: 2.03125 },
        { iteration: 5, error: 0.078125, value: 1.953125 },
        { iteration: 6, error: 0.0390625, value: 1.9921875 },
        { iteration: 7, error: 0.01953125, value: 2.01171875 },
        { iteration: 8, error: 0.009765625, value: 2.00195312 },
        { iteration: 9, error: 0.0048828125, value: 1.99951172 },
        { iteration: 10, error: 0.00244140625, value: 2.00024414 },
        { iteration: 11, error: 0.001220703125, value: 2.00085449 },
        { iteration: 12, error: 0.0006103515625, value: 2.00042725 },
        { iteration: 13, error: 0.00030517578125, value: 2.00012207 },
        { iteration: 14, error: 0.0001525878906, value: 2.00001526 },
      ],
    };
    setResult(mockResult);
  };

  return (
    <>
      <Header
        title="Dichotomie"
        breadcrumb={['Résolution des fonctions non linéaire', 'Dichotomie']}
      />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-foreground mb-6">Inputs</h3>

              <div className="space-y-4">
                {/* Function Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    function :
                  </label>
                  <input
                    type="text"
                    value={functionInput}
                    onChange={(e) => setFunctionInput(e.target.value)}
                    placeholder="e.g., x**2 - 4"
                    className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>

                {/* Interval A */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    interval a :
                  </label>
                  <input
                    type="text"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    placeholder="-5"
                    className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>

                {/* Interval B */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    interval b :
                  </label>
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    placeholder="5"
                    className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>

                {/* Tolerance */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    tolerance :
                  </label>
                  <input
                    type="text"
                    value={tolerance}
                    onChange={(e) => setTolerance(e.target.value)}
                    placeholder="0.0001"
                    className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>

                {/* Solve Button */}
                <button
                  onClick={handleSolve}
                  className="w-full bg-blue-500/80 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors mt-6"
                >
                  Solve
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Result Panel */}
            {result && (
              <>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">result :</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Root</p>
                      <p className="text-lg font-bold text-blue-400">
                        {result.root.toFixed(6)}
                      </p>
                    </div>
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Iterations</p>
                      <p className="text-lg font-bold text-green-400">{result.iterations}</p>
                    </div>
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Error</p>
                      <p className="text-lg font-bold text-red-400">
                        {result.error.toFixed(8)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Convergence Chart */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Convergence Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={result.convergenceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="iteration" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(20, 20, 25, 0.9)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="error"
                        stroke="rgb(239, 68, 68)"
                        isAnimationActive={false}
                        strokeWidth={2}
                        name="Error"
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="rgb(59, 130, 246)"
                        isAnimationActive={false}
                        strokeWidth={2}
                        name="Approximation"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {!result && (
              <div className="bg-card border border-border rounded-xl p-12 flex items-center justify-center min-h-96">
                <p className="text-muted-foreground text-center">
                  Fill in the parameters and click solve to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
