"""
Newton Interpolation Module

Provides functions for polynomial interpolation using divided differences (Newton form).
This is often more numerically stable and efficient than Lagrange form.
"""

import numpy as np
from typing import Tuple, Callable


def divided_differences(x_nodes: np.ndarray, y_nodes: np.ndarray) -> np.ndarray:
    """
    Compute the divided differences table for Newton interpolation.

    The divided differences table is a lower triangular matrix where:
    - First column: original y values
    - Each subsequent column: divided differences of previous column

    Args:
        x_nodes: Array of x-coordinates of interpolation nodes
        y_nodes: Array of y-coordinates of interpolation nodes

    Returns:
        Lower triangular matrix where row i contains the divided differences up to order i
    """
    n = len(x_nodes)
    # Create a matrix to store divided differences
    dd = np.zeros((n, n))

    # Fill first column with y values
    dd[:, 0] = y_nodes

    # Compute divided differences iteratively
    for j in range(1, n):
        for i in range(j, n):
            dd[i, j] = (dd[i, j - 1] - dd[i - 1, j - 1]) / (x_nodes[i] - x_nodes[i - j])

    return dd


def newton_interpolate(x_nodes: np.ndarray, y_nodes: np.ndarray, x: float) -> float:
    """
    Evaluate the Newton interpolation polynomial at point x.

    Uses the forward difference formula:
    P(x) = y[0] + (x-x[0])*f[0,1] + (x-x[0])(x-x[1])*f[0,1,2] + ...

    Args:
        x_nodes: Array of x-coordinates of interpolation nodes
        y_nodes: Array of y-coordinates of interpolation nodes
        x: Point at which to evaluate the polynomial

    Returns:
        Value of the Newton interpolation polynomial P(x)
    """
    dd = divided_differences(x_nodes, y_nodes)
    n = len(x_nodes)

    # Horner's method: evaluate from right to left
    result = dd[n - 1, n - 1]

    for i in range(n - 2, -1, -1):
        result = dd[i, i] + (x - x_nodes[i]) * result

    return result


def get_newton_polynomial_str(x_nodes: np.ndarray, y_nodes: np.ndarray) -> str:
    """
    Generate a readable string representation of the Newton polynomial.

    Args:
        x_nodes: Array of x-coordinates of interpolation nodes
        y_nodes: Array of y-coordinates of interpolation nodes

    Returns:
        String representation of the polynomial in Newton form
    """
    dd = divided_differences(x_nodes, y_nodes)
    n = len(x_nodes)

    terms = []

    # First term: f[x0]
    terms.append(f"{dd[0, 0]:.6g}")

    # Subsequent terms: (x - x[i]) * f[x0,...,xi]
    for i in range(1, n):
        coeff = dd[i, i]

        # Build product of (x - x[j]) for j = 0 to i-1
        factors = []
        for j in range(i):
            if x_nodes[j] >= 0:
                factors.append(f"(x - {x_nodes[j]:.4g})")
            else:
                factors.append(f"(x + {-x_nodes[j]:.4g})")

        factor_str = " * ".join(factors)

        if coeff >= 0:
            terms.append(f" + {coeff:.6g} * {factor_str}")
        else:
            terms.append(f" - {-coeff:.6g} * {factor_str}")

    result = "".join(terms)
    return f"P(x) = {result}"


def newton_error_table(
    x_nodes: np.ndarray,
    y_nodes: np.ndarray,
    f: Callable[[float], float],
    test_points: np.ndarray,
) -> list:
    """
    Compute error table comparing Newton interpolation to true function values.

    Args:
        x_nodes: Array of x-coordinates of interpolation nodes
        y_nodes: Array of y-coordinates of interpolation nodes
        f: The true function to compare against
        test_points: Array of points at which to evaluate error

    Returns:
        List of dictionaries with columns: x, f(x), P(x), error, relative_error
    """
    errors = []

    for x in test_points:
        p_x = newton_interpolate(x_nodes, y_nodes, x)
        f_x = f(x)
        error = abs(f_x - p_x)
        relative_error = error / abs(f_x) if f_x != 0 else 0

        errors.append(
            {
                "x": x,
                "f(x)": f_x,
                "P(x)": p_x,
                "error": error,
                "relative_error": relative_error,
            }
        )

    return errors


