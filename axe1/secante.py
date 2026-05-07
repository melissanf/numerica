from utils import parse_function, f

def secante(func_str, x0, x1, eps=1e-5, max_iter=100):

    func = parse_function(func_str)

    if func is None:
        print("Fonction invalide")
        return None

    for i in range(max_iter):

        try:
            f0 = f(func, x0)
            f1 = f(func, x1)

            if abs(f1 - f0) < 1e-12:
                print("Division par zero -> arret")
                return None

            x2 = x1 - f1 * (x1 - x0) / (f1 - f0)

        except:
            print("Erreur numerique")
            return None

        if abs(x2 - x1) < eps:

            
            if abs(f(func, x2)) < 1e-3:
                return x2
            else:
                print("Pseudo-convergence detectee")
                return None

        x0, x1 = x1, x2

    print("Pas de convergence")
    return None