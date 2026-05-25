from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys, os

sys.path.insert(0, os.path.dirname(__file__))

from utils import parse_function, f, derivative
from fonctions import analyse_fonction, test_continuite

router = APIRouter()


class FonctionRequest(BaseModel):
    f: str


class ContinuiteRequest(BaseModel):
    f: str
    point: float


class IntervalleRequest(BaseModel):
    f: str
    a: float
    b: float
    eps: float


class NewtonRequest(BaseModel):
    f: str
    x0: float
    a: float
    b: float
    eps: float


class SecanteRequest(BaseModel):
    f: str
    x0: float
    x1: float


class PointFixeRequest(BaseModel):
    f: str
    x0: float
    a: float
    b: float


# ── Helpers (inline enriched versions, originals untouched) ───────────────────


def _dichotomie(func_str, a, b, eps=1e-5):
    func = parse_function(func_str)
    if func is None:
        raise HTTPException(status_code=400, detail="Fonction invalide")
    fa = f(func, a)
    fb = f(func, b)
    if fa * fb > 0:
        raise HTTPException(status_code=400, detail="Pas de racine dans cet intervalle (f(a)*f(b) > 0)")
    convergence = []
    i = 0
    while abs(b - a) / 2 > eps:
        m = (a + b) / 2
        fm = f(func, m)
        convergence.append(
            {"iteration": i, "value": round(m, 8), "error": round(abs(b - a) / 2, 10)}
        )
        if fa * fm < 0:
            b = m
        else:
            a = m
            fa = f(func, a)
        i += 1
    racine = (a + b) / 2
    return racine, convergence


def _newton(func_str, x0, a, b, eps=1e-5, max_iter=100):
    import sympy as sp

    func = parse_function(func_str)
    if func is None:
        raise HTTPException(status_code=400, detail="Fonction invalide")
    dfunc = derivative(func)
    fa = f(func, a)
    fb = f(func, b)
    if fa * fb > 0:
        raise HTTPException(status_code=400, detail="Condition f(a)*f(b)<0 non respectée")
    x = x0
    convergence = []
    for i in range(max_iter):
        fx = f(func, x)
        dfx = f(dfunc, x)
        if abs(dfx) < 1e-10:
            raise HTTPException(status_code=400, detail="Dérivée nulle")
        x_new = x - fx / dfx
        convergence.append(
            {
                "iteration": i,
                "value": round(x_new, 8),
                "error": round(abs(x_new - x), 10),
            }
        )
        if abs(x_new - x) < eps:
            return x_new, convergence
        x = x_new
    raise HTTPException(status_code=400, detail="Pas de convergence après max itérations")


def _secante(func_str, x0, x1, eps=1e-5, max_iter=100):
    func = parse_function(func_str)
    if func is None:
        raise HTTPException(status_code=400, detail="Fonction invalide")
    convergence = []
    for i in range(max_iter):
        try:
            f0 = f(func, x0)
            f1 = f(func, x1)
            if abs(f1 - f0) < 1e-12:
                raise HTTPException(status_code=400, detail="Division par zéro")
            x2 = x1 - f1 * (x1 - x0) / (f1 - f0)
        except:
            raise HTTPException(status_code=400, detail="Erreur numérique")
        convergence.append(
            {"iteration": i, "value": round(x2, 8), "error": round(abs(x2 - x1), 10)}
        )
        if abs(x2 - x1) < eps:
            if abs(f(func, x2)) < 1e-3:
                return x2, convergence
            else:
                raise HTTPException(status_code=400, detail="Pseudo-convergence détectée")
        x0, x1 = x1, x2
    raise HTTPException(status_code=400, detail="Pas de convergence")


def _point_fixe(phi_str, x0, a, b, eps=1e-5, max_iter=100):
    phi = parse_function(phi_str)
    if phi is None:
        raise HTTPException(status_code=400, detail="Fonction invalide")
    convergence = []
    x = x0
    for i in range(max_iter):
        try:
            x_new = f(phi, x)
        except:
            raise HTTPException(status_code=400, detail="Erreur évaluation phi(x)")
        if abs(x_new) > 1e6:
            raise HTTPException(status_code=400, detail="Divergence détectée")
        convergence.append(
            {
                "iteration": i,
                "value": round(x_new, 8),
                "error": round(abs(x_new - x), 10),
            }
        )
        if abs(x_new - x) < eps:
            return x_new, convergence
        x = x_new
    raise HTTPException(status_code=400, detail="Pas de convergence")


# ── Routes ────────────────────────────────────────────────────────────────────


@router.post("/analyse")
def route_analyse(req: FonctionRequest):
    return {"result": analyse_fonction(req.f)}


@router.post("/continuite")
def route_continuite(req: ContinuiteRequest):
    return {"continue": test_continuite(req.f, req.point)}


@router.post("/dichotomie")
def route_dichotomie(req: IntervalleRequest):
    racine, convergence = _dichotomie(req.f, req.a, req.b, req.eps)
    return {
        "racine": racine,
        "iterations": len(convergence),
        "error": convergence[-1]["error"] if convergence else 0,
        "convergence_data": convergence,
    }


@router.post("/newton")
def route_newton(req: NewtonRequest):
    racine, convergence = _newton(req.f, req.x0, req.a, req.b, req.eps)
    return {
        "racine": racine,
        "iterations": len(convergence),
        "error": convergence[-1]["error"] if convergence else 0,
        "convergence_data": convergence,
    }


@router.post("/secante")
def route_secante(req: SecanteRequest):
    racine, convergence = _secante(req.f, req.x0, req.x1)
    return {
        "racine": racine,
        "iterations": len(convergence),
        "error": convergence[-1]["error"] if convergence else 0,
        "convergence_data": convergence,
    }


@router.post("/point-fixe")
def route_point_fixe(req: PointFixeRequest):
    racine, convergence = _point_fixe(req.f, req.x0, req.a, req.b)
    return {
        "racine": racine,
        "iterations": len(convergence),
        "error": convergence[-1]["error"] if convergence else 0,
        "convergence_data": convergence,
    }
