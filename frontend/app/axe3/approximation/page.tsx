"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const API = "http://127.0.0.1:8000";

export default function ApproximationPage() {
  const [xInput, setXInput] = useState("1.3 1.5 2.5 2.5 2.7 3 4 5");
  const [yInput, setYInput] = useState("2.3 3.5 3.5 4.5 4.7 3 2 1");
  const [degreeMax, setDegreeMax] = useState(4);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const x = xInput.trim().split(/\s+/).map(Number);
      const y = yInput.trim().split(/\s+/).map(Number);
      const res = await fetch(`${API}/axe3/approximation/moindres-carres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, degree_max: degreeMax }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Erreur serveur");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-32">
        <Header title="NUMERICA" />
        <div className="px-8 py-8 max-w-4xl">
          <h2 className="text-xl font-semibold text-white mb-1">
            Moindres Carrés
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Approximation polynomiale P₁ → P₄
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Points X
              </label>
              <input
                value={xInput}
                onChange={(e) => setXInput(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Points Y
              </label>
              <input
                value={yInput}
                onChange={(e) => setYInput(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-muted-foreground mb-2">
              Degré max s = {degreeMax}
            </label>
            <input
              type="range"
              min={1}
              max={4}
              value={degreeMax}
              onChange={(e) => setDegreeMax(Number(e.target.value))}
              className="w-48 accent-yellow-400"
            />
            <div className="flex justify-between text-xs text-muted-foreground w-48 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Calcul..." : "Calculer"}
          </button>

          {error && (
            <div className="mt-6 p-4 rounded-lg border border-red-400/30 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6">
              {/* Cost table */}
              {result.polynomials && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Polynômes & coûts
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="text-xs text-foreground w-full">
                      <thead>
                        <tr className="border-b border-border bg-input">
                          <th className="px-4 py-2 text-left text-muted-foreground">
                            Degré
                          </th>
                          <th className="px-4 py-2 text-left text-muted-foreground">
                            Polynôme
                          </th>
                          <th className="px-4 py-2 text-right text-muted-foreground">
                            Coût (MSE)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(result.polynomials).map(
                          (p: any, i: number) => (
                            <tr
                              key={i}
                              className="border-b border-border/50 last:border-0"
                            >
                              <td className="px-4 py-2 text-yellow-400 font-bold">
                                P{p.degree ?? "?"}
                              </td>
                              <td className="px-4 py-2 font-mono break-all">
                                {p.polynomial_str}
                              </td>
                              <td className="px-4 py-2 font-mono text-right text-yellow-300">
                                {p.cost?.toExponential(4)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {result.plot_base64 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Visualisation
                  </p>
                  <img
                    src={`data:image/png;base64,${result.plot_base64}`}
                    alt="Approximation plot"
                    className="rounded-xl border border-border w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
