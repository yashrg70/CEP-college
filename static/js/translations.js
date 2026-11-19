/**
 * Raksha Connect - Internationalization (i18n) Engine
 * Full multilingual support for English, Hindi (हिंदी), and Marathi (मराठी).
 */

const TRANSLATIONS = {
  en: {
    brand_tagline: "One app. The right helpline. Instantly.",
    disclaimer_banner: "Raksha Connect is an independent citizen-support initiative. NOT an official government app.",
    nav_home: "Home",
    nav_emergency: "Emergency",
    nav_directory: "Helpline Directory",
    nav_assistant: "Smart Assistant",
    nav_how: "How It Works",
    nav_about: "About Us",
    nav_contact: "Contact",
    hero_badge: "Verified National Citizen Helplines",
    hero_title_1: "Need Help? Find the",
    hero_title_2: "Right Helpline",
    hero_title_3: "Instantly.",
    hero_subtitle: "Access verified national and state emergency contacts, citizen grievance portals, and public safety helplines without confusion.",
    search_placeholder: "Describe your problem or search for a helpline (e.g. online fraud, ambulance, domestic safety)...",
    search_btn: "Find Helpline",
    quick_queries_label: "Popular searches:",
    btn_find_help: "Find Help Now",
    btn_emergency_dials: "Emergency Speed Dials",
    emergency_strip_title: "Nationwide Emergency Speed Dials (24x7)",
    cat_section_tag: "Comprehensive Directory",
    cat_section_title: "Explore Helplines by Category",
    cat_section_desc: "Browse 12 essential emergency and grievance categories verified through official government departments.",
    btn_call_now: "Call Now",
    btn_more_info: "Details & Sources",
    ai_tag: "AI Citizen Assistant",
    ai_title: "Smart Help Assistant",
    ai_subtitle: "Describe your issue in ordinary words. Our AI recommends verified official helplines instantly.",
    ai_placeholder: "Explain what happened (e.g., 'Someone called claiming to be my bank and took money via OTP' or 'Elderly neighbor needs medical rescue')...",
    ai_btn: "Analyze & Get Helplines",
    ai_disclaimer: "Raksha Connect never invents phone numbers. All suggestions are retrieved directly from official government databases.",
    dir_section_tag: "Searchable Database",
    dir_section_title: "Official Helpline Directory",
    dir_section_desc: "Search, filter, and inspect verified contacts with official source references and last-verified timestamps.",
    dir_filter_all: "All Categories",
    dir_sort_alpha: "Alphabetical (A-Z)",
    dir_sort_emerg: "Emergency First",
    dir_sort_recent: "Recently Verified",
    how_tag: "Simple 3-Step Process",
    how_title: "How Raksha Connect Works",
    step1_title: "1. Search or Describe",
    step1_desc: "Type a keyword, number, or describe your situation in plain English, Hindi, or Marathi.",
    step2_title: "2. Instant Verification Match",
    step2_desc: "Our engine maps your query to authorized official helplines, highlighting operational hours and toll-free access.",
    step3_title: "3. Confirm & Call Safely",
    step3_desc: "Review caller tips and emergency guidelines, then place a direct call with zero misdial risk.",
    why_title: "Why Rely on Raksha Connect?",
    feat1_title: "100% Verified Records",
    feat1_desc: "Numbers cross-referenced against official .gov.in portals and nodal ministries.",
    feat2_title: "Zero Account Required",
    feat2_desc: "Instant help during emergencies without login walls, passwords, or personal data tracking.",
    feat3_title: "Smart Language Understanding",
    feat3_desc: "Supports English, Hindi, and Marathi natural problem descriptions seamlessly.",
    feat4_title: "Accidental Dial Protection",
    feat4_desc: "Two-step confirmation modal ensures safety and displays essential incident checklist.",
    contact_title: "Connect with the Project Team",
    contact_desc: "Report outdated numbers, suggest new verified community services, or submit feedback.",
    modal_confirm_title: "Call Confirmation",
    modal_cancel: "Cancel",
    modal_proceed: "Proceed to Call",
    modal_copy: "Copy Number",
    footer_disclaimer: "IMPORTANT DISCLAIMER: Raksha Connect is an independent public-interest platform created to simplify citizen helpline discovery. It is NOT affiliated with or operated by any government body. In extreme life-threatening situations, dial 112 directly."
  },

  hi: {
    brand_tagline: "एक मंच। सही हेल्पलाइन। तुरंत।",
    disclaimer_banner: "रक्षा कनेक्ट एक स्वतंत्र नागरिक-सहायता मंच है। यह कोई आधिकारिक सरकारी ऐप नहीं है।",
    nav_home: "होम",
    nav_emergency: "आपातकालीन",
    nav_directory: "हेल्पलाइन डायरेक्टरी",
    nav_assistant: "स्मार्ट सहायक",
    nav_how: "यह कैसे काम करता है",
    nav_about: "हमारे बारे में",
    nav_contact: "संपर्क करें",
    hero_badge: "सत्यापित राष्ट्रीय नागरिक हेल्पलाइन",
    hero_title_1: "मदद चाहिए? तुरंत पाएं",
    hero_title_2: "सही हेल्पलाइन",
    hero_title_3: "नंबर।",
    hero_subtitle: "बिना किसी उलझन के आधिकारिक राष्ट्रीय और राज्य आपातकालीन नंबर, शिकायत पोर्टल और जन सुरक्षा हेल्पलाइन खोजें।",
    search_placeholder: "अपनी समस्या लिखें या हेल्पलाइन खोजें (जैसे: ऑनलाइन धोखाधड़ी, एम्बुलेंस, महिला सुरक्षा)...",
    search_btn: "हेल्पलाइन खोजें",
    quick_queries_label: "लोकप्रिय खोजें:",
    btn_find_help: "मदद खोजें",
    btn_emergency_dials: "आपातकालीन स्पीड डायल",
    emergency_strip_title: "राष्ट्रव्यापी आपातकालीन स्पीड डायल (24x7)",
    cat_section_tag: "व्यापक डायरेक्टरी",
    cat_section_title: "श्रेणी के अनुसार हेल्पलाइन देखें",
    cat_section_desc: "सरकारी विभागों द्वारा अधिकृत 12 आवश्यक आपातकालीन और शिकायत श्रेणियों को ब्राउज़ करें।",
    btn_call_now: "कॉल करें",
    btn_more_info: "विवरण और स्रोत",
    ai_tag: "एआई नागरिक सहायक",
    ai_title: "स्मार्ट हेल्प असिस्टेंट",
    ai_subtitle: "अपनी समस्या सरल भाषा में बताएं। हमारा एआई तुरंत आधिकारिक हेल्पलाइन की सिफारिश करता है।",
    ai_placeholder: "बताएं क्या समस्या है (जैसे: 'किसी ने बैंक के नाम पर ओटीपी लेकर पैसे निकाल लिए' या 'पड़ोसी को तुरंत एम्बुलेंस चाहिए')...",
    ai_btn: "समस्या का समाधान पाएं",
    ai_disclaimer: "रक्षा कनेक्ट कभी भी मनगढ़ंत नंबर नहीं देता। सभी नंबर आधिकारिक सरकारी डेटाबेस से लिए गए हैं।",
    dir_section_tag: "सत्यापित डेटाबेस",
    dir_section_title: "आधिकारिक हेल्पलाइन डायरेक्टरी",
    dir_section_desc: "आधिकारिक स्रोत संदर्भ और सत्यापन तिथि के साथ सभी सत्यापित नंबर खोजें और फ़िल्टर करें।",
    dir_filter_all: "सभी श्रेणियां",
    dir_sort_alpha: "वर्णमाला (A-Z)",
    dir_sort_emerg: "आपातकालीन पहले",
    dir_sort_recent: "हाल ही में सत्यापित",
    how_tag: "सरल 3-चरणीय प्रक्रिया",
    how_title: "रक्षा कनेक्ट कैसे काम करता है",
    step1_title: "1. खोजें या अपनी बात लिखें",
    step1_desc: "कीवर्ड दर्ज करें या हिंदी/अंग्रेजी में अपनी परेशानी का विवरण दें।",
    step2_title: "2. तुरंत आधिकारिक मिलान",
    step2_desc: "हमारा सिस्टम आपकी समस्या को सही सरकारी हेल्पलाइन से जोड़ता है।",
    step3_title: "3. पुष्टि करें और कॉल करें",
    step3_desc: "ज़रूरी दिशा-निर्देश पढ़ें और बिना किसी गलत कॉल के सीधे संपर्क करें।",
    why_title: "रक्षा कनेक्ट क्यों चुनें?",
    feat1_title: "100% सत्यापित डेटा",
    feat1_desc: "सभी नंबर सरकारी मंत्रालयों और .gov.in पोर्टल्स से जाँचे गए हैं।",
    feat2_title: "लॉगिन की ज़रूरत नहीं",
    feat2_desc: "आपात स्थिति में बिना किसी पासवर्ड या व्यक्तिगत डेटा के तुरंत मदद।",
    feat3_title: "सरल भाषा समझ",
    feat3_desc: "हिंदी, मराठी और अंग्रेजी में समस्या विवरण का सही विश्लेषण।",
    feat4_title: "गलत कॉल से सुरक्षा",
    feat4_desc: "कॉल करने से पहले पुष्टि पॉपअप ताकि गलती से डायल न हो।",
    contact_title: "हमसे संपर्क करें",
    contact_desc: "नंबर सुधार की सूचना दें या नई हेल्पलाइन का सुझाव दें।",
    modal_confirm_title: "कॉल पुष्टि",
    modal_cancel: "रद्द करें",
    modal_proceed: "कॉल करें",
    modal_copy: "नंबर कॉपी करें",
    footer_disclaimer: "महत्वपूर्ण अस्वीकरण: रक्षा कनेक्ट एक स्वतंत्र नागरिक-सहायता पहल है। यह किसी भी सरकारी विभाग द्वारा संचालित नहीं है। अत्यधिक आपात स्थिति में सीधे 112 पर कॉल करें।"
  },

  mr: {
    brand_tagline: "एक ॲप. योग्य हेल्पलाइन. तात्काळ.",
    disclaimer_banner: "रक्षा कनेक्ट हा एक स्वतंत्र नागरिक-साहाय्य मंच आहे. हे कोणतेही अधिकृत सरकारी ॲप नाही.",
    nav_home: "मुख्यपृष्ठ",
    nav_emergency: "तातडीची मदत",
    nav_directory: "हेल्पलाइन सूची",
    nav_assistant: "स्मार्ट सहाय्यक",
    nav_how: "हे कसे कार्य करते",
    nav_about: "आमच्याबद्दल",
    nav_contact: "संपर्क",
    hero_badge: "सत्यापित राष्ट्रीय नागरिक हेल्पलाइन",
    hero_title_1: "मदत हवी आहे? तात्काळ मिळवा",
    hero_title_2: "योग्य हेल्पलाइन",
    hero_title_3: "क्रमांक.",
    hero_subtitle: "कोणत्याही गोंधळाशिवाय अधिकृत राष्ट्रीय आणि राज्य आपत्कालीन संपर्क, तक्रार निवारण पोर्टल शोधा.",
    search_placeholder: "तुमची समस्या लिहा किंवा हेल्पलाइन शोधा (उदा. सायबर फसवणूक, रुग्णवाहिका, महिला सुरक्षा)...",
    search_btn: "हेल्पलाइन शोधा",
    quick_queries_label: "वारंवार शोधले जाणारे:",
    btn_find_help: "मदत शोधा",
    btn_emergency_dials: "आपत्कालीन स्पीड डायल",
    emergency_strip_title: "देशव्यापी आपत्कालीन स्पीड डायल (24x7)",
    cat_section_tag: "संपूर्ण निर्देशिका",
    cat_section_title: "वर्गवारीनुसार हेल्पलाइन तपासा",
    cat_section_desc: "शासकीय विभागांद्वारे अधिकृत 12 आवश्यक आपत्कालीन आणि तक्रार निवारण वर्गवारी पहा.",
    btn_call_now: "कॉल करा",
    btn_more_info: "तपशील व स्रोत",
    ai_tag: "एआय नागरिक सहाय्यक",
    ai_title: "स्मार्ट हेल्प असिस्टंट",
    ai_subtitle: "तुमची अडचण साध्या शब्दांत सांगा. आमचे एआय तात्काळ अधिकृत हेल्पलाइन सुचवेल.",
    ai_placeholder: "काय घडले ते सांगा (उदा. 'खात्यातून ऑनलाइन पैसे कट झाले' किंवा 'अपघात झाला असून रुग्णवाहिका हवी आहे')...",
    ai_btn: "विश्लेषण करा व मदत मिळवा",
    ai_disclaimer: "रक्षा कनेक्ट कधीही खोटे क्रमांक दाखवत नाही. सर्व संपर्क अधिकृत सरकारी नोंदींमधून घेतले आहेत.",
    dir_section_tag: "अधिकृत डेटाबेस",
    dir_section_title: "अधिकृत हेल्पलाइन सूची",
    dir_section_desc: "सरकारी स्रोत संदर्भ आणि पडताळणी तारखेसह सर्व सत्यापित क्रमांक शोधा.",
    dir_filter_all: "सर्व वर्गवारी",
    dir_sort_alpha: "वर्णानुक्रम (A-Z)",
    dir_sort_emerg: "आपत्कालीन प्रथम",
    dir_sort_recent: "नुकतेच सत्यापित",
    how_tag: "सोपी 3-टप्प्यांची पद्धत",
    how_title: "रक्षा कनेक्ट कसे चालते",
    step1_title: "1. शोधा किंवा अडचण लिहा",
    step1_desc: "मराठी, हिंदी किंवा इंग्रजीत तुमची अडचण लिहा.",
    step2_title: "2. तात्काळ अधिकृत पडताळणी",
    step2_desc: "आमचे अल्गोरिदम योग्य हेल्पलाइन आणि मोफत संपर्क क्रमांक दाखवते.",
    step3_title: "3. खात्री करा आणि सुरक्षित कॉल करा",
    step3_desc: "महत्त्वाच्या सूचना वाचा आणि सुरक्षितपणे थेट कॉल करा.",
    why_title: "रक्षा कनेक्ट का निवडावे?",
    feat1_title: "100% सत्यापित क्रमांक",
    feat1_desc: "सर्व क्रमांक सरकारी पोर्टल आणि मंत्रालयांकडून पडताळलेले आहेत.",
    feat2_title: "नोंदणीची गरज नाही",
    feat2_desc: "आपत्कालीन स्थितीत कोणत्याही पासवर्ड किंवा लॉगिनशिवाय थेट मदत.",
    feat3_title: "स्थानिक भाषा समज",
    feat3_desc: "मराठी, हिंदी आणि इंग्रजी भाषेतील प्रश्नांचे अचूक विश्लेषण.",
    feat4_title: "चुकीच्या कॉलपासून संरक्षण",
    feat4_desc: "कॉल करण्यापूर्वी पुष्टीकरण विंडो जेणेकरून अनावधानाने डायल होणार नाही.",
    contact_title: "आमच्याशी संपर्क साधा",
    contact_desc: "नवीन हेल्पलाइन सुचवा किंवा चुकीच्या क्रमांकाची तक्रार नोंदवा.",
    modal_confirm_title: "कॉल पुष्टीकरण",
    modal_cancel: "रद्द करा",
    modal_proceed: "कॉल करा",
    modal_copy: "नंबर कॉपी करा",
    footer_disclaimer: "महत्त्वाचा अस्वीकरण: रक्षा कनेक्ट हा एक स्वतंत्र सार्वजनिक हिताचा उपक्रम आहे. याचा कोणत्याही शासकीय यंत्रणेशी थेट संबंध नाही. अति-आपत्कालीन परिस्थितीत 112 वर संपर्क साधावा."
  }
};

let currentLang = "en";

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = "en";
  currentLang = lang;
  localStorage.setItem("raksha_lang", lang);

  const t = TRANSLATIONS[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });

  const selector = document.getElementById("languageSelect");
  if (selector) selector.value = lang;
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("raksha_lang") || "en";
  setLanguage(savedLang);

  const selector = document.getElementById("languageSelect");
  if (selector) {
    selector.addEventListener("change", (e) => setLanguage(e.target.value));
  }
});
