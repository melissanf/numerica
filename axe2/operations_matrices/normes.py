import numpy as np

def calculer_toutes_normes(A):
    """Calcule les normes usuelles d'une matrice."""
    normes = {
        "Norme 1 (colonnes)": np.linalg.norm(A, 1),
        "Norme infini (lignes)": np.linalg.norm(A, np.inf),
        "Norme de Frobenius": np.linalg.norm(A, 'fro'),
        "Norme 2 (euclidienne)": np.linalg.norm(A, 2)
    }
    
    # Calcul du conditionnement (important pour la stabilité)
    try:
        normes["Conditionnement κ(A)"] = np.linalg.cond(A)
    except:
        normes["Conditionnement κ(A)"] = float('inf')
        
    return normes

def calculer_rayon_spectral(A):
    """
    Calcule le rayon spectral ρ(A) : la plus grande valeur absolue 
    des valeurs propres de la matrice.
    """
    try:
        valeurs_propres = np.linalg.eigvals(A)
        return max(abs(valeurs_propres))
    except Exception:
        return None