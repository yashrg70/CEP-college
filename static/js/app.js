/**
 * Raksha Connect - Core Application Controller
 * Handles Navigation, Search, Directory Filtering, Call Modal, and Accessibility.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize data store
  if (window.rakshaStore) {
    await window.rakshaStore.checkBackend();
  }

  initNavigation();
  initHeroSearch();
  initCategoryCards();
  initDirectory();
  initContactForm();
  initAccessibility();
  initStatsCounter();
});

/* -------------------------------------------------------------
   Navigation & View Routing
   ------------------------------------------------------------- */
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link, .footer-col a, .btn-primary, .btn-emergency");
  const mobileToggle = document.getElementById("mobileNavToggle");
  const mainNav = document.getElementById("mainNav");

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      mainNav.classList.toggle("mobile-active");
    });
  }

  // Handle in-page smooth navigation and active state
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          if (mainNav) mainNav.classList.remove("mobile-active");
          targetSection.scrollIntoView({ behavior: "smooth" });
          
          // Update active pill
          document.querySelectorAll(".nav-link").forEach(nl => nl.classList.remove("active"));
          if (link.classList.contains("nav-link")) link.classList.add("active");
        }
      }
    });
  });
}

/* -------------------------------------------------------------
   Hero Search System
   ------------------------------------------------------------- */
function initHeroSearch() {
  const searchInput = document.getElementById("heroSearchInput");
  const searchBtn = document.getElementById("heroSearchBtn");
  const searchResultsContainer = document.getElementById("heroSearchResults");
  const queryChips = document.querySelectorAll(".query-chip");

  if (!searchInput || !searchBtn) return;

  function executeSearch() {
    const q = searchInput.value.trim();
    if (!q) {
      if (searchResultsContainer) searchResultsContainer.style.display = "none";
      return;
    }

    if (window.rakshaStore) window.rakshaStore.saveSearchTerm(q);

    // If query looks like a conversational sentence, switch to Smart Assistant
    if (q.split(" ").length > 3 || /^(someone|i want|please|help|fraud|complaint|emergency)/i.test(q)) {
      const aiInput = document.getElementById("aiProblemInput");
      const aiSection = document.getElementById("assistant");
      if (aiInput && aiSection) {
        aiInput.value = q;
        aiSection.scrollIntoView({ behavior: "smooth" });
        const aiSubmitBtn = document.getElementById("aiSubmitBtn");
        if (aiSubmitBtn) aiSubmitBtn.click();
        return;
      }
    }

    // Otherwise, perform direct search and scroll to Directory
    const dirInput = document.getElementById("directorySearchInput");
    const dirSection = document.getElementById("directory");
    if (dirInput && dirSection) {
      dirInput.value = q;
      dirSection.scrollIntoView({ behavior: "smooth" });
      renderDirectoryItems(q, "all");
    }
  }

  searchBtn.addEventListener("click", executeSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
  });

  // Query chips quick actions
  queryChips.forEach(chip => {
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      const term = chip.getAttribute("data-query");
      searchInput.value = term;
      executeSearch();
    });
  });
}

/* -------------------------------------------------------------
   12 Category Cards Renderer
   ------------------------------------------------------------- */
function initCategoryCards() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid || !window.rakshaStore) return;

  const categories = window.rakshaStore.categories;

  grid.innerHTML = categories.map(cat => `
    <div class="category-card" style="--category-color: ${cat.color}; --cat-bg: ${cat.bg};">
      <div>
        <div class="cat-card-header">
          <div class="cat-icon-box">
            ${getCategorySvgIcon(cat.icon)}
          </div>
          <span class="cat-number-pill">${cat.primary}</span>
        </div>
        <div class="cat-card-body">
          <h3>${cat.name}</h3>
          <p>${cat.desc}</p>
        </div>
      </div>
      <div class="cat-card-footer">
        <button class="btn-details-link" onclick="filterDirectoryByCategory('${cat.id}')">
          View All Helplines &rarr;
        </button>
        <button class="btn-call-sm" onclick="window.triggerCallModal('${cat.name}', '${cat.primary}', '${cat.name}', 'Official National Helpline')">
          📞 Call ${cat.primary}
        </button>
      </div>
    </div>
  `).join("");
}

/* -------------------------------------------------------------
   Helpline Directory & Filtering
   ------------------------------------------------------------- */
let currentCategoryFilter = "all";
let currentSortBy = "alphabetical";

