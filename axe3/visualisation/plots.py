import numpy as np
import matplotlib

matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
from matplotlib import cm
import base64
import io
from typing import List, Callable, Dict, Tuple, Any


def fig_to_base64(fig: plt.Figure) -> str:
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=100, bbox_inches="tight")
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close(fig)
    return image_base64


def plot_interpolation(
    x_nodes: np.ndarray,
    y_nodes: np.ndarray,
    poly_fn: Callable[[float], float],
    label: str = "Interpolation",
    true_fn: Callable[[float], float] = None,
    title: str = "Polynomial Interpolation",
) -> str:
    fig, ax = plt.subplots(figsize=(10, 6))

    # Convert to float to handle numpy scalars
    x_min = float(np.min(x_nodes))
    x_max = float(np.max(x_nodes))
    x_range = x_max - x_min
    x_min -= 0.1 * x_range
    x_max += 0.1 * x_range

    # Generate dense x values for smooth curve
    x_vals = np.linspace(x_min, x_max, 300)
    y_poly = np.array([poly_fn(x) for x in x_vals])

    # Plot polynomial
    ax.plot(x_vals, y_poly, "b-", linewidth=2, label=label)

    # Plot nodes
    ax.plot(x_nodes, y_nodes, "ro", markersize=8, label="Interpolation nodes", zorder=5)

    # Plot true function if provided
    if true_fn is not None:
        y_true = np.array([true_fn(x) for x in x_vals])
        ax.plot(x_vals, y_true, "g--", linewidth=2, label="True function", alpha=0.7)

    ax.set_xlabel("x", fontsize=12)
    ax.set_ylabel("y", fontsize=12)
    ax.set_title(title, fontsize=14)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)

    return fig_to_base64(fig)


def plot_approximation(
    x_nodes: np.ndarray,
    y_nodes: np.ndarray,
    polys_dict: Dict[int, Callable[[float], float]],
    title: str = "Polynomial Approximation (Least Squares)",
) -> str:
    fig, ax = plt.subplots(figsize=(10, 6))

    # Convert to float to handle numpy scalars
    x_min = float(np.min(x_nodes))
    x_max = float(np.max(x_nodes))
    x_range = x_max - x_min
    x_min -= 0.1 * x_range
    x_max += 0.1 * x_range

    # Generate dense x values
    x_vals = np.linspace(x_min, x_max, 300)

    # Colors for different degrees
    colors = ["red", "green", "blue", "purple", "orange", "brown"]

    # Plot each polynomial
    for idx, (degree, poly_fn) in enumerate(sorted(polys_dict.items())):
        y_poly = np.array([poly_fn(x) for x in x_vals])
        ax.plot(
            x_vals,
            y_poly,
            color=colors[idx % len(colors)],
            linewidth=2,
            label=f"Degree {degree}",
            alpha=0.8,
        )

    # Plot data points
    ax.plot(x_nodes, y_nodes, "ko", markersize=8, label="Data points", zorder=5)

    ax.set_xlabel("x", fontsize=12)
    ax.set_ylabel("y", fontsize=12)
    ax.set_title(title, fontsize=14)
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)

    return fig_to_base64(fig)


def plot_gradient_3d(
    f: Callable[[np.ndarray], float],
    history: List[np.ndarray],
    title: str = "Gradient Descent Trajectory (3D Surface)",
    x_range: Tuple[float, float] = (-2, 2),
    y_range: Tuple[float, float] = (-2, 2),
) -> str:
    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection="3d")

    # Create mesh grid
    x = np.linspace(x_range[0], x_range[1], 50)
    y = np.linspace(y_range[0], y_range[1], 50)
    X, Y = np.meshgrid(x, y)
    Z = np.array(
        [
            [f(np.array([xi, yi])) for xi, yi in zip(x_row, y_row)]
            for x_row, y_row in zip(X, Y)
        ]
    )

    # Plot surface
    surf = ax.plot_surface(X, Y, Z, cmap="viridis", alpha=0.6, edgecolor="none")

    # Plot trajectory
    history_array = np.array(history)
    z_trajectory = np.array([f(point) for point in history_array])
    ax.plot(
        history_array[:, 0],
        history_array[:, 1],
        z_trajectory,
        "r-",
        linewidth=2,
        label="Descent path",
    )
    ax.scatter(
        history_array[:, 0], history_array[:, 1], z_trajectory, c="red", s=30, zorder=5
    )

    # Mark start and end
    ax.scatter(
        [history_array[0, 0]],
        [history_array[0, 1]],
        [z_trajectory[0]],
        c="green",
        s=100,
        marker="o",
        label="Start",
        zorder=6,
    )
    ax.scatter(
        [history_array[-1, 0]],
        [history_array[-1, 1]],
        [z_trajectory[-1]],
        c="blue",
        s=100,
        marker="*",
        label="End",
        zorder=6,
    )

    ax.set_xlabel("x", fontsize=10)
    ax.set_ylabel("y", fontsize=10)
    ax.set_zlabel("f(x,y)", fontsize=10)
    ax.set_title(title, fontsize=12)
    ax.legend(fontsize=10)
    fig.colorbar(surf, ax=ax, label="f(x,y)")

    return fig_to_base64(fig)