# Test functions
def cos_function(x: float) -> float:
    """Test function: cos(x)"""
    return np.cos(x)


def exp_function(x: float) -> float:
    """Test function: exp(-1/(1+x²))"""
    return np.exp(-1 / (1 + x**2))


def runge_function(x: float) -> float:
    """Test function: 1/(1+25x²) - demonstrates Runge phenomenon"""
    return 1 / (1 + 25 * x**2)


def discrete_points() -> Tuple[np.ndarray, np.ndarray]:
    """Test points from TP4 Ex3: (0,0), (1,3), (5,2), (8,2)"""
    x_nodes = np.array([0, 1, 5, 8], dtype=float)
    y_nodes = np.array([0, 3, 2, 2], dtype=float)
    return x_nodes, y_nodes


if __name__ == "__main__":
    # Test 1: Discrete points and comparison with Lagrange
    print("=" * 60)
    print("TEST 1: Discrete Points (Newton vs Lagrange)")
    print("=" * 60)
    x_nodes, y_nodes = discrete_points()
    print(f"Nodes: x = {x_nodes}, y = {y_nodes}")

    # Show divided differences table
    dd = divided_differences(x_nodes, y_nodes)
    print("\nDivided Differences Table:")
    print("Order 0:", dd[:, 0])
    print("Order 1:", dd[1:, 1])
    print("Order 2:", dd[2:, 2])
    print("Order 3:", dd[3, 3])

    # Evaluate at the nodes (should match exactly)
    print("\nEvaluation at nodes:")
    for i, x in enumerate(x_nodes):
        p_x = newton_interpolate(x_nodes, y_nodes, x)
        print(f"  P({x}) = {p_x:.6f} (should be {y_nodes[i]})")

    # Evaluate at intermediate points
    print("\nEvaluation at intermediate points:")
    x_test = np.array([0.5, 2.0, 6.0])
    for x in x_test:
        p_x = newton_interpolate(x_nodes, y_nodes, x)
        print(f"  P({x}) = {p_x:.6f}")

    print(f"\n{get_newton_polynomial_str(x_nodes, y_nodes)}")

    # Test 2: Runge function with uniform nodes
    print("\n" + "=" * 60)
    print("TEST 2: Runge Function - Newton Form")
    print("=" * 60)

    for n in [4, 8, 10]:
        x_nodes_uniform = np.linspace(-1, 1, n)
        y_nodes_runge = np.array([runge_function(x) for x in x_nodes_uniform])

        x_test = np.linspace(-1, 1, 20)
        errors = newton_error_table(
            x_nodes_uniform, y_nodes_runge, runge_function, x_test
        )

        max_error = max(e["error"] for e in errors)
        mean_error = np.mean([e["error"] for e in errors])

        print(f"\nn = {n} uniform nodes:")
        print(f"  Max error: {max_error:.8f}")
        print(f"  Mean error: {mean_error:.8f}")

    # Test 3: Comparison with cos function
    print("\n" + "=" * 60)
    print("TEST 3: Cosine Function - Newton Form")
    print("=" * 60)

    x_nodes_cos = np.linspace(-4 * np.pi, 4 * np.pi, 8)
    y_nodes_cos = np.array([cos_function(x) for x in x_nodes_cos])

    x_test = np.linspace(-4 * np.pi, 4 * np.pi, 15)
    errors = newton_error_table(x_nodes_cos, y_nodes_cos, cos_function, x_test)

    print(f"Nodes: {len(x_nodes_cos)} points over [-4π, 4π]")
    print(f"Max error: {max(e['error'] for e in errors):.8f}")
    print(f"Mean error: {np.mean([e['error'] for e in errors]):.8f}")