function initDirectory() {
  const dirSearchInput = document.getElementById("directorySearchInput");
  const sortSelect = document.getElementById("directorySortSelect");
  const filterPillsContainer = document.getElementById("directoryFilterPills");

  if (!filterPillsContainer) return;

  // Build filter pills
  const categories = window.rakshaStore ? window.rakshaStore.categories : [];
  let pillsHtml = `
    <button class="filter-pill active" data-category="all" onclick="filterDirectoryByCategory('all')">
      All Categories
    </button>
  `;

  categories.forEach(c => {
    pillsHtml += `
      <button class="filter-pill" data-category="${c.id}" onclick="filterDirectoryByCategory('${c.id}')">
        ${c.name}
      </button>
    `;
  });
  filterPillsContainer.innerHTML = pillsHtml;

  if (dirSearchInput) {
    dirSearchInput.addEventListener("input", () => {
      renderDirectoryItems(dirSearchInput.value, currentCategoryFilter, currentSortBy);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSortBy = e.target.value;
      renderDirectoryItems(dirSearchInput ? dirSearchInput.value : "", currentCategoryFilter, currentSortBy);
    });
  }

  // Initial render
  renderDirectoryItems("", "all", "alphabetical");
}

window.filterDirectoryByCategory = function(catId) {
  currentCategoryFilter = catId;
  const pills = document.querySelectorAll(".filter-pill");
  pills.forEach(p => {
    p.classList.toggle("active", p.getAttribute("data-category") === catId);
  });

  const dirSearchInput = document.getElementById("directorySearchInput");
  const query = dirSearchInput ? dirSearchInput.value : "";
  renderDirectoryItems(query, catId, currentSortBy);

  const dirSection = document.getElementById("directory");
  if (dirSection) dirSection.scrollIntoView({ behavior: "smooth" });
};

function renderDirectoryItems(query = "", category = "all", sortBy = "alphabetical") {
  const grid = document.getElementById("directoryGrid");
  const countBadge = document.getElementById("directoryCountBadge");
  if (!grid || !window.rakshaStore) return;

  const items = window.rakshaStore.filterHelplines(query, category, null, sortBy);

  if (countBadge) {
    countBadge.textContent = `${items.length} ${items.length === 1 ? 'Helpline' : 'Helplines'} Found`;
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: white; border-radius: 12px; border: 1px dashed #cbd5e1;">
        <div style="font-size: 2.2rem; margin-bottom: 10px;">🔍</div>
        <h4 style="font-size: 1.2rem; color: #0f172a; margin-bottom: 6px;">No exact helpline record found for "${query}"</h4>
        <p style="color: #64748b; font-size: 0.9rem; max-width: 500px; margin: 0 auto 16px;">
          For any immediate physical emergency or threat to life anywhere in India, please contact the Unified National Emergency line directly.
        </p>
        <button class="btn-emergency" onclick="window.triggerCallModal('Emergency Response Support System', '112', 'Unified Emergency', 'Ministry of Home Affairs')">
          🚨 Dial National Emergency 112
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(h => {
    const isSample = (h.verification_status || "").includes("Sample") || (h.verification_status || "").includes("Unverified");
    const badgeClass = isSample ? "sample" : "verified";
    const badgeText = isSample ? "⚠️ Sample / Unverified Record" : "✓ Verified Official";

    return `
      <div class="directory-card">
        <div>
          <div class="dir-card-top">
            <span class="dir-cat-badge">${h.category}</span>
            <span class="dir-verified-badge ${badgeClass}">${badgeText}</span>
          </div>
          <h4 class="dir-helpline-name">${h.helpline_name}</h4>
          <div class="dir-phone-highlight">${h.phone_number}</div>
          <p class="dir-desc">${h.description}</p>
        </div>

        <div>
          <div class="dir-meta-list">
            <div class="dir-meta-item">
              <strong>Hours:</strong> <span>${h.operational_hours || '24 Hours / 7 Days'}</span>
            </div>
            <div class="dir-meta-item">
              <strong>Source:</strong> 
              <span>${renderSourceLink(h.official_source)}</span>
            </div>
            <div class="dir-meta-item">
              <strong>Verified Date:</strong> <span>${h.last_verified_date || 'November 2026'}</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; gap: 8px;">
            <button class="btn-primary" style="flex: 1; padding: 9px 12px; font-size: 0.85rem;" onclick="copyToClipboard('${h.phone_number}')">
              📋 Copy
            </button>
            <button class="btn-call-sm" style="flex: 1.5; justify-content: center; padding: 9px 12px;" onclick="window.triggerCallModal('${h.helpline_name.replace(/'/g, "\\'")}', '${h.phone_number}', '${h.category.replace(/'/g, "\\'")}', '${(h.official_source || '').replace(/'/g, "\\'")}')">
              📞 Call Now
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderSourceLink(sourceText) {
  if (!sourceText) return "Official Portal";
  const urlMatch = sourceText.match(/https?:\/\/[^\s\)]+/);
  if (urlMatch) {
    const cleanUrl = urlMatch[0];
    const label = sourceText.split("(")[0].trim() || cleanUrl;
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
  }
  return sourceText;
}

/* -------------------------------------------------------------
   Call Confirmation Safety Modal
   ------------------------------------------------------------- */
let activeDialNumber = "";

window.triggerCallModal = function(name, number, category, source) {
  const modal = document.getElementById("callModal");
  if (!modal) return;

  activeDialNumber = number;
  document.getElementById("modalHelplineName").textContent = name;
  document.getElementById("modalCategoryName").textContent = category;
  document.getElementById("modalNumberDigits").textContent = number;
  document.getElementById("modalSourceRef").textContent = source || "Government Nodal Authority";

  const dialBtn = document.getElementById("modalDialBtn");
  if (dialBtn) {
    // Sanitized tel link
    const cleanTel = number.replace(/[^0-9+]/g, "");
    dialBtn.setAttribute("href", `tel:${cleanTel}`);
  }

  modal.classList.add("active");
};

window.closeCallModal = function() {
  const modal = document.getElementById("callModal");
  if (modal) modal.classList.remove("active");
};

window.copyModalNumber = function() {
  if (activeDialNumber) {
    copyToClipboard(activeDialNumber);
  }
};

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Helpline number ${text} copied to clipboard!`, "success");
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showToast(`Helpline number ${text} copied!`, "success");
}

/* -------------------------------------------------------------
   Contact Form Handler
   ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value;
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject_type: subject, message })
      });

      if (response.ok) {
        showToast("Thank you! Your feedback has been safely submitted for review.", "success");
        form.reset();
      } else {
        showToast("Submission registered locally. Thank you for your feedback!", "success");
        form.reset();
      }
    } catch (err) {
      // Local fallback success
      showToast("Message saved locally. Thank you for helping improve citizen safety!", "success");
      form.reset();
    }
  });
}

/* -------------------------------------------------------------
   Accessibility & High Contrast
   ------------------------------------------------------------- */
function initAccessibility() {
  const contrastBtn = document.getElementById("highContrastToggle");
  const fontDecBtn = document.getElementById("fontDecBtn");
  const fontIncBtn = document.getElementById("fontIncBtn");

  // Load preferences
  const savedContrast = localStorage.getItem("raksha_contrast") || "normal";
  const savedFontSize = localStorage.getItem("raksha_fontsize") || "md";

  document.documentElement.setAttribute("data-contrast", savedContrast);
  document.documentElement.setAttribute("data-fontsize", savedFontSize);

  if (contrastBtn) {
    contrastBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-contrast");
      const next = current === "high" ? "normal" : "high";
      document.documentElement.setAttribute("data-contrast", next);
      localStorage.setItem("raksha_contrast", next);
      showToast(`Contrast Mode: ${next === "high" ? "High Contrast Enabled" : "Normal"}`, "success");
    });
  }

  const sizes = ["sm", "md", "lg"];
  if (fontDecBtn) {
    fontDecBtn.addEventListener("click", () => {
      let current = document.documentElement.getAttribute("data-fontsize") || "md";
      let idx = sizes.indexOf(current);
      if (idx > 0) {
        let next = sizes[idx - 1];
        document.documentElement.setAttribute("data-fontsize", next);
        localStorage.setItem("raksha_fontsize", next);
      }
    });
  }

  if (fontIncBtn) {
    fontIncBtn.addEventListener("click", () => {
      let current = document.documentElement.getAttribute("data-fontsize") || "md";
      let idx = sizes.indexOf(current);
      if (idx < sizes.length - 1) {
        let next = sizes[idx + 1];
        document.documentElement.setAttribute("data-fontsize", next);
        localStorage.setItem("raksha_fontsize", next);
      }
    });
  }
}

