// ==========================================================================
// GlobalTrotters Shared Itinerary - Public Share Logic & Content Rendering
// ==========================================================================

// Global States
let activeTrip = null;
let allTrips = [];
let userId = null; // null means visitor is not logged in
let currentView = 'list'; // 'list' | 'calendar'
let calendarCurrentDate = new Date();

// Distinct Colors for stop legends
const CITY_COLORS = ['#2D6A4F', '#D97706', '#C2593F', '#40916C', '#2563EB', '#7C3AED', '#0D9488'];
let cityColorMap = {};

// Activity Icons
function getActivityCategoryIcon(activityName) {
  const name = activityName.toLowerCase();
  if (name.includes('flight') || name.includes('airport') || name.includes('plane')) {
    return `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
  }
  if (name.includes('dinner') || name.includes('lunch') || name.includes('breakfast') || name.includes('restaurant') || name.includes('cafe') || name.includes('food') || name.includes('tasting')) {
    return `<svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`;
  }
  if (name.includes('museum') || name.includes('palace') || name.includes('art') || name.includes('gallery') || name.includes('louvre')) {
    return `<svg viewBox="0 0 24 24"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5 6 12 3 19 6"/><line x1="4" y1="10" x2="4" y2="21"/><line x1="20" y1="10" x2="20" y2="21"/><line x1="8" y1="14" x2="8" y2="17"/><line x1="12" y1="14" x2="12" y2="17"/><line x1="16" y1="14" x2="16" y2="17"/></svg>`;
  }
  if (name.includes('cruise') || name.includes('boat') || name.includes('river') || name.includes('canal') || name.includes('ferry') || name.includes('lake')) {
    return `<svg viewBox="0 0 24 24"><path d="M2 20a6 6 0 0 0 10 0 6 6 0 0 0 10 0M4 10l2 6h12l2-6M12 4v6M10 7h4"/></svg>`;
  }
  if (name.includes('hike') || name.includes('mountain') || name.includes('park') || name.includes('trail') || name.includes('nature') || name.includes('garden')) {
    return `<svg viewBox="0 0 24 24"><path d="M8 3l4 8 5-5 5 15H2L8 3z"/></svg>`;
  }
  if (name.includes('hotel') || name.includes('resort') || name.includes('stay')) {
    return `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2 12 12 22 17 12 22 2 17 12 12"/></svg>`;
}

// Transport Icons
function getTransportIconSvg(mode) {
  switch (mode) {
    case 'Flight':
      return `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
    case 'Bus':
      return `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M3 13h18"/></svg>`;
    case 'Car':
      return `<svg viewBox="0 0 24 24"><rect x="1" y="11" width="22" height="7" rx="2"/><path d="M5 11l1.5-4.5h11L19 11M6 18h12"/></svg>`;
    default: // Train
      return `<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="15" rx="2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/><path d="M4 10h16M7 18l-3 3M17 18l3 3"/></svg>`;
  }
}

// Document Ready
document.addEventListener("DOMContentLoaded", () => {
  initSharedItinerary();
});

/**
 * Initialize and load public shared trip
 */
function initSharedItinerary() {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('tripId');

  // Load visitor authentication status
  userId = localStorage.getItem('globaltrotter_userId');

  // Configure Sidebar redirects for logged out visitors
  configureSidebarLinks();

  // Load Trips
  const stored = localStorage.getItem('globaltrotter_trips');
  if (stored) {
    try {
      allTrips = JSON.parse(stored);
    } catch (e) {
      allTrips = [];
    }
  }

  // Ensure default showcase trip is marked public so directory is never empty
  const tokyoTrip = allTrips.find(t => t.id === 'trip-tokyo');
  if (tokyoTrip && tokyoTrip.isPublic === undefined) {
    tokyoTrip.isPublic = true;
    tokyoTrip.isBudgetPublic = true;
    localStorage.setItem('globaltrotter_trips', JSON.stringify(allTrips));
  }

  const skeleton = document.getElementById("sharedSkeletonLoader");
  const mainContent = document.getElementById("sharedMainContent");
  const privateState = document.getElementById("privateState");
  const expiredState = document.getElementById("expiredState");
  const errorState = document.getElementById("errorState");
  const directorySection = document.getElementById("publicDirectorySection");

  // Show skeleton shimmer initially
  skeleton.style.display = "flex";
  mainContent.style.display = "none";
  privateState.style.display = "none";
  expiredState.style.display = "none";
  errorState.style.display = "none";
  directorySection.style.display = "none";

  setTimeout(() => {
    skeleton.style.display = "none";

    // 1. Browse Public directory if no tripId is provided
    if (!tripId) {
      const shLink = document.getElementById("sidebarSharedTripsLink");
      if (shLink) shLink.classList.add("active");
      renderPublicDirectory();
      renderTopHeaderAuth();
      return;
    }

    activeTrip = allTrips.find(t => t.id === tripId);
    if (!activeTrip) {
      expiredState.style.display = "flex";
      return;
    }

    // 2. Respect Privacy Public setting
    // Note: if owner has not explicitly made it public (isPublic: true), it defaults to private.
    if (!activeTrip.isPublic) {
      privateState.style.display = "flex";
      return;
    }

    // Load active data
    mainContent.style.display = "block";
    
    // Set public share URL
    const shareInput = document.getElementById("publicShareUrlInput");
    shareInput.value = window.location.href;

    // Show mobile native share if supported
    if (navigator.share) {
      document.getElementById("mobileShareBtn").style.display = "flex";
    }

    // Color code mapping for destinations
    cityColorMap = {};
    if (activeTrip.stops) {
      activeTrip.stops.forEach((stop, index) => {
        cityColorMap[stop.city] = CITY_COLORS[index % CITY_COLORS.length];
      });
    }

    // Calendar month tracking
    if (activeTrip.startDate) {
      calendarCurrentDate = new Date(activeTrip.startDate);
      if (isNaN(calendarCurrentDate.getTime())) {
        calendarCurrentDate = new Date();
      }
    }

    // Render Components
    renderHeroSection();
    renderCopyCTAButtons();
    renderSummaryMetrics();
    renderRoadflowRoute();
    renderTimelineView();
    renderCalendarView();
    renderCitiesIndexSidebar();
    renderTopHeaderAuth();
  }, 750);
}

/**
 * Sidebar Navigation routes mapping
 */
function configureSidebarLinks() {
  const homeLink = document.getElementById("sidebarHomeLink");
  const tripsLink = document.getElementById("sidebarTripsLink");
  const exploreLink = document.getElementById("sidebarExploreLink");
  const activitiesLink = document.getElementById("sidebarActivitiesLink");
  const authBtn = document.getElementById("sidebarAuthBtn");

  if (userId) {
    homeLink.href = "dashboard.html";
    tripsLink.href = "dashboard.html";
    exploreLink.href = "explore.html";
    activitiesLink.href = "activities.html";
    authBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Logout`;
    authBtn.onclick = handleLogout;
  } else {
    // Unauthenticated: redirect to login
    const loginRedirect = () => {
      window.location.href = "index.html";
    };
    homeLink.onclick = loginRedirect;
    tripsLink.onclick = loginRedirect;
    exploreLink.onclick = loginRedirect;
    activitiesLink.onclick = loginRedirect;
    authBtn.onclick = loginRedirect;
  }
}

/**
 * Top header profile display depending on login state
 */
function renderTopHeaderAuth() {
  const headerRight = document.getElementById("headerAuthSection");
  if (userId) {
    headerRight.innerHTML = `
      <button class="profile-trigger" onclick="window.location.href='dashboard.html'">
        <div class="avatar-wrapper">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar" class="avatar-img">
        </div>
        <span class="profile-name">Jay 👋</span>
      </button>
    `;
  } else {
    headerRight.innerHTML = `
      <button class="btn-auth-sub primary-sub" onclick="window.location.href='index.html'">Log In / Sign Up</button>
    `;
  }
}

/**
 * Render visual cover image header
 */
function renderHeroSection() {
  document.getElementById("heroTripTitle").textContent = activeTrip.destination;

  const startStr = formatDateShort(activeTrip.startDate);
  const endStr = formatDateLong(activeTrip.endDate);
  document.getElementById("heroTripDates").textContent = `${startStr} – ${endStr}`;

  const citiesCount = activeTrip.stops ? activeTrip.stops.length : 0;
  const activitiesCount = activeTrip.stops ? activeTrip.stops.reduce((sum, s) => sum + (s.activities ? s.activities.length : 0), 0) : 0;
  document.getElementById("heroTripSummaryLabel").textContent = `${citiesCount} ${citiesCount === 1 ? 'City' : 'Cities'} · ${activitiesCount} ${activitiesCount === 1 ? 'Activity' : 'Activities'}`;

  // Image banner cover
  const coverUrl = activeTrip.banner || (activeTrip.stops && activeTrip.stops[0] && activeTrip.stops[0].image) || "assets/dashboard_hero.png";
  document.getElementById("heroImageBg").style.backgroundImage = `url('${coverUrl}')`;
}

/**
 * Configures Copy Trip CTA blocks (Top banner & bottom prompt)
 */
function renderCopyCTAButtons() {
  const topArea = document.getElementById("topCopyActionArea");
  const bottomArea = document.getElementById("bottomCopyActionArea");

  if (userId) {
    // Visitor is logged in: show prominent Copy Trip button
    const btnHtml = `<button class="btn-copy-cta" onclick="handleCopyTripAction()">Copy Itinerary</button>`;
    topArea.innerHTML = btnHtml;
    bottomArea.innerHTML = btnHtml;
  } else {
    // Visitor is logged out: show account creation prompt
    const promptHtml = `
      <div class="copy-login-prompt">
        <span class="login-sub-text">Create an account to copy this trip</span>
        <button class="btn-auth-sub primary-sub" onclick="window.location.href='index.html?signup=true'">Sign Up</button>
        <button class="btn-auth-sub" onclick="window.location.href='index.html'">Log In</button>
      </div>
    `;
    topArea.innerHTML = promptHtml;
    bottomArea.innerHTML = promptHtml;
  }
}

/**
 * Handle copy/clone trip logic
 */
function handleCopyTripAction() {
  if (!userId || !activeTrip) return;

  // Clone the trip object
  const newTripId = `trip-${Date.now()}`;
  
  // Clone stops with deep cloned nested activities (assigning fresh unique IDs to avoid clashing)
  const clonedStops = activeTrip.stops ? activeTrip.stops.map((stop, sIdx) => {
    const clonedActivities = stop.activities ? stop.activities.map(act => {
      return {
        ...act,
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      };
    }) : [];

    return {
      ...stop,
      id: `stop-${Date.now()}-${sIdx}`,
      activities: clonedActivities
    };
  }) : [];

  const copiedTrip = {
    id: newTripId,
    destination: `Copy of ${activeTrip.destination}`,
    startDate: activeTrip.startDate,
    endDate: activeTrip.endDate,
    citiesVal: activeTrip.citiesVal,
    activitiesVal: activeTrip.activitiesVal,
    budget: activeTrip.isBudgetPublic ? activeTrip.budget : null, // only copy budget if public
    status: "Draft",
    banner: activeTrip.banner,
    stops: clonedStops,
    isPublic: false,       // Default cloned trip to private
    isBudgetPublic: false
  };

  // Add to visitor's trips and save
  allTrips.push(copiedTrip);
  localStorage.setItem('globaltrotter_trips', JSON.stringify(allTrips));

  showToast("Itinerary copied successfully to your account!", "success");

  // Redirect to copied trip's itinerary builder
  setTimeout(() => {
    window.location.href = `itinerary.html?tripId=${newTripId}`;
  }, 1200);
}

/**
 * Visual summary metric cards loading
 */
function renderSummaryMetrics() {
  const start = new Date(activeTrip.startDate);
  const end = new Date(activeTrip.endDate);
  const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  document.getElementById("summaryDurationValue").textContent = `${totalDays} ${totalDays === 1 ? 'Day' : 'Days'}`;

  const citiesCount = activeTrip.stops ? activeTrip.stops.length : 0;
  document.getElementById("summaryStopsValue").textContent = `${citiesCount} ${citiesCount === 1 ? 'Stop' : 'Stops'}`;

  const activitiesCount = activeTrip.stops ? activeTrip.stops.reduce((sum, s) => sum + (s.activities ? s.activities.length : 0), 0) : 0;
  document.getElementById("summaryActivitiesValue").textContent = `${activitiesCount} ${activitiesCount === 1 ? 'Event' : 'Events'}`;

  // Hide or display budget metrics depending on public checkbox toggle settings
  const budgetCard = document.getElementById("summaryBudgetValue");
  if (activeTrip.isBudgetPublic && activeTrip.budget) {
    budgetCard.textContent = `$${parseFloat(activeTrip.budget).toLocaleString()}`;
  } else {
    budgetCard.textContent = "Private";
    budgetCard.style.color = "var(--text-muted)";
  }
}

/**
 * Route tracker pathway row
 */
function renderRoadflowRoute() {
  const line = document.getElementById("routeTrackLine");
  line.innerHTML = "";

  if (!activeTrip.stops || activeTrip.stops.length === 0) return;

  activeTrip.stops.forEach((stop, index) => {
    const stopDays = Math.round((new Date(stop.endDate) - new Date(stop.startDate)) / (1000 * 60 * 60 * 24)) + 1;

    const node = document.createElement("a");
    node.className = "route-step-node";
    node.href = `#city-section-${stop.id}`;
    node.onclick = (e) => {
      e.preventDefault();
      if (currentView !== 'list') switchItineraryView('list');
      const el = document.getElementById(`city-section-${stop.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    node.innerHTML = `
      <img src="${stop.image}" alt="${stop.city}" class="route-node-thumb">
      <div class="route-node-info">
        <span class="route-node-city">${stop.city}</span>
        <span class="route-node-days">${stopDays} ${stopDays === 1 ? 'day' : 'days'}</span>
      </div>
    `;
    line.appendChild(node);

    if (index < activeTrip.stops.length - 1) {
      const mode = stop.transportToNext || "Train";
      const connector = document.createElement("div");
      connector.className = "route-connector-item";
      connector.innerHTML = `
        <div class="route-connector-line"></div>
        <div class="route-transport-icon" title="${mode}">
          ${getTransportIconSvg(mode)}
        </div>
        <div class="route-connector-line"></div>
      `;
      line.appendChild(connector);
    }
  });
}

/**
 * Render read-only Chronological timeline
 */
function renderTimelineView() {
  const list = document.getElementById("cityTimelineList");
  list.innerHTML = "";

  if (!activeTrip.stops || activeTrip.stops.length === 0) return;

  let journeyDayCounter = 1;

  activeTrip.stops.forEach((stop, stopIndex) => {
    const stopDays = Math.round((new Date(stop.endDate) - new Date(stop.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const activitiesCount = stop.activities ? stop.activities.length : 0;
    const cityColor = cityColorMap[stop.city] || 'var(--primary)';

    const card = document.createElement("article");
    card.className = "city-section-card";
    card.id = `city-section-${stop.id}`;

    // Loop dates within stop
    const stopDates = [];
    let curr = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    while (curr <= end) {
      stopDates.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
    }

    let daysHtml = "";
    stopDates.forEach(dateISO => {
      const currentDayNumber = journeyDayCounter++;

      // Filter events
      let dayActivities = [];
      if (stop.activities) {
        dayActivities = stop.activities.filter(a => a.date === dateISO);
        dayActivities.sort((a,b) => (a.time || "").localeCompare(b.time || ""));
      }

      let activitiesListHtml = "";
      if (dayActivities.length === 0) {
        activitiesListHtml = `
          <div class="empty-day-note">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
            <span>Free time to explore ${stop.city}!</span>
          </div>
        `;
      } else {
        activitiesListHtml = `<div class="day-activities-grid">`;
        dayActivities.forEach(act => {
          const timeFormatted = act.time ? formatTime(act.time) : "Flexible Time";
          const costVal = parseFloat(act.cost);
          const hasCost = !isNaN(costVal) && costVal > 0;
          
          // Cost is public check
          const costHtml = activeTrip.isBudgetPublic 
            ? (hasCost ? `<span class="activity-cost-pill">$${costVal.toFixed(0)}</span>` : `<span class="activity-free-pill">Free</span>`)
            : "";

          activitiesListHtml += `
            <div class="activity-view-card">
              <div class="activity-card-left">
                <div class="activity-category-icon" style="color: ${cityColor}; background-color: rgba(45, 106, 79, 0.08);">
                  ${getActivityCategoryIcon(act.name)}
                </div>
                <div class="activity-details">
                  <h5 class="activity-name-text">${act.name}</h5>
                  <div class="activity-timing-row">
                    <span class="timing-badge">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      ${timeFormatted}
                    </span>
                    ${act.duration ? `<span class="timing-dot">•</span><span>${act.duration}</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="activity-card-right">
                ${costHtml}
              </div>
            </div>
          `;
        });
        activitiesListHtml += `</div>`;
      }

      daysHtml += `
        <div class="day-timeline-section">
          <div class="day-section-header">
            <div class="day-header-left">
              <span class="day-badge-num">Day ${currentDayNumber}</span>
              <span class="day-header-date">${formatDateFullWithWeekday(dateISO)}</span>
            </div>
            <span class="day-activities-count">${dayActivities.length} ${dayActivities.length === 1 ? 'activity' : 'activities'}</span>
          </div>
          ${activitiesListHtml}
        </div>
      `;
    });

    card.innerHTML = `
      <div class="city-section-header" style="background-image: url('${stop.image}');">
        <div class="city-header-gradient"></div>
        <div class="city-header-content">
          <div class="city-header-left">
            <span class="city-order-badge">Stop ${String(stopIndex + 1).padStart(2, '0')}</span>
            <h3 class="city-name-title">${stop.city}</h3>
            <span class="city-country-title">${stop.country}</span>
          </div>
          <div class="city-header-right">
            <span class="city-meta-pill">
              <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              ${formatDateShort(stop.startDate)} – ${formatDateShort(stop.endDate)}
            </span>
            <span class="city-meta-pill">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${stopDays} ${stopDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>
      </div>
      <div class="city-days-container">
        ${daysHtml}
      </div>
    `;
    list.appendChild(card);

    if (stopIndex < activeTrip.stops.length - 1) {
      const mode = stop.transportToNext || "Train";
      const nextStop = activeTrip.stops[stopIndex + 1];
      const connector = document.createElement("div");
      connector.className = "city-transition-connector";
      connector.innerHTML = `
        <div class="transition-mode-badge">
          ${getTransportIconSvg(mode)}
          <span>${mode} to ${nextStop.city}</span>
          <span class="transition-arrow">&rarr;</span>
        </div>
      `;
      list.appendChild(connector);
    }
  });
}

