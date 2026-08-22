// State tracking variables
let activeTrip = null;
let allTrips = [];
let currentView = 'list'; // 'list' | 'calendar'
let calendarCurrentDate = new Date(); // Tracks month in calendar view

// Color palette assigned dynamically to cities for visual distinction
const CITY_COLORS = [
  '#2D6A4F', // Deep Sage Green
  '#D97706', // Warm Amber
  '#C2593F', // Terracotta
  '#40916C', // Forest Light
  '#2563EB', // Ocean Blue
  '#7C3AED', // Royal Purple
  '#0D9488'  // Teal
];
let cityColorMap = {};

// Activity Category Icons map helper
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
  if (name.includes('hotel') || name.includes('resort') || name.includes('check-in') || name.includes('stay') || name.includes('hyatt')) {
    return `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  }
  // Default Landmark / Adventure Icon
  return `<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2 12 12 22 17 12 22 2 17 12 12"/></svg>`;
}

// Transport Mode Icons helper
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
  initItineraryView();
});

/**
 * Initialize and load trip itinerary data
 */
function initItineraryView() {
  const urlParams = new URLSearchParams(window.location.search);
  let tripId = urlParams.get('tripId');

  const skeleton = document.getElementById("viewSkeletonLoader");
  const mainContent = document.getElementById("viewMainContent");
  const errorState = document.getElementById("viewErrorState");
  const emptyState = document.getElementById("viewEmptyState");

  // Load trips from LocalStorage
  const stored = localStorage.getItem('globaltrotter_trips');
  if (stored) {
    try {
      allTrips = JSON.parse(stored);
    } catch (e) {
      allTrips = [];
    }
  }

  // Fallback to first trip if none specified in query string
  if (!tripId && allTrips.length > 0) {
    tripId = allTrips[0].id;
  }

  if (!tripId) {
    showViewError("No Trip Selected", "Please select a trip from your dashboard to view its complete itinerary.");
    return;
  }

  activeTrip = allTrips.find(t => t.id === tripId);

  if (!activeTrip) {
    showViewError("Trip Not Found", `Could not find an itinerary for trip ID "${tripId}". Please return to My Trips.`);
    return;
  }

  // Ensure stops array exists
  if (!activeTrip.stops) {
    activeTrip.stops = [];
  }

  // Assign distinct colors to stops
  cityColorMap = {};
  activeTrip.stops.forEach((stop, index) => {
    cityColorMap[stop.city] = CITY_COLORS[index % CITY_COLORS.length];
  });

  // Set initial calendar date to trip start date
  if (activeTrip.startDate) {
    calendarCurrentDate = new Date(activeTrip.startDate);
    if (isNaN(calendarCurrentDate.getTime())) {
      calendarCurrentDate = new Date();
    }
  }

  // Display skeleton loading simulation
  skeleton.style.display = "flex";
  mainContent.style.display = "none";
  errorState.style.display = "none";
  emptyState.style.display = "none";

  setTimeout(() => {
    skeleton.style.display = "none";

    // If trip has 0 stops, show empty state
    if (activeTrip.stops.length === 0) {
      emptyState.style.display = "flex";
      document.getElementById("emptyBuildBtn").href = `itinerary.html?tripId=${activeTrip.id}`;
      return;
    }

    mainContent.style.display = "block";

    // Render all components
    renderHeader();
    renderTravelRouteFlow();
    renderListView();
    renderCalendarView();
    renderSummarySidebar();
  }, 650);
}

/**
 * Display Error view state
 */
function showViewError(title, message) {
  document.getElementById("viewSkeletonLoader").style.display = "none";
  document.getElementById("viewMainContent").style.display = "none";
  document.getElementById("viewEmptyState").style.display = "none";

  const errorState = document.getElementById("viewErrorState");
  errorState.style.display = "flex";
  document.getElementById("errorTitle").textContent = title;
  document.getElementById("errorMessage").textContent = message;
}

/**
 * Render Header details (Hero banner, title, metrics, actions)
 */
