from utils import parse_function, f, derivative
import numpy as np
import sympy as sp


def verifier_stabilite(phi, a, b, n=100):

    xs = np.linspace(a, b, n)

    vals = []

    for x in xs:
        try:
            vals.append(f(phi, x))
        except:
            return False

    return min(vals) >= a and max(vals) <= b


def verifier_contraction(dphi, a, b, n=100):

    xs = np.linspace(a, b, n)

    vals = []

    for x in xs:
        try:
            vals.append(abs(f(dphi, x)))
        except:
            return float("inf"), False

    k = max(vals)

    return k, k < 1


def point_fixe(phi_str, x0, a, b, eps=1e-5, max_iter=100):

    phi = parse_function(phi_str)

    if phi is None:
        print("Fonction invalide")
        return None

    dphi = derivative(phi)

   
    stable = verifier_stabilite(phi, a, b)
    k, contracte = verifier_contraction(dphi, a, b)

    print("Stabilite :", stable)
    print("Contraction :", contracte)
    print("k =", k)

    
    if not stable:
        print("Attention : phi(x) sort de l'intervalle [a,b]")

    if not contracte:
        print("Attention : methode potentiellement divergente")

    x = x0

    for i in range(max_iter):

        try:
            x_new = f(phi, x)
        except:
            print("Erreur evaluation phi(x)")
            return None

       
        if abs(x_new) > 1e6:
            print("Divergence detectee")
            return None

        if abs(x_new - x) < eps:
            return x_new

        x = x_new

    print("Pas de convergence")
    return None