'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Play, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const API = 'http://127.0.0.1:8000';
const STORAGE_KEY = 'numerica_saved_algos';

interface SavedAlgo {
  id: string;
  name: string;
  code: string;
  savedAt: string;
}

export default function PersonalizedPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<SavedAlgo[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Load saved algos from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
  }, []);

  function persist(algos: SavedAlgo[]) {
    setSaved(algos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(algos));
  }

  function saveAlgo() {
    if (!name.trim() || !code.trim()) return;
    const algo: SavedAlgo = {
      id: Date.now().toString(),
      name: name.trim(),
      code,
      savedAt: new Date().toLocaleString(),
    };
    persist([algo, ...saved]);
  }

  function deleteAlgo(id: string) {
    persist(saved.filter(a => a.id !== id));
  }

  function loadAlgo(algo: SavedAlgo) {
    setName(algo.name);
    setCode(algo.code);
    setOutput(null);
    setError(null);
  }

  async function runCode() {
    setLoading(true);
    setOutput(null);
    setError(null);
    try {
      const res = await fetch(`${API}/custom/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, timeout: 5 }),
      });
      const data = await res.json();
      setOutput(data.output);
      setError(data.error);
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
        <div className="px-8 py-8 max-w-6xl">

          <h2 className="text-xl font-semibold text-white mb-1">Custom Algorithm</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Write Python code — allowed: <span className="text-primary font-mono">math, numpy, scipy, matplotlib</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Editor */}
            <div className="lg:col-span-2 space-y-4">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Algorithm name (to save)"
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder={`import numpy as np\n\nx = np.linspace(0, 10, 5)\nprint(x)`}
                rows={16}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />

              <div className="flex gap-3">
                <button
                  onClick={runCode}
                  disabled={loading || !code.trim()}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  {loading ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={saveAlgo}
                  disabled={!name.trim() || !code.trim()}
                  className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-input transition-colors disabled:opacity-50 text-sm"
                >
                  Save
                </button>
              </div>

              {/* Output */}
              {(output || error) && (
                <div className={`rounded-xl border p-4 font-mono text-sm whitespace-pre-wrap ${
                  error
                    ? 'border-red-400/30 bg-red-500/10 text-red-400'
                    : 'border-green-400/30 bg-green-500/10 text-green-300'
                }`}>
                  {error || output}
                </div>
              )}
            </div>

            {/* Saved algos */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Saved</h3>
              {saved.length === 0 && (
                <p className="text-xs text-muted-foreground">No saved algorithms yet.</p>
              )}
              {saved.map(algo => (
                <div key={algo.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <button
                      onClick={() => loadAlgo(algo)}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left flex-1"
                    >
                      {algo.name}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExpanded(expanded === algo.id ? null : algo.id)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        {expanded === algo.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteAlgo(algo.id)}
                        className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {expanded === algo.id && (
                    <div className="px-4 pb-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mt-2 mb-1">{algo.savedAt}</p>
                      <pre className="text-xs font-mono text-foreground/70 overflow-x-auto">{algo.code.slice(0, 200)}{algo.code.length > 200 ? '...' : ''}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}