/**
 * Calendar month grid
 */
function renderCalendarView() {
  const legend = document.getElementById("calendarCityLegend");
  const grid = document.getElementById("calendarDaysGrid");
  const monthLabel = document.getElementById("calCurrentMonthLabel");

  legend.innerHTML = "";
  grid.innerHTML = "";

  if (!activeTrip.stops) return;

  activeTrip.stops.forEach(stop => {
    const col = cityColorMap[stop.city] || 'var(--primary)';
    const item = document.createElement("div");
    item.className = "legend-chip";
    item.innerHTML = `<span class="legend-dot" style="background-color: ${col};"></span><span>${stop.city}</span>`;
    legend.appendChild(item);
  });

  const year = calendarCurrentDate.getFullYear();
  const month = calendarCurrentDate.getMonth();
  const mNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthLabel.textContent = `${mNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const startingDow = firstDay.getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthTotal = new Date(year, month, 0).getDate();

  // Trail prev month
  for (let i = startingDow - 1; i >= 0; i--) {
    const num = prevMonthTotal - i;
    const cell = buildCalendarCell(new Date(year, month - 1, num), num, true);
    grid.appendChild(cell);
  }

  // Active month
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const cell = buildCalendarCell(new Date(year, month, d), d, false);
    grid.appendChild(cell);
  }

  // Lead next month
  const cellCount = startingDow + totalDaysInMonth;
  const rem = cellCount % 7 === 0 ? 0 : 7 - (cellCount % 7);
  for (let next = 1; next <= rem; next++) {
    const cell = buildCalendarCell(new Date(year, month + 1, next), next, true);
    grid.appendChild(cell);
  }
}

function buildCalendarCell(dateObj, dayNum, isOther) {
  const dateISO = dateObj.toISOString().split('T')[0];
  const cell = document.createElement("div");
  cell.className = `cal-day-cell ${isOther ? 'other-month' : ''}`;

  const today = new Date();
  if (dateObj.toDateString() === today.toDateString()) cell.classList.add("today");

  const matchingStops = activeTrip.stops.filter(s => dateISO >= s.startDate && dateISO <= s.endDate);
  const isTripDay = matchingStops.length > 0;
  let cellActivities = [];

  if (isTripDay) {
    cell.classList.add("is-trip-day");
    const primary = matchingStops[0];
    const col = cityColorMap[primary.city] || 'var(--primary)';
    cell.style.setProperty('--city-color', col);

    matchingStops.forEach(s => {
      if (s.activities) {
        const matching = s.activities.filter(a => a.date === dateISO);
        matching.forEach(a => {
          cellActivities.push({
            ...a,
            city: s.city,
            cityColor: cityColorMap[s.city] || 'var(--primary)'
          });
        });
      }
    });
    cellActivities.sort((a,b) => (a.time || "").localeCompare(b.time || ""));
  }

  let tagHtml = isTripDay && matchingStops[0] ? `<span class="cal-city-tag" style="background-color: ${cell.style.getPropertyValue('--city-color')};">${matchingStops[0].city}</span>` : "";
  
  let actsHtml = "";
  if (cellActivities.length > 0) {
    actsHtml = `<div class="cal-activities-list">`;
    cellActivities.slice(0, 2).forEach(act => {
      const t = act.time ? formatTime(act.time) : "";
      actsHtml += `
        <div class="cal-activity-chip" style="--city-color: ${act.cityColor};">
          ${t ? `<span class="cal-activity-time">${t}</span>` : ''}
          <span>${act.name}</span>
        </div>
      `;
    });
    if (cellActivities.length > 2) {
      actsHtml += `<span class="cal-more-chip">+${cellActivities.length - 2} more</span>`;
    }
    actsHtml += `</div>`;
  }

  cell.innerHTML = `
    <div class="cal-day-header">
      <span class="cal-day-number">${dayNum}</span>
      ${tagHtml}
    </div>
    ${actsHtml}
  `;

  if (isTripDay || cellActivities.length > 0) {
    cell.onclick = () => {
      const stop = matchingStops[0] || { city: activeTrip.destination, country: "" };
      let journeyDayNum = 1;
      if (new Date(dateISO) >= new Date(activeTrip.startDate)) {
        journeyDayNum = Math.round((new Date(dateISO) - new Date(activeTrip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
      }
      openDayInspector(dateISO, stop, cellActivities, journeyDayNum);
    };
  }

  return cell;
}

/**
 * Calendar Nav month offsets
 */
function navigateCalendarMonth(delta) {
  calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + delta);
  renderCalendarView();
}

function jumpToTripStartMonth() {
  if (activeTrip && activeTrip.startDate) {
    calendarCurrentDate = new Date(activeTrip.startDate);
    renderCalendarView();
  }
}

/**
 * View Switcher Timeline / Calendar
 */
function switchItineraryView(mode) {
  currentView = mode;
  const tabList = document.getElementById("tabListView");
  const tabCalendar = document.getElementById("tabCalendarView");
  const listContainer = document.getElementById("listViewContainer");
  const calendarContainer = document.getElementById("calendarViewContainer");
  const calendarNavControls = document.getElementById("calendarNavControls");

  if (mode === 'list') {
    tabList.classList.add("active");
    tabList.setAttribute("aria-selected", "true");
    tabCalendar.classList.remove("active");
    tabCalendar.setAttribute("aria-selected", "false");
    listContainer.style.display = "block";
    calendarContainer.style.display = "none";
    calendarNavControls.style.display = "none";
  } else {
    tabCalendar.classList.add("active");
    tabCalendar.setAttribute("aria-selected", "true");
    tabList.classList.remove("active");
    tabList.setAttribute("aria-selected", "false");
    listContainer.style.display = "none";
    calendarContainer.style.display = "block";
    calendarNavControls.style.display = "flex";
    renderCalendarView();
  }
}

/**
 * Sidebar Index checklist
 */
function renderCitiesIndexSidebar() {
  const sidebar = document.getElementById("citiesIndexList");
  sidebar.innerHTML = "";

  if (!activeTrip.stops) return;

  activeTrip.stops.forEach(stop => {
    const a = document.createElement("a");
    a.className = "city-index-item";
    a.href = `#city-section-${stop.id}`;
    a.onclick = (e) => {
      e.preventDefault();
      if (currentView !== 'list') switchItineraryView('list');
      const el = document.getElementById(`city-section-${stop.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    a.innerHTML = `
      <div class="city-index-left">
        <img src="${stop.image}" alt="${stop.city}" class="city-index-thumb">
        <span class="city-index-name">${stop.city}</span>
      </div>
      <span class="city-index-dates">${formatDateShort(stop.startDate)} – ${formatDateShort(stop.endDate)}</span>
    `;
    sidebar.appendChild(a);
  });
}

/**
 * Day Inspector dialog
 */
function openDayInspector(dateISO, stop, activities, dayNumber) {
  document.getElementById("inspectorDayPill").textContent = `Day ${dayNumber}`;
  document.getElementById("inspectorDateTitle").textContent = formatDateFullWithWeekday(dateISO);
  document.getElementById("inspectorCityName").textContent = `${stop.city}${stop.country ? ', ' + stop.country : ''}`;

  const container = document.getElementById("inspectorActivitiesList");
  container.innerHTML = "";

  if (activities.length === 0) {
    container.innerHTML = `
      <div class="empty-day-note" style="margin: 1rem 0;">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
        <span>Free exploration day!</span>
      </div>
    `;
  } else {
    activities.forEach(act => {
      const timeFormatted = act.time ? formatTime(act.time) : "Flexible Time";
      const costVal = parseFloat(act.cost);
      const hasCost = !isNaN(costVal) && costVal > 0;
      
      const costHtml = activeTrip.isBudgetPublic
        ? (hasCost ? `<span class="activity-cost-pill">$${costVal.toFixed(0)}</span>` : `<span class="activity-free-pill">Free</span>`)
        : "";

      const card = document.createElement("div");
      card.className = "activity-view-card";
      card.innerHTML = `
        <div class="activity-card-left">
          <div class="activity-category-icon" style="color: ${act.cityColor || 'var(--primary)'};">
            ${getActivityCategoryIcon(act.name)}
          </div>
          <div class="activity-details">
            <h5 class="activity-name-text">${act.name}</h5>
            <div class="activity-timing-row">
              <span class="timing-badge">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${timeFormatted}
              </span>
              ${act.duration ? `<span class="timing-dot">•</span><span>${act.duration}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="activity-card-right">${costHtml}</div>
      `;
      container.appendChild(card);
    });
  }

  document.getElementById("dayInspectorModal").classList.add("visible");
}

