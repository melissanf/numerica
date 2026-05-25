'use client';

import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function NewtonPage() {
  const [functionInput, setFunctionInput] = useState('x**2 - 4');
  const [derivative, setDerivative] = useState('2*x');
  const [x0, setX0] = useState('1');
  const [tolerance, setTolerance] = useState('0.0001');
  const [result, setResult] = useState<any>(null);

  const handleSolve = async () => {
    try {
      const response = await fetch('/api/axe1/newton', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ f: functionInput, x0: parseFloat(x0), a: -5, b: 5, eps: parseFloat(tolerance) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error solving:", error);
      // Handle error state in the UI
    }
  };

  return (
    <>
      <Header
        title="Newton"
        breadcrumb={['Résolution des fonctions non linéaire', 'Newton']}
      />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-foreground mb-6">Inputs</h3>

              <div className="space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    derivative :
                  </label>
                  <input
                    type="text"
                    value={derivative}
                    onChange={(e) => setDerivative(e.target.value)}
                    placeholder="e.g., 2*x"
                    className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    x0 :
                  </label>
                  <input
                    type="text"
                    value={x0}
                    onChange={(e) => setX0(e.target.value)}
                    placeholder="1"
                    className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>

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

                <button
                  onClick={handleSolve}
                  className="w-full bg-red-500/80 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors mt-6"
                >
                  Solve
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {result && (
              <>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">result :</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Root</p>
                      <p className="text-lg font-bold text-red-400">
                        {result?.racine?.toFixed(6) ?? "No root found"}
                      </p>
                    </div>
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Iterations</p>
                      <p className="text-lg font-bold text-green-400">{result.iterations}</p>
                    </div>
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Error</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {result?.error?.toFixed(8) ?? "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Convergence Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={result.convergence_data}>
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
                        stroke="rgb(220, 38, 38)"
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
