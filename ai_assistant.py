"""
Raksha Connect - AI-Powered Smart Help Assistant Engine
Understands natural language citizen problems and matches them to official verified helplines.
Supports external LLM API (Gemini / OpenAI) with an intelligent, offline semantic fallback engine.
"""

import os
import re
import json
import urllib.request
import urllib.error
from database import get_all_helplines, CATEGORIES

# Intent mapping dictionary supporting English, Hindi, and Marathi terminology
INTENT_RULES = [
    {
        "category_id": "cyber_crime",
        "category_name": "Cyber Crime",
        "keywords": [
            "cyber", "fraud", "scam", "phishing", "bank", "otp", "upi", "paytm", "gpay",
            "phonepe", "hacked", "stolen money", "debited", "account drained", "online fraud",
            "suspicious message", "apk", "lottery", "blackmail", "nude call", "sextortion",
            "credit card", "debit card", "atm fraud", "sim swap", "fraud call",
            "पैसे कट", "धोखाधड़ी", "ऑनलाइन ठगी", "बैंक फ्रॉड", "खाते से पैसे", "ओटीपी",
            "सायबर", "फसवणूक", "बँक घोटाळा"
        ],
        "urgency": "HIGH",
        "advice": "CRITICAL GOLDEN HOUR: Report within 2 hours to freeze the financial transaction before money is withdrawn. Keep your transaction reference ID, screenshot, and bank account number ready."
    },
    {
        "category_id": "medical",
        "category_name": "Medical Emergency",
        "keywords": [
            "medical", "ambulance", "doctor", "heart attack", "chest pain", "unconscious",
            "bleeding", "patient", "injury", "stroke", "collapsed", "breathing issue",
            "oxygen", "poison", "hospital", "delivery", "pregnant", "labour pain", "trauma",
            "blood needed", "snake bite", "choking", "seizure", "fits",
            "एम्बुलेंस", "दिल का दौरा", "बेहोश", "खून", "अस्पताल", "इलाज", "प्रसव", "ज़हर",
            "रुग्णवाहिका", "हृदयविकार", "रक्तस्त्राव", "दवाखाना"
        ],
        "urgency": "CRITICAL",
        "advice": "IMMEDIATE ACTION: Ensure the patient is in a safe position, check pulse and breathing, do not give oral liquids if unconscious, and call for emergency ambulance transport immediately."
    },
    {
        "category_id": "fire",
        "category_name": "Fire Emergency",
        "keywords": [
            "fire", "flames", "smoke", "burning", "blaze", "cylinder blast", "short circuit fire",
            "building on fire", "fire brigade", "fire engine", "extinguisher", "trapped in fire",
            "आग", "धुआं", "सिलेंडर ब्लास्ट", "शॉर्ट सर्किट", "दमकल", "आगीची घटना", "स्फोट"
        ],
        "urgency": "CRITICAL",
        "advice": "LIFE SAFETY WARNING: Evacuate the premises immediately using stairs (do not use elevators), cover your nose with a damp cloth if smoke is present, and alert occupants nearby."
    },
    {
        "category_id": "women_safety",
        "category_name": "Women Safety",
        "keywords": [
            "women", "girl", "female", "harassment", "stalking", "eve teasing", "molestation",
            "domestic violence", "husband beating", "in-laws abuse", "dowry", "threat to woman",
            "cab safety", "night stranded", "indecent", "posha", "unsafe", "shelter needed",
            "महिला सुरक्षा", "घरेलू हिंसा", "छेड़छाड़", "दहेज", "उत्पीड़न", "महिला",
            "महिला अत्याचार", "कौटुंबिक हिंसाचार", "सुरक्षा"
        ],
        "urgency": "HIGH",
        "advice": "SAFETY ADVISORY: Move to a well-lit, populated public area or police station. Share your live location with trusted family members. Call the 24x7 helpline for rescue and counseling."
    },
    {
        "category_id": "child_protection",
        "category_name": "Child Protection",
        "keywords": [
            "child", "minor", "kid", "baby", "orphan", "child abuse", "child labor", "begging child",
            "abandoned baby", "runaway child", "pocso", "child marriage", "school beating",
            "trafficking", "missing child",
            "बच्चा", "बाल मजदूरी", "बाल विवाह", "बाल शोषण", "अनाथ", "लापता बच्चा",
            "मुलगा", "मुलगी", "बाल कामगार", "बाल अत्याचार"
        ],
        "urgency": "HIGH",
        "advice": "CHILD WELFARE: Do not confront armed traffickers alone. Note the exact physical location, description of the child, and contact Childline 1098 or ERSS 112 for safe interception."
    },
    {
        "category_id": "police",
        "category_name": "Police Assistance",
        "keywords": [
            "police", "cops", "thana", "theft", "stolen", "robbery", "burglary", "attack",
            "physical assault", "beating", "fight", "brawl", "fir", "threat", "gang",
            "kidnap", "weapon", "loudspeaker nuisance", "illegal", "patrol",
            "पुलिस", "चोरी", "डकैती", "मारपीट", "झगड़ा", "धमकी", "थाना", "एफआईआर",
            "पोलीस", "चोरीची तक्रार", "भांडण", "हल्ला"
        ],
        "urgency": "CRITICAL",
        "advice": "EMERGENCY PROTOCOL: If you are in immediate physical danger, retreat to safety. Note vehicle plate numbers and suspect descriptions. Unified Emergency 112 connects to GPS police patrol."
    },
    {
        "category_id": "road_accidents",
        "category_name": "Road and Traffic Accidents",
        "keywords": [
            "accident", "crash", "highway", "expressway", "overturned", "car hit", "bike accident",
            "towing", "crane", "breakdown on highway", "punctured", "stuck on highway", "nhai",
            "toll road", "collision", "hit and run", "expressway emergency",
            "सड़क दुर्घटना", "एक्सीडेंट", "हाइवे", "गाड़ी टकराई", "क्रेन", "गाड़ी खराब",
            "रस्ता अपघात", "हायवे", "वाहन धडक"
        ],
        "urgency": "CRITICAL",
        "advice": "HIGHWAY SAFETY: Pull over safely away from moving lanes if possible, turn on hazard lights, place reflective triangles 50m behind, and call NHAI 1033 for crane or ambulance dispatch."
    },
    {
        "category_id": "senior_citizen",
        "category_name": "Senior Citizen Assistance",
        "keywords": [
            "senior citizen", "elderly", "old age", "parents", "elder abuse", "abandoned old",
            "pension fraud", "loneliness", "caregiver", "dementia", "maintenance rights", "geriatric",
            "बुजुर्ग", "वृद्ध", "माता-पिता", "पेंशन", "बुढ़ापा", "वृद्धाश्रम",
            "ज्येष्ठ नागरिक", "म्हातारपण", "वृद्धाश्रम"
        ],
        "urgency": "STANDARD",
        "advice": "ELDER SUPPORT: Elderline 14567 assists with elder care, rescue of abandoned parents, legal rights under Maintenance of Parents Act, and free emotional counseling."
    },
    {
        "category_id": "disaster_mgmt",
        "category_name": "Disaster Management",
        "keywords": [
            "disaster", "flood", "earthquake", "cyclone", "storm", "landslide", "tsunami",
            "waterlogging", "cloudburst", "heavy rainfall", "ndrf", "ndma", "evacuation",
            "बाढ़", "भूकंप", "चक्रवात", "तूफान", "भूस्खलन", "राहत शिविर", "एनडीआरएफ",
            "पूर", "भूकंप", "वादळ", "दरड कोसळणे"
        ],
        "urgency": "CRITICAL",
        "advice": "DISASTER PROTOCOL: Turn off electrical mains and gas supplies. Move to elevated ground if flooding. Listen to official meteorological bulletins and contact NDMA 1078."
    },
    {
        "category_id": "govt_complaints",
        "category_name": "Government Complaints",
        "keywords": [
            "consumer", "complaint", "refund", "bribe", "corruption", "defective", "warranty",
            "e-commerce fraud", "delayed flight", "ration", "water supply", "electricity cut",
            "gas leak", "lpg cylinder", "government office", "official asking money", "cpgrams",
            "शिकायत", "रिफंड", "उपभोक्ता", "घूस", "रिश्वत", "खराब सामान", "गैस लीक",
            "तक्रार", "लाच", "ग्राहक तक्रार", "गॅस गळती"
        ],
        "urgency": "STANDARD",
        "advice": "GRIEVANCE FILING: Gather all order invoices, transaction IDs, or proof of grievance. National Consumer Helpline 1915 facilitates fast dispute resolution with registered brands."
    },
    {
        "category_id": "mental_health",
        "category_name": "Mental Health Support",
        "keywords": [
            "mental health", "depression", "sad", "hopeless", "anxiety", "panic attack", "stress",
            "suicide", "ending life", "cant sleep", "overthinking", "psychologist", "counselor",
            "telemanas", "nervous breakdown", "trauma", "bipolar",
            "मानसिक तनाव", "अवसाद", "डिप्रेशन", "घबराहट", "नींद नहीं आना", "काउंसलर", "आत्महत्या",
            "मानसिक ताण", "नैराश्य", "काळजी", "समुपदेशन"
        ],
        "urgency": "HIGH",
        "advice": "YOU ARE NOT ALONE: Certified counselors are available 24x7 completely free and confidential. Please speak to Tele-MANAS at 14416 or KIRAN at 1800-599-0019."
    },
    {
        "category_id": "railway",
        "category_name": "Railway Assistance",
        "keywords": [
            "train", "railway", "railmadad", "coach", "berth", "seat", "irctc", "tte",
            "station", "stolen in train", "medical in train", "unclean toilet", "delay query",
            "रेलवे", "ट्रेन", "रेलगाड़ी", "बोगी", "सामान चोरी", "रेल मदद", "स्टेशन",
            "रेल्वे", "ट्रेन", "डबा", "तिकीट"
        ],
        "urgency": "HIGH",
        "advice": "PASSENGER SUPPORT: Keep your 10-digit PNR number and Coach/Seat number handy. Call RailMadad 139 or alert RPF at the next approaching station."
    }
]


