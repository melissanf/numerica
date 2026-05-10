'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface CustomAlgorithm {
  name: string;
  description: string;
  inputs: string;
  conditions: string;
  outputs: string;
  code: string;
  functionType: string;
}

export default function PersonalizedAlgorithm() {
  const [algorithm, setAlgorithm] = useState<CustomAlgorithm>({
    name: '',
    description: '',
    inputs: '',
    conditions: '',
    outputs: '',
    code: '',
    functionType: 'non-linear',
  });

  const [saved, setSaved] = useState(false);

  const handleInputChange = (field: keyof CustomAlgorithm, value: string) => {
    setAlgorithm({ ...algorithm, [field]: value });
  };

  const handleSave = () => {
    if (algorithm.name && algorithm.code) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-32">
        <Header title="NUMERICA" />

        <div className="px-12 py-12">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>

          {/* Page Title Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-3">Create Custom Algorithm</h1>
            <p className="text-lg text-foreground/70">
              Define your own numerical algorithm with custom inputs, conditions, and outputs
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-card border border-border rounded-2xl p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Algorithm Name */}
                <div>
                  <label className="block text-base font-bold text-foreground mb-4">
                    Algorithm Name
                  </label>
                  <input
                    type="text"
                    value={algorithm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., My Custom Solver"
                    className="w-full px-5 py-3 rounded-lg bg-foreground/5 border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-base font-bold text-foreground mb-4">
                    Description
                  </label>
                  <textarea
                    value={algorithm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what your algorithm does..."
                    rows={4}
                    className="w-full px-5 py-3 rounded-lg bg-foreground/5 border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                </div>

                {/* Function Type */}
                <div>
                  <label className="block text-base font-bold text-foreground mb-4">
                    Function Type
                  </label>
                  <select
                    value={algorithm.functionType}
                    onChange={(e) => handleInputChange('functionType', e.target.value)}
                    className="w-full px-5 py-3 rounded-lg bg-foreground/5 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="non-linear">Non-Linear Functions</option>
                    <option value="linear-systems">Linear Systems</option>
                    <option value="interpolation">Interpolation & Approximation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Inputs */}
                <div>
                  <label className="block text-base font-bold text-foreground mb-4">
                    Inputs
                  </label>
                  <input
                    type="text"
                    value={algorithm.inputs}
                    onChange={(e) => handleInputChange('inputs', e.target.value)}
                    placeholder="e.g., f(x), a, b, tolerance"
                    className="w-full px-5 py-3 rounded-lg bg-foreground/5 border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                  {algorithm.inputs && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {algorithm.inputs.split(',').map((input, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/30"
                        >
                          {input.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-foreground/50 mt-3">Define the parameters your algorithm needs</p>
                </div>

                {/* Conditions */}
                <div>
                  <label className="block text-base font-bold text-foreground mb-4">
                    Conditions & Constraints
                  </label>
                  <textarea
                    value={algorithm.conditions}
                    onChange={(e) => handleInputChange('conditions', e.target.value)}
                    placeholder="e.g., f(a)*f(b) < 0, tolerance > 0"
                    rows={4}
                    className="w-full px-5 py-3 rounded-lg bg-foreground/5 border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                  <p className="text-sm text-foreground/50 mt-3">Specify the conditions your algorithm requires</p>
                </div>

                {/* Outputs */}
                <div>
                  <label className="block text-base font-bold text-foreground mb-4">
                    Outputs
                  </label>
                  <input
                    type="text"
                    value={algorithm.outputs}
                    onChange={(e) => handleInputChange('outputs', e.target.value)}
                    placeholder="e.g., root, iterations, error"
                    className="w-full px-5 py-3 rounded-lg bg-foreground/5 border border-border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                  {algorithm.outputs && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {algorithm.outputs.split(',').map((output, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/30"
                        >
                          {output.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-foreground/50 mt-3">Define what your algorithm outputs</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8 flex flex-col">
                {/* Algorithm Code */}
                <div className="h-full flex flex-col">
                  <label className="block text-base font-bold text-foreground mb-4">
                    Algorithm Code
                  </label>
                  <textarea
                    value={algorithm.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="Paste your algorithm code here...&#10;&#10;Example:&#10;function solve(f, a, b, tol) {&#10;  while (b - a > tol) {&#10;    c = (a + b) / 2;&#10;    if (f(c) == 0) return c;&#10;    if (f(a) * f(c) < 0) b = c;&#10;    else a = c;&#10;  }&#10;  return (a + b) / 2;&#10;}"
                    rows={18}
                    className="w-full px-5 py-3 rounded-lg bg-foreground/5 border border-border text-foreground font-mono text-base placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                  />
                  <p className="text-sm text-foreground/50 mt-3">Write or paste your algorithm implementation</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-12 pt-12 border-t border-border">
              <button
                onClick={handleSave}
                className="flex-1 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors text-lg"
              >
                {saved ? '✓ Algorithm Saved' : 'Save Algorithm'}
              </button>
              <button
                onClick={() =>
                  setAlgorithm({
                    name: '',
                    description: '',
                    inputs: '',
                    conditions: '',
                    outputs: '',
                    code: '',
                    functionType: 'non-linear',
                  })
                }
                className="flex-1 px-8 py-3 rounded-lg bg-foreground/10 text-foreground font-bold hover:bg-foreground/20 transition-colors text-lg"
              >
                Clear Form
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-10 p-6 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-base text-foreground">
                <span className="font-semibold">Pro Tip:</span> Your custom algorithm will be saved and available in the recently viewed section once created.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
