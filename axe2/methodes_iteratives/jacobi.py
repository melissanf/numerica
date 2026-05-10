import numpy as np

def verifier_dominance_diagonale(A):
    n = len(A)
    for i in range(n):
        if abs(A[i, i]) <= sum(abs(A[i, j]) for j in range(n) if j != i):
            return False
    return True

def methode_jacobi(A, b, tol=1e-6, max_iter=1000):
    A = A.astype(float)
    b = b.astype(float)
    n = len(b)
    x = np.zeros(n)
    erreurs = []

    for k in range(max_iter):
        x_new = np.zeros(n)
        for i in range(n):
            s = sum(A[i, j] * x[j] for j in range(n) if j != i)
            if abs(A[i, i]) < 1e-12:
                raise ValueError(f"Élément diagonal nul à la ligne {i}.")
            x_new[i] = (b[i] - s) / A[i, i]

        erreur = np.linalg.norm(x_new - x, ord=np.inf)
        erreurs.append(erreur)
        x = x_new

        if erreur < tol:
            print(f"Convergence atteinte en {k+1} itérations.")
            break
    else:
        print(f"Nombre maximum d'itérations ({max_iter}) atteint sans convergence.")

    return x, erreurs