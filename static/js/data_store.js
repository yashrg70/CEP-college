/**
 * Raksha Connect - Resilient Data Store & Offline Engine
 * Bundles verified official Indian helplines and offline matcher for zero-dependency reliability.
 */

const LOCAL_SEED_CATEGORIES = [
  { id: "police", name: "Police Assistance", icon: "shield-alert", color: "#1e3a8a", bg: "#eff6ff", primary: "112", desc: "Emergency police dispatch, law enforcement, theft, assault, and public safety control." },
  { id: "medical", name: "Medical Emergency", icon: "heart-pulse", color: "#dc2626", bg: "#fef2f2", primary: "108", desc: "Ambulance response, critical health trauma, cardiac emergency, and hospital routing." },
  { id: "fire", name: "Fire Emergency", icon: "flame", color: "#ea580c", bg: "#fff7ed", primary: "101", desc: "Fire breakouts, chemical hazard rescue, building evacuation, and trapped victim salvage." },
  { id: "women_safety", name: "Women Safety", icon: "user-check", color: "#9333ea", bg: "#faf5ff", primary: "181", desc: "24x7 emergency distress rescue, domestic violence, harassment, and one-stop shelter aid." },
  { id: "child_protection", name: "Child Protection", icon: "baby", color: "#0284c7", bg: "#f0f9ff", primary: "1098", desc: "Childline crisis care, runaway protection, child labor rescue, abuse, and POCSO reporting." },
  { id: "cyber_crime", name: "Cyber Crime", icon: "laptop-minimal-check", color: "#0d9488", bg: "#f0fdfa", primary: "1930", desc: "Immediate financial cyber fraud freeze, phishing, identity theft, and online extortion reporting." },
  { id: "senior_citizen", name: "Senior Citizen Assistance", icon: "heart-handshake", color: "#ca8a04", bg: "#fefce8", primary: "14567", desc: "Elderline nationwide care, elder abuse prevention, legal guidance, and welfare support." },
  { id: "road_accidents", name: "Road and Traffic Accidents", icon: "car-alert", color: "#d97706", bg: "#fffbeb", primary: "1033", desc: "National highway emergency, crane/towing, expressway rescue, and traffic dispatch." },
  { id: "disaster_mgmt", name: "Disaster Management", icon: "waves", color: "#475569", bg: "#f8fafc", primary: "1078", desc: "NDMA floods, earthquakes, cyclone warnings, evacuation shelters, and relief distribution." },
  { id: "govt_complaints", name: "Government Complaints", icon: "file-text", color: "#059669", bg: "#ecfdf5", primary: "1915", desc: "National consumer helpline, citizen service grievances, anti-corruption, and public utility issues." },
  { id: "mental_health", name: "Mental Health Support", icon: "brain", color: "#6366f1", bg: "#eef2ff", primary: "14416", desc: "Tele-MANAS confidential psychological counseling, distress de-escalation, and psychiatric aid." },
  { id: "railway", name: "Railway Assistance", icon: "train", color: "#2563eb", bg: "#eff6ff", primary: "139", desc: "RailMadad unified train security, passenger medical help, coach hygiene, and lost luggage." }
];

