"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const API = "http://127.0.0.1:8000";

type Method = "lagrange" | "newton";

export default function InterpolationPage() {
  const [method, setMethod] = useState<Method>("lagrange");
  const [xInput, setXInput] = useState("0 1 5 8");
  const [yInput, setYInput] = useState("0 3 2 2");
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
      const res = await fetch(`${API}/axe3/interpolation/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y }),
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
            Interpolation Polynomiale
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Lagrange & Newton — Différences Divisées
          </p>

          {/* Method toggle */}
          <div className="flex gap-3 mb-8">
            {(["lagrange", "newton"] as Method[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  method === m
                    ? "bg-blue-500/30 border border-blue-400/60 text-blue-400"
                    : "bg-input border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Points X <span className="text-xs">(séparés par espace)</span>
              </label>
              <input
                value={xInput}
                onChange={(e) => setXInput(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="0 1 5 8"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Points Y <span className="text-xs">(séparés par espace)</span>
              </label>
              <input
                value={yInput}
                onChange={(e) => setYInput(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="0 3 2 2"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Calcul..." : "Calculer"}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 rounded-lg border border-red-400/30 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 space-y-6">
              {/* Polynomial */}
              {result.polynomial_str && (
                <div className="p-5 rounded-xl border border-blue-400/30 bg-blue-500/10">
                  <p className="text-xs text-blue-400/70 mb-2 uppercase tracking-wider">
                    Polynôme interpolant
                  </p>
                  <p className="text-blue-300 font-mono text-sm break-all">
                    {result.polynomial_str}
                  </p>
                </div>
              )}

              {/* Divided differences table (Newton only) */}
              {result.divided_differences && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tableau des différences divisées
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="text-xs text-foreground w-full">
                      <tbody>
                        {result.divided_differences.map(
                          (row: number[], i: number) => (
                            <tr
                              key={i}
                              className="border-b border-border/50 last:border-0"
                            >
                              {row.map((val: number, j: number) => (
                                <td
                                  key={j}
                                  className="px-4 py-2 font-mono text-right"
                                >
                                  {val !== null && val !== undefined
                                    ? val.toFixed(4)
                                    : ""}
                                </td>
                              ))}
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Plot */}
              {result.plot_base64 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Visualisation
                  </p>
                  <img
                    src={`data:image/png;base64,${result.plot_base64}`}
                    alt="Interpolation plot"
                    className="rounded-xl border border-border w-full"
                  />
                </div>
              )}

              {/* Error table */}
              {result.error_table && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tableau d'erreurs
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="text-xs text-foreground w-full">
                      <thead>
                        <tr className="border-b border-border bg-input">
                          <th className="px-4 py-2 text-left text-muted-foreground">
                            x
                          </th>
                          <th className="px-4 py-2 text-right text-muted-foreground">
                            P(x)
                          </th>
                          <th className="px-4 py-2 text-right text-muted-foreground">
                            f(x)
                          </th>
                          <th className="px-4 py-2 text-right text-muted-foreground">
                            Erreur
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.error_table.map((row: any, i: number) => (
                          <tr
                            key={i}
                            className="border-b border-border/50 last:border-0"
                          >
                            <td className="px-4 py-2 font-mono">
                              {row.x?.toFixed(4)}
                            </td>
                            <td className="px-4 py-2 font-mono text-right">
                              {row.px?.toFixed(6)}
                            </td>
                            <td className="px-4 py-2 font-mono text-right">
                              {row.fx?.toFixed(6)}
                            </td>
                            <td className="px-4 py-2 font-mono text-right text-yellow-400">
                              {row.error?.toExponential(3)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
