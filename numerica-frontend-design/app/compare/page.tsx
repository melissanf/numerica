'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ComparePage() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(['dichotomie', 'newton', 'secante']);
  const [functionInput, setFunctionInput] = useState('x**2 - 4');

  const algorithms = [
    { id: 'dichotomie', name: 'Dichotomie', color: '#3b82f6' },
    { id: 'newton', name: 'Newton', color: '#ef4444' },
    { id: 'secante', name: 'Secante', color: '#22c55e' },
  ];

  const comparisonData = [
    {
      metric: 'Iterations',
      dichotomie: 15,
      newton: 5,
      secante: 8,
    },
    {
      metric: 'Convergence Speed',
      dichotomie: 2,
      newton: 5,
      secante: 4,
    },
    {
      metric: 'Final Error',
      dichotomie: 0.00008,
      newton: 0.0000001,
      secante: 0.00001,
    },
  ];

  const convergenceData = [
    { iteration: 0, dichotomie: 2.5, newton: 1, secante: 1.5 },
    { iteration: 1, dichotomie: 1.25, newton: 0.1, secante: 1.0 },
    { iteration: 2, dichotomie: 0.625, newton: 0.01, secante: 0.5 },
    { iteration: 3, dichotomie: 0.3125, newton: 0.001, secante: 0.2 },
    { iteration: 4, dichotomie: 0.15625, newton: 0.0001, secante: 0.08 },
    { iteration: 5, dichotomie: 0.078125, newton: 0.00001, secante: 0.02 },
  ];

  const comparisonTable = [
    {
      aspect: 'Convergence Type',
      dichotomie: 'Linear',
      newton: 'Quadratic',
      secante: 'Superlinear',
    },
    {
      aspect: 'Derivative Required',
      dichotomie: 'No',
      newton: 'Yes',
      secante: 'No',
    },
    {
      aspect: 'Initial Points Needed',
      dichotomie: '2 (interval)',
      newton: '1 point',
      secante: '2 points',
    },
    {
      aspect: 'Typical Use Case',
      dichotomie: 'Simple, reliable',
      newton: 'Fast convergence',
      secante: 'No derivative available',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-32">
        <Header title="Algorithm Comparison" />

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Comparison Controls */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Compare Algorithms</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Function :
                </label>
                <input
                  type="text"
                  value={functionInput}
                  onChange={(e) => setFunctionInput(e.target.value)}
                  placeholder="e.g., x**2 - 4"
                  className="w-full bg-input text-foreground placeholder-muted-foreground px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Algorithms :
                </label>
                <div className="flex flex-wrap gap-2">
                  {algorithms.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => {
                        setSelectedAlgorithms((prev) =>
                          prev.includes(algo.id)
                            ? prev.filter((a) => a !== algo.id)
                            : [...prev, algo.id]
                        );
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedAlgorithms.includes(algo.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-input text-foreground hover:bg-input/80'
                      }`}
                    >
                      {algo.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart - Metrics */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 25, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="dichotomie" fill="#3b82f6" />
                  <Bar dataKey="newton" fill="#ef4444" />
                  <Bar dataKey="secante" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart - Convergence */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Convergence Behavior</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={convergenceData}>
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
                  <Line type="monotone" dataKey="dichotomie" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="newton" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="secante" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Aspect</th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-400">Dichotomie</th>
                    <th className="text-left py-3 px-4 font-semibold text-red-400">Newton</th>
                    <th className="text-left py-3 px-4 font-semibold text-green-400">Secante</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-border/50 hover:bg-input/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-foreground font-medium">{row.aspect}</td>
                      <td className="py-3 px-4 text-foreground/80">{row.dichotomie}</td>
                      <td className="py-3 px-4 text-foreground/80">{row.newton}</td>
                      <td className="py-3 px-4 text-foreground/80">{row.secante}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">Use Dichotomie</h4>
                <p className="text-sm text-foreground/80">
                  When you want a guaranteed, slow but reliable method. Good for educational purposes.
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-2">Use Newton</h4>
                <p className="text-sm text-foreground/80">
                  When you have the derivative and need fast convergence. Requires careful initial guess.
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2">Use Secante</h4>
                <p className="text-sm text-foreground/80">
                  When you can&apos;t compute the derivative but need reasonably fast convergence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
