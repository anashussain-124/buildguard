import json
from typing import Any, Dict, List
from fastapi import HTTPException
from pydantic import BaseModel, Field

try:
    from typing import Literal
except ImportError:
    from typing_extensions import Literal


class AnalysisRedFlag(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=1000)
    severity: Literal["Low", "Medium", "High", "Critical"]
    location: str = Field(default="", min_length=0, max_length=200)


class AnalysisClause(BaseModel):
    clause_type: str = Field(min_length=1, max_length=100)
    extracted_text: str = Field(min_length=1, max_length=5000)
    risk_score: int = Field(ge=0, le=100)
    explanation: str = Field(min_length=1, max_length=1000)
    recommendation: str = Field(default="", min_length=0, max_length=1000)


class AnalysisPayload(BaseModel):
    model_config = {"protected_namespaces": ()}

    overall_risk_score: int = Field(ge=0, le=100)
    risk_level: Literal["Low", "Medium", "High", "Critical"]
    summary: str = Field(min_length=1, max_length=500)
    red_flags: List[AnalysisRedFlag] = Field(default_factory=list)
    clauses: List[AnalysisClause] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    missing_protections: List[str] = Field(default_factory=list)
    overall_recommendation: str = Field(default="", min_length=0, max_length=500)
    model_used: str = Field(min_length=1, max_length=200)


def parse_json_or_raise(content: str) -> Any:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start = content.find("{")
        end = content.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(content[start : end + 1])
            except json.JSONDecodeError:
                pass
        raise HTTPException(status_code=502, detail="LLM response was not valid JSON")


def validate_analysis_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and sanitize LLM analysis output using strict Pydantic model."""
    try:
        validated = AnalysisPayload(**payload)
    except (ValueError, TypeError) as exc:
        raise HTTPException(
            status_code=502,
            detail=f"LLM response did not conform to expected schema: {exc}",
        )
    return validated.model_dump()
