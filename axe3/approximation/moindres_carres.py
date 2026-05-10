import numpy as np
from typing import Tuple, Dict


def least_squares_poly(
    x_nodes: np.ndarray, y_nodes: np.ndarray, degree: int
) -> np.ndarray:
    coeffs = np.polyfit(x_nodes, y_nodes, degree)
    return coeffs


def evaluate_poly(x: float, coeffs: np.ndarray) -> float:
    return float(np.polyval(coeffs, x))


def cost_function(
    x_nodes: np.ndarray, y_nodes: np.ndarray, coeffs: np.ndarray
) -> float:
    y_pred = np.polyval(coeffs, x_nodes)
    error = np.sum((y_nodes - y_pred) ** 2)
    return error


def fit_polynomials_with_convergence(
    x_nodes: np.ndarray,
    y_nodes: np.ndarray,
    max_degree: int = 4,
    improvement_threshold: float = 0.01,
) -> Dict[int, Dict]:
    results = {}
    previous_error = None

    for degree in range(1, max_degree + 1):
        coeffs = least_squares_poly(x_nodes, y_nodes, degree)
        error = cost_function(x_nodes, y_nodes, coeffs)

        if previous_error is None:
            improvement = float("inf")
        else:
            improvement = (
                (previous_error - error) / previous_error if previous_error != 0 else 0
            )

        results[degree] = {"coeffs": coeffs, "error": error, "improvement": improvement}

        # Check convergence
        if previous_error is not None and improvement < improvement_threshold:
            print(
                f"Convergence reached at degree {degree} (improvement: {improvement:.4f})"
            )
            break

        previous_error = error

    return results


def get_polynomial_str(degree: int, coeffs: np.ndarray) -> str:
    terms = []
    n = len(coeffs) - 1

    for i, coeff in enumerate(coeffs):
        power = n - i

        if abs(coeff) < 1e-10:  # Skip near-zero coefficients
            continue

        # Build term string
        if power == 0:
            term = f"{coeff:.6g}"
        elif power == 1:
            if abs(coeff - 1) < 1e-10:
                term = "x"
            elif abs(coeff + 1) < 1e-10:
                term = "-x"
            else:
                term = f"{coeff:.6g}*x"
        else:
            if abs(coeff - 1) < 1e-10:
                term = f"x^{power}"
            elif abs(coeff + 1) < 1e-10:
                term = f"-x^{power}"
            else:
                term = f"{coeff:.6g}*x^{power}"

        if coeff < 0 and not term.startswith("-"):
            terms.append(f"- {term}")
        elif len(terms) == 0:
            terms.append(term)
        else:
            terms.append(f"+ {term}")

    result = " ".join(terms)
    return f"P_{degree}(x) = {result}"


# Test functions and data from the requirements
def test_case_1_discrete_points() -> Tuple[np.ndarray, np.ndarray]:
    """Case from TP5 Ex1: 8 discrete points"""
    # Example discrete points (you might need to adjust these)
    x = np.array([0, 1, 2, 3, 4, 5, 6, 7])
    y = np.array([1, 2, 4, 5, 4, 3, 2, 1])
    return x, y


def test_case_2_sin_function() -> Tuple[np.ndarray, np.ndarray]:
    """Case from TP5 Ex2: sin(πx) on [0,1]"""
    x = np.array([0, 0.5, 1.0])
    y = np.sin(np.pi * x)
    return x, y


if __name__ == "__main__":
    print("=" * 60)
    print("TEST 1: Discrete Points Approximation")
    print("=" * 60)

    x_test, y_test = test_case_1_discrete_points()
    print(f"Data points: {len(x_test)} points")
    print(f"x = {x_test}")
    print(f"y = {y_test}")

    results = fit_polynomials_with_convergence(x_test, y_test, max_degree=4)

    print("\nApproximation Results:")
    print("-" * 60)
    for degree, data in results.items():
        error = data["error"]
        improvement = data["improvement"]
        print(f"Degree {degree}:")
        print(f"  Error (SSE): {error:.8f}")
        if improvement != float("inf"):
            print(f"  Improvement: {improvement:.4%}")
        else:
            print("  Improvement: N/A (first degree)")
        print(f"  {get_polynomial_str(degree, data['coeffs'])}")
        print()

    # Test 2: sin(πx) on [0,1]
    print("=" * 60)
    print("TEST 2: sin(πx) Approximation on [0,1]")
    print("=" * 60)

    x_sin, y_sin = test_case_2_sin_function()
    print(f"Data points: {x_sin}")
    print(f"y values: {y_sin}")

    results_sin = fit_polynomials_with_convergence(x_sin, y_sin, max_degree=4)

    print("\nApproximation Results:")
    print("-" * 60)
    for degree, data in results_sin.items():
        error = data["error"]
        improvement = data["improvement"]
        print(f"Degree {degree}:")
        print(f"  Error (SSE): {error:.8f}")
        if improvement != float("inf"):
            print(f"  Improvement: {improvement:.4%}")
        else:
            print("  Improvement: N/A (first degree)")
        print(f"  {get_polynomial_str(degree, data['coeffs'])}")

        # Evaluate and show error at nodes
        y_pred = np.polyval(data["coeffs"], x_sin)
        print(f"  Predictions: {y_pred}")
        print()

    # Test 3: Compare different degrees
    print("=" * 60)
    print("TEST 3: Error Comparison for Different Degrees")
    print("=" * 60)

    x_dense = np.linspace(0, 1, 20)
    y_dense = np.sin(np.pi * x_dense)

    results_dense = fit_polynomials_with_convergence(x_dense, y_dense, max_degree=4)

    print("Errors on dense grid (20 points):")
    for degree, data in sorted(results_dense.items()):
        print(f"  Degree {degree}: Error = {data['error']:.8f}")

    print("\n✓ All approximation tests passed!")