def plot_gradient_contour(
    f: Callable[[np.ndarray], float],
    history: List[np.ndarray],
    title: str = "Gradient Descent Trajectory (Contour Plot)",
    x_range: Tuple[float, float] = (-2, 2),
    y_range: Tuple[float, float] = (-2, 2),
) -> str:
    fig, ax = plt.subplots(figsize=(10, 8))

    # Create mesh grid
    x = np.linspace(x_range[0], x_range[1], 100)
    y = np.linspace(y_range[0], y_range[1], 100)
    X, Y = np.meshgrid(x, y)
    Z = np.array(
        [
            [f(np.array([xi, yi])) for xi, yi in zip(x_row, y_row)]
            for x_row, y_row in zip(X, Y)
        ]
    )

    # Plot contour lines
    levels = np.linspace(np.min(Z), np.max(Z), 20)
    contours = ax.contour(X, Y, Z, levels=levels, cmap="viridis", alpha=0.6)
    ax.clabel(contours, inline=True, fontsize=8)

    # Plot filled contours for better visualization
    contourf = ax.contourf(X, Y, Z, levels=20, cmap="viridis", alpha=0.3)

    # Plot trajectory
    history_array = np.array(history)
    ax.plot(
        history_array[:, 0],
        history_array[:, 1],
        "r-",
        linewidth=2,
        label="Descent path",
    )
    ax.scatter(history_array[:, 0], history_array[:, 1], c="red", s=30, zorder=5)

    # Mark start and end
    ax.scatter(
        [history_array[0, 0]],
        [history_array[0, 1]],
        c="green",
        s=100,
        marker="o",
        label="Start",
        zorder=6,
    )
    ax.scatter(
        [history_array[-1, 0]],
        [history_array[-1, 1]],
        c="blue",
        s=100,
        marker="*",
        label="End",
        zorder=6,
    )

    ax.set_xlabel("x", fontsize=12)
    ax.set_ylabel("y", fontsize=12)
    ax.set_title(title, fontsize=14)
    ax.legend(fontsize=10)
    fig.colorbar(contourf, ax=ax, label="f(x,y)")

    return fig_to_base64(fig)


def plot_convergence(
    iterations: List[int],
    values: List[float],
    title: str = "Convergence Analysis",
    ylabel: str = "Function Value",
) -> str:
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

    # Linear scale
    ax1.plot(iterations, values, "b-o", linewidth=2, markersize=6)
    ax1.set_xlabel("Iteration", fontsize=12)
    ax1.set_ylabel(ylabel, fontsize=12)
    ax1.set_title(f"{title} (Linear Scale)", fontsize=12)
    ax1.grid(True, alpha=0.3)

    # Log scale
    values_array = np.array(values)
    # Avoid log of zero or negative
    values_positive = values_array[values_array > 0]
    if len(values_positive) > 0:
        ax2.semilogy(
            iterations[: len(values_positive)],
            values_positive,
            "r-o",
            linewidth=2,
            markersize=6,
        )
        ax2.set_xlabel("Iteration", fontsize=12)
        ax2.set_ylabel(ylabel, fontsize=12)
        ax2.set_title(f"{title} (Log Scale)", fontsize=12)
        ax2.grid(True, alpha=0.3, which="both")

    plt.tight_layout()
    return fig_to_base64(fig)


if __name__ == "__main__":
    import sys

    sys.path.insert(0, "/home/younes/Desktop/numerica")

    # Test 1: Interpolation plot
    print("TEST 1: Interpolation Plot")
    from axe3.interpolation.lagrange import lagrange_interpolate, discrete_points

    x_nodes, y_nodes = discrete_points()

    def poly_fn(x):
        return lagrange_interpolate(x_nodes, y_nodes, x)

    plot_base64 = plot_interpolation(
        x_nodes, y_nodes, poly_fn, label="Lagrange Polynomial"
    )
    print(f"✓ Interpolation plot generated ({len(plot_base64) // 1024}KB)")

    # Test 2: Approximation plot with multiple degrees
    print("\nTEST 2: Approximation Plot")

    # Create some test data
    x_test = np.array([0, 0.25, 0.5, 0.75, 1.0])
    y_test = np.sin(np.pi * x_test)

    polys = {}
    for degree in range(1, 4):
        coeffs = np.polyfit(x_test, y_test, degree)
        polys[degree] = np.poly1d(coeffs)

    plot_base64 = plot_approximation(x_test, y_test, polys)
    print(f"✓ Approximation plot generated ({len(plot_base64) // 1024}KB)")

    # Test 3: Gradient descent 2D visualization
    print("\nTEST 3: Gradient Descent Plots")

    def test_function(point):
        x, y = point
        return x**2 + 2 * y**2 + x * y

    # Simulate a descent history
    history = [
        np.array([1.5, 1.5]),
        np.array([1.2, 1.1]),
        np.array([0.8, 0.7]),
        np.array([0.4, 0.3]),
        np.array([0.1, 0.05]),
    ]

    plot_base64_3d = plot_gradient_3d(test_function, history)
    print(f"✓ Gradient 3D plot generated ({len(plot_base64_3d) // 1024}KB)")

    plot_base64_contour = plot_gradient_contour(test_function, history)
    print(f"✓ Gradient contour plot generated ({len(plot_base64_contour) // 1024}KB)")

    # Test 4: Convergence plot
    print("\nTEST 4: Convergence Plot")
    iterations = list(range(20))
    values = [2 ** (-i) for i in iterations]

    plot_base64_conv = plot_convergence(iterations, values, ylabel="Error")
    print(f"✓ Convergence plot generated ({len(plot_base64_conv) // 1024}KB)")

    print("\n✓ All visualization tests passed!")
