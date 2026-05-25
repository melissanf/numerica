'use client';

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";
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
} from "recharts";

const ALGOS = [
  { id: "dichotomie", name: "Dichotomie", color: "#3b82f6" },
  { id: "newton", name: "Newton", color: "#ef4444" },
  { id: "secante", name: "Sécante", color: "#22c55e" },
];

const COMPARISON_TABLE = [
  {
    aspect: "Convergence",
    dichotomie: "Linéaire",
    newton: "Quadratique",
    secante: "Superlinéaire",
  },
  {
    aspect: "Dérivée requise",
    dichotomie: "Non",
    newton: "Oui",
    secante: "Non",
  },
  {
    aspect: "Points initiaux",
    dichotomie: "2 (intervalle)",
    newton: "1 point",
    secante: "2 points",
  },
  {
    aspect: "Robustesse",
    dichotomie: "Très fiable",
    newton: "Sensible à x0",
    secante: "Modérée",
  },
];

export default function ComparePage() {
  const [selected, setSelected] = useState(["dichotomie", "newton", "secante"]);
  const [fn, setFn] = useState("x**2 - 4");
  const [a, setA] = useState("0");
  const [b, setB] = useState("5");
  const [x0, setX0] = useState("1");
  const [x1, setX1] = useState("3");
  const [epsilon, setEpsilon] = useState("1e-7");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }

  async function handleCompare() {
    setLoading(true);
    setError(null);
    setResults({});

    const calls: Record<string, Promise<any>> = {};
    const eps = parseFloat(epsilon);

    if (selected.includes("dichotomie")) {
      calls.dichotomie = fetch(`/api/axe1/dichotomie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ f: fn, a: parseFloat(a), b: parseFloat(b), eps }),
      }).then((r) => r.json());
    }

    if (selected.includes("newton")) {
      calls.newton = fetch(`/api/axe1/newton`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ f: fn, x0: parseFloat(x0), eps }),
      }).then((r) => r.json());
    }

    if (selected.includes("secante")) {
      calls.secante = fetch(`/api/axe1/secante`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ f: fn, x0: parseFloat(x0), x1: parseFloat(x1), eps }),
      }).then((r) => r.json());
    }

    try {
      const resolved: Record<string, any> = {};
      await Promise.all(
        Object.entries(calls).map(async ([id, promise]) => {
          const res = await promise;
          if (res.detail) throw new Error(`${ALGOS.find(a=>a.id===id)?.name}: ${res.detail}`);
          resolved[id] = res;
        }),
      );
      setResults(resolved);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Build convergence chart data — align by iteration index
  const maxIter = Math.max(
    ...Object.values(results).map((r: any) => r.convergence_data?.length ?? 0),
  );
  const convergenceData = Array.from({ length: maxIter }, (_, i) => {
    const row: any = { iteration: i };
    for (const [id, r] of Object.entries(results)) {
      row[id] = r.convergence_data?.[i]?.error ?? null;
    }
    return row;
  });

  // Bar chart data
  const metricsData = [
    {
      metric: "Itérations",
      ...Object.fromEntries(
        Object.entries(results).map(([id, r]) => [id, r.iterations ?? 0]),
      ),
    },
    {
      metric: `Erreur (eps=${epsilon})`,
      ...Object.fromEntries(
        Object.entries(results).map(([id, r]) => [
          id,
          r.error ? r.error : 0,
        ]),
      ),
    },
  ];

  const hasResults = Object.keys(results).length > 0;
  
  const validResults = Object.entries(results).filter(
    ([id, r]) => r.racine !== null
  );

  let iterWinner = null;
  let errorWinner = null;

  if (validResults.length > 1) {
    let winnerByIterations = { id: '', val: Infinity };
    let winnerByError = { id: '', val: Infinity };

    for (const [id, r] of validResults) {
      if (r.iterations < winnerByIterations.val) {
        winnerByIterations = { id, val: r.iterations };
      }
      if (r.error < winnerByError.val) {
        winnerByError = { id, val: r.error };
      }
    }
    iterWinner = ALGOS.find(a => a.id === winnerByIterations.id);
    errorWinner = ALGOS.find(a => a.id === winnerByError.id);
  }


  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-32">
        <Header title="NUMERICA" />
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Controls */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-foreground">
              Comparer les algorithmes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  f(x)
                </label>
                <input
                  value={fn}
                  onChange={(e) => setFn(e.target.value)}
                  className="w-full bg-input border border-border text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Intervalle [a, b]
                </label>
                <div className="flex gap-2">
                  <input
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    placeholder="a"
                    className="w-full bg-input border border-border text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                  <input
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    placeholder="b"
                    className="w-full bg-input border border-border text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Points initiaux x0, x1
                </label>
                <div className="flex gap-2">
                  <input
                    value={x0}
                    onChange={(e) => setX0(e.target.value)}
                    placeholder="x0"
                    className="w-full bg-input border border-border text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                  <input
                    value={x1}
                    onChange={(e) => setX1(e.target.value)}
                    placeholder="x1"
                    className="w-full bg-input border border-border text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
               <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Epsilon (précision)
                </label>
                <input
                  value={epsilon}
                  onChange={(e) => setEpsilon(e.target.value)}
                  placeholder="1e-7"
                  className="w-full bg-input border border-border text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between gap-4 flex-wrap">
              <div className="flex gap-2">
                {ALGOS.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => toggle(algo.id)}
                    style={
                      selected.includes(algo.id)
                        ? { backgroundColor: algo.color, color: "white" }
                        : {}
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      selected.includes(algo.id)
                        ? "border-transparent"
                        : "bg-input border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {algo.name}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCompare}
                disabled={loading || selected.length === 0}
                className="px-8 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                {loading ? "Calcul..." : "Comparer"}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg border border-red-400/30 bg-red-500/10 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Results summary */}
          {hasResults && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ALGOS.filter((a) => results[a.id]).map((algo) => {
                const r = results[algo.id];
                return (
                  <div
                    key={algo.id}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <h4
                      className="font-semibold mb-3"
                      style={{ color: algo.color }}
                    >
                      {algo.name}
                    </h4>
                    {r.racine === null ? (
                      <p className="text-red-400 text-sm">{r.message || "Erreur de calcul"}</p>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Racine</span>
                          <span className="font-mono text-foreground">
                            {r.racine?.toFixed(8)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Itérations
                          </span>
                          <span className="font-mono text-green-400">
                            {r.iterations}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Erreur</span>
                          <span className="font-mono text-yellow-400">
                            {r.error?.toExponential(3)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Dynamic Winner Analysis */}
          {iterWinner && errorWinner && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                🏆 Who won this race?
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Convergence la plus rapide (moins d'itérations)</span>
                  <span className="font-semibold px-2 py-1 rounded-md text-white" style={{backgroundColor: iterWinner.color}}>{iterWinner.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Meilleure précision (erreur la plus faible)</span>
                  <span className="font-semibold px-2 py-1 rounded-md text-white" style={{backgroundColor: errorWinner.color}}>{errorWinner.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          {hasResults && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Convergence des erreurs
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={convergenceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis dataKey="iteration" stroke="rgba(255,255,255,0.5)" />
                    <YAxis
                      scale="log"
                      domain={['auto', 'auto']}
                      stroke="rgba(255,255,255,0.5)" 
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(20,20,25,0.9)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    {ALGOS.filter((a) => results[a.id]?.racine !== null).map(
                      (algo) => (
                        <Line
                          key={algo.id}
                          type="monotone"
                          dataKey={algo.id}
                          stroke={algo.color}
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                          name={algo.name}
                          connectNulls
                        />
                      ),
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Métriques
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(20,20,25,0.9)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    {ALGOS.filter((a) => results[a.id]?.racine !== null).map(
                      (algo) => (
                        <Bar
                          key={algo.id}
                          dataKey={algo.id}
                          fill={algo.color}
                          name={algo.name}
                        />
                      ),
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Conclusion */}
          {hasResults && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Conclusion : Quel est le meilleur ?
              </h3>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Le &quot;meilleur&quot; algorithme dépend entièrement de votre problème et de vos contraintes.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong style={{ color: '#3b82f6' }}>La méthode de dichotomie est la plus robuste.</strong> Si vous avez un intervalle où la fonction change de signe, elle est garantie de trouver une racine. Cependant, elle est aussi la plus lente. Choisissez-la pour la fiabilité avant tout.
                  </li>
                  <li>
                    <strong style={{ color: '#ef4444' }}>La méthode de Newton est la plus rapide (convergence quadratique).</strong> Cependant, elle nécessite le calcul de la dérivée, et peut échouer si le point de départ est mal choisi. Utilisez-la si vous pouvez facilement calculer la dérivée et avez une bonne idée du point de départ.
                  </li>
                  <li>
                    <strong style={{ color: '#22c55e' }}>La méthode de la sécante est un excellent compromis.</strong> Elle est presque aussi rapide que Newton (convergence superlinéaire) mais n'a pas besoin de la dérivée. C'est souvent le choix par défaut dans beaucoup de cas.
                  </li>
                </ul>
                <p className="pt-2">
                  En résumé : <strong>Pour la vitesse, Newton. Pour la fiabilité, Dichotomie. Pour un bon équilibre, Sécante.</strong>
                </p>
              </div>
            </div>
          )}

          {/* Static comparison table */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Comparaison théorique
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground">
                      Aspect
                    </th>
                    <th className="text-left py-3 px-4 text-blue-400">
                      Dichotomie
                    </th>
                    <th className="text-left py-3 px-4 text-red-400">Newton</th>
                    <th className="text-left py-3 px-4 text-green-400">
                      Sécante
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/50 hover:bg-input/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-foreground font-medium">
                        {row.aspect}
                      </td>
                      <td className="py-3 px-4 text-foreground/80">
                        {row.dichotomie}
                      </td>
                      <td className="py-3 px-4 text-foreground/80">
                        {row.newton}
                      </td>
                      <td className="py-3 px-4 text-foreground/80">
                        {row.secante}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
