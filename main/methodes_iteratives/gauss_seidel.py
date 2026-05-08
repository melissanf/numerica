import numpy as np

def methode_gauss_seidel(A, b, tol=1e-6, max_iter=1000):
    A = A.astype(float)
    b = b.astype(float)
    n = len(b)
    x = np.zeros(n)
    erreurs = []

    for k in range(max_iter):
        x_old = x.copy()
        for i in range(n):
            s1 = sum(A[i, j] * x[j]     for j in range(i))
            s2 = sum(A[i, j] * x_old[j] for j in range(i + 1, n))
            if abs(A[i, i]) < 1e-12:
                raise ValueError(f"Élément diagonal nul à la ligne {i}.")
            x[i] = (b[i] - s1 - s2) / A[i, i]

        erreur = np.linalg.norm(x - x_old, ord=np.inf)
        erreurs.append(erreur)

        if erreur < tol:
            print(f"Convergence atteinte en {k+1} itérations.")
            break
    else:
        print(f"Nombre maximum d'itérations ({max_iter}) atteint sans convergence.")

    return x, erreurs