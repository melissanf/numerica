import sympy as sp
import re

x = sp.Symbol('x')


def clean_expression(expr):
    expr = expr.replace(" ", "")
    expr = re.sub(r'(\d)(x)', r'\1*x', expr)
    return expr


def parse_function(expr):
    try:
        expr = clean_expression(expr)
        return sp.sympify(expr)
    except:
        return None


def f(func, val):
    return float(func.subs(x, val))


def derivative(func):
    return sp.diff(func, x)