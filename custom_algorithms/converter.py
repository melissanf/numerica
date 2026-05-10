"""
Pseudo-code to Python Converter

Uses Anthropic API to convert pseudo-code to Python.
"""

import os
from typing import Optional
from anthropic import Anthropic


client = Anthropic()

SYSTEM_PROMPT = """You are a Python code converter expert. Your task is to convert pseudo-code or algorithm descriptions into clean, runnable Python code.

Rules:
1. Only use libraries: math, numpy, scipy, matplotlib
2. Return ONLY the Python code, no markdown, no explanations
3. Include proper error handling
4. Add comments explaining complex parts
5. Make the code production-ready
6. Avoid any imports other than those listed above
7. Do not include file I/O operations

The code should be ready to execute directly."""


def pseudocode_to_python(pseudocode: str, api_key: Optional[str] = None) -> dict:
    """
    Convert pseudo-code to Python using Claude API.

    Args:
        pseudocode: Pseudo-code or algorithm description
        api_key: Optional API key (uses ANTHROPIC_API_KEY env var if not provided)

    Returns:
        Dict with 'code' (str) and 'error' (str or None)
    """
    try:
        if not api_key:
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                return {
                    "code": None,
                    "error": "ANTHROPIC_API_KEY not set in environment",
                }

        # Create message with Anthropic API
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Convert this pseudo-code to Python:\n\n{pseudocode}",
                }
            ],
        )

        # Extract the code from the response
        python_code = message.content[0].text.strip()

        # Remove markdown code blocks if present
        if python_code.startswith("```"):
            lines = python_code.split("\n")
            # Remove first line (```python or ```)
            if lines[0].startswith("```"):
                lines = lines[1:]
            # Remove last line (```)
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            python_code = "\n".join(lines).strip()

        return {"code": python_code, "error": None}

    except Exception as e:
        return {"code": None, "error": f"API error: {str(e)}"}


if __name__ == "__main__":
    print("=" * 70)
    print("PSEUDO-CODE TO PYTHON CONVERTER TESTS")
    print("=" * 70)

    # Test cases
    test_cases = [
        {
            "name": "Simple loop",
            "pseudocode": """
Algorithm: Sum of squares
Input: n (integer)
Output: sum of i^2 for i from 1 to n

total = 0
for i = 1 to n:
    total = total + i*i
return total
""",
        },
        {
            "name": "Quadratic formula",
            "pseudocode": """
Algorithm: Solve quadratic equation
Input: a, b, c (coefficients of ax^2 + bx + c = 0)
Output: roots of the equation

discriminant = b^2 - 4*a*c
if discriminant < 0:
    return "No real roots"
else:
    sqrt_discriminant = sqrt(discriminant)
    x1 = (-b + sqrt_discriminant) / (2*a)
    x2 = (-b - sqrt_discriminant) / (2*a)
    return [x1, x2]
""",
        },
    ]

    for test_case in test_cases:
        print(f"\n{test_case['name']}")
        print("-" * 70)
        print(f"Input pseudo-code:\n{test_case['pseudocode']}")

        result = pseudocode_to_python(test_case["pseudocode"])

        if result["error"]:
            print(f"Error: {result['error']}")
        else:
            print(f"Generated Python code:\n{result['code']}")
        print()

    print("=" * 70)
