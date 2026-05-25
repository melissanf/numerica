import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AlgorithmCard from "@/components/AlgorithmCard";
import { Search } from "lucide-react";

export default function MenuPage() {
  const algorithms = {
    "Résolution des fonctions non linéaire": [
      {
        id: "1",
        title: "Dichotomie",
        description: "Algorithme de dichotomie pour résoudre f(x) = 0",
        color: "blue" as const,
        href: "/algorithms/dichotomie",
      },
      {
        id: "2",
        title: "Newton",
        description: "Méthode de Newton pour la recherche de racines",
        color: "red" as const,
        href: "/algorithms/newton",
      },
      {
        id: "3",
        title: "Secante",
        description: "Méthode de la sécante pour l'approximation",
        color: "green" as const,
        href: "/algorithms/secante",
      },
    ],
    "Résolution Des Systèmes Linéaires": [
      {
        id: "4",
        title: "Gauss-Seidel",
        description: "Méthode itérative pour résoudre Ax = b",
        color: "yellow" as const,
        href: "/algorithms/gauss-seidel",
      },
      {
        id: "5",
        title: "Jacobi",
        description: "Méthode de Jacobi pour les systèmes linéaires",
        color: "pink" as const,
        href: "/algorithms/jacobi",
      },
    ],
    "Interpolation Et Approximation": [
      {
        id: "6",
        title: "Lagrange",
        description: "Interpolation polynomiale de Lagrange",
        color: "blue" as const,
        href: "/axe3/interpolation",
      },
      {
        id: "7",
        title: "Newton (Différences Divisées)",
        description: "Différences divisées de Newton",
        color: "yellow" as const,
        href: "/axe3/interpolation",
      },
      {
        id: "8",
        title: "Moindres Carrés",
        description: "Approximation polynomiale au sens des MC",
        color: "red" as const,
        href: "/axe3/approximation",
      },
      {
        id: "9",
        title: "Descente de Gradient",
        description: "Optimisation par gradient à pas fixe",
        color: "green" as const,
        href: "/axe3/gradient",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-32">
        <Header title="NUMERICA" />

        {/* Search Section */}
        <div className="px-8 py-8">
          <div className="flex items-center gap-3 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="search"
                className="w-full bg-input text-foreground placeholder-muted-foreground pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors">
              Filter
            </button>
          </div>
        </div>

        {/* Algorithms by Category */}
        <div className="px-8 pb-12 space-y-12">
          {Object.entries(algorithms).map(([category, algos]) => (
            <section key={category}>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {algos.map((algo) => (
                  <AlgorithmCard
                    key={algo.id}
                    id={algo.id}
                    title={algo.title}
                    description={algo.description}
                    color={algo.color}
                    href={algo.href}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
