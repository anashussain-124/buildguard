from backend.utils import parse_json_or_raise, validate_analysis_payload
import pytest


def test_parse_json_valid():
    s = '{"a": 1, "b": 2}'
    obj = parse_json_or_raise(s)
    assert obj["a"] == 1


def test_parse_json_with_extra_text():
    s = 'Some preamble text {"x": 10} trailing'
    obj = parse_json_or_raise(s)
    assert obj["x"] == 10


def test_parse_json_invalid_raises():
    with pytest.raises(Exception):
        parse_json_or_raise('no json here')


def test_validate_analysis_payload_missing_keys():
    bad = {"overall_risk_score": 5}
    with pytest.raises(Exception):
        validate_analysis_payload(bad)


def test_validate_analysis_payload_ok():
    good = {
        "overall_risk_score": 5,
        "risk_level": "Low",
        "summary": "ok",
        "red_flags": [],
        "clauses": [],
        "recommendations": [],
        "missing_protections": [],
        "overall_recommendation": "sign",
        "model_used": "meta-llama/llama-3.3-70b-instruct:free",
    }
    assert validate_analysis_payload(good)["risk_level"] == "Low"
