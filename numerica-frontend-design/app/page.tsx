import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface AlgorithmDetail {
  id: string;
  title: string;
  description: string;
  color: 'blue' | 'yellow' | 'green' | 'red' | 'pink';
  href: string;
  algorithm: string;
  inputs: string[];
  outputs: string[];
  result?: string;
  iterations?: number;
  error?: number;
}

const colorClasses: Record<string, string> = {
  blue:   'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-400/30 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20',
  yellow: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-400/30 hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-500/20',
  green:  'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-400/30 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20',
  red:    'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-400/30 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/20',
  pink:   'bg-gradient-to-br from-pink-500/20 to-pink-600/10 border-pink-400/30 hover:border-pink-400/60 hover:shadow-lg hover:shadow-pink-500/20',
};

const colorTextClasses: Record<string, string> = {
  blue:   'text-blue-400',
  yellow: 'text-yellow-400',
  green:  'text-green-400',
  red:    'text-red-400',
  pink:   'text-pink-400',
};

export default function Home() {
  const recentlyViewed: AlgorithmDetail[] = [
    {
      id: '1',
      title: 'Function 1',
      description: 'f(x) = x² + 3x + 5',
      color: 'blue',
      href: '/functions/function1',
      algorithm: 'Binary Search Algorithm',
      inputs: ['f(x)', 'a', 'b', 'tolerance'],
      outputs: ['root', 'iterations'],
      result: '1.4142135623730951',
      iterations: 45,
      error: 0.00000001,
    },
    {
      id: '2',
      title: 'Function 2',
      description: 'f(x) = x² + 3x + 5',
      color: 'yellow',
      href: '/functions/function2',
      algorithm: 'Newton-Raphson Method',
      inputs: ['f(x)', "f'(x)", 'x0', 'tolerance'],
      outputs: ['root', 'iterations'],
      result: '1.4142135623730951',
      iterations: 8,
      error: 0.000000001,
    },
    {
      id: '3',
      title: 'Function 3',
      description: 'f(x) = x² + 3x + 5',
      color: 'red',
      href: '/functions/function3',
      algorithm: 'Secant Method',
      inputs: ['f(x)', 'x0', 'x1', 'tolerance'],
      outputs: ['root', 'iterations'],
      result: '1.4142135623730951',
      iterations: 12,
      error: 0.00000001,
    },
    {
      id: '4',
      title: 'Function 4',
      description: 'f(x) = x² + 3x + 5',
      color: 'green',
      href: '/functions/function4',
      algorithm: 'Lagrange Interpolation',
      inputs: ['points', 'x'],
      outputs: ['value'],
      result: '2.5',
      iterations: 1,
      error: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-32">
        <Header title="NUMERICA" />

        <div className="px-8 py-8">
          <h2 className="text-lg font-semibold text-white">
            Solve, Visualize and Compare Numerical Algorithms
          </h2>
        </div>

        {/* Recently Viewed Section */}
        <section className="px-8 pb-12">
          <h3 className="text-lg font-semibold text-foreground mb-6">recently viewed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {recentlyViewed.map((algo) => {
              return (
                <Link
                  key={algo.id}
                  href={algo.href}
                  className={`block p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer group ${colorClasses[algo.color]}`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-2 h-2 rounded-full ${colorTextClasses[algo.color]}`} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold ${colorTextClasses[algo.color]} mb-2`}>
                    {algo.title}
                  </h3>

                  {/* Algorithm name */}
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {algo.algorithm}
                  </p>

                  {/* Footer */}
                  <div className={`mt-4 text-xs ${colorTextClasses[algo.color]}/60`}>
                    card{algo.id}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}