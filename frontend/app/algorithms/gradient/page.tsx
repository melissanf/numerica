'use client';

import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function GradientPage() {
  const [f, setF] = useState('(x-2)**2 + 5');
  const [x0, setX0] = useState(10);
  const [lr, setLr] = useState(0.1);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSolve() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/axe3/gradient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ f, x0, lr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Erreur serveur');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const convergenceData = result?.convergence_data?.map((item: any) => ({...item, error: item.cost})) ?? [];

  return (
    <>
      <Header title="Gradient Descent" breadcrumb={['Interpolation Et Approximation', 'Gradient Descent']} />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Inputs */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 space-y-5">
              <h3 className="text-lg font-semibold text-foreground">Inputs</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Function f(x)</label>
                <input
                  type="text"
                  value={f}
                  onChange={e => setF(e.target.value)}
                  className="w-full bg-input border border-border text-foreground rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Initial Point x0</label>
                <input
                  type="number"
                  value={x0}
                  onChange={e => setX0(Number(e.target.value))}
                  className="w-full bg-input border border-border text-foreground rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Learning Rate</label>
                <input
                  type="number"
                  value={lr}
                  onChange={e => setLr(Number(e.target.value))}
                  className="w-full bg-input border border-border text-foreground rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <button
                onClick={handleSolve}
                disabled={loading}
                className="w-full bg-purple-500/80 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Calcul...' : 'Solve'}
              </button>

              {error && (
                <div className="p-3 rounded-lg border border-red-400/30 bg-red-500/10 text-red-400 text-xs">{error}</div>
              )}
            </div>
          </div>

          {/* Right — Results */}
          <div className="lg:col-span-2 space-y-6">
            {result && (
              <>
                 <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Minimum</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">x</p>
                      <p className="text-lg font-bold text-purple-400">{result.min_x?.toFixed(8)}</p>
                    </div>
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">cost</p>
                      <p className="text-lg font-bold text-purple-400">{result.min_cost?.toFixed(8)}</p>
                    </div>
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Itérations</p>
                      <p className="text-lg font-bold text-green-400">{result.iterations}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Convergence</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={convergenceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="iteration" stroke="rgba(255,255,255,0.5)" />
                      <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
                      <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="error" stroke="#8884d8" name="Cost" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {!result && (
              <div className="bg-card border border-border rounded-xl p-12 flex items-center justify-center min-h-96">
                <p className="text-muted-foreground text-center">Fill in the function and parameters and click Solve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}