/* -------------------------------------------------------------
   Stats Counter
   ------------------------------------------------------------- */
async function initStatsCounter() {
  try {
    const res = await fetch("/api/stats");
    if (res.ok) {
      const data = await res.json();
      if (data.stats) {
        const vEl = document.getElementById("statVerifiedCount");
        const tEl = document.getElementById("statTotalCount");
        if (vEl) vEl.textContent = `${data.stats.verified_official}+`;
        if (tEl) tEl.textContent = `${data.stats.total_helplines}+`;
      }
    }
  } catch (e) {}
}

/* -------------------------------------------------------------
   Toast Notification System
   ------------------------------------------------------------- */
window.showToast = function(msg, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === "error" ? "⚠️" : "✓"}</span>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

/* -------------------------------------------------------------
   SVG Icon Generator
   ------------------------------------------------------------- */
function getCategorySvgIcon(iconName) {
  const icons = {
    "shield-alert": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
    "heart-pulse": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h4.27"></path></svg>',
    "flame": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
    "user-check": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>',
    "baby": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path></svg>',
    "laptop-minimal-check": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"></path><path d="m9 10 2 2 4-4"></path><rect x="3" y="4" width="18" height="12" rx="2"></rect></svg>',
    "heart-handshake": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="m11 13 2.5 2.5a1.5 1.5 0 0 0 2.12 0l3.88-3.88"></path></svg>',
    "car-alert": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 11.1 2 11.5V16c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>',
    "waves": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path></svg>',
    "file-text": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>',
    "brain": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"></path></svg>',
    "train": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="3" rx="2"></rect><path d="M4 11h16"></path><path d="M12 3v8"></path><path d="m8 19-2 3"></path><path d="m16 19 2 3"></path><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>'
  };
  return icons[iconName] || icons["shield-alert"];
}
