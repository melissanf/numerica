"""
FastAPI Routes for Custom Algorithms

Provides endpoints for code execution sandbox and pseudo-code conversion.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from custom_algorithms.executor import run_user_code, ALLOWED_MODULES
from custom_algorithms.converter import pseudocode_to_python


router = APIRouter()


# ==================== Request/Response Models ====================


class ExecuteCodeRequest(BaseModel):
    """Request model for code execution"""

    code: str
    inputs: Optional[Dict[str, Any]] = None
    timeout: Optional[int] = 5


class ExecuteCodeResponse(BaseModel):
    """Response model for code execution"""

    output: Optional[str]
    error: Optional[str]
    success: bool


class ConvertPseudocodeRequest(BaseModel):
    """Request model for pseudo-code conversion"""

    pseudocode: str
    api_key: Optional[str] = None


class ConvertPseudocodeResponse(BaseModel):
    """Response model for pseudo-code conversion"""

    python_code: Optional[str]
    error: Optional[str]


# ==================== Code Execution Endpoint ====================


@router.post("/execute", response_model=ExecuteCodeResponse)
async def execute_code(request: ExecuteCodeRequest):
    """
    Execute user-provided Python code in a sandboxed subprocess.

    Allowed imports: math, numpy, scipy, matplotlib, random, statistics
    Forbidden: os, sys, subprocess, open, eval, exec, etc.
    """
    try:
        # Validate timeout
        if request.timeout and (request.timeout < 1 or request.timeout > 60):
            raise ValueError("Timeout must be between 1 and 60 seconds")

        timeout = request.timeout or 5

        # Execute code
        result = run_user_code(request.code, request.inputs, timeout)

        return ExecuteCodeResponse(
            output=result["output"], error=result["erreur"], success=result["success"]
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==================== Pseudo-code Conversion Endpoint ====================


@router.post("/convert", response_model=ConvertPseudocodeResponse)
async def convert_pseudocode(request: ConvertPseudocodeRequest):
    """
    Convert pseudo-code to Python using Claude API.

    Generated code only uses: math, numpy, scipy, matplotlib
    """
    try:
        if not request.pseudocode.strip():
            raise ValueError("Pseudo-code cannot be empty")

        result = pseudocode_to_python(request.pseudocode, request.api_key)

        return ConvertPseudocodeResponse(
            python_code=result["code"], error=result["error"]
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==================== Info Endpoint ====================


@router.get("/info")
async def get_info():
    """Get information about allowed modules and restrictions"""
    return {
        "description": "Custom Algorithms Module",
        "allowed_imports": list(ALLOWED_MODULES),
        "forbidden": ["os", "sys", "subprocess", "open", "eval", "exec", "__import__"],
        "max_timeout": 60,
        "features": {
            "execute": "Run user code in sandbox",
            "convert": "Convert pseudo-code to Python via Claude API",
        },
    }


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "module": "custom_algorithms"}
