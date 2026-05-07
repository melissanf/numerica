from utils import parse_function, derivative, f

def analyse_fonction(func_str):
    func = parse_function(func_str)

    if func is None:
        print("Fonction invalide")
        return

    print("f(x) =", func)
    print("f'(x) =", derivative(func))


def test_continuite(func_str, point):
    func = parse_function(func_str)

    if func is None:
        print("Fonction invalide")
        return False

    try:
        left = f(func, point - 1e-5)
        right = f(func, point + 1e-5)
        return abs(left - right) < 1e-3
    except:
        return False