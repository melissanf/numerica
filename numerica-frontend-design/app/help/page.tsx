import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ChevronDown } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      question: 'What is Numerica?',
      answer:
        'Numerica is an interactive platform for solving, visualizing, and comparing numerical algorithms. It provides tools for solving non-linear functions, linear systems, and interpolation problems.',
    },
    {
      question: 'How do I use the Dichotomie algorithm?',
      answer:
        'The Dichotomie (Bisection) algorithm is used to find roots of continuous functions. Enter your function, specify an interval [a,b] where the function changes sign, and set your tolerance level. The algorithm will narrow the interval iteratively.',
    },
    {
      question: 'What is the difference between Newton and Secante methods?',
      answer:
        'Newton&apos;s method requires the derivative of the function and converges quadratically. The Secante method doesn&apos;t require the derivative and uses two initial points, with linear convergence rate.',
    },
    {
      question: 'How are the algorithms compared?',
      answer:
        'You can compare different algorithms on the same function to see their convergence behavior, number of iterations, and accuracy. The comparison view shows performance metrics side by side.',
    },
    {
      question: 'What function syntax should I use?',
      answer:
        'Use Python-like syntax: ** for exponents, + for addition, - for subtraction, * for multiplication, / for division. Example: x**2 - 4*x + 3',
    },
    {
      question: 'Can I export my results?',
      answer:
        'Currently, you can take screenshots of the results. Full export functionality is coming soon!',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-32">
        <Header title="Help & Documentation" />

        <div className="px-8 py-12 max-w-4xl">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-8">
              Find answers to common questions about using Numerica.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group border border-border rounded-lg bg-card hover:border-primary/50 transition-colors"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground border-t border-border pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Step 1: Choose an Algorithm</h3>
                <p className="text-foreground/80">
                  Browse the available algorithms in the Menu. Select from non-linear solvers, linear system solvers, or interpolation methods.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Step 2: Enter Your Problem</h3>
                <p className="text-foreground/80">
                  Provide the function, initial parameters, and tolerance level. Use standard mathematical notation and Python-like syntax for expressions.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Step 3: Run the Algorithm</h3>
                <p className="text-foreground/80">
                  Click the Solve button to execute the algorithm. The results will show the root/solution, number of iterations, and convergence analysis.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Step 4: Analyze & Compare</h3>
                <p className="text-foreground/80">
                  View detailed visualizations of the algorithm&apos;s convergence behavior. Use the comparison dashboard to evaluate multiple algorithms on the same problem.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