function renderHeader() {
  document.getElementById("tripHeroTitle").textContent = activeTrip.destination;
  
  // Status pill
  const statusPill = document.getElementById("tripStatusPill");
  statusPill.textContent = activeTrip.status || "Upcoming Trip";
  if (activeTrip.status === "Draft") {
    statusPill.style.backgroundColor = "var(--accent)";
  } else {
    statusPill.style.backgroundColor = "var(--primary)";
  }

  // Background cover banner
  const bannerUrl = activeTrip.banner || (activeTrip.stops[0] && activeTrip.stops[0].image) || "assets/dashboard_hero.png";
  const heroBg = document.getElementById("headerHeroBg");
  heroBg.style.backgroundImage = `url('${bannerUrl}')`;

  // Edit action links
  document.getElementById("btnEditItinerary").href = `itinerary.html?tripId=${activeTrip.id}`;
  document.getElementById("sidebarEditBtn").href = `itinerary.html?tripId=${activeTrip.id}`;

  // Rewrite Explore & Activities sidebar links to preserve active trip context
  const exploreLink = document.getElementById("exploreSidebarLink");
  if (exploreLink) {
    exploreLink.href = `explore.html?tripId=${activeTrip.id}`;
  }
  const activitiesLink = document.getElementById("activitiesSidebarLink");
  if (activitiesLink) {
    activitiesLink.href = `activities.html?tripId=${activeTrip.id}`;
  }

  // Metrics
  const startStr = formatDateShort(activeTrip.startDate);
  const endStr = formatDateLong(activeTrip.endDate);
  document.getElementById("metaTripDates").textContent = `${startStr} – ${endStr}`;

  const totalDays = dateDifferenceInDays(activeTrip.startDate, activeTrip.endDate) + 1;
  document.getElementById("metaTripDuration").textContent = `${totalDays} ${totalDays === 1 ? 'Day' : 'Days'}`;

  const citiesCount = activeTrip.stops.length;
  document.getElementById("metaTripCities").textContent = `${citiesCount} ${citiesCount === 1 ? 'City' : 'Cities'}`;

  const totalActivities = activeTrip.stops.reduce((sum, stop) => sum + (stop.activities ? stop.activities.length : 0), 0);
  document.getElementById("metaTripActivities").textContent = `${totalActivities} ${totalActivities === 1 ? 'Activity' : 'Activities'}`;

  // Total Activities Cost & Budget
  const totalActCost = activeTrip.stops.reduce((sum, stop) => {
    return sum + (stop.activities ? stop.activities.reduce((aSum, a) => aSum + (parseFloat(a.cost) || 0), 0) : 0);
  }, 0);

  const budgetVal = activeTrip.budget || (totalActCost > 0 ? totalActCost * 2 : 2500);
  document.getElementById("metaTripCost").textContent = `$${budgetVal.toLocaleString()}`;
}

/**
 * Render Travel Route Flow Bar (e.g. Paris → Amsterdam → Rome)
 */
