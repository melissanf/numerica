import matplotlib.pyplot as plt


def tracer_convergence(erreurs_dict):
    """Affiche l'évolution de l'erreur (échelle log) pour les méthodes itératives."""
    plt.figure(figsize=(10, 6))
    for nom, erreurs in erreurs_dict.items():
        # On utilise une échelle log car l'erreur diminue de façon exponentielle
        plt.plot(erreurs, marker=".", label=nom)

    plt.yscale("log")
    plt.xlabel("Nombre d’itérations")
    plt.ylabel("Erreur (log)")
    plt.title("Vitesse de convergence")
    plt.grid(True, which="both", ls="-", alpha=0.5)
    plt.legend()
    plt.show()


def tracer_normes(normes_dict):
    """Affiche un graphique en barres des différentes normes calculées."""
    noms = list(normes_dict.keys())
    valeurs = list(normes_dict.values())
    plt.figure(figsize=(10, 5))
    plt.bar(noms, valeurs, color="skyblue")
    plt.ylabel("Valeur de la norme")
    plt.title("Comparaison des normes de la matrice")
    plt.xticks(rotation=15)
    plt.tight_layout()
    plt.show()


def tracer_erreurs_finales(erreurs_dict):
    """Compare la précision finale atteinte par chaque méthode."""
    noms = list(erreurs_dict.keys())
    # Récupère la dernière valeur d'erreur pour chaque méthode
    finales = [e[-1] for e in erreurs_dict.values()]

    plt.figure(figsize=(8, 5))
    plt.bar(noms, finales, color="salmon")
    plt.yscale("log")
    plt.ylabel("Erreur finale (log)")
    plt.title("Précision finale après convergence")
    plt.show()


def tracer_temps_execution(A, b):
    """Affiche un message informatif ou un graphique de performance."""
    print("\n[Visualisation] Affichage du temps d'exécution...")
    # Tu pourras implémenter ici la mesure réelle avec time.time()
    plt.figure(figsize=(8, 5))
    plt.text(
        0.5,
        0.5,
        "Graphique des temps d'exécution\n(À implémenter avec time.time())",
        ha="center",
        va="center",
        fontsize=12,
    )
    plt.title("Comparaison de performance")
    plt.show()
