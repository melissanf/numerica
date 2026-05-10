"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const API = "http://127.0.0.1:8000";

type FnId = "A" | "B";

export default function GradientPage() {
  const [fnId, setFnId] = useState<FnId>("A");
  const [alpha, setAlpha] = useState("0.01");
  const [eps, setEps] = useState("1e-5");
  const [x0, setX0] = useState("3");
  const [y0, setY0] = useState("3");
  const [t, setT] = useState("1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API}/axe3/gradient/descente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          function_id: fnId,
          alpha: parseFloat(alpha),
          eps: parseFloat(eps),
          x0: [parseFloat(x0), parseFloat(y0)],
          t: parseFloat(t),
        }),
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
            Descente de Gradient
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Algorithme à pas fixe α
          </p>

          {/* Function selector */}
          <div className="flex gap-3 mb-8">
            {(["A", "B"] as FnId[]).map((f) => (
              <button
                key={f}
                onClick={() => setFnId(f)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  fnId === f
                    ? "bg-green-500/30 border border-green-400/60 text-green-400"
                    : "bg-input border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Fonction {f}
              </button>
            ))}
          </div>

          {/* Function description */}
          <div className="mb-6 p-4 rounded-xl border border-border bg-input text-sm text-muted-foreground font-mono">
            {fnId === "A"
              ? "f(x,y) = x² + 2y² + xy + x − y + 30"
              : "f(x,y) = 1 / (1 + t·x² + y²)"}
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "α (pas)",
                value: alpha,
                set: setAlpha,
                placeholder: "0.01",
              },
              {
                label: "ε (critère)",
                value: eps,
                set: setEps,
                placeholder: "1e-5",
              },
              { label: "x₀", value: x0, set: setX0, placeholder: "3" },
              { label: "y₀", value: y0, set: setY0, placeholder: "3" },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="block text-sm text-muted-foreground mb-2">
                  {label}
                </label>
                <input
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
            ))}
          </div>

          {fnId === "B" && (
            <div className="mb-6 w-32">
              <label className="block text-sm text-muted-foreground mb-2">
                Paramètre t
              </label>
              <input
                value={t}
                onChange={(e) => setT(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Calcul..." : "Lancer"}
          </button>

          {error && (
            <div className="mt-6 p-4 rounded-lg border border-red-400/30 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6">
              {/* Convergence summary */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Solution x*",
                    value: result.final_point?.[0]?.toFixed(6) ?? "—",
                    color: "text-green-400",
                  },
                  {
                    label: "Solution y*",
                    value: result.final_point?.[1]?.toFixed(6) ?? "—",
                    color: "text-green-400",
                  },
                  {
                    label: "f(x*, y*)",
                    value: result.final_value?.toFixed(6) ?? "—",
                    color: "text-blue-400",
                  },
                  {
                    label: "Itérations",
                    value: result.iterations ?? "—",
                    color: "text-yellow-400",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="p-4 rounded-xl border border-border bg-input text-center"
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {label}
                    </p>
                    <p className={`font-mono font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Plots */}
              {result.plot_contour_base64 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Courbes de niveau + trajectoire
                  </p>
                  <img
                    src={`data:image/png;base64,${result.plot_contour_base64}`}
                    alt="Contour plot"
                    className="rounded-xl border border-border w-full"
                  />
                </div>
              )}

              {result.plot_3d_base64 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Surface 3D
                  </p>
                  <img
                    src={`data:image/png;base64,${result.plot_3d_base64}`}
                    alt="3D surface"
                    className="rounded-xl border border-border w-full"
                  />
                </div>
              )}

              {/* Iteration history (last 10) */}
              {result.history && result.history.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Historique (dernières {Math.min(10, result.history.length)}{" "}
                    itérations)
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="text-xs text-foreground w-full">
                      <thead>
                        <tr className="border-b border-border bg-input">
                          <th className="px-4 py-2 text-left text-muted-foreground">
                            Iter
                          </th>
                          <th className="px-4 py-2 text-right text-muted-foreground">
                            x
                          </th>
                          <th className="px-4 py-2 text-right text-muted-foreground">
                            y
                          </th>
                          <th className="px-4 py-2 text-right text-muted-foreground">
                            f(x,y)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.history
                          .slice(-10)
                          .map((row: any, i: number) => (
                            <tr
                              key={i}
                              className="border-b border-border/50 last:border-0"
                            >
                              <td className="px-4 py-2 text-muted-foreground">
                                {row.iter}
                              </td>
                              <td className="px-4 py-2 font-mono text-right">
                                {row.x?.toFixed(6)}
                              </td>
                              <td className="px-4 py-2 font-mono text-right">
                                {row.y?.toFixed(6)}
                              </td>
                              <td className="px-4 py-2 font-mono text-right text-green-400">
                                {row.f?.toFixed(6)}
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
