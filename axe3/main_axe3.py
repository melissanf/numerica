"""
FastAPI router for Axe 3: Interpolation, Approximation, and Gradient Descent
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np

from axe3.interpolation.lagrange import (
    lagrange_interpolate,
    lagrange_error_table,
    get_lagrange_polynomial_str,
)
from axe3.interpolation.newton import (
    newton_interpolate,
    newton_error_table,
    get_newton_polynomial_str,
)
from axe3.approximation.moindres_carres import (
    fit_polynomials_with_convergence,
    get_polynomial_str,
)
from axe3.gradient.descente_gradient import (
    gradient_descent_fixed_step,
    function_A,
    grad_function_A,
    function_B,
    grad_function_B,
)
from axe3.visualisation.plots import (
    plot_interpolation,
    plot_approximation,
    plot_gradient_3d,
    plot_gradient_contour,
    plot_convergence,
)

router = APIRouter()


# ==================== Request/Response Models ====================
class InterpolationRequest(BaseModel):
    """Request model for interpolation endpoints"""

    x: List[float]
    y: List[float]
    x_eval: Optional[List[float]] = None  # Points to evaluate at
    n: Optional[int] = None  # Number of uniform nodes if generating from function
    function: Optional[str] = None  # Function name: "cos", "exp", "runge"


class InterpolationResponse(BaseModel):
    """Response model for interpolation"""

    polynomial_str: str
    error_table: List[Dict[str, float]]
    plot_base64: str
    evaluations: Optional[Dict[str, float]] = None


class ApproximationRequest(BaseModel):
    """Request model for least squares approximation"""

    x: List[float]
    y: List[float]
    degree_max: int = 4


class ApproximationResponse(BaseModel):
    """Response model for approximation"""

    polynomials: Dict[int, str]
    errors: Dict[int, float]
    plot_base64: str
    convergence: str


class GradientDescentRequest(BaseModel):
    """Request model for gradient descent"""

    function_id: str  # "A" or "B"
    alpha: float
    eps: float = 1e-5
    x0: List[float]
    t: Optional[float] = None  # Parameter for function B


class GradientDescentResponse(BaseModel):
    """Response model for gradient descent"""

    final_point: List[float]
    final_value: float
    iterations: int
    convergence: bool
    plot_base64: str
    convergence_plot_base64: str


# ==================== Helper Functions ====================
def create_function_from_name(name: str):
    """Create a test function from its name"""
    if name == "cos":
        return lambda x: np.cos(x)
    elif name == "exp":
        return lambda x: np.exp(-1 / (1 + x**2))
    elif name == "runge":
        return lambda x: 1 / (1 + 25 * x**2)
    else:
        raise ValueError(f"Unknown function: {name}")


def generate_uniform_nodes(func_name: str, n: int):
    """Generate uniform nodes for a function"""
    if func_name == "cos":
        x_nodes = np.linspace(-4 * np.pi, 4 * np.pi, n)
    elif func_name == "exp":
        x_nodes = np.linspace(-4, 4, n)
    elif func_name == "runge":
        x_nodes = np.linspace(-1, 1, n)
    else:
        raise ValueError(f"Unknown function: {func_name}")

    func = create_function_from_name(func_name)
    y_nodes = np.array([func(x) for x in x_nodes])
    return x_nodes, y_nodes


# ==================== Interpolation Endpoints ====================
@router.post("/interpolation/lagrange", response_model=InterpolationResponse)
async def interpolation_lagrange(request: InterpolationRequest):
    """
    Perform Lagrange interpolation
    """
    try:
        x_nodes = np.array(request.x, dtype=float)
        y_nodes = np.array(request.y, dtype=float)

        if len(x_nodes) != len(y_nodes):
            raise ValueError("x and y must have the same length")

        # Create interpolation function
        def poly_fn(x):
            return lagrange_interpolate(x_nodes, y_nodes, x)

        # Get polynomial string
        poly_str = get_lagrange_polynomial_str(x_nodes, y_nodes)

        # Generate evaluation points if not provided
        if request.x_eval is None:
            x_eval = np.linspace(np.min(x_nodes), np.max(x_nodes), 20)
        else:
            x_eval = np.array(request.x_eval, dtype=float)

        # Create a dummy function for error table (if function provided)
        true_fn = None
        if request.function:
            true_fn = create_function_from_name(request.function)
            error_data = lagrange_error_table(x_nodes, y_nodes, true_fn, x_eval)
        else:
            error_data = []

        # Create plot
        plot_base64 = plot_interpolation(
            x_nodes, y_nodes, poly_fn, label="Lagrange Interpolation", true_fn=true_fn
        )

        return InterpolationResponse(
            polynomial_str=poly_str, error_table=error_data, plot_base64=plot_base64
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/interpolation/newton", response_model=InterpolationResponse)
async def interpolation_newton(request: InterpolationRequest):
    """
    Perform Newton interpolation
    """
    try:
        x_nodes = np.array(request.x, dtype=float)
        y_nodes = np.array(request.y, dtype=float)

        if len(x_nodes) != len(y_nodes):
            raise ValueError("x and y must have the same length")

        # Create interpolation function
        def poly_fn(x):
            return newton_interpolate(x_nodes, y_nodes, x)

        # Get polynomial string
        poly_str = get_newton_polynomial_str(x_nodes, y_nodes)

        # Generate evaluation points if not provided
        if request.x_eval is None:
            x_eval = np.linspace(np.min(x_nodes), np.max(x_nodes), 20)
        else:
            x_eval = np.array(request.x_eval, dtype=float)

        # Create error table if function provided
        true_fn = None
        if request.function:
            true_fn = create_function_from_name(request.function)
            error_data = newton_error_table(x_nodes, y_nodes, true_fn, x_eval)
        else:
            error_data = []

        # Create plot
        plot_base64 = plot_interpolation(
            x_nodes, y_nodes, poly_fn, label="Newton Interpolation", true_fn=true_fn
        )

        return InterpolationResponse(
            polynomial_str=poly_str, error_table=error_data, plot_base64=plot_base64
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==================== Approximation Endpoints ====================
@router.post("/approximation/moindres-carres", response_model=ApproximationResponse)
async def approximation_least_squares(request: ApproximationRequest):
    """
    Perform least squares polynomial approximation
    """
    try:
        x_data = np.array(request.x, dtype=float)
        y_data = np.array(request.y, dtype=float)

        if len(x_data) != len(y_data):
            raise ValueError("x and y must have the same length")

        # Fit polynomials with convergence check
        results = fit_polynomials_with_convergence(
            x_data, y_data, max_degree=request.degree_max
        )

        # Create polynomial functions and strings
        polys_dict = {}
        poly_strs = {}
        errors = {}

        for degree, data in results.items():
            coeffs = data["coeffs"]
            poly_strs[str(degree)] = get_polynomial_str(degree, coeffs)
            errors[str(degree)] = data["error"]
            polys_dict[degree] = np.poly1d(coeffs)

        # Create plot
        plot_base64 = plot_approximation(x_data, y_data, polys_dict)

        # Convergence info
        convergence_str = f"Fitted {len(results)} polynomials"

        return ApproximationResponse(
            polynomials=poly_strs,
            errors=errors,
            plot_base64=plot_base64,
            convergence=convergence_str,
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==================== Gradient Descent Endpoints ====================
@router.post("/gradient/descente", response_model=GradientDescentResponse)
async def gradient_descent(request: GradientDescentRequest):
    """
    Perform gradient descent optimization
    """
    try:
        x0 = np.array(request.x0, dtype=float)

        if request.function_id == "A":
            result = gradient_descent_fixed_step(
                function_A, grad_function_A, x0, request.alpha, request.eps
            )
            f_final = result["f_value"]
        elif request.function_id == "B":
            if request.t is None:
                raise ValueError("Parameter t is required for function B")

            # Create function B with specific t
            def func_B(x):
                return function_B(x, request.t)

            def grad_B(x):
                return grad_function_B(x, request.t)

            result = gradient_descent_fixed_step(
                func_B, grad_B, x0, request.alpha, request.eps
            )
            f_final = result["f_value"]
        else:
            raise ValueError(f"Unknown function: {request.function_id}")

        # Create plots
        history = result["history"]

        if request.function_id == "A":
            plot_3d = plot_gradient_3d(
                function_A, history, x_range=(-2, 2), y_range=(-2, 2)
            )
            plot_contour = plot_gradient_contour(
                function_A, history, x_range=(-2, 2), y_range=(-2, 2)
            )
        else:

            def func_B(x):
                return function_B(x, request.t)

            plot_3d = plot_gradient_3d(
                func_B, history, x_range=(-1.5, 1.5), y_range=(-1.5, 1.5)
            )
            plot_contour = plot_gradient_contour(
                func_B, history, x_range=(-1.5, 1.5), y_range=(-1.5, 1.5)
            )

        # Convergence plot
        iterations = list(range(len(result["f_history"])))
        convergence_plot = plot_convergence(
            iterations, result["f_history"], ylabel="Function Value"
        )

        return GradientDescentResponse(
            final_point=result["x"].tolist(),
            final_value=float(f_final),
            iterations=result["iterations"],
            convergence=result["iterations"] < 10000,  # Check if converged early
            plot_base64=plot_3d,
            convergence_plot_base64=convergence_plot,
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==================== Health Check ====================
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "module": "axe3"}