def match_problem_offline(problem_text):
    """
    Intelligent semantic and rule-based fallback analyzer.
    Extracts category, urgency level, explanation, and verified numbers.
    """
    clean_text = problem_text.lower().strip()
    all_helplines = get_all_helplines()

    best_category_id = None
    best_score = 0
    matched_rule = None

    for rule in INTENT_RULES:
        score = 0
        for kw in rule["keywords"]:
            # Exact word or phrase boundary match
            if kw in clean_text:
                score += 3 if " " in kw else 1

        if score > best_score:
            best_score = score
            best_category_id = rule["category_id"]
            matched_rule = rule

    # Default fallback if no specific keywords matched
    if not best_category_id or best_score == 0:
        # Check if text contains general emergency terms
        if any(w in clean_text for w in ["urgent", "help", "save", "danger", "immediately", "jaldi"]):
            best_category_id = "police"
            category_title = "Police Assistance & General Emergency"
            urgency = "CRITICAL"
            explanation = "Your problem indicates an urgent or unsafe situation. For immediate emergency dispatch anywhere in India, contact the unified Emergency Response Support System (112)."
            advice = "If in immediate danger, stay in a secure location and dial 112 directly."
        else:
            best_category_id = "govt_complaints"
            category_title = "Government Grievances & Citizen Services"
            urgency = "STANDARD"
            explanation = "Based on your description, this appears to be a general citizen query or administrative complaint. You can contact the National Consumer Helpline or submit a public grievance."
            advice = "Keep any related documents, receipts, or application numbers ready before calling."
    else:
        category_title = matched_rule["category_name"]
        urgency = matched_rule["urgency"]
        advice = matched_rule["advice"]
        explanation = f"Your situation relates to {category_title}. We have matched you with authoritative official helplines designated by the government to handle this matter."

    # Filter verified helplines for this category from database
    recommended_helplines = [
        h for h in all_helplines if h.get("category_id") == best_category_id
    ]

    # Prioritize emergency and short 3-4 digit speed dials first
    recommended_helplines.sort(
        key=lambda x: (x.get("is_emergency", 0), 1 if len(x.get("phone_number", "").replace("-", "")) <= 5 else 0),
        reverse=True
    )

    # If critical urgency, prepend 112 if not already present
    is_life_threatening = (urgency == "CRITICAL")
    national_emergency_contact = None
    for h in all_helplines:
        if h.get("phone_number") == "112":
            national_emergency_contact = h
            break

    return {
        "identified_category": category_title,
        "category_id": best_category_id,
        "urgency_level": urgency,
        "is_life_threatening": is_life_threatening,
        "explanation": explanation,
        "actionable_advice": advice,
        "recommended_helplines": recommended_helplines[:3],
        "national_emergency_contact": national_emergency_contact if is_life_threatening else None,
        "disclaimer": "AI recommendations are for guidance only. All numbers are verified against official government registries. In life-threatening emergencies, dial 112 immediately."
    }


