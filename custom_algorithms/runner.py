import subprocess, tempfile, os, ast
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

ALLOWED = {"math", "numpy", "scipy", "matplotlib", "random", "statistics"}
BLOCKED = {
    "os",
    "sys",
    "subprocess",
    "open",
    "eval",
    "exec",
    "__import__",
    "input",
    "compile",
}


def is_safe(code: str) -> tuple[bool, str]:
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                names = (
                    [a.name for a in node.names]
                    if isinstance(node, ast.Import)
                    else [node.module or ""]
                )
                for name in names:
                    if name.split(".")[0] in BLOCKED:
                        return False, f"Import interdit: {name}"
        return True, ""
    except SyntaxError as e:
        return False, f"Erreur de syntaxe: {e}"


class RunRequest(BaseModel):
    code: str
    timeout: Optional[int] = 5


@router.post("/run")
def run_code(req: RunRequest):
    safe, err = is_safe(req.code)
    if not safe:
        return {"output": None, "error": err, "success": False}

    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(req.code)
        tmp = f.name

    try:
        result = subprocess.run(
            ["/home/younes/Desktop/numerica/.venv/bin/python", tmp],
            capture_output=True,
            text=True,
            timeout=req.timeout,
        )
        return {
            "output": result.stdout.strip() or None,
            "error": result.stderr.strip() or None,
            "success": result.returncode == 0,
        }
    except subprocess.TimeoutExpired:
        return {
            "output": None,
            "error": f"Timeout après {req.timeout}s",
            "success": False,
        }
    finally:
        os.remove(tmp)
