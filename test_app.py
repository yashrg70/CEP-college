"""
Raksha Connect - Automated Unit and Integration Test Suite
Verifies database integrity, API endpoints, AI matching logic, and input validations.
"""

import pytest
import json
from app import app
from database import init_db, get_all_helplines, get_helpline_by_id, save_contact_message, CATEGORIES
from ai_assistant import get_ai_recommendation, match_problem_offline


@pytest.fixture(scope="module")
def client():
    """Configures Flask test client."""
    init_db()
    app.config["TESTING"] = True
    with app.test_client() as test_client:
        yield test_client


def test_database_initialization():
    """Verifies database contains required official helplines across all 12 categories."""
    helplines = get_all_helplines()
    assert len(helplines) >= 20, "Helpline database should have at least 20 verified entries."
    
    # Check that critical numbers exist
    numbers = [h["phone_number"] for h in helplines]
    assert "112" in numbers, "ERSS 112 must be present."
    assert "108" in numbers, "Medical Emergency 108 must be present."
    assert "101" in numbers, "Fire Emergency 101 must be present."
    assert "1930" in numbers, "Cyber Crime 1930 must be present."
    assert "1098" in numbers, "Childline 1098 must be present."
    assert "181" in numbers, "Women Helpline 181 must be present."
    assert "14567" in numbers, "Elderline 14567 must be present."
    assert "1033" in numbers, "NHAI 1033 must be present."
    assert "139" in numbers, "Railway 139 must be present."


def test_category_coverage():
    """Ensures each of the 12 required categories has at least one helpline."""
    assert len(CATEGORIES) == 12, "Must contain exactly 12 required categories."
    helplines = get_all_helplines()
    category_ids = {h["category_id"] for h in helplines}

    for cat in CATEGORIES:
        assert cat["id"] in category_ids, f"Category '{cat['name']}' has no helpline entries."


def test_helpline_search_and_filters():
    """Tests search by text, category filtering, and emergency filtering."""
    # Search by number
    res_num = get_all_helplines(query="1930")
    assert len(res_num) > 0
    assert any("Cyber" in h["helpline_name"] for h in res_num)

    # Search by keyword
    res_kw = get_all_helplines(query="ambulance")
    assert len(res_kw) > 0
    assert res_kw[0]["category_id"] == "medical"

    # Filter by category
    res_cat = get_all_helplines(category="fire")
    assert len(res_cat) > 0
    for r in res_cat:
        assert r["category_id"] == "fire"

    # Emergency filter
    res_emerg = get_all_helplines(is_emergency=True)
    assert len(res_emerg) > 0
    for r in res_emerg:
        assert r["is_emergency"] == 1


def test_ai_problem_matcher():
    """Tests AI assistant's classification and helpline pairing across various scenarios."""
    # 1. Cyber fraud scenario
    cyber = get_ai_recommendation("I received a phishing link and someone stole money from my bank account")
    assert cyber["category_id"] == "cyber_crime"
    assert any(h["phone_number"] == "1930" for h in cyber["recommended_helplines"])

    # 2. Medical accident scenario
    med = get_ai_recommendation("A person collapsed and has severe chest pain and cannot breathe")
    assert med["category_id"] == "medical"
    assert med["urgency_level"] == "CRITICAL"
    assert med["is_life_threatening"] is True

    # 3. Highway vehicle crash scenario
    road = get_ai_recommendation("Car broke down and had a crash on the national highway")
    assert road["category_id"] == "road_accidents"
    assert any(h["phone_number"] == "1033" for h in road["recommended_helplines"])

    # 4. Multilingual Hindi scenario
    hindi = get_ai_recommendation("घर में गैस सिलेंडर से बहुत तेज गैस लीक हो रही है और आग का खतरा है")
    assert hindi["category_id"] in ["govt_complaints", "fire"]


def test_api_health_endpoint(client):
    """Tests GET /api/health."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"


def test_api_categories_endpoint(client):
    """Tests GET /api/categories."""
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.get_json()
    assert data["total_categories"] == 12
    assert len(data["data"]) == 12


def test_api_helplines_endpoint(client):
    """Tests GET /api/helplines."""
    response = client.get("/api/helplines?q=women")
    assert response.status_code == 200
    data = response.get_json()
    assert data["count"] > 0
    assert any("Women" in item["category"] for item in data["data"])


def test_api_ai_recommend_endpoint(client):
    """Tests POST /api/ai/recommend."""
    payload = {"problem": "Someone is asking for bribe at the government office"}
    response = client.post(
        "/api/ai/recommend",
        data=json.dumps(payload),
        content_type="application/json"
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"
    assert data["data"]["category_id"] == "govt_complaints"


def test_api_contact_endpoint(client):
    """Tests POST /api/contact validation and submission."""
    # Invalid submission
    invalid = client.post(
        "/api/contact",
        data=json.dumps({"name": "Test"}),
        content_type="application/json"
    )
    assert invalid.status_code == 400

    # Valid submission
    valid = client.post(
        "/api/contact",
        data=json.dumps({
            "name": "Citizen Ramesh",
            "email": "ramesh@example.com",
            "subject_type": "Suggest New Helpline",
            "message": "Please add State Animal Rescue Helpline 1962."
        }),
        content_type="application/json"
    )
    assert valid.status_code == 200
    data = valid.get_json()
    assert data["status"] == "success"