const LOCAL_SEED_HELPLINES = [
  {
    id: 1,
    helpline_name: "Emergency Response Support System (ERSS)",
    category: "Police Assistance",
    category_id: "police",
    phone_number: "112",
    description: "India's unified emergency number for instant police dispatch, fire, and medical assistance nationwide. GPS-enabled vehicle dispatch.",
    official_source: "Ministry of Home Affairs (https://112.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-15",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, Regional languages",
    keywords: "police, emergency, 112, cops, theft, crime, violence, FIR, attack, danger, brawl, assault, robbery, patrol",
    jurisdiction: "All India (States & Union Territories)"
  },
  {
    id: 2,
    helpline_name: "Police Control Room (PCR)",
    category: "Police Assistance",
    category_id: "police",
    phone_number: "100",
    description: "Traditional national police helpline, routed automatically to the state ERSS 112 control room for immediate dispatch.",
    official_source: "State Police Departments & MHA (https://mha.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-10",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, State languages",
    keywords: "police, 100, thulla, thana, kotwali, crime, complaint, report theft, burglar",
    jurisdiction: "All India"
  },
  {
    id: 3,
    helpline_name: "National Emergency Medical & Ambulance Service",
    category: "Medical Emergency",
    category_id: "medical",
    phone_number: "108",
    description: "Free emergency ambulance service equipped with Basic/Advanced Life Support (BLS/ALS) for trauma, cardiac arrests, and stroke.",
    official_source: "National Health Mission (https://nhm.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-12",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, State languages",
    keywords: "medical, ambulance, 108, doctor, heart attack, unconscious, stroke, bleeding, injury, hospital, emergency ICU",
    jurisdiction: "All India"
  },
  {
    id: 4,
    helpline_name: "Janani Shishu Suraksha Karyakram (JSSK) Ambulance",
    category: "Medical Emergency",
    category_id: "medical",
    phone_number: "102",
    description: "Dedicated free ambulance transport for pregnant mothers for delivery and sick infants up to 1 year.",
    official_source: "Ministry of Health and Family Welfare (https://mohfw.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-05",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, State languages",
    keywords: "pregnancy, delivery, maternal, newborn, baby, labour pain, infant, hospital transport, 102",
    jurisdiction: "All India"
  },
  {
    id: 5,
    helpline_name: "National Fire and Rescue Service",
    category: "Fire Emergency",
    category_id: "fire",
    phone_number: "101",
    description: "Immediate dispatch of fire tenders, hydraulic ladders, and specialized rescue teams for building fires and explosions.",
    official_source: "Directorate General Fire Services, CD & HG (https://dgfscdhg.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-14",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, Regional",
    keywords: "fire, 101, blaze, aag, smoke, cylinder blast, burning, building fire, fire engine, brigade, rescue",
    jurisdiction: "All India"
  },
  {
    id: 6,
    helpline_name: "National Women Helpline (One Stop Centre)",
    category: "Women Safety",
    category_id: "women_safety",
    phone_number: "181",
    description: "24-hour toll-free telecom service providing integrated emergency and non-emergency support including medical, legal, and counseling.",
    official_source: "Ministry of Women and Child Development (https://wcd.nic.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-16",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, All Major Regional Languages",
    keywords: "women, mahila, 181, domestic violence, harassment, abuse, stalking, eve teasing, shelter, counseling, legal aid",
    jurisdiction: "All India"
  },
  {
    id: 7,
    helpline_name: "Women in Distress - Police Cell",
    category: "Women Safety",
    category_id: "women_safety",
    phone_number: "1091",
    description: "Direct emergency mobile police assistance for women facing imminent danger, street harassment, or stalking.",
    official_source: "Special Police Unit for Women and Children (SPUWAC)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-08",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, Regional",
    keywords: "women, distress, 1091, molestation, stalker, danger, cab safety, night emergency, female police",
    jurisdiction: "All India"
  },
  {
    id: 8,
    helpline_name: "CHILDLINE India Emergency Rescue",
    category: "Child Protection",
    category_id: "child_protection",
    phone_number: "1098",
    description: "India's first 24-hour, free, emergency phone outreach service for children in need of care and protection (integrated with ERSS 112).",
    official_source: "Ministry of Women and Child Development (https://wcd.nic.in/childline-1098)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-15",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, Regional languages",
    keywords: "child, bachha, childline, 1098, child abuse, child labour, orphan, missing child, kidnapping, begging, trafficking",
    jurisdiction: "All India"
  },
  {
    id: 9,
    helpline_name: "National Cyber Crime Reporting & Financial Fraud Helpline",
    category: "Cyber Crime",
    category_id: "cyber_crime",
    phone_number: "1930",
    description: "Immediate reporting of financial cyber frauds to freeze siphoned funds within the critical golden hour. Also handles online identity crimes.",
    official_source: "Indian Cyber Crime Coordination Centre (I4C), MHA (https://cybercrime.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-18",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, 12 Regional Languages",
    keywords: "cyber, fraud, 1930, bank scam, upi scam, otp fraud, phishing, credit card stolen, hack, ransom, money debited, online blackmail",
    jurisdiction: "All India"
  },
  {
    id: 10,
    helpline_name: "Elderline - National Helpline for Senior Citizens",
    category: "Senior Citizen Assistance",
    category_id: "senior_citizen",
    phone_number: "14567",
    description: "Nationwide toll-free service providing guidance, emotional support, rescue of abandoned elders, and legal assistance on maintenance rights.",
    official_source: "Ministry of Social Justice and Empowerment (https://socialjustice.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-17",
    is_emergency: 0,
    is_toll_free: 1,
    operational_hours: "08:00 AM - 08:00 PM (All 7 Days)",
    languages: "Hindi, English, State languages",
    keywords: "senior citizen, elderly, 14567, elderline, old age, abandoned parent, pension issue, elder abuse, dementia, old age home",
    jurisdiction: "All India"
  },
  {
    id: 11,
    helpline_name: "National Highways Emergency Helpline (NHAI)",
    category: "Road and Traffic Accidents",
    category_id: "road_accidents",
    phone_number: "1033",
    description: "Dedicated round-the-clock emergency assistance on all National Highways and Expressways for ambulance, towing crane, and road clearance.",
    official_source: "National Highways Authority of India (https://nhai.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-16",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, Regional",
    keywords: "highway, expressway, accident, 1033, nhai, toll plaza, car crash, breakdown, towing crane, road accident",
    jurisdiction: "All National Highways & Expressways in India"
  },
  {
    id: 12,
    helpline_name: "NDMA National Disaster Management Control Room",
    category: "Disaster Management",
    category_id: "disaster_mgmt",
    phone_number: "1078",
    description: "National apex body control room for natural disasters, severe flood alerts, earthquake response, landslides, and NDRF mobilization.",
    official_source: "National Disaster Management Authority (https://ndma.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-13",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English",
    keywords: "disaster, flood, baadh, bhukamp, earthquake, cyclone, tsunami, ndma, ndrf, rescue operation, emergency shelter",
    jurisdiction: "All India"
  },
  {
    id: 13,
    helpline_name: "National Consumer Helpline (NCH)",
    category: "Government Complaints",
    category_id: "govt_complaints",
    phone_number: "1915",
    description: "Official national platform for lodging complaints against unfair trade practices, defective products, e-commerce fraud, and deficient services.",
    official_source: "Department of Consumer Affairs (https://consumerhelpline.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-18",
    is_emergency: 0,
    is_toll_free: 1,
    operational_hours: "08:00 AM - 08:00 PM",
    languages: "Hindi, English, 17 Regional languages",
    keywords: "consumer, complaint, 1915, refund, warranty, defective product, e-commerce, fraud seller, flight refund, overcharging, consumer forum",
    jurisdiction: "All India"
  },
  {
    id: 14,
    helpline_name: "Tele-MANAS Comprehensive Mental Health Helpline",
    category: "Mental Health Support",
    category_id: "mental_health",
    phone_number: "14416",
    description: "Government of India's 24x7 tele-mental health programme providing free, confidential counseling by certified psychologists and psychiatrists.",
    official_source: "Ministry of Health & Family Welfare / NIMHANS (https://telemanas.mohfw.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-17",
    is_emergency: 0,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, and 20+ Regional languages",
    keywords: "mental health, depression, anxiety, stress, 14416, suicide prevention, counseling, panic attack, sleep issue, psychologist, telemanas",
    jurisdiction: "All India"
  },
  {
    id: 15,
    helpline_name: "RailMadad Unified Railway Grievance & Security",
    category: "Railway Assistance",
    category_id: "railway",
    phone_number: "139",
    description: "Integrated helpline for all railway queries: security in running trains, medical aid on board, coach cleaning, food complaints, and luggage.",
    official_source: "Indian Railways (https://railmadad.indianrailways.gov.in)",
    verification_status: "Verified Official",
    last_verified_date: "2026-11-18",
    is_emergency: 1,
    is_toll_free: 1,
    operational_hours: "24 Hours / 7 Days",
    languages: "Hindi, English, and 12 Indian Languages",
    keywords: "train, railway, 139, railmadad, irctc, coach, ticket, berth, luggage theft in train, tte complaint, rpf",
    jurisdiction: "Indian Railways Network Nationwide"
  },
  {
    id: 16,
    helpline_name: "Sample Local Municipal Sanitation Helpline",
    category: "Government Complaints",
    category_id: "govt_complaints",
    phone_number: "1969",
    description: "Sample test record for municipal waste collection, open drain overflow, and civic cleanliness complaints (Swachhata App).",
    official_source: "MoHUA / Swachh Bharat Mission (Sample Demonstration Record)",
    verification_status: "Sample / Unverified Record",
    last_verified_date: "2026-09-01",
    is_emergency: 0,
    is_toll_free: 1,
    operational_hours: "08:00 AM - 06:00 PM",
    languages: "Hindi, English",
    keywords: "garbage, kachra, drainage, sweep, municipal, swachh bharat, sample",
    jurisdiction: "Selected Smart Cities"
  }
];

