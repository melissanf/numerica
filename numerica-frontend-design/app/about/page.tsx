import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-32">
        <Header title="About Numerica" />

        <div className="px-8 py-12 max-w-4xl space-y-12">
          {/* Mission Section */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Numerica is dedicated to making numerical analysis accessible and intuitive. We believe that understanding how algorithms work is crucial for solving real-world problems. Our platform combines interactive visualization, practical implementation, and educational content to help students, researchers, and professionals master numerical methods.
            </p>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Interactive Solvers',
                  description: 'Solve non-linear equations, linear systems, and interpolation problems with visual feedback and detailed analysis.',
                  color: 'blue-400',
                },
                {
                  title: 'Algorithm Comparison',
                  description: 'Compare different algorithms on the same problem to understand their convergence behavior and performance.',
                  color: 'green-400',
                },
                {
                  title: 'Convergence Visualization',
                  description: 'Watch algorithms converge in real-time with detailed charts and metrics tracking each iteration.',
                  color: 'yellow-400',
                },
                {
                  title: 'Educational Resources',
                  description: 'Learn about numerical methods with comprehensive guides, examples, and explanations.',
                  color: 'red-400',
                },
              ].map((feature, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <h3 className={`text-lg font-semibold text-${feature.color} mb-3`}>
                    {feature.title}
                  </h3>
                  <p className="text-foreground/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Supported Algorithms Section */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Supported Algorithms</h2>
            
            <div className="space-y-8">
              {/* Non-linear Section */}
              <div className="bg-card border border-blue-400/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Solving Non-linear Functions</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Dichotomie (Bisection Method)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Newton Method
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Secante Method
                  </li>
                </ul>
              </div>

              {/* Linear Systems Section */}
              <div className="bg-card border border-green-400/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">Solving Linear Systems</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Gauss-Seidel Method
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Jacobi Method
                  </li>
                </ul>
              </div>

              {/* Interpolation Section */}
              <div className="bg-card border border-yellow-400/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Interpolation & Approximation</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    Lagrange Polynomial Interpolation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    Newton Divided Differences
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    Cubic Spline Interpolation
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Built With Modern Technology</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Numerica is built using cutting-edge web technologies to provide a smooth, responsive experience. We use Next.js for server-side rendering, React for interactive components, and Recharts for beautiful data visualization.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have feedback, suggestions, or found a bug? We&apos;d love to hear from you!
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/80 transition-colors">
                Contact Us
              </button>
              <button className="px-6 py-3 bg-border text-foreground font-semibold rounded-lg hover:bg-border/80 transition-colors">
                Report an Issue
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
