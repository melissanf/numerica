"""
Sandbox Executor for User Code

Executes user-provided Python code in a sandboxed subprocess with security checks.
"""

import subprocess
import tempfile
import os
import ast
from typing import Dict, Any


# Whitelist of allowed imports
ALLOWED_MODULES = {"math", "numpy", "scipy", "matplotlib", "random", "statistics"}

# Blacklist of dangerous functions/modules
DANGEROUS_ITEMS = {
    "os",
    "sys",
    "subprocess",
    "open",
    "eval",
    "exec",
    "__import__",
    "input",
    "file",
    "compile",
}


class ImportValidator(ast.NodeVisitor):
    """AST visitor to check for dangerous imports"""

    def __init__(self):
        self.safe = True
        self.dangerous_imports = []

    def visit_Import(self, node):
        for alias in node.names:
            module_name = alias.name.split(".")[0]
            if module_name in DANGEROUS_ITEMS:
                self.safe = False
                self.dangerous_imports.append(module_name)
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        if node.module:
            module_name = node.module.split(".")[0]
            if module_name in DANGEROUS_ITEMS:
                self.safe = False
                self.dangerous_imports.append(module_name)
        self.generic_visit(node)


def validate_code_safety(code: str) -> tuple[bool, str]:
    """
    Validate code for dangerous imports using AST parsing.

    Args:
        code: Python code to validate

    Returns:
        (is_safe, error_message)
    """
    try:
        tree = ast.parse(code)
        validator = ImportValidator()
        validator.visit(tree)

        if not validator.safe:
            error_msg = f"Dangerous imports detected: {', '.join(set(validator.dangerous_imports))}"
            return False, error_msg

        return True, ""
    except SyntaxError as e:
        return False, f"Syntax error: {e}"
    except Exception as e:
        return False, f"Validation error: {e}"


def run_user_code(
    code: str, inputs: Dict[str, Any] = None, timeout: int = 5
) -> Dict[str, Any]:
    """
    Execute user code in a sandboxed subprocess.

    Args:
        code: Python code to execute
        inputs: Dictionary of variables to inject into the code
        timeout: Timeout in seconds

    Returns:
        Dict with 'output' (stdout), 'erreur' (stderr), and 'success' (bool)
    """
    # Validate code first
    is_safe, error_msg = validate_code_safety(code)
    if not is_safe:
        return {
            "output": None,
            "erreur": f"Code validation failed: {error_msg}",
            "success": False,
        }

    # Create temporary file
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        temp_file = f.name

        # Prepare the code with injected inputs
        injection_code = ""
        if inputs:
            injection_code = "# Injected variables:\n"
            for key, value in inputs.items():
                injection_code += f"{key} = {repr(value)}\n"
            injection_code += "\n"

        f.write(injection_code)
        f.write(code)

    try:
        # Run the code in subprocess
        result = subprocess.run(
            ["/home/younes/Desktop/numerica/.venv/bin/python", temp_file],
            capture_output=True,
            text=True,
            timeout=timeout,
        )

        output = result.stdout.strip() if result.stdout else None
        error = result.stderr.strip() if result.stderr else None

        return {"output": output, "erreur": error, "success": result.returncode == 0}

    except subprocess.TimeoutExpired:
        return {
            "output": None,
            "erreur": f"Code execution timed out after {timeout} seconds",
            "success": False,
        }

    except Exception as e:
        return {
            "output": None,
            "erreur": f"Execution error: {str(e)}",
            "success": False,
        }

    finally:
        # Clean up temporary file
        try:
            os.remove(temp_file)
        except:
            pass


if __name__ == "__main__":
    print("=" * 70)
    print("SANDBOX EXECUTOR TESTS")
    print("=" * 70)

    # Test 1: Safe code
    print("\nTest 1: Safe code execution")
    safe_code = """
import math
x = 5
result = math.sqrt(x)
print(f"Square root of {x} is {result}")
"""
    result = run_user_code(safe_code)
    print(f"Output: {result['output']}")
    print(f"Error: {result['erreur']}")
    print(f"Success: {result['success']}")

    # Test 2: Dangerous import (os)
    print("\nTest 2: Dangerous import (os module)")
    dangerous_code = """
import os
print(os.getcwd())
"""
    result = run_user_code(dangerous_code)
    print(f"Output: {result['output']}")
    print(f"Error: {result['erreur']}")
    print(f"Success: {result['success']}")

    # Test 3: Dangerous function (eval)
    print("\nTest 3: Dangerous function (eval)")
    dangerous_eval_code = """
code = "print('hacked')"
eval(code)
"""
    result = run_user_code(dangerous_eval_code)
    print(f"Output: {result['output']}")
    print(f"Error: {result['erreur']}")
    print(f"Success: {result['success']}")

    # Test 4: Code with inputs
    print("\nTest 4: Code with injected inputs")
    code_with_inputs = """
import numpy as np
data = np.array(data_list)
mean = np.mean(data)
print(f"Mean: {mean}")
"""
    result = run_user_code(code_with_inputs, {"data_list": [1, 2, 3, 4, 5]})
    print(f"Output: {result['output']}")
    print(f"Error: {result['erreur']}")
    print(f"Success: {result['success']}")

    # Test 5: Timeout
    print("\nTest 5: Timeout test")
    timeout_code = """
import time
while True:
    time.sleep(1)
"""
    result = run_user_code(timeout_code, timeout=2)
    print(f"Output: {result['output']}")
    print(f"Error: {result['erreur']}")
    print(f"Success: {result['success']}")

    print("\n" + "=" * 70)
    print("✓ All executor tests completed!")
    print("=" * 70)