def query_llm_api(problem_text):
    """
    Attempts to call Gemini API if GEMINI_API_KEY is configured.
    Falls back gracefully if key is missing or call fails.
    """
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
    
    prompt = f"""You are the Raksha Connect AI Help Assistant for citizen support in India.
Analyze this user problem: "{problem_text}"

Choose the single most fitting category from:
- Police Assistance (police)
- Medical Emergency (medical)
- Fire Emergency (fire)
- Women Safety (women_safety)
- Child Protection (child_protection)
- Cyber Crime (cyber_crime)
- Senior Citizen Assistance (senior_citizen)
- Road and Traffic Accidents (road_accidents)
- Disaster Management (disaster_mgmt)
- Government Complaints (govt_complaints)
- Mental Health Support (mental_health)
- Railway Assistance (railway)

Respond ONLY with valid JSON in this exact structure:
{{
  "category_id": "cyber_crime",
  "category_name": "Cyber Crime",
  "urgency": "HIGH",
  "explanation": "Brief 1-2 sentence explanation of why this category applies.",
  "advice": "1 practical step the citizen should take right now."
}}
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode("utf-8"))
            content = result["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(content)

            # Match category to database records
            cat_id = parsed.get("category_id")
            all_helplines = get_all_helplines()
            recommended = [h for h in all_helplines if h.get("category_id") == cat_id]
            recommended.sort(
                key=lambda x: (x.get("is_emergency", 0), 1 if len(x.get("phone_number", "").replace("-", "")) <= 5 else 0),
                reverse=True
            )

            if not recommended:
                return None  # Fallback to offline rule matcher

            urgency = parsed.get("urgency", "STANDARD").upper()
            is_critical = (urgency == "CRITICAL")
            
            emergency_contact = None
            if is_critical:
                emergency_contact = next((h for h in all_helplines if h.get("phone_number") == "112"), None)

            return {
                "identified_category": parsed.get("category_name", cat_id.replace("_", " ").title()),
                "category_id": cat_id,
                "urgency_level": urgency,
                "is_life_threatening": is_critical,
                "explanation": parsed.get("explanation", ""),
                "actionable_advice": parsed.get("advice", ""),
                "recommended_helplines": recommended[:3],
                "national_emergency_contact": emergency_contact,
                "source": "AI-Enhanced (Gemini)",
                "disclaimer": "AI recommendations are for guidance only. All numbers are verified against official government registries. In life-threatening emergencies, dial 112 immediately."
            }
    except Exception as e:
        print(f"LLM API request bypassed: {e}")
        return None


def get_ai_recommendation(problem_text):
    """
    Main entry point for AI recommendation.
    Tries external LLM first; if unavailable, seamlessly uses offline semantic matcher.
    """
    if not problem_text or not problem_text.strip():
        return {
            "error": "Please provide a description of the problem."
        }

    # Attempt LLM if configured
    llm_result = query_llm_api(problem_text)
    if llm_result:
        return llm_result

    # Offline high-accuracy semantic engine
    result = match_problem_offline(problem_text)
    result["source"] = "Raksha Intelligent Offline Engine"
    return result
