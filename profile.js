// ==========================================================================
// GlobalTrotters User Profile & Settings Script
// ==========================================================================

// Default User State
const DEFAULT_USER = {
  name: "Jay",
  email: "jay@globaltrotters.app",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  bio: "Avid explorer, photography enthusiast, and coffee hunter wandering the world.",
  language: "English",
  currency: "USD",
  units: "km",
  profileVisibility: "public",
  tripSharingDefault: "public",
  savedDestinations: [
    { id: "dest-paris", city: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80" },
    { id: "dest-tokyo", city: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80" },
    { id: "dest-dubai", city: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80" },
    { id: "dest-rome", city: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80" }
  ]
};

// Fallback avatar placeholder (Default SVG icon as data URI)
const DEFAULT_AVATAR_PLACEHOLDER = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

let currentUser = null;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initUserProfile();
});

/**
 * Initialize User Profile from LocalStorage
 */
function initUserProfile() {
  const stored = localStorage.getItem("globaltrotter_user");
  if (!stored) {
    currentUser = { ...DEFAULT_USER };
    localStorage.setItem("globaltrotter_user", JSON.stringify(currentUser));
  } else {
    try {
      currentUser = JSON.parse(stored);
      // Ensure arrays and defaults exist
      if (!currentUser.savedDestinations) {
        currentUser.savedDestinations = [...DEFAULT_USER.savedDestinations];
      }
    } catch (e) {
      currentUser = { ...DEFAULT_USER };
    }
  }

  // Populate UI fields
  populateUserFormFields();
  updateGlobalUserElements();
  renderSavedDestinations();

  // Check URL hash to open specific tab (e.g. profile.html#preferences)
  handleInitialUrlHash();
}

/**
 * Handle initial URL Hash for direct navigation to settings tabs
 */
function handleInitialUrlHash() {
  const hash = window.location.hash.replace("#", "").toLowerCase();
  const validSections = ["profile", "preferences", "privacy", "destinations", "account"];
  if (validSections.includes(hash)) {
    switchSettingsSection(hash);
  }
}

/**
 * Populate form inputs from current user state
 */
function populateUserFormFields() {
  // Profile Section
  document.getElementById("inputFullName").value = currentUser.name || "";
  document.getElementById("inputEmail").value = currentUser.email || "";
  document.getElementById("inputBio").value = currentUser.bio || "";
  document.getElementById("formAvatarPreview").src = currentUser.avatar || DEFAULT_AVATAR_PLACEHOLDER;
  document.getElementById("sessionUserEmail").textContent = currentUser.email || "jay@globaltrotters.app";

  // Preferences Section
  if (currentUser.language) {
    document.getElementById("selectLanguage").value = currentUser.language;
  }
  if (currentUser.currency) {
    document.getElementById("selectCurrency").value = currentUser.currency;
  }
  const unitsRadio = document.querySelector(`input[name="distanceUnits"][value="${currentUser.units || 'km'}"]`);
  if (unitsRadio) unitsRadio.checked = true;

  // Privacy Section
  const visibilityRadio = document.querySelector(`input[name="profileVisibility"][value="${currentUser.profileVisibility || 'public'}"]`);
  if (visibilityRadio) visibilityRadio.checked = true;

  const tripSharingRadio = document.querySelector(`input[name="tripSharingDefault"][value="${currentUser.tripSharingDefault || 'public'}"]`);
  if (tripSharingRadio) tripSharingRadio.checked = true;
}

/**
 * Update top header avatar and names across the screen
 */
function updateGlobalUserElements() {
  const userAvatar = currentUser.avatar || DEFAULT_AVATAR_PLACEHOLDER;
  const userName = currentUser.name || "Jay";

  // Top header bar
  const navAvatar = document.getElementById("navUserAvatar");
  const navName = document.getElementById("navUserName");
  if (navAvatar) navAvatar.src = userAvatar;
  if (navName) navName.textContent = `${userName} 👋`;

  // Page Hero Header
  const headerAvatar = document.getElementById("headerUserAvatar");
  const headerName = document.getElementById("headerUserName");
  if (headerAvatar) headerAvatar.src = userAvatar;
  if (headerName) headerName.textContent = userName;
}

/**
 * Switch active Settings Section
 */
function switchSettingsSection(sectionId) {
  const sections = ["profile", "preferences", "privacy", "destinations", "account"];
  
  sections.forEach(sec => {
    const tabNav = document.getElementById(`tabNav${capitalize(sec)}`);
    const panel = document.getElementById(`section${capitalize(sec)}`);
    
    if (sec === sectionId) {
      if (tabNav) {
        tabNav.classList.add("active");
        tabNav.setAttribute("aria-selected", "true");
      }
      if (panel) {
        panel.style.display = "block";
        panel.classList.add("active");
      }
    } else {
      if (tabNav) {
        tabNav.classList.remove("active");
        tabNav.setAttribute("aria-selected", "false");
      }
      if (panel) {
        panel.style.display = "none";
        panel.classList.remove("active");
      }
    }
  });

  // Update URL hash smoothly
  history.replaceState(null, null, `#${sectionId}`);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * File Input Trigger for Profile Photo
 */
function triggerFileInput() {
  document.getElementById("photoFileInput").click();
}

/**
 * Handle Photo File Selected & Base64 preview
 */
function handlePhotoFileSelected(event) {
  const file = event.target.files[0];
  const errorMsg = document.getElementById("photoErrorMsg");
  errorMsg.style.display = "none";
  errorMsg.textContent = "";

  if (!file) return;

  // Validate File Type
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    errorMsg.textContent = "Please select a valid image file (JPG, PNG, or WebP).";
    errorMsg.style.display = "block";
    return;
  }

  // Validate File Size (< 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    errorMsg.textContent = "Image size is too large. Maximum allowed size is 5MB.";
    errorMsg.style.display = "block";
    return;
  }

  // Read file to Data URL
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    document.getElementById("formAvatarPreview").src = dataUrl;
    
    // Update local state
    currentUser.avatar = dataUrl;
    saveUserToLocalStorage();
    updateGlobalUserElements();
    
    showToast("Profile photo updated successfully!", "success");
  };
  reader.onerror = function() {
    errorMsg.textContent = "Failed to load image. Please try another file.";
    errorMsg.style.display = "block";
  };
  reader.readAsDataURL(file);
}

