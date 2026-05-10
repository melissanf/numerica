from fastapi import APIRouter
from pydantic import BaseModel
import sys, os

sys.path.insert(0, os.path.dirname(__file__))

from dichotomie import dichotomie
from newton import newton
from secante import secante
from point_fixe import point_fixe
from fonctions import analyse_fonction, test_continuite

router = APIRouter()


class FonctionRequest(BaseModel):
    f: str


class IntervalleRequest(BaseModel):
    f: str
    a: float
    b: float


class NewtonRequest(BaseModel):
    f: str
    x0: float
    a: float
    b: float


class SecanteRequest(BaseModel):
    f: str
    x0: float
    x1: float


class PointFixeRequest(BaseModel):
    f: str
    x0: float
    a: float
    b: float


class ContinuiteRequest(BaseModel):
    f: str
    point: float


@router.post("/analyse")
def route_analyse(req: FonctionRequest):
    result = analyse_fonction(req.f)
    return {"result": result}


@router.post("/continuite")
def route_continuite(req: ContinuiteRequest):
    result = test_continuite(req.f, req.point)
    return {"continue": result}


@router.post("/dichotomie")
def route_dichotomie(req: IntervalleRequest):
    result = dichotomie(req.f, req.a, req.b)
    if result is None:
        return {"racine": None, "message": "Pas de racine dans cet intervalle"}
    return {"racine": result}


@router.post("/newton")
def route_newton(req: NewtonRequest):
    result = newton(req.f, req.x0, req.a, req.b)
    if result is None:
        return {"racine": None, "message": "Pas de convergence"}
    return {"racine": result}


@router.post("/secante")
def route_secante(req: SecanteRequest):
    result = secante(req.f, req.x0, req.x1)
    if result is None:
        return {"racine": None, "message": "Pas de convergence"}
    return {"racine": result}


@router.post("/point-fixe")
def route_point_fixe(req: PointFixeRequest):
    result = point_fixe(req.f, req.x0, req.a, req.b)
    if result is None:
        return {"resultat": None, "message": "Pas de convergence"}
    return {"resultat": result}
