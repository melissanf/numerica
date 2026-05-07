from utils import parse_function, f

def dichotomie(func_str, a, b, eps=1e-5):

    func = parse_function(func_str)

    if func is None:
        print("Fonction invalide")
        return None

    fa = f(func, a)
    fb = f(func, b)

    if fa * fb > 0:
        print("Pas de racine dans cet intervalle")
        return None

    while abs(b - a) / 2 > eps:

        m = (a + b) / 2
        fm = f(func, m)

        if fa * fm < 0:
            b = m
        else:
            a = m

    return (a + b) / 2