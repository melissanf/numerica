import numpy as np
import sys

# Importations des modules
from methodes_directes.gauss import elimination_gauss
from methodes_iteratives.jacobi import methode_jacobi, verifier_dominance_diagonale
from methodes_iteratives.gauss_seidel import methode_gauss_seidel
from operations_matrices.normes import calculer_rayon_spectral
from visualisation.visualisation import tracer_convergence

# ===============================================================
#  DIAGNOSTIC (LOGIQUE DE L'ORGANIGRAMME)
# ===============================================================


def diagnostiquer_matrice(A):
    print("\n" + "-" * 45)
    print("  ANALYSE DES CONDITIONS DE CONVERGENCE")
    print("-" * 45)

    is_dds = verifier_dominance_diagonale(A)
    rho = calculer_rayon_spectral(A)

    if is_dds:
        print("[ETAT] : Matrice DDS detectee.")
        print("[CONSEIL] : Convergence GARANTIE pour Jacobi/Gauss-Seidel.")
    elif rho is not None and rho < 1:
        print(f"[ETAT] : Rayon spectral rho = {rho:.4f} < 1.")
        print("[CONSEIL] : Convergence théorique assurée.")
    else:
        print("[ATTENTION] : Criteres de convergence non satisfaits.")
        print("[CONSEIL] : Utilisez une METHODE DIRECTE (Gauss ou LU).")
    print("-" * 45 + "\n")


# ===============================================================
#  AXE 2 : SYSTEMES LINEAIRES
# ===============================================================


# Remplacez votre fonction menu_axe_2 par celle-ci pour plus de clarté
def menu_axe_2():
    print("\n" + "=" * 50)
    print("       AXE 2 : RESOLUTION DE SYSTEMES")
    print("=" * 50)

    try:
        n_str = input("Entrez n (ou 'q' pour annuler) : ")
        if n_str.lower() == "q":
            return
        n = int(n_str)

        A = saisir_matrice(n)
        b = saisir_vecteur(n)

        # Diagnostic immédiat
        diagnostiquer_matrice(A)

        print("\n--- CHOIX DE LA METHODE ---")
        print("1. Directe (Gauss)")
        print("2. Directe (LU)")
        print("3. Iterative (Jacobi)")
        print("4. Iterative (Gauss-Seidel)")

        choix = input("\nVotre choix (1-4) : ")

        if choix == "1":
            print("Calcul en cours...")
            x = elimination_gauss(A, b)
            print("\nSolution :", x)
        elif choix == "3":
            print("Calcul en cours...")
            x, errs = methode_jacobi(A, b)
            print("\nSolution :", x)
            # On affiche le graph direct pour éviter d'attendre un input
            tracer_convergence({"Jacobi": errs})

    except Exception as e:
        print(f"\nErreur : {e}")

    print("\nAppuyez sur Entree pour revenir au menu...")
    input()  # Cette ligne permet de lire le résultat avant que le menu ne revienne


# ===============================================================
#  FONCTIONS UTILES
# ===============================================================


def saisir_matrice(n):
    print(f"Entrez les {n} lignes (nombres separes par espace) :")
    mat = []
    for i in range(n):
        while True:
            try:
                l = list(map(float, input(f" Ligne {i + 1} : ").split()))
                if len(l) == n:
                    mat.append(l)
                    break
                print(f"Erreur: il faut {n} valeurs.")
            except ValueError:
                print("Erreur: entrez des chiffres.")
    return np.array(mat)


def saisir_vecteur(n):
    while True:
        try:
            b = list(map(float, input(f"Entrez b ({n} valeurs) : ").split()))
            if len(b) == n:
                return np.array(b)
            print(f"Erreur: il faut {n} valeurs.")
        except ValueError:
            print("Erreur: entrez des chiffres.")


def comparer_graphique(A, b):
    print("\nCalcul des itérations en cours...")
    try:
        _, e_j = methode_jacobi(A, b)
        _, e_gs = methode_gauss_seidel(A, b)
        tracer_convergence({"Jacobi": e_j, "Gauss-Seidel": e_gs})
    except:
        print("Erreur lors de la comparaison graphique.")


# ===============================================================
#  MENU PRINCIPAL
# ===============================================================


def main():
    while True:
        print("\n" + "+" + "-" * 40 + "+")
        print("|    APPLICATION ANALYSE NUMERIQUE - USTHB   |")
        print("+" + "-" * 40 + "+")
        print(" 1. Axe 2 : Resolution de Systemes")
        print(" 2. Axe 2 : Calcul de Normes")
        print(" 0. Quitter")

        sel = input("\nChoix : ")
        if sel == "1":
            menu_axe_2()
        elif sel == "0":
            print("Fermeture...")
            break


if __name__ == "__main__":
    main()