/**
 * Handle Photo Removal
 */
function handleRemovePhoto() {
  if (currentUser.avatar === DEFAULT_AVATAR_PLACEHOLDER) {
    showToast("Default photo is already in use.", "success");
    return;
  }

  currentUser.avatar = DEFAULT_AVATAR_PLACEHOLDER;
  document.getElementById("formAvatarPreview").src = DEFAULT_AVATAR_PLACEHOLDER;
  document.getElementById("photoFileInput").value = "";
  
  saveUserToLocalStorage();
  updateGlobalUserElements();
  
  showToast("Profile photo removed and reset to default.", "success");
}

/**
 * Check if email input was modified
 */
function handleEmailChangeCheck(newVal) {
  const noticeBanner = document.getElementById("emailNoticeBanner");
  const verificationBadge = document.getElementById("emailVerificationBadge");
  const emailTrimmed = newVal.trim();

  if (currentUser && emailTrimmed !== currentUser.email) {
    noticeBanner.style.display = "flex";
    verificationBadge.className = "verification-badge pending";
    verificationBadge.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Verification Required`;
  } else {
    noticeBanner.style.display = "none";
    verificationBadge.className = "verification-badge verified";
    verificationBadge.innerHTML = `<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Verified Account`;
  }
}

/**
 * Profile Form Submit Handler with Validation
 */
function handleProfileFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("inputFullName");
  const emailInput = document.getElementById("inputEmail");
  const bioInput = document.getElementById("inputBio");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const submitBtn = document.getElementById("btnSaveProfile");

  // Reset errors
  nameError.textContent = "";
  emailError.textContent = "";
  nameInput.style.borderColor = "";
  emailInput.style.borderColor = "";

  const nameVal = nameInput.value.trim();
  const emailVal = emailInput.value.trim();
  let hasError = false;

  // Validate Name
  if (nameVal === "") {
    nameError.textContent = "Please enter your full name.";
    nameInput.style.borderColor = "var(--error)";
    nameInput.focus();
    hasError = true;
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    emailError.textContent = "Please enter a valid email address.";
    emailInput.style.borderColor = "var(--error)";
    if (!hasError) emailInput.focus();
    hasError = true;
  }

  if (hasError) return;

  // Trigger simulated loading
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");

  setTimeout(() => {
    currentUser.name = nameVal;
    currentUser.email = emailVal;
    currentUser.bio = bioInput.value.trim();

    saveUserToLocalStorage();
    updateGlobalUserElements();

    submitBtn.classList.remove("loading");
    submitBtn.classList.add("success");

    setTimeout(() => {
      submitBtn.classList.remove("success");
      submitBtn.disabled = false;
      showToast("Profile information saved successfully!", "success");
    }, 600);

  }, 800);
}

/**
 * Preferences Form Submit Handler
 */
function handlePreferencesSubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("btnSavePreferences");
  const language = document.getElementById("selectLanguage").value;
  const currency = document.getElementById("selectCurrency").value;
  const unitsRadio = document.querySelector('input[name="distanceUnits"]:checked');
  const units = unitsRadio ? unitsRadio.value : "km";

  submitBtn.disabled = true;
  submitBtn.classList.add("loading");

  setTimeout(() => {
    currentUser.language = language;
    currentUser.currency = currency;
    currentUser.units = units;

    saveUserToLocalStorage();

    submitBtn.classList.remove("loading");
    submitBtn.classList.add("success");

    setTimeout(() => {
      submitBtn.classList.remove("success");
      submitBtn.disabled = false;
      showToast("Language and preferences updated!", "success");
    }, 600);

  }, 750);
}

/**
 * Privacy Form Submit Handler
 */
function handlePrivacySubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("btnSavePrivacy");
  const visibilityRadio = document.querySelector('input[name="profileVisibility"]:checked');
  const tripSharingRadio = document.querySelector('input[name="tripSharingDefault"]:checked');

  const visibility = visibilityRadio ? visibilityRadio.value : "public";
  const tripSharing = tripSharingRadio ? tripSharingRadio.value : "public";

  submitBtn.disabled = true;
  submitBtn.classList.add("loading");

  setTimeout(() => {
    currentUser.profileVisibility = visibility;
    currentUser.tripSharingDefault = tripSharing;

    saveUserToLocalStorage();

    submitBtn.classList.remove("loading");
    submitBtn.classList.add("success");

    setTimeout(() => {
      submitBtn.classList.remove("success");
      submitBtn.disabled = false;
      showToast("Privacy and sharing preferences saved!", "success");
    }, 600);

  }, 750);
}

/**
 * Render Saved Destinations Grid
 */
function renderSavedDestinations() {
  const grid = document.getElementById("savedDestinationsGrid");
  const emptyState = document.getElementById("emptySavedDestState");
  const counter = document.getElementById("savedDestCounter");

  grid.innerHTML = "";

  const destinations = currentUser.savedDestinations || [];
  counter.textContent = destinations.length;

  if (destinations.length === 0) {
    grid.style.display = "none";
    emptyState.style.display = "flex";
    return;
  }

  grid.style.display = "grid";
  emptyState.style.display = "none";

  destinations.forEach(dest => {
    const card = document.createElement("div");
    card.className = "dest-card";
    card.id = `dest-${dest.id}`;

    card.innerHTML = `
      <div class="dest-card-image-box">
        <img src="${dest.image}" alt="${dest.city}" class="dest-card-img" loading="lazy">
        <div class="dest-card-overlay"></div>
        <button type="button" class="btn-remove-saved-dest" onclick="removeSavedDestination('${dest.id}', '${dest.city}')" title="Remove from saved destinations" aria-label="Remove ${dest.city}">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
      <div class="dest-card-body">
        <h4 class="dest-city-name">${dest.city}</h4>
        <span class="dest-country-name">${dest.country}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

/**
 * Remove Destination from Saved List
 */
function removeSavedDestination(destId, cityName) {
  const card = document.getElementById(`dest-${destId}`);
  if (card) {
    card.style.opacity = "0";
    card.style.transform = "scale(0.9)";
  }

  setTimeout(() => {
    currentUser.savedDestinations = (currentUser.savedDestinations || []).filter(d => d.id !== destId);
    saveUserToLocalStorage();
    renderSavedDestinations();
    showToast(`Removed ${cityName} from saved destinations`, "success");
  }, 300);
}

/**
 * Explore Destinations Action
 */
function handleExploreDestinations() {
  showToast("Opening Destinations Explorer...", "success");
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 600);
}

/**
 * Delete Account Confirmation Modal Workflow
 */
function openDeleteAccountModal() {
  const modal = document.getElementById("deleteAccountModal");
  const input = document.getElementById("deleteConfirmInput");
  const btn = document.getElementById("btnConfirmDeleteAccount");

  input.value = "";
  btn.disabled = true;
  modal.classList.add("visible");
  input.focus();
}

function closeDeleteAccountModal() {
  const modal = document.getElementById("deleteAccountModal");
  modal.classList.remove("visible");
}

function closeDeleteAccountModalOnBackdrop(event) {
  if (event.target === document.getElementById("deleteAccountModal")) {
    closeDeleteAccountModal();
  }
}

function handleDeleteInputValidation(val) {
  const btn = document.getElementById("btnConfirmDeleteAccount");
  if (val.trim() === "DELETE") {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

/**
 * Execute Account Deletion
 */
function executeAccountDeletion() {
  const btn = document.getElementById("btnConfirmDeleteAccount");
  if (btn.classList.contains("loading")) return;

  btn.disabled = true;
  btn.classList.add("loading");

  setTimeout(() => {
    // Clear Local Storage items for user & trips
    localStorage.removeItem("globaltrotter_user");
    localStorage.removeItem("globaltrotter_trips");

    closeDeleteAccountModal();
    showToast("Your account has been deleted. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);

  }, 1400);
}

/**
 * Search filter inside settings
 */
function handleSettingsSearch(query) {
  const normalized = query.toLowerCase().trim();
  const navItems = document.querySelectorAll(".settings-nav-item");

  if (!normalized) {
    navItems.forEach(item => item.style.display = "flex");
    return;
  }

  navItems.forEach(item => {
    const title = item.querySelector(".nav-item-title").textContent.toLowerCase();
    const desc = item.querySelector(".nav-item-desc").textContent.toLowerCase();
    if (title.includes(normalized) || desc.includes(normalized)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

/**
 * Save user to LocalStorage helper
 */
function saveUserToLocalStorage() {
  localStorage.setItem("globaltrotter_user", JSON.stringify(currentUser));
}
