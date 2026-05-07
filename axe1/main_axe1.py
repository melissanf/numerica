from fonctions import analyse_fonction, test_continuite
from dichotomie import dichotomie
from newton import newton
from secante import secante
from point_fixe import point_fixe


def to_float(x):
    return float(x.replace(",", "."))


f = input("Entrer f(x) : ")

print("\nFonction :", f)

while True:

    print("\n===== AXE 1 =====")
    print("1 Analyse fonction")
    print("2 Continuite")
    print("3 Dichotomie")
    print("4 Newton")
    print("5 Secante")
    print("6 Point fixe")
    print("0 Quitter")

    c = input("Choix : ")

    try:

        
        if c == "1":
            analyse_fonction(f)

        
        elif c == "2":
            p = to_float(input("point : "))
            print("Continue :", test_continuite(f, p))

        
        elif c == "3":
            a = to_float(input("a : "))
            b = to_float(input("b : "))

            res = dichotomie(f, a, b)

            if res is None:
                print("Pas de racine dans cet intervalle")
            else:
                print("Racine :", res)

        
        elif c == "4":
            a = to_float(input("a : "))
            b = to_float(input("b : "))
            x0 = to_float(input("x0 : "))

            if abs(x0) > 5:
                print("Warning : x0 loin de la racine, convergence non garantie")

            res = newton(f, x0, a, b)

            if res is None:
                print("Pas de convergence")
            else:
                print("Racine :", res)

        
        elif c == "5":
            x0 = to_float(input("x0 : "))
            x1 = to_float(input("x1 : "))

            res = secante(f, x0, x1)

            if res is None:
                print("Pas de convergence")
            else:
                print("Racine :", res)

        
        elif c == "6":
            x0 = to_float(input("x0 : "))
            a = to_float(input("a : "))
            b = to_float(input("b : "))

            res = point_fixe(f, x0, a, b)

            if res is None:
                print("Pas de convergence")
            else:
                print("Resultat :", res)

        
        elif c == "0":
            print("Fin du programme")
            break

        else:
            print("Choix invalide")

    except ValueError:
        print("Erreur : entree invalide (utilise des nombres)")
    except Exception:
        print("Erreur interne")