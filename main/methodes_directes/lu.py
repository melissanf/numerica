import numpy as np
from scipy.linalg import lu

def decomposition_lu(A, b):
    A = A.astype(float)
    b = b.astype(float)
    n = len(b)

    P, L, U = lu(A)
    Pb = np.dot(P, b)

    # Résolution Ly = Pb 
    y = np.zeros(n)
    for i in range(n):
        y[i] = Pb[i] - np.dot(L[i, :i], y[:i])

    # Résolution Ux = y 
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (y[i] - np.dot(U[i, i+1:], x[i+1:])) / U[i, i]

    return L, U, x