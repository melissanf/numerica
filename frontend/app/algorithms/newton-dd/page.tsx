'use client';

import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function NewtonDDPage() {
  const [x, setX] = useState('1, 2, 3, 4');
  const [y, setY] = useState('1, 4, 9, 16');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSolve() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const x_nodes = x.split(',').map(v => parseFloat(v.trim()));
      const y_nodes = y.split(',').map(v => parseFloat(v.trim()));

      const res = await fetch(`/api/axe3/interpolation/newton`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: x_nodes, y: y_nodes }),
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

  return (
    <>
      <Header title="Newton Divided Differences" breadcrumb={['Interpolation Et Approximation', 'Newton DD']} />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Inputs */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 space-y-5">
              <h3 className="text-lg font-semibold text-foreground">Inputs</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">X Nodes</label>
                <input
                  type="text"
                  value={x}
                  onChange={e => setX(e.target.value)}
                  className="w-full bg-input border border-border text-foreground rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Y Nodes</label>
                <input
                  type="text"
                  value={y}
                  onChange={e => setY(e.target.value)}
                  className="w-full bg-input border border-border text-foreground rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
                />
              </div>

              <button
                onClick={handleSolve}
                disabled={loading}
                className="w-full bg-yellow-500/80 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
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
                  <h3 className="text-lg font-semibold text-foreground mb-4">Polynomial</h3>
                  <p className="text-sm text-muted-foreground">{result.polynomial_str}</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Plot</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <img src={`data:image/png;base64,${result.plot_base64}`} alt="Plot" />
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {!result && (
              <div className="bg-card border border-border rounded-xl p-12 flex items-center justify-center min-h-96">
                <p className="text-muted-foreground text-center">Fill in the nodes and click Solve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}