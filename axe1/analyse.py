def afficher_algorithmes():
    print("\n--- ALGORITHMES AXE 1 ---")
    print("1. Dichotomie → robuste mais lente")
    print("2. Newton → rapide mais dérivée requise")
    print("3. Sécante → alternative à Newton")
    print("4. Point fixe → dépend de g(x)")

def recommandation():
    print("\n--- RECOMMANDATIONS ---")
    print("- Newton : meilleur si dérivable")
    print("- Dichotomie : toujours stable")
    print("- Sécante : compromis sans dérivée")
    print("- Point fixe : dépend convergence |g'(x)| < 1")