class RakshaDataStore {
  constructor() {
    this.helplines = [...LOCAL_SEED_HELPLINES];
    this.categories = [...LOCAL_SEED_CATEGORIES];
    this.isBackendAvailable = false;
  }

  async checkBackend() {
    try {
      const res = await fetch("/api/health", { method: "GET", headers: { "Accept": "application/json" } });
      if (res.ok) {
        this.isBackendAvailable = true;
        await this.syncFromBackend();
      }
    } catch (e) {
      this.isBackendAvailable = false;
      console.log("Operating in High-Resilience Standalone / Local Data mode.");
    }
  }

  async syncFromBackend() {
    try {
      const [catRes, helpRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/helplines")
      ]);
      if (catRes.ok && helpRes.ok) {
        const catData = await catRes.json();
        const helpData = await helpRes.json();
        if (catData.data) this.categories = catData.data;
        if (helpData.data) this.helplines = helpData.data;
      }
    } catch (e) {
      console.warn("Backend sync bypassed:", e);
    }
  }

  filterHelplines(query = "", category = "all", isEmergency = null, sortBy = "alphabetical") {
    let list = [...this.helplines];

    if (category && category !== "all") {
      const catLower = category.toLowerCase();
      list = list.filter(h => 
        (h.category_id && h.category_id.toLowerCase() === catLower) ||
        (h.category && h.category.toLowerCase() === catLower)
      );
    }

    if (isEmergency !== null) {
      list = list.filter(h => h.is_emergency === (isEmergency ? 1 : 0));
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(h => 
        (h.helpline_name && h.helpline_name.toLowerCase().includes(q)) ||
        (h.phone_number && h.phone_number.toLowerCase().includes(q)) ||
        (h.category && h.category.toLowerCase().includes(q)) ||
        (h.description && h.description.toLowerCase().includes(q)) ||
        (h.keywords && h.keywords.toLowerCase().includes(q))
      );
    }

    if (sortBy === "alphabetical") {
      list.sort((a, b) => a.helpline_name.localeCompare(b.helpline_name));
    } else if (sortBy === "emergency_first") {
      list.sort((a, b) => (b.is_emergency || 0) - (a.is_emergency || 0) || a.helpline_name.localeCompare(b.helpline_name));
    } else if (sortBy === "verified_date") {
      list.sort((a, b) => (b.last_verified_date || "").localeCompare(a.last_verified_date || ""));
    }

    return list;
  }

  // Privacy-friendly explicit opt-in search history
  isHistoryEnabled() {
    return localStorage.getItem("raksha_history_enabled") === "true";
  }

  setHistoryEnabled(val) {
    localStorage.setItem("raksha_history_enabled", val ? "true" : "false");
    if (!val) {
      localStorage.removeItem("raksha_search_history");
    }
  }

  saveSearchTerm(term) {
    if (!this.isHistoryEnabled() || !term || !term.trim()) return;
    try {
      const history = JSON.parse(localStorage.getItem("raksha_search_history") || "[]");
      const filtered = history.filter(item => item.toLowerCase() !== term.toLowerCase());
      filtered.unshift(term.trim());
      localStorage.setItem("raksha_search_history", JSON.stringify(filtered.slice(0, 8)));
    } catch (e) {}
  }

  getSearchHistory() {
    if (!this.isHistoryEnabled()) return [];
    try {
      return JSON.parse(localStorage.getItem("raksha_search_history") || "[]");
    } catch (e) {
      return [];
    }
  }

  clearSearchHistory() {
    localStorage.removeItem("raksha_search_history");
  }
}

window.rakshaStore = new RakshaDataStore();
