import numpy as np
from typing import Callable, Dict


def gradient_descent_fixed_step(
    f: Callable[[np.ndarray], float],
    grad_f: Callable[[np.ndarray], np.ndarray],
    x0: np.ndarray,
    alpha: float,
    eps: float = 1e-5,
    max_iter: int = 1000,
) -> Dict:
    x = x0.copy().astype(float)
    history = [x.copy()]
    f_history = [f(x)]
    grad_norm_history = []

    for iteration in range(max_iter):
        grad = grad_f(x)
        grad_norm = np.linalg.norm(grad)
        grad_norm_history.append(grad_norm)

        # Check convergence
        if grad_norm < eps:
            print(f"Converged at iteration {iteration + 1}")
            break

        # Update step
        x = x - alpha * grad

        # Record history
        history.append(x.copy())
        f_history.append(f(x))

    return {
        "x": x,
        "f_value": f(x),
        "iterations": iteration + 1,
        "history": history,
        "f_history": f_history,
        "grad_norm_history": grad_norm_history,
    }


# Test Case A: f(x,y) = x² + 2y² + xy + x - y + 30
def function_A(x: np.ndarray) -> float:
    """
    Test function A: f(x,y) = x² + 2y² + xy + x - y + 30
    """
    a, b = x[0], x[1]
    return a**2 + 2 * b**2 + a * b + a - b + 30


def grad_function_A(x: np.ndarray) -> np.ndarray:
    """
    Gradient of function A: ∇f = [2x + y + 1, 4y + x - 1]
    """
    a, b = x[0], x[1]
    df_da = 2 * a + b + 1
    df_db = 4 * b + a - 1
    return np.array([df_da, df_db])


# Test Case B: f(x,y) = 1 / (1 + t·x² + y²)
def function_B(x: np.ndarray, t: float = 1.0) -> float:
    """
    Test function B: f(x,y) = 1 / (1 + t·x² + y²)
    """
    a, b = x[0], x[1]
    return 1.0 / (1 + t * a**2 + b**2)


def grad_function_B(x: np.ndarray, t: float = 1.0) -> np.ndarray:
    """
    Gradient of function B:
    ∂f/∂x = -2tx / (1 + tx² + y²)²
    ∂f/∂y = -2y / (1 + tx² + y²)²
    """
    a, b = x[0], x[1]
    denominator = 1 + t * a**2 + b**2
    df_da = -2 * t * a / (denominator**2)
    df_db = -2 * b / (denominator**2)
    return np.array([df_da, df_db])


if __name__ == "__main__":
    print("=" * 70)
    print("GRADIENT DESCENT TESTS")
    print("=" * 70)

    # Test Case A
    print("\nCASE A: f(x,y) = x² + 2y² + xy + x - y + 30")
    print("-" * 70)

    x0_A = np.array([3.0, 3.0])
    print(f"Initial point: x0 = {x0_A}")
    print(f"Initial function value: f(x0) = {function_A(x0_A):.8f}")

    # Analytical minimum (from taking ∇f = 0):
    # 2x + y + 1 = 0
    # x + 4y - 1 = 0
    # Solving: x = -1, y = 1, f(-1,1) = 1 - 2 + 1 - 1 - 1 + 30 = 28
    print("\nAnalytical minimum: x = (-1, 1), f = 28")

    alphas = [0.0001, 0.001, 0.01]

    for alpha in alphas:
        print(f"\nStep size α = {alpha}:")
        result = gradient_descent_fixed_step(
            function_A, grad_function_A, x0_A, alpha, eps=1e-5, max_iter=10000
        )
        print(f"  Final point: x = {result['x']}")
        print(f"  Final function value: f(x) = {result['f_value']:.8f}")
        print(f"  Iterations: {result['iterations']}")
        print(f"  Gradient norm at final: {result['grad_norm_history'][-1]:.2e}")

    # Test Case B
    print("\n" + "=" * 70)
    print("CASE B: f(x,y) = 1 / (1 + t·x² + y²)")
    print("-" * 70)

    for t in [1, 2, 3]:
        print(f"\nParameter t = {t}:")

        # For this function, the maximum is at (0, 0)
        x0_B = np.array([1.0, 1.0])
        print(f"  Initial point: x0 = {x0_B}")
        print(f"  Initial function value: f(x0) = {function_B(x0_B, t):.8f}")
        print("  Maximum (at origin): f(0,0) = 1.0")

        # We want to maximize, so we need to use -grad_f
        def neg_grad_B(x):
            return -grad_function_B(x, t)

        alpha_B = 0.1  # Reasonable for this function
        result = gradient_descent_fixed_step(
            lambda x: -function_B(x, t),  # Maximize by minimizing negative
            neg_grad_B,
            x0_B,
            alpha_B,
            eps=1e-5,
            max_iter=1000,
        )

        print(f"  Final point: x = {result['x']}")
        print(f"  Final function value (negative): {result['f_value']:.8f}")
        print(f"  Original function value: {-result['f_value']:.8f}")
        print(f"  Iterations: {result['iterations']}")
        print(f"  Gradient norm at final: {result['grad_norm_history'][-1]:.2e}")

    print("\n" + "=" * 70)
    print("✓ All gradient descent tests completed!")
    print("=" * 70)
