from utils import parse_function, f, derivative
import numpy as np
import sympy as sp


def second_derivative(func):
    x = sp.Symbol('x')
    return sp.diff(func, x)


def verifier_signe(func, a, b):
    return f(func, a) * f(func, b) < 0


def verifier_domaine(dfunc, a, b):
    xs = np.linspace(a, b, 50)
    return all(abs(f(dfunc, x)) > 1e-8 for x in xs)


def verifier_convexite(ddfunc, a, b):
    xs = np.linspace(a, b, 50)
    vals = [f(ddfunc, x) for x in xs]
    return all(v > 0 for v in vals) or all(v < 0 for v in vals)


def newton(func_str, x0, a, b, eps=1e-5, max_iter=100):

    func = parse_function(func_str)

    if func is None:
        print("Fonction invalide")
        return None

    dfunc = derivative(func)
    ddfunc = second_derivative(func)

    
    if not verifier_signe(func, a, b):
        print("Condition f(a)*f(b)<0 non respectee")
        return None

    if not verifier_domaine(dfunc, a, b):
        print("Derivee nulle sur intervalle (danger)")
        return None

    if not verifier_convexite(ddfunc, a, b):
        print("f'' ne garde pas le meme signe (attention convergence)")
    
    
    x = x0

    for i in range(max_iter):

        fx = f(func, x)
        dfx = f(dfunc, x)

        if abs(dfx) < 1e-10:
            print("Derivee nulle")
            return None

        x_new = x - fx / dfx

        if abs(x_new - x) < eps:
            return x_new

        x = x_new

    print("Pas de convergence")
    return None