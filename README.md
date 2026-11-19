# 🛡️ RAKSHA CONNECT — Smart Citizen Support System
> **Tagline:** *One app. The right helpline. Instantly.*

[![Tests](https://img.shields.io/badge/pytest-9%20passed-brightgreen.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Python%20Flask%20%2F%20SQLite3-blue.svg)]()
[![AI](https://img.shields.io/badge/AI%20Engine-Gemini%20API%20%2B%20Offline%20Semantic-orange.svg)]()
[![Design](https://img.shields.io/badge/UI-Navy%2C%20White%2C%20Emergency%20Red-red.svg)]()
[![Coverage](https://img.shields.io/badge/Coverage-12%20National%20Categories-teal.svg)]()

---

## 📌 1. Project Overview

**Raksha Connect** is a modern, responsive, and accessible Smart Citizen Support System engineered to eliminate confusion during distress by providing a unified gateway to verified official Indian emergency numbers and government grievance helplines.

### The Problem It Solves
When facing emergencies or public grievances, citizens frequently struggle with:
- Fragmented and outdated phone numbers across unofficial blogs and directories.
- Confusion over which nodal department or helpline handles a specific issue (e.g. cyber fraud vs bank complaints, highway emergencies vs city police).
- Fake customer care numbers and sponsored scam links on search engines.
- Accidental misdials or lack of immediate pre-call guidance.

### The Solution: Raksha Connect
- **Instant Categorized Directory**: 12 verified categories covering ERSS 112, Police (100), Ambulance (108), Fire (101), Women Safety (181/1091), Childline (1098), Cyber Crime (1930), Senior Citizen Elderline (14567), NHAI Road Safety (1033), NDMA Disaster Management (1078), National Consumer Helpline (1915), Tele-MANAS (14416), and RailMadad (139).
- **Smart Help Assistant (AI)**: Citizens describe problems in conversational English, Hindi, or Marathi. The assistant analyzes intent, gauges urgency, and pairs the user with the exact verified helpline along with step-by-step caller checklists.
- **Accidental Dial Protection**: A two-step call confirmation modal prevents pocket dials and displays crucial pre-call instructions.
- **Multilingual & Accessible**: Native support for English, Hindi, and Marathi with high-contrast mode and font scaling.
- **Privacy First**: Zero login walls, zero password requirements, and zero personal data retention.

> **IMPORTANT DISCLAIMER**: Raksha Connect is an independent public-interest citizen-support platform. It is **NOT** an official government application and does not claim official affiliation. All numbers are verified against official `.gov.in` and authoritative nodal ministry registries.

---

## 🎨 2. Design System & User Interface

- **Color Palette**:
  - Primary Navy: `#0b192c` and `#1e293b`
  - Crisp White: `#ffffff` and `#f8fafc`
  - Emergency Crimson Red: `#dc2626` and `#ef4444` (with glowing pulse animations)
  - Safety Emerald: `#059669` and `#10b981`
  - Trust Blue: `#2563eb` and `#38bdf8`
- **Typography**: Clean, readable sans-serif typography with high optical contrast.
- **Cards & Controls**: Rounded corners (`border-radius: 14px-20px`), subtle glassmorphism, responsive grids.
- **Accessibility**:
  - High Contrast Mode toggle (`data-contrast="high"`)
  - Dynamic Font Size Scaler (`A-`, `A`, `A+`)
  - High-visibility badges for verified vs sample records.

---

## 🗂️ 3. The 12 Primary Helpline Categories

| # | Category | Primary Helpline | Authority / Source | Status |
|---|---|:---:|---|:---:|
| 1 | **Police Assistance** | **112 / 100** | Ministry of Home Affairs (`112.gov.in`) | Verified Official |
| 2 | **Medical Emergency** | **108 / 102** | National Health Mission (`nhm.gov.in`) | Verified Official |
| 3 | **Fire Emergency** | **101** | Directorate General Fire Services (`dgfscdhg.gov.in`) | Verified Official |
| 4 | **Women Safety** | **181 / 1091** | Ministry of Women & Child Development (`wcd.nic.in`) | Verified Official |
| 5 | **Child Protection** | **1098** | CHILDLINE India / MWCD (`wcd.nic.in/childline-1098`) | Verified Official |
| 6 | **Cyber Crime** | **1930** | Indian Cyber Crime Coordination Centre (`cybercrime.gov.in`) | Verified Official |
| 7 | **Senior Citizen Assistance** | **14567** | Ministry of Social Justice & Empowerment (`socialjustice.gov.in`) | Verified Official |
| 8 | **Road & Traffic Accidents** | **1033 / 1073** | National Highways Authority of India (`nhai.gov.in`) | Verified Official |
| 9 | **Disaster Management** | **1078 / 1070** | National Disaster Management Authority (`ndma.gov.in`) | Verified Official |
| 10 | **Government Complaints** | **1915** | National Consumer Helpline (`consumerhelpline.gov.in`) | Verified Official |
| 11 | **Mental Health Support** | **14416** | Tele-MANAS / MoHFW (`telemanas.mohfw.gov.in`) | Verified Official |
| 12 | **Railway Assistance** | **139** | RailMadad / Indian Railways (`railmadad.indianrailways.gov.in`) | Verified Official |

---

## 🤖 4. AI-Powered Smart Help Assistant

The **Smart Help Assistant** allows citizens to state problems in ordinary, everyday language:
- *"Someone sent me a link and drained money from my bank account."*
- *"A car flipped over on the Mumbai-Pune expressway and people are injured."*
- *"Mere pados ke ghar me aag lagi hai aur cylinder blast hua hai."*
- *"Train me mera bag chori ho gaya."*

### Assistant Protocol:
1. **Intent Analysis & Urgency Detection**:
   - `CRITICAL`: Life safety, ongoing accidents, fire breakouts, medical trauma.
   - `HIGH`: Cyber financial fraud (within golden hour), active domestic violence.
   - `STANDARD`: Consumer complaints, civil disputes, municipal utility queries.
2. **Prominent Emergency Warning**:
   - When a critical life threat is detected, an eye-catching red emergency banner prompts the user to dial **112** immediately.
3. **Verified Number Binding**:
   - The AI **never invents** phone numbers. All suggestions strictly match records in the verified SQLite database.
4. **Actionable Pre-Call Checklist**:
   - Advises citizens on essential details to have on hand (e.g. Bank Reference ID, PNR Number, Highway Toll Milestone).

---

## 🗄️ 5. Database Schema

The database (`data/raksha_helplines.db`) is built using SQLite with the following structure:

```sql
CREATE TABLE helplines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    helpline_name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_id TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    description TEXT NOT NULL,
    official_source TEXT NOT NULL,
    verification_status TEXT NOT NULL,
    last_verified_date TEXT NOT NULL,
    is_emergency INTEGER DEFAULT 0,
    is_toll_free INTEGER DEFAULT 1,
    operational_hours TEXT DEFAULT '24 Hours / 7 Days',
    languages TEXT DEFAULT 'Hindi, English',
    keywords TEXT DEFAULT '',
    jurisdiction TEXT DEFAULT 'All India'
);

CREATE TABLE contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject_type TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌐 6. REST API Reference

| Endpoint | Method | Query / Payload | Description |
|---|:---:|---|---|
| `/api/health` | `GET` | — | Health check & engine status |
| `/api/categories` | `GET` | — | Returns 12 categories with helpline counts |
| `/api/helplines` | `GET` | `?q=...&category=...&emergency=1&sort=...` | Search and filter verified helplines |
| `/api/helplines/<id>` | `GET` | — | Detailed record by ID |
| `/api/ai/recommend` | `POST` | `{"problem": "string"}` | Problem analysis and helpline recommendations |
| `/api/contact` | `POST` | `{"name": "...", "email": "...", "subject_type": "...", "message": "..."}` | Submit feedback or report outdated numbers |
| `/api/stats` | `GET` | — | Citizen trust metrics & count telemetry |

---

## 🚀 7. Installation & Local Setup

### Prerequisites
- Python 3.10+ (Standard Python runtime with SQLite3)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### Option 1: Standard Full-Stack Flask Launch (Recommended)

1. Open PowerShell or Terminal in the project root:
   ```powershell
   cd d:\hackthon
   ```

2. Run the automated startup script:
   ```powershell
   .\start-server.ps1
   ```
   *Or launch manually with Python:*
   ```bash
   python app.py
   ```

3. Open your browser at:
   ```
   http://localhost:5000/
   ```

### Option 2: 1-Click Windows Batch Runner
Double-click `run.bat` in Windows Explorer.

### Option 3: Zero-Dependency Standalone Mode
Double-click `index.html` to open the client directly in your browser (`file:///d:/hackthon/index.html`). The bundled data store and client-side semantic engine will execute with zero server requirements!

---

## 🧪 8. Automated Testing

A comprehensive automated test suite is included in `test_app.py`.

Run tests using pytest:
```bash
python -m pytest test_app.py -v
```

### Verified Test Cases:
- ✅ Database initialization and 30+ seed records
- ✅ Coverage across all 12 mandatory categories
- ✅ Search by number, keyword, category, and emergency flag
- ✅ AI problem matcher across cyber fraud, medical, road accidents, and Hindi queries
- ✅ REST API endpoints (`/api/health`, `/api/categories`, `/api/helplines`, `/api/ai/recommend`, `/api/contact`)
- ✅ Input validation and error handling

---

## 📁 9. Project Directory Structure

```
d:\hackthon\
├── app.py                     # Flask web server & REST API
├── database.py                # SQLite database manager & verified seeds
├── ai_assistant.py            # AI recommendation engine (Gemini API + offline semantic matcher)
├── test_app.py                # Automated pytest test suite
├── requirements.txt           # Python package requirements
├── .env.example               # Environment variables template
├── start-server.ps1           # 1-click launch script for PowerShell
├── run.bat                    # 1-click launch script for Windows
├── index.html                 # Standalone web app entrypoint
├── templates/
│   └── index.html             # Flask template entrypoint
├── static/
│   ├── css/
│   │   └── styles.css         # Modern styling, responsive breakpoints, high-contrast
│   └── js/
│       ├── translations.js    # Multilingual i18n dictionary (EN, HI, MR)
│       ├── data_store.js      # Resilient client-side store & history manager
│       ├── ai_assistant.js    # AI chat controller & prompt chips
│       └── app.js             # UI router, search, directory, modals, toasts
└── data/
    └── raksha_helplines.db    # SQLite database
```

---

## 🏆 10. Hackathon & Presentation Highlights

- **Real-World Impact**: Directly tackles panic and misdirection during emergencies in India.
- **Fail-Safe Architecture**: Gracefully falls back from external cloud APIs to an offline semantic matcher and local database without breaking.
- **Strict Citizen Safety**: Features accidental call protection, caller checklists, verified badges, and transparent disclaimers.
- **Inclusive Accessibility**: Designed for citizens of all age groups with multilingual translation (English, Hindi, Marathi) and high-contrast support.

---

**Raksha Connect** — *One app. The right helpline. Instantly.*
