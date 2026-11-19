/**
 * Raksha Connect - AI-Powered Smart Help Assistant UI Controller
 * Analyzes citizen problems and matches them to official verified helplines.
 */

document.addEventListener("DOMContentLoaded", () => {
  const aiInput = document.getElementById("aiProblemInput");
  const aiSubmitBtn = document.getElementById("aiSubmitBtn");
  const aiResultBox = document.getElementById("aiResultBox");
  const samplePromptBtns = document.querySelectorAll(".sample-prompt-btn");

  if (!aiSubmitBtn || !aiInput) return;

  // Handle sample prompt chips
  samplePromptBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      aiInput.value = btn.getAttribute("data-prompt");
      aiInput.focus();
      handleAiSubmission();
    });
  });

  aiSubmitBtn.addEventListener("click", () => {
    handleAiSubmission();
  });

  aiInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAiSubmission();
    }
  });

  async function handleAiSubmission() {
    const text = aiInput.value.trim();
    if (!text || text.length < 3) {
      if (window.showToast) window.showToast("Please describe your situation in more detail.", "error");
      aiInput.focus();
      return;
    }

    aiSubmitBtn.disabled = true;
    aiSubmitBtn.innerHTML = `
      <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Analyzing Problem...
    `;

    try {
      let result = null;

      // Try Backend API first
      try {
        const response = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem: text })
        });
        if (response.ok) {
          const json = await response.json();
          if (json.status === "success") result = json.data;
        }
      } catch (err) {
        console.warn("Backend AI endpoint unavailable, using offline engine.", err);
      }

      // Offline Semantic Matcher Fallback
      if (!result) {
        result = clientSideSemanticMatch(text);
      }

      renderAiResult(result);
      if (window.rakshaStore) window.rakshaStore.saveSearchTerm(text.slice(0, 30));
    } catch (error) {
      console.error("AI Assistant Error:", error);
      if (window.showToast) window.showToast("Analysis encountered an error. Please try direct search.", "error");
    } finally {
      aiSubmitBtn.disabled = false;
      aiSubmitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m10 15 5-3-5-3v6z"></path>
        </svg>
        <span data-i18n="ai_btn">Analyze & Get Helplines</span>
      `;
    }
  }

  function renderAiResult(data) {
    if (!aiResultBox) return;

    const urgencyClass = `urgency-${data.urgency_level || 'STANDARD'}`;
    const urgencyLabel = data.urgency_level === "CRITICAL"
      ? "🚨 CRITICAL EMERGENCY — LIFE OR IMMEDIATE SAFETY AT RISK"
      : (data.urgency_level === "HIGH" ? "⚠️ HIGH PRIORITY INCIDENT" : "ℹ️ CITIZEN GRIEVANCE & SUPPORT");

    let nationalEmergencyHtml = "";
    if (data.is_life_threatening) {
      nationalEmergencyHtml = `
        <div style="background: linear-gradient(135deg, #dc2626, #991b1b); border-radius: 12px; padding: 18px; margin-bottom: 20px; color: white; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);">
          <div style="display:flex; align-items:center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: white; color: #dc2626; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.3rem;">!</div>
            <div>
              <div style="font-weight: 800; font-size: 1.1rem;">IMMEDIATE DANGER? DIAL 112 FIRST</div>
              <div style="font-size: 0.85rem; opacity: 0.9;">Unified National Emergency Response Support System (ERSS) connects instantly with police, ambulance, and fire rescue.</div>
            </div>
          </div>
          <button class="btn-primary" style="color: #dc2626; font-weight: 800; padding: 10px 20px;" onclick="window.triggerCallModal('Emergency Response Support System (ERSS)', '112', 'Unified Emergency (Police/Ambulance/Fire)', 'Ministry of Home Affairs')">
            📞 Dial 112 Now
          </button>
        </div>
      `;
    }

    const cardsHtml = (data.recommended_helplines || []).map(h => `
      <div class="ai-helpline-card">
        <div>
          <div style="font-size: 0.74rem; font-weight: 700; color: #2563eb; text-transform: uppercase; margin-bottom: 4px;">
            ${h.category}
          </div>
          <h4>${h.helpline_name}</h4>
          <div class="ai-helpline-num">${h.phone_number}</div>
          <p class="ai-helpline-desc">${h.description}</p>
        </div>
        <div style="display:flex; align-items:center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
          <span style="font-size: 0.78rem; font-weight: 700; color: #059669;">
            ✓ ${h.verification_status || 'Verified Official'}
          </span>
          <button class="btn-call-sm" onclick="window.triggerCallModal('${h.helpline_name.replace(/'/g, "\\'")}', '${h.phone_number}', '${h.category.replace(/'/g, "\\'")}', '${(h.official_source || '').replace(/'/g, "\\'")}')">
            📞 Call Now
          </button>
        </div>
      </div>
    `).join("");

    aiResultBox.innerHTML = `
      ${nationalEmergencyHtml}
      
      <div class="ai-urgency-banner ${urgencyClass}">
        ${urgencyLabel}
      </div>

      <div style="margin-bottom: 14px;">
        <span style="font-size: 0.82rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Matched Category:</span>
        <h4 style="font-size: 1.3rem; font-weight: 800; color: #38bdf8;">${data.identified_category}</h4>
      </div>

      <p class="ai-explanation-text">
        <strong>Why this applies:</strong> ${data.explanation}
      </p>

      <div class="ai-action-step-card">
        <strong>Recommended Next Step:</strong>
        <p>${data.actionable_advice}</p>
      </div>

      <div style="margin-bottom: 12px; font-size: 0.88rem; font-weight: 700; color: #cbd5e1;">
        Verified Contact Helplines:
      </div>
      <div class="ai-recommended-cards-grid">
        ${cardsHtml || '<p style="color: #cbd5e1;">No specific helpline card matched. Please refer to national emergency 112.</p>'}
      </div>

      <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 18px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
        ${data.disclaimer || 'Verified official contacts from government registries.'}
      </div>
    `;

    aiResultBox.classList.add("active");
    aiResultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Client-side Semantic Matcher Fallback
  function clientSideSemanticMatch(query) {
    const q = query.toLowerCase();
    const helplines = window.rakshaStore ? window.rakshaStore.helplines : LOCAL_SEED_HELPLINES;

    let catId = "govt_complaints";
    let catTitle = "Government Complaints";
    let urgency = "STANDARD";
    let advice = "Keep your transaction or dispute records ready before calling.";
    let explanation = "Based on your description, this matches official public grievance and citizen consumer helplines.";

    if (/fraud|bank|otp|upi|scam|cyber|phishing|stolen money|hacked|पैसा|धोखा|सायबर/.test(q)) {
      catId = "cyber_crime";
      catTitle = "Cyber Crime & Financial Fraud";
      urgency = "HIGH";
      advice = "GOLDEN HOUR: Call 1930 immediately within 2 hours to freeze fraudulent fund transfers.";
      explanation = "Your problem indicates online financial fraud or cybercrime. Report immediately to freeze illicit transactions.";
    } else if (/accident|crash|highway|road|overturned|car hit|bike accident|हायवे|अपघात/.test(q)) {
      catId = "road_accidents";
      catTitle = "Road & Traffic Accidents";
      urgency = "CRITICAL";
      advice = "Turn on emergency vehicle hazard lights and ensure passengers move off the active carriageway.";
      explanation = "Highway collision or traffic accident requires prompt emergency highway authority dispatch.";
    } else if (/heart attack|ambulance|medical|doctor|collapsed|bleeding|breath|unconscious|delivery|रुग्णवाहिका|एम्बुलेंस/.test(q)) {
      catId = "medical";
      catTitle = "Medical Emergency";
      urgency = "CRITICAL";
      advice = "Check patient responsiveness and clear airway. Do not give water if unresponsive.";
      explanation = "Medical emergencies require immediate life support ambulance dispatch.";
    } else if (/fire|smoke|burning|flame|cylinder blast|दमकल|आग|शॉर्ट सर्किट/.test(q)) {
      catId = "fire";
      catTitle = "Fire Emergency";
      urgency = "CRITICAL";
      advice = "Evacuate using stairs immediately. Cover face with wet cloth if smoke is present.";
      explanation = "Fire outbreak requires rapid fire brigade and rescue tender deployment.";
    } else if (/women|female|girl|harassment|stalking|domestic violence|wife beating|छेड़छाड़|महिला/.test(q)) {
      catId = "women_safety";
      catTitle = "Women Safety & Protection";
      urgency = "HIGH";
      advice = "Head towards a well-lit public space or police station and share live location with family.";
      explanation = "24x7 women distress response provides immediate police assistance, legal guidance, and temporary shelter.";
    } else if (/child|minor|kid|orphan|child labor|child abuse|बच्चा|बाल/.test(q)) {
      catId = "child_protection";
      catTitle = "Child Protection";
      urgency = "HIGH";
      advice = "Note the child's exact location, appearance, and contact Childline 1098 without alerting traffickers.";
      explanation = "Child distress or abuse issues are addressed by specialized Childline 1098 officers.";
    } else if (/train|railway|coach|berth|station|tte|रेलवे|ट्रेन/.test(q)) {
      catId = "railway";
      catTitle = "Railway Assistance";
      urgency = "HIGH";
      advice = "Keep your 10-digit PNR and train coach/seat number ready.";
      explanation = "RailMadad 139 provides on-board security, medical attention, and passenger assistance.";
    } else if (/elder|senior citizen|parents|old age|बुजुर्ग|म्हातारपण/.test(q)) {
      catId = "senior_citizen";
      catTitle = "Senior Citizen Assistance";
      urgency = "STANDARD";
      advice = "Elderline 14567 assists with maintenance rights, emotional counseling, and shelter rescue.";
      explanation = "Dedicated elderline services support senior citizens facing neglect or administrative issues.";
    } else if (/flood|earthquake|disaster|tsunami|cyclone|बाढ़|भूकंप/.test(q)) {
      catId = "disaster_mgmt";
      catTitle = "Disaster Management";
      urgency = "CRITICAL";
      advice = "Switch off main electricity and gas valves. Move to higher ground if floodwaters rise.";
      explanation = "Natural disaster alerts require coordination with NDMA control rooms and NDRF rescue teams.";
    } else if (/mental health|depression|anxiety|suicide|hopeless|stress|तनाव|डिप्रेशन/.test(q)) {
      catId = "mental_health";
      catTitle = "Mental Health Support";
      urgency = "HIGH";
      advice = "Speak to a certified compassionate mental health counselor 24x7 completely free and confidential.";
      explanation = "Tele-MANAS provides immediate psychological first-aid and professional counseling.";
    }

    const matchedHelplines = helplines.filter(h => h.category_id === catId);
    const isCritical = (urgency === "CRITICAL");

    return {
      identified_category: catTitle,
      category_id: catId,
      urgency_level: urgency,
      is_life_threatening: isCritical,
      explanation: explanation,
      actionable_advice: advice,
      recommended_helplines: matchedHelplines.slice(0, 3),
      disclaimer: "AI recommendations are for guidance only. All numbers are verified against official government registries."
    };
  }
});
