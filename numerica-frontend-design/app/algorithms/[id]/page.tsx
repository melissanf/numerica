'use client';

import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const algorithmInfo: Record<string, any> = {
  'gauss-seidel': {
    name: 'Gauss-Seidel',
    category: 'Résolution Des Systèmes Linéaires',
    color: 'yellow-400',
    description: 'Méthode itérative pour résoudre des systèmes linéaires Ax = b',
  },
  jacobi: {
    name: 'Jacobi',
    category: 'Résolution Des Systèmes Linéaires',
    color: 'pink-400',
    description: 'Méthode de Jacobi pour l\'approximation des solutions',
  },
  lagrange: {
    name: 'Lagrange',
    category: 'Interpolation Et Approximation',
    color: 'blue-400',
    description: 'Interpolation polynomiale de Lagrange',
  },
  'newton-dd': {
    name: 'Newton Divided Differences',
    category: 'Interpolation Et Approximation',
    color: 'yellow-400',
    description: 'Différences divisées de Newton pour l\'interpolation',
  },
  spline: {
    name: 'Spline Cubique',
    category: 'Interpolation Et Approximation',
    color: 'red-400',
    description: 'Interpolation par splines cubiques',
  },
  function3: {
    name: 'Function3',
    category: 'Algorithms',
    color: 'pink-400',
    description: 'Algorithme avancé de résolution',
  },
};

export default function AlgorithmPage({ params }: { params: { id: string } }) {
  const info = algorithmInfo[params.id] || { name: 'Algorithm', category: 'Algorithms', color: 'blue-400', description: 'Algorithm description' };
  const [result, setResult] = useState<any>(null);

  const mockConvergenceData = [
    { iteration: 0, error: 1.0, value: 0 },
    { iteration: 1, error: 0.5, value: 0.5 },
    { iteration: 2, error: 0.25, value: 0.75 },
    { iteration: 3, error: 0.125, value: 0.875 },
    { iteration: 4, error: 0.0625, value: 0.9375 },
  ];

  const handleSolve = () => {
    setResult({
      root: 2.0,
      iterations: 8,
      error: 0.00001,
      convergenceData: mockConvergenceData,
    });
  };

  return (
    <>
      <Header title={info.name} breadcrumb={[info.category, info.name]} />

      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-foreground mb-6">Inputs</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Parameter 1 :
                  </label>
                  <input
                    type="text"
                    placeholder="Enter value"
                    className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Parameter 2 :
                  </label>
                  <input
                    type="text"
                    placeholder="Enter value"
                    className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tolerance :
                  </label>
                  <input
                    type="text"
                    placeholder="0.0001"
                    className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>

                <button
                  onClick={handleSolve}
                  className={`w-full bg-${info.color.split('-')[0]}-500/80 hover:bg-${info.color.split('-')[0]}-600 text-white font-semibold py-2 rounded-lg transition-colors mt-6`}
                  style={{
                    backgroundColor: info.color === 'yellow-400' ? '#eab308' : info.color === 'pink-400' ? '#ec4899' : '#3b82f6',
                  }}
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
                      <p className="text-sm text-muted-foreground">Result</p>
                      <p className={`text-lg font-bold text-${info.color}`}>
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