function closeDayInspector() {
  document.getElementById("dayInspectorModal").classList.remove("visible");
}

function closeDayInspectorOnBackdrop(event) {
  if (event.target === document.getElementById("dayInspectorModal")) {
    closeDayInspector();
  }
}

/**
 * Clipboard action
 */
function copyPublicShareLink() {
  const shareInput = document.getElementById("publicShareUrlInput");
  shareInput.select();
  shareInput.setSelectionRange(0, 99999); // Mobile
  
  const finishCopy = () => {
    showToast("Link copied!", "success");
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareInput.value).then(finishCopy).catch(() => {
      document.execCommand('copy');
      finishCopy();
    });
  } else {
    document.execCommand('copy');
    finishCopy();
  }
}

/**
 * Social web intent share links helper
 */
function shareOnSocial(platform) {
  const shareUrl = window.location.href;
  const title = `Check out my travel plan for ${activeTrip.destination} on GlobalTrotters!`;

  switch(platform) {
    case 'whatsapp':
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`, '_blank');
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      break;
    case 'email':
      window.location.href = `mailto:?subject=${encodeURIComponent(activeTrip.destination + ' Itinerary')}&body=${encodeURIComponent(title + '\n\n' + shareUrl)}`;
      break;
    case 'native':
      if (navigator.share) {
        navigator.share({
          title: activeTrip.destination,
          text: title,
          url: shareUrl
        }).catch(err => console.log('Native share failed', err));
      }
      break;
  }
}

/**
 * Date / Time Utility functions
 */
function formatDateShort(dateString) {
  const options = { month: "short", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

function formatDateLong(dateString) {
  const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

function formatDateFullWithWeekday(dateString) {
  const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

function formatTime(timeString) {
  if (!timeString) return "";
  const parts = timeString.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  return `${hours}:${minutes} ${ampm}`;
}

function handleLogout() {
  localStorage.removeItem("globaltrotter_userId");
  showToast("Logging out...", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

/**
 * Renders list grid browse cards of all public trips
 */
function renderPublicDirectory() {
  const dirSection = document.getElementById("publicDirectorySection");
  const dirGrid = document.getElementById("publicDirectoryGrid");
  const emptyDir = document.getElementById("emptyDirectoryState");

  dirSection.style.display = "block";
  dirGrid.innerHTML = "";
  emptyDir.style.display = "none";

  // Filter public trips
  const publicTrips = allTrips.filter(t => t.isPublic === true);

  if (publicTrips.length === 0) {
    emptyDir.style.display = "flex";
    return;
  }

  publicTrips.forEach(trip => {
    const card = document.createElement("article");
    card.className = "trip-card";
    
    const citiesCount = trip.stops ? trip.stops.length : 0;
    const activitiesCount = trip.stops ? trip.stops.reduce((sum, s) => sum + (s.activities ? s.activities.length : 0), 0) : 0;
    const bannerUrl = trip.banner || (trip.stops && trip.stops[0] && trip.stops[0].image) || "assets/dashboard_hero.png";
    const startStr = formatDateShort(trip.startDate);
    const endStr = formatDateShort(trip.endDate);

    card.innerHTML = `
      <div class="trip-card-banner">
        <img src="${bannerUrl}" alt="Scenic banner for ${trip.destination}" class="trip-banner-img">
        <span class="trip-status-badge" style="background-color: var(--primary);">Shared</span>
      </div>
      <div class="trip-card-body">
        <h4 class="trip-destination" style="margin-bottom: 8px;">${trip.destination}</h4>
        <div class="trip-dates" style="font-size: 0.82rem; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
          <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; stroke: currentColor; stroke-width: 2.2; fill: none;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${startStr} - ${endStr}
        </div>
        
        <div class="trip-details-grid" style="display: flex; gap: 15px; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 15px;">
          <div class="trip-detail-item" style="display: flex; align-items: center; gap: 6px;">
            <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; stroke: currentColor; stroke-width: 2.2; fill: none;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            ${citiesCount} ${citiesCount === 1 ? 'City' : 'Cities'}
          </div>
          <div class="trip-detail-item" style="display: flex; align-items: center; gap: 6px;">
            <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; stroke: currentColor; stroke-width: 2.2; fill: none;"><polygon points="12 2 2 7 12 12 22 7 12 2 12 12 22 17 12 22 2 17 12 12"/></svg>
            ${activitiesCount} ${activitiesCount === 1 ? 'Activity' : 'Activities'}
          </div>
        </div>

        <button class="btn-view-trip" style="width: 100%; border: none; font-family: var(--font-brand); font-weight: 700; background-color: var(--primary); color: white; padding: 10px; border-radius: var(--radius-sm); cursor: pointer;" onclick="window.location.href='shared-itinerary.html?tripId=${trip.id}'">Explore Itinerary</button>
      </div>
    `;
    dirGrid.appendChild(card);
  });
}
