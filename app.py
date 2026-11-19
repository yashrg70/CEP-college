"""
Raksha Connect - Full-Stack Web Application Backend
Flask Server with SQLite Database and Smart AI Help Recommendation
"""

import os
from flask import Flask, request, jsonify, render_template, send_from_directory
from database import (
    init_db,
    get_all_helplines,
    get_helpline_by_id,
    save_contact_message,
    CATEGORIES,
    DB_PATH
)
from ai_assistant import get_ai_recommendation

app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates"
)

# Initialize database on startup if not already done
if not os.path.exists(DB_PATH):
    init_db()


# -------------------------------------------------------------
# Frontend Page Routes (SPA View Handlers)
# -------------------------------------------------------------
@app.route("/")
@app.route("/emergency")
@app.route("/directory")
@app.route("/assistant")
@app.route("/how-it-works")
@app.route("/about")
@app.route("/contact")
@app.route("/privacy")
def index_page():
    """Serves the primary responsive single-page application shell."""
    return render_template("index.html")


# -------------------------------------------------------------
# REST API Endpoints
# -------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    """System health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "Raksha Connect Citizen Helpline Engine",
        "version": "1.0.0",
        "database": "sqlite3",
        "ai_engine": "hybrid (Gemini API + Intelligent Semantic Rule Fallback)"
    })


@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Returns the 12 primary citizen helpline categories with statistics."""
    helplines = get_all_helplines()
    
    # Calculate count per category
    category_counts = {}
    for h in helplines:
        cat_id = h.get("category_id")
        category_counts[cat_id] = category_counts.get(cat_id, 0) + 1

    enhanced_categories = []
    for cat in CATEGORIES:
        enhanced_categories.append({
            **cat,
            "helpline_count": category_counts.get(cat["id"], 0)
        })

    return jsonify({
        "status": "success",
        "total_categories": len(CATEGORIES),
        "data": enhanced_categories
    })


@app.route("/api/helplines", methods=["GET"])
def api_helplines():
    """
    Retrieves helplines with optional filtering and sorting.
    Query params:
      - q: search term (name, number, keywords, description)
      - category: category id or name
      - emergency: 1 or 0
      - sort: alphabetical | emergency_first | verified_date
    """
    search_q = request.args.get("q", "").strip()
    category = request.args.get("category", "").strip()
    is_emergency_param = request.args.get("emergency")
    sort_by = request.args.get("sort", "alphabetical")

    is_emergency = None
    if is_emergency_param is not None and is_emergency_param != "":
        is_emergency = (is_emergency_param.lower() in ["1", "true", "yes"])

    results = get_all_helplines(
        query=search_q if search_q else None,
        category=category if category else None,
        is_emergency=is_emergency,
        sort_by=sort_by
    )

    return jsonify({
        "status": "success",
        "count": len(results),
        "query": search_q,
        "category": category or "all",
        "data": results
    })


@app.route("/api/helplines/<int:helpline_id>", methods=["GET"])
def api_helpline_detail(helpline_id):
    """Retrieves specific helpline details by ID."""
    record = get_helpline_by_id(helpline_id)
    if not record:
        return jsonify({"status": "error", "message": "Helpline record not found"}), 404
    return jsonify({"status": "success", "data": record})


@app.route("/api/ai/recommend", methods=["POST"])
def api_ai_recommend():
    """
    Accepts natural language citizen problem description.
    Returns matched category, explanation, advice, and verified helplines.
    """
    data = request.get_json(silent=True) or {}
    problem_text = data.get("problem", "").strip()

    if not problem_text:
        return jsonify({
            "status": "error",
            "message": "Problem description is required."
        }), 400

    if len(problem_text) < 3:
        return jsonify({
            "status": "error",
            "message": "Please enter a descriptive problem query (minimum 3 characters)."
        }), 400

    recommendation = get_ai_recommendation(problem_text)
    return jsonify({
        "status": "success",
        "data": recommendation
    })


@app.route("/api/contact", methods=["POST"])
def api_contact():
    """Accepts user feedback, helpline update, or correction submission."""
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    subject_type = data.get("subject_type", "General Feedback").strip()
    message = data.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({
            "status": "error",
            "message": "Name, email, and message are required."
        }), 400

    if "@" not in email or "." not in email:
        return jsonify({
            "status": "error",
            "message": "Please provide a valid email address."
        }), 400

    save_contact_message(name, email, subject_type, message)

    return jsonify({
        "status": "success",
        "message": "Thank you! Your feedback or helpline report has been safely logged for administrative review."
    })


@app.route("/api/stats", methods=["GET"])
def api_stats():
    """Returns high-level statistics for the citizen trust counter."""
    all_records = get_all_helplines()
    total_helplines = len(all_records)
    verified_count = sum(1 for h in all_records if "Verified" in h.get("verification_status", ""))
    emergency_count = sum(1 for h in all_records if h.get("is_emergency") == 1)
    toll_free_count = sum(1 for h in all_records if h.get("is_toll_free") == 1)

    return jsonify({
        "status": "success",
        "stats": {
            "total_helplines": total_helplines,
            "total_categories": len(CATEGORIES),
            "verified_official": verified_count,
            "emergency_speed_dials": emergency_count,
            "toll_free_services": toll_free_count,
            "coverage": "All 28 States & 8 UTs",
            "response_time": "< 300ms",
            "operating_model": "100% Free Citizen Service"
        }
    })


# -------------------------------------------------------------
# Static Asset Fallback
# -------------------------------------------------------------
@app.route("/<path:filename>")
def serve_static(filename):
    """Serves static files directly if requested from root."""
    if os.path.exists(os.path.join(app.static_folder, filename)):
        return send_from_directory(app.static_folder, filename)
    return render_template("index.html")


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    print(f"============================================================")
    print(f"  🛡️ RAKSHA CONNECT — Smart Citizen Support System")
    print(f"  One app. The right helpline. Instantly.")
    print(f"  Local Server: http://localhost:{port}/")
    print(f"============================================================")
    app.run(host="0.0.0.0", port=port, debug=False)