function renderTravelRouteFlow() {
  const track = document.getElementById("routeFlowTrack");
  track.innerHTML = "";

  activeTrip.stops.forEach((stop, index) => {
    const duration = dateDifferenceInDays(stop.startDate, stop.endDate) + 1;
    
    // Stop node element
    const node = document.createElement("a");
    node.className = "route-stop-node";
    node.href = `#city-section-${stop.id}`;
    node.onclick = (e) => {
      e.preventDefault();
      // If currently on calendar view, switch to list view first
      if (currentView !== 'list') {
        switchItineraryView('list');
      }
      const el = document.getElementById(`city-section-${stop.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    node.innerHTML = `
      <img src="${stop.image}" alt="${stop.city}" class="route-node-thumb">
      <div class="route-node-info">
        <span class="route-node-city">${stop.city}</span>
        <span class="route-node-days">${duration} ${duration === 1 ? 'day' : 'days'}</span>
      </div>
    `;
    track.appendChild(node);

    // Connector arrow & transport mode
    if (index < activeTrip.stops.length - 1) {
      const nextStop = activeTrip.stops[index + 1];
      const transportType = stop.transportToNext || "Train";
      
      const connector = document.createElement("div");
      connector.className = "route-connector-item";
      connector.innerHTML = `
        <div class="route-connector-line"></div>
        <div class="route-transport-icon" title="${transportType} to ${nextStop.city}">
          ${getTransportIconSvg(transportType)}
        </div>
        <div class="route-connector-line"></div>
      `;
      track.appendChild(connector);
    }
  });
}

/**
 * Render List / Timeline View grouped by City and Day
 */
function renderListView() {
  const container = document.getElementById("cityTimelineList");
  container.innerHTML = "";

  // Track overall journey day counter across stops
  let journeyDayCounter = 1;

  activeTrip.stops.forEach((stop, stopIndex) => {
    const stopDuration = dateDifferenceInDays(stop.startDate, stop.endDate) + 1;
    const activitiesCount = stop.activities ? stop.activities.length : 0;
    const cityColor = cityColorMap[stop.city] || 'var(--primary)';

    // City Section Card
    const cityCard = document.createElement("article");
    cityCard.className = "city-section-card";
    cityCard.id = `city-section-${stop.id}`;

    // Generate day-by-day dates within this stop
    const stopDates = getDatesArray(stop.startDate, stop.endDate);

    let daysHtml = "";
    stopDates.forEach(dateObj => {
      const dateISO = dateObj.toISOString().split('T')[0];
      const currentDayNumber = journeyDayCounter++;

      // Filter activities for this date
      let dayActivities = [];
      if (stop.activities) {
        dayActivities = stop.activities.filter(act => act.date === dateISO);
        // Sort chronologically by start time
        dayActivities.sort((a, b) => {
          if (!a.time) return 1;
          if (!b.time) return -1;
          return a.time.localeCompare(b.time);
        });
      }

      let activitiesListHtml = "";
      if (dayActivities.length === 0) {
        activitiesListHtml = `
          <div class="empty-day-note">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
            <span>No specific activities scheduled for this day. Free time to explore ${stop.city}!</span>
          </div>
        `;
      } else {
        activitiesListHtml = `<div class="day-activities-grid">`;
        dayActivities.forEach(act => {
          const timeFormatted = act.time ? formatTime(act.time) : "Flexible Time";
          const durationStr = act.duration ? act.duration : "";
          const costVal = parseFloat(act.cost);
          const hasCost = !isNaN(costVal) && costVal > 0;

          activitiesListHtml += `
            <div class="activity-view-card" data-act-id="${act.id}" data-city="${stop.city}">
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
                    ${durationStr ? `<span class="timing-dot">•</span><span>${durationStr}</span>` : ''}
                  </div>
                </div>
              </div>

              <div class="activity-card-right">
                ${hasCost 
                  ? `<span class="activity-cost-pill">$${costVal.toFixed(0)}</span>` 
                  : `<span class="activity-free-pill">Free Entry</span>`
                }
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

    cityCard.innerHTML = `
      <!-- City Hero Header -->
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
              ${stopDuration} ${stopDuration === 1 ? 'Day' : 'Days'}
            </span>
            <span class="city-meta-pill">
              <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2 12 12 22 17 12 22 2 17 12 12"/></svg>
              ${activitiesCount} ${activitiesCount === 1 ? 'Activity' : 'Activities'}
            </span>
          </div>
        </div>
      </div>

      <!-- City Days Container -->
      <div class="city-days-container">
        ${daysHtml}
      </div>
    `;

    container.appendChild(cityCard);

    // If there is a next city, append travel transport connector
    if (stopIndex < activeTrip.stops.length - 1) {
      const nextStop = activeTrip.stops[stopIndex + 1];
      const transportType = stop.transportToNext || "Train";

      const transitionWrapper = document.createElement("div");
      transitionWrapper.className = "city-transition-connector";
      transitionWrapper.innerHTML = `
        <div class="transition-mode-badge">
          ${getTransportIconSvg(transportType)}
          <span>${transportType} to ${nextStop.city}</span>
          <span class="transition-arrow">&rarr;</span>
        </div>
      `;
      container.appendChild(transitionWrapper);
    }
  });
}

/**
 * Render Calendar View
 */
function renderCalendarView() {
  const legendContainer = document.getElementById("calendarCityLegend");
  const daysGrid = document.getElementById("calendarDaysGrid");
  const monthLabel = document.getElementById("calCurrentMonthLabel");

  legendContainer.innerHTML = "";
  daysGrid.innerHTML = "";

  // Render City Legends
  activeTrip.stops.forEach(stop => {
    const color = cityColorMap[stop.city] || 'var(--primary)';
    const chip = document.createElement("div");
    chip.className = "legend-chip";
    chip.innerHTML = `
      <span class="legend-dot" style="background-color: ${color};"></span>
      <span>${stop.city}</span>
    `;
    legendContainer.appendChild(chip);
  });

  const year = calendarCurrentDate.getFullYear();
  const month = calendarCurrentDate.getMonth();

  // Set month label
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthLabel.textContent = `${monthNames[month]} ${year}`;

  // First day of current month
  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // 1. Previous month trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const cell = createCalendarDayCell(prevDate, dayNum, true);
    daysGrid.appendChild(cell);
  }

  // 2. Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const cell = createCalendarDayCell(dateObj, day, false);
    daysGrid.appendChild(cell);
  }

  // 3. Next month leading days to complete the 7-column grid
  const totalRendered = startingDayOfWeek + daysInMonth;
  const remainingCells = (totalRendered % 7 === 0) ? 0 : 7 - (totalRendered % 7);
  for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
    const nextDate = new Date(year, month + 1, nextDay);
    const cell = createCalendarDayCell(nextDate, nextDay, true);
    daysGrid.appendChild(cell);
  }
}

