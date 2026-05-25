'use client';

import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function GaussSeidelPage() {
  const [n, setN] = useState(3);
  const [A, setA] = useState([[4,1,-1],[2,7,1],[1,-3,12]]);
  const [b, setB] = useState([3,19,31]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateA(i: number, j: number, val: string) {
    const newA = A.map(row => [...row]);
    newA[i][j] = parseFloat(val) || 0;
    setA(newA);
  }

  function updateB(i: number, val: string) {
    const newB = [...b];
    newB[i] = parseFloat(val) || 0;
    setB(newB);
  }

  function resizeMatrix(newN: number) {
    setN(newN);
    setA(Array.from({length: newN}, (_, i) => Array.from({length: newN}, (_, j) => A[i]?.[j] ?? 0)));
    setB(Array.from({length: newN}, (_, i) => b[i] ?? 0));
  }

  async function handleSolve() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/axe2/gauss-seidel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ A, b }),
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

  const convergenceData = result?.erreurs?.map((e: number, i: number) => ({
    iteration: i + 1,
    error: e,
  })) ?? [];

  return (
    <>
      <Header title="Gauss-Seidel" breadcrumb={['Résolution Des Systèmes Linéaires', 'Gauss-Seidel']} />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Inputs */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 space-y-5">
              <h3 className="text-lg font-semibold text-foreground">Inputs</h3>

              {/* Matrix size */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Taille n =</label>
                <select
                  value={n}
                  onChange={e => resizeMatrix(Number(e.target.value))}
                  className="bg-input border border-border text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {[2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              {/* Matrix A */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Matrice A</label>
                <div className="space-y-1">
                  {A.map((row, i) => (
                    <div key={i} className="flex gap-1">
                      {row.map((val, j) => (
                        <input
                          key={j}
                          type="number"
                          value={val}
                          onChange={e => updateA(i, j, e.target.value)}
                          className="w-full bg-input border border-border text-foreground rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vector b */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vecteur b</label>
                <div className="flex gap-1">
                  {b.map((val, i) => (
                    <input
                      key={i}
                      type="number"
                      value={val}
                      onChange={e => updateB(i, e.target.value)}
                      className="w-full bg-input border border-border text-foreground rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
                    />
                  ))}
                </div>
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
                  <h3 className="text-lg font-semibold text-foreground mb-4">Solution x</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {result.solution.map((val: number, i: number) => (
                      <div key={i} className="bg-input rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">x{i + 1}</p>
                        <p className="text-lg font-bold text-yellow-400">{val.toFixed(8)}</p>
                      </div>
                    ))}
                    <div className="bg-input rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Itérations</p>
                      <p className="text-lg font-bold text-green-400">{result.erreurs.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Convergence</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={convergenceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="iteration" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }} />
                      <Legend />
                      <Line type="monotone" dataKey="error" stroke="#eab308" strokeWidth={2} isAnimationActive={false} name="Erreur" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {!result && (
              <div className="bg-card border border-border rounded-xl p-12 flex items-center justify-center min-h-96">
                <p className="text-muted-foreground text-center">Fill in the matrix and click Solve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}