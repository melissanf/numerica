from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
import sys, os

sys.path.insert(0, os.path.dirname(__file__))

from methodes_directes.gauss import elimination_gauss
from methodes_iteratives.jacobi import methode_jacobi, verifier_dominance_diagonale
from methodes_iteratives.gauss_seidel import methode_gauss_seidel
from operations_matrices.normes import calculer_rayon_spectral

router = APIRouter()


class SystemeRequest(BaseModel):
    A: list[list[float]]
    b: list[float]


@router.post("/gauss")
def route_gauss(req: SystemeRequest):
    A = np.array(req.A)
    b = np.array(req.b)
    x = elimination_gauss(A, b)
    return {"solution": x.tolist()}


@router.post("/jacobi")
def route_jacobi(req: SystemeRequest):
    A = np.array(req.A)
    b = np.array(req.b)
    x, errors = methode_jacobi(A, b)
    return {"solution": x.tolist(), "erreurs": errors}


@router.post("/gauss-seidel")
def route_gauss_seidel(req: SystemeRequest):
    A = np.array(req.A)
    b = np.array(req.b)
    x, errors = methode_gauss_seidel(A, b)
    return {"solution": x.tolist(), "erreurs": errors}


@router.post("/diagnostic")
def route_diagnostic(req: SystemeRequest):
    A = np.array(req.A)
    is_dds = verifier_dominance_diagonale(A)
    rho = calculer_rayon_spectral(A)
    return {
        "dominance_diagonale": bool(is_dds),
        "rayon_spectral": float(rho) if rho is not None else None,
        "conseil": (
            "Convergence garantie (DDS)"
            if is_dds
            else "Convergence théorique (rho < 1)"
            if rho and rho < 1
            else "Utilisez une méthode directe"
        ),
    }