/**
 * Creates individual calendar cell element
 */
function createCalendarDayCell(dateObj, dayNum, isOtherMonth) {
  const dateISO = dateObj.toISOString().split('T')[0];
  const cell = document.createElement("div");
  cell.className = `cal-day-cell ${isOtherMonth ? 'other-month' : ''}`;
  
  // Today's date check
  const today = new Date();
  if (dateObj.toDateString() === today.toDateString()) {
    cell.classList.add("today");
  }

  // Check if date falls in active trip stops
  const activeStops = activeTrip.stops.filter(stop => {
    return dateISO >= stop.startDate && dateISO <= stop.endDate;
  });

  const isTripDay = activeStops.length > 0;
  let matchingActivities = [];

  if (isTripDay) {
    cell.classList.add("is-trip-day");
    const primaryStop = activeStops[0];
    const cityColor = cityColorMap[primaryStop.city] || 'var(--primary)';
    cell.style.setProperty('--city-color', cityColor);

    activeStops.forEach(stop => {
      if (stop.activities) {
        const found = stop.activities.filter(a => a.date === dateISO);
        found.forEach(a => {
          matchingActivities.push({
            ...a,
            city: stop.city,
            cityColor: cityColorMap[stop.city] || 'var(--primary)'
          });
        });
      }
    });

    // Sort activities by time
    matchingActivities.sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  }

  // Build cell inner HTML
  let headerCityTag = "";
  if (isTripDay && activeStops[0]) {
    headerCityTag = `<span class="cal-city-tag" style="background-color: ${cell.style.getPropertyValue('--city-color')};">${activeStops[0].city}</span>`;
  }

  let activitiesHtml = "";
  if (matchingActivities.length > 0) {
    activitiesHtml = `<div class="cal-activities-list">`;
    const previewActivities = matchingActivities.slice(0, 2);
    previewActivities.forEach(act => {
      const timeStr = act.time ? formatTime(act.time) : "";
      activitiesHtml += `
        <div class="cal-activity-chip" style="--city-color: ${act.cityColor};" title="${act.name} (${timeStr})">
          ${timeStr ? `<span class="cal-activity-time">${timeStr}</span>` : ''}
          <span>${act.name}</span>
        </div>
      `;
    });

    if (matchingActivities.length > 2) {
      activitiesHtml += `<span class="cal-more-chip">+${matchingActivities.length - 2} more</span>`;
    }
    activitiesHtml += `</div>`;
  }

  cell.innerHTML = `
    <div class="cal-day-header">
      <span class="cal-day-number">${dayNum}</span>
      ${headerCityTag}
    </div>
    ${activitiesHtml}
  `;

  // Attach click to open inspector if it's a trip day or has activities
  if (isTripDay || matchingActivities.length > 0) {
    cell.onclick = () => {
      const primaryStop = activeStops[0] || { city: activeTrip.destination, country: "" };
      
      // Calculate journey day number
      let dayNumber = 1;
      const tripStartDate = new Date(activeTrip.startDate);
      const clickedDate = new Date(dateISO);
      if (clickedDate >= tripStartDate) {
        dayNumber = dateDifferenceInDays(activeTrip.startDate, dateISO) + 1;
      }

      openDayInspector(dateISO, primaryStop, matchingActivities, dayNumber);
    };
  }

  return cell;
}

/**
 * Switch between List View and Calendar View
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
 * Calendar Navigation: Next/Previous Month
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
 * Render Right Trip Summary Sidebar
 */
function renderSummarySidebar() {
  const totalDays = dateDifferenceInDays(activeTrip.startDate, activeTrip.endDate) + 1;
  const totalCities = activeTrip.stops.length;
  const totalActivities = activeTrip.stops.reduce((sum, stop) => sum + (stop.activities ? stop.activities.length : 0), 0);
  
  // Total cost
  const totalActCost = activeTrip.stops.reduce((sum, stop) => {
    return sum + (stop.activities ? stop.activities.reduce((aSum, a) => aSum + (parseFloat(a.cost) || 0), 0) : 0);
  }, 0);

  const budgetVal = activeTrip.budget || (totalActCost > 0 ? totalActCost * 2 : 2500);

  document.getElementById("summaryTotalDays").textContent = totalDays;
  document.getElementById("summaryTotalCities").textContent = totalCities;
  document.getElementById("summaryTotalActivities").textContent = totalActivities;
  document.getElementById("summaryEstimatedBudget").textContent = `$${budgetVal.toLocaleString()}`;

  // Budget Progress & Breakdown
  document.getElementById("budgetBreakdownAmount").textContent = `$${totalActCost.toLocaleString()} / $${budgetVal.toLocaleString()}`;
  let percent = budgetVal > 0 ? Math.min(100, Math.round((totalActCost / budgetVal) * 100)) : 0;
  document.getElementById("budgetProgressFill").style.width = `${percent}%`;
  document.getElementById("budgetNote").textContent = `Activity tickets represent ${percent}% of total estimated trip budget.`;

  // Render Destinations Quick Jump List
  const indexList = document.getElementById("citiesIndexList");
  indexList.innerHTML = "";

  activeTrip.stops.forEach(stop => {
    const item = document.createElement("a");
    item.className = "city-index-item";
    item.href = `#city-section-${stop.id}`;
    item.onclick = (e) => {
      e.preventDefault();
      if (currentView !== 'list') {
        switchItineraryView('list');
      }
      const el = document.getElementById(`city-section-${stop.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    item.innerHTML = `
      <div class="city-index-left">
        <img src="${stop.image}" alt="${stop.city}" class="city-index-thumb">
        <span class="city-index-name">${stop.city}</span>
      </div>
      <span class="city-index-dates">${formatDateShort(stop.startDate)} – ${formatDateShort(stop.endDate)}</span>
    `;
    indexList.appendChild(item);
  });
}

/**
 * Open Day Details Inspector Modal
 */
function openDayInspector(dateISO, stop, activities, dayNumber) {
  document.getElementById("inspectorDayPill").textContent = `Day ${dayNumber}`;
  document.getElementById("inspectorDateTitle").textContent = formatDateFullWithWeekday(dateISO);
  document.getElementById("inspectorCityName").textContent = `${stop.city}${stop.country ? ', ' + stop.country : ''}`;
  document.getElementById("inspectorEditDayBtn").href = `itinerary.html?tripId=${activeTrip.id}`;

  const list = document.getElementById("inspectorActivitiesList");
  list.innerHTML = "";

  if (!activities || activities.length === 0) {
    list.innerHTML = `
      <div class="empty-day-note" style="margin: 1rem 0;">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
        <span>No scheduled activities for this date. Free exploration time!</span>
      </div>
    `;
  } else {
    activities.forEach(act => {
      const timeFormatted = act.time ? formatTime(act.time) : "Flexible Time";
      const durationStr = act.duration ? act.duration : "";
      const costVal = parseFloat(act.cost);
      const hasCost = !isNaN(costVal) && costVal > 0;

      const row = document.createElement("div");
      row.className = "activity-view-card";
      row.innerHTML = `
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
              ${durationStr ? `<span class="timing-dot">•</span><span>${durationStr}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="activity-card-right">
          ${hasCost 
            ? `<span class="activity-cost-pill">$${costVal.toFixed(0)}</span>` 
            : `<span class="activity-free-pill">Free Entry</span>`
          }
        </div>
      `;
      list.appendChild(row);
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

function openShareModal() {
  const input = document.getElementById("shareLinkInput");
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace('itinerary-view.html', 'shared-itinerary.html');
  input.value = url.toString();

  // Populate checkbox settings
  document.getElementById("sharePublicToggle").checked = activeTrip.isPublic || false;
  document.getElementById("shareBudgetToggle").checked = activeTrip.isBudgetPublic || false;

  document.getElementById("shareModal").classList.add("visible");
}

function saveShareSettings() {
  if (!activeTrip) return;

  activeTrip.isPublic = document.getElementById("sharePublicToggle").checked;
  activeTrip.isBudgetPublic = document.getElementById("shareBudgetToggle").checked;

  // Save changes to state & localStorage
  const index = allTrips.findIndex(t => t.id === activeTrip.id);
  if (index !== -1) {
    allTrips[index] = activeTrip;
    localStorage.setItem('globaltrotter_trips', JSON.stringify(allTrips));
  }

  showToast("Sharing settings updated successfully!", "success");
}

function closeShareModal() {
  document.getElementById("shareModal").classList.remove("visible");
}

function closeShareModalOnBackdrop(event) {
  if (event.target === document.getElementById("shareModal")) {
    closeShareModal();
  }
}

function copyShareLink() {
  const input = document.getElementById("shareLinkInput");
  input.select();
  input.setSelectionRange(0, 99999); // Mobile
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(input.value).then(() => {
      showShareCopyFeedback();
    }).catch(() => {
      document.execCommand('copy');
      showShareCopyFeedback();
    });
  } else {
    document.execCommand('copy');
    showShareCopyFeedback();
  }
}

function showShareCopyFeedback() {
  const btn = document.getElementById("btnCopyShareLink");
  const origHtml = btn.innerHTML;
  btn.innerHTML = `<svg viewBox="0 0 24 24" style="stroke: #FFFFFF;"><polyline points="20 6 9 17 4 12"/></svg> <span>Copied!</span>`;
  btn.style.backgroundColor = "var(--primary-light)";
  
  showToast("Itinerary link copied to clipboard!", "success");

  setTimeout(() => {
    btn.innerHTML = origHtml;
    btn.style.backgroundColor = "";
  }, 2000);
}

function simulateSocialShare(platform) {
  showToast(`Itinerary shared via ${platform}!`, "success");
}

function triggerPrintExport() {
  window.print();
}

/**
 * Real-time Itinerary Search filter
 */
function handleItinerarySearch(query) {
  const normalized = query.toLowerCase().trim();
  const activityCards = document.querySelectorAll(".activity-view-card");
  const cityCards = document.querySelectorAll(".city-section-card");

  if (!normalized) {
    activityCards.forEach(c => {
      c.style.display = "flex";
      c.style.backgroundColor = "";
    });
    cityCards.forEach(c => c.style.display = "block");
    return;
  }

  cityCards.forEach(cityCard => {
    const cityName = cityCard.querySelector(".city-name-title") ? cityCard.querySelector(".city-name-title").textContent.toLowerCase() : "";
    const countryName = cityCard.querySelector(".city-country-title") ? cityCard.querySelector(".city-country-title").textContent.toLowerCase() : "";
    const activitiesInCity = cityCard.querySelectorAll(".activity-view-card");
    
    let anyActivityMatched = false;

    activitiesInCity.forEach(actCard => {
      const actTitle = actCard.querySelector(".activity-name-text") ? actCard.querySelector(".activity-name-text").textContent.toLowerCase() : "";
      if (actTitle.includes(normalized)) {
        actCard.style.display = "flex";
        actCard.style.backgroundColor = "var(--primary-glow)";
        anyActivityMatched = true;
      } else if (cityName.includes(normalized) || countryName.includes(normalized)) {
        actCard.style.display = "flex";
        actCard.style.backgroundColor = "";
        anyActivityMatched = true;
      } else {
        actCard.style.display = "none";
        actCard.style.backgroundColor = "";
      }
    });

    if (cityName.includes(normalized) || countryName.includes(normalized) || anyActivityMatched) {
      cityCard.style.display = "block";
    } else {
      cityCard.style.display = "none";
    }
  });
}

/**
 * Date / Time Formatting Helpers
 */
function formatDateShort(dateString) {
  if (!dateString) return "";
  const options = { month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function formatDateLong(dateString) {
  if (!dateString) return "";
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function formatDateFullWithWeekday(dateString) {
  if (!dateString) return "";
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function formatTime(time24) {
  if (!time24) return "";
  const parts = time24.split(":");
  if (parts.length < 2) return time24;
  let hrsNum = parseInt(parts[0], 10);
  const mins = parts[1];
  const ampm = hrsNum >= 12 ? "PM" : "AM";
  hrsNum = hrsNum % 12;
  hrsNum = hrsNum ? hrsNum : 12;
  return `${hrsNum}:${mins} ${ampm}`;
}

function dateDifferenceInDays(startStr, endStr) {
  if (!startStr || !endStr) return 0;
  const oneDay = 24 * 60 * 60 * 1000;
  const start = new Date(startStr);
  const end = new Date(endStr);
  return Math.round(Math.abs((end - start) / oneDay));
}

function getDatesArray(startStr, endStr) {
  const dates = [];
  let current = new Date(startStr);
  const end = new Date(endStr);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
