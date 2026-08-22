// Global State for the active Trip
let activeTrip = null;
let allTrips = [];
let dragSourceElement = null;

// City Suggestions Database
const popularCities = [
  { city: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80" },
  { city: "Amsterdam", country: "Netherlands", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80" },
  { city: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80" },
  { city: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80" },
  { city: "Hakone", country: "Japan", image: "https://images.unsplash.com/photo-1509009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80" },
  { city: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80" },
  { city: "London", country: "United Kingdom", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80" },
  { city: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=400&q=80" },
  { city: "New York", country: "United States", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80" },
  { city: "Venice", country: "Italy", image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=400&q=80" },
  { city: "Sydney", country: "Australia", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80" }
];

// Unsplash fallback pool for random cities
const fallbackCityImages = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
];

// Document Load Event
document.addEventListener("DOMContentLoaded", () => {
  loadTripItinerary();
});

/**
 * Parses query parameters and loads trip data
 */
function loadTripItinerary() {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('tripId');
  
  const skeleton = document.getElementById("skeletonLoader");
  const content = document.getElementById("itineraryContent");
  const error = document.getElementById("errorState");

  if (!tripId) {
    showError("No Trip Specified", "Please navigate to this screen by selecting a trip card on the dashboard.");
    return;
  }

  // Retrieve Trips list
  const stored = localStorage.getItem('globaltrotter_trips');
  if (stored) {
    allTrips = JSON.parse(stored);
    activeTrip = allTrips.find(t => t.id === tripId);
  }

  if (!activeTrip) {
    showError("Trip Not Found", `We couldn't locate a trip with the ID "${tripId}" in your local storage.`);
    return;
  }

  // Ensure stops structure is initialized
  if (!activeTrip.stops) {
    activeTrip.stops = [];
  }

  // Rewrite Explore & Activities sidebar links to preserve active trip context
  const exploreLink = document.getElementById("exploreSidebarLink");
  if (exploreLink) {
    exploreLink.href = `explore.html?tripId=${activeTrip.id}`;
  }
  const activitiesLink = document.getElementById("activitiesSidebarLink");
  if (activitiesLink) {
    activitiesLink.href = `activities.html?tripId=${activeTrip.id}`;
  }

  // Simulate premium network delay with skeleton loaders
  skeleton.style.display = "block";
  content.style.display = "none";
  error.style.display = "none";

  setTimeout(() => {
    skeleton.style.display = "none";
    content.style.display = "block";
    
    // Render UI panels
    renderTripInfo();
    renderTimeline();
    renderDayByDay();
    renderRouteFlow();
  }, 750);
}

/**
 * Displays error states
 */
function showError(title, message) {
  document.getElementById("skeletonLoader").style.display = "none";
  document.getElementById("itineraryContent").style.display = "none";
  
  const errorPanel = document.getElementById("errorState");
  errorPanel.style.display = "flex";
  errorPanel.querySelector(".error-title").textContent = title;
  document.getElementById("errorMessage").textContent = message;
}

/**
 * Display Trip meta details in page headers
 */
function renderTripInfo() {
  document.getElementById("tripName").textContent = activeTrip.destination;
  
  const startStr = formatDateLong(activeTrip.startDate);
  const endStr = formatDateLong(activeTrip.endDate);
  document.getElementById("tripDates").querySelector("span").textContent = `${startStr} – ${endStr}`;
  
  const stopsCount = activeTrip.stops.length;
  document.getElementById("tripStopsCount").querySelector("span").textContent = `${stopsCount} ${stopsCount === 1 ? 'stop' : 'stops'}`;
  
  // Calculate total duration in days
  const daysDiff = dateDifferenceInDays(activeTrip.startDate, activeTrip.endDate) + 1;
  document.getElementById("tripDuration").querySelector("span").textContent = `${daysDiff} ${daysDiff === 1 ? 'day' : 'days'} total`;
}

/**
 * Render Connected Timeline Stops List
 */
function renderTimeline() {
  const container = document.getElementById("stopsTimelineContainer");
  const emptyState = document.getElementById("emptyItineraryState");
  
  container.innerHTML = "";

  if (activeTrip.stops.length === 0) {
    emptyState.style.display = "flex";
    return;
  }
  
  emptyState.style.display = "none";

  activeTrip.stops.forEach((stop, index) => {
    // Determine timeline sequence number
    const stopNum = String(index + 1).padStart(2, '0');
    const stopDuration = dateDifferenceInDays(stop.startDate, stop.endDate) + 1;
    const activitiesCount = stop.activities ? stop.activities.length : 0;
    
    const wrapper = document.createElement("div");
    wrapper.className = "stop-card-wrapper";
    wrapper.id = `wrapper-${stop.id}`;
    
    // Add drag-and-drop properties
    wrapper.setAttribute("draggable", "true");
    setupDragAndDropEvents(wrapper, index);

    // Swap buttons status
    const isFirst = index === 0;
    const isLast = index === activeTrip.stops.length - 1;

    wrapper.innerHTML = `
      <div class="timeline-node-number">${stopNum}</div>
      
      <!-- Order Swapping triggers (visible on mobile where dragging is difficult) -->
      <div class="stop-card-order-controls">
        <button class="btn-order-swap" onclick="swapStopPosition(${index}, ${index - 1})" ${isFirst ? 'disabled' : ''} aria-label="Move stop up">
          <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button class="btn-order-swap" onclick="swapStopPosition(${index}, ${index + 1})" ${isLast ? 'disabled' : ''} aria-label="Move stop down">
          <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

      <article class="stop-card">
        <div class="stop-card-main-content">
          <div class="stop-card-image-box">
            <img src="${stop.image}" alt="${stop.city}" class="stop-card-img">
            <div class="stop-card-image-overlay"></div>
            <span class="stop-duration-badge">${stopDuration} ${stopDuration === 1 ? 'day' : 'days'}</span>
          </div>
          
          <div class="stop-card-details-box">
            <div class="stop-card-title-row">
              <div>
                <h4 class="stop-city-name">${stop.city}</h4>
                <span class="stop-country-name">${stop.country}</span>
              </div>
              
              <div class="stop-card-dates">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${formatDateShort(stop.startDate)} – ${formatDateShort(stop.endDate)}
              </div>
            </div>

            <div class="stop-card-stats">
              <div class="stop-stat-item">
                <svg viewBox="0 0 24 24"><polyline points="12 2 2 7 12 12 22 7 12 2 12 12 22 17 12 22 2 17 12 12"/></svg>
                ${activitiesCount} ${activitiesCount === 1 ? 'Activity' : 'Activities'}
              </div>
            </div>

            <div class="stop-card-actions">
              <div class="stop-actions-left">
                <button class="btn-card-action" onclick="openEditStopModal('${stop.id}')">
                  <svg viewBox="0 0 24 24"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/></svg>
                  Edit Dates
                </button>
                <button class="btn-card-action btn-card-delete" onclick="confirmDeleteStop('${stop.id}', '${stop.city}')">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Delete
                </button>
              </div>
              
              <a href="activities.html?tripId=${activeTrip.id}&stopId=${stop.id}" class="btn-card-action btn-card-accent" style="color: var(--accent); font-weight: 700; border-color: var(--accent); background: var(--accent-glow);">
                <svg viewBox="0 0 24 24" style="stroke: var(--accent); stroke-width: 2.5;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Discover
              </a>
              <button class="btn-card-action btn-card-primary" onclick="openAddActivityModal('${stop.id}')">
                <svg viewBox="0 0 24 24" style="stroke-width:2.5;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Activity
              </button>
            </div>
          </div>
        </div>

        <!-- Render activities assigned to this stop -->
        ${renderStopActivities(stop)}
      </article>
    `;

    container.appendChild(wrapper);

    // Append Travel Transport connector line between stop nodes
    if (index < activeTrip.stops.length - 1) {
      const nextStop = activeTrip.stops[index + 1];
      const transportType = stop.transportToNext || "Train";
      
      const connector = document.createElement("div");
      connector.className = "transport-connector-wrapper";
      connector.innerHTML = `
        <div class="transport-badge" onclick="cycleTransportMode(${index})" title="Click to change transport mode">
          ${getTransportIcon(transportType)}
          <span>${transportType} to ${nextStop.city}</span>
        </div>
      `;
      container.appendChild(connector);
    }
  });
}

/**
 * Compiles inner activities lists for a specific stop card
 */
function renderStopActivities(stop) {
  if (!stop.activities || stop.activities.length === 0) {
    return "";
  }

  // Sort activities chronologically by date then time
  const sorted = [...stop.activities].sort((a, b) => {
    const dComp = new Date(a.date) - new Date(b.date);
    if (dComp !== 0) return dComp;
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  let activitiesHTML = `<div class="stop-card-activities-list">
    <div class="stop-activities-header-label">Planned Schedule</div>`;
  
  sorted.forEach(act => {
    const timeFormatted = act.time ? formatTime(act.time) : "All Day";
    const durationText = act.duration ? act.duration : "";
    const costText = act.cost && act.cost > 0 ? `$${act.cost}` : "";

    activitiesHTML += `
      <div class="activity-item-row" id="act-${act.id}">
        <div class="activity-item-info">
          <div class="activity-item-title">${act.name}</div>
          <div class="activity-item-meta">
            <span>${formatDateShort(act.date)}</span>
            <span class="activity-meta-dot">•</span>
            <span>${timeFormatted}</span>
            ${durationText ? `<span class="activity-meta-dot">•</span><span>${durationText}</span>` : ''}
            ${costText ? `<span class="activity-meta-dot">•</span><span class="activity-cost-badge">${costText}</span>` : ''}
          </div>
        </div>
        <div class="activity-actions-row">
          <button class="btn-activity-action" onclick="openEditActivityModal('${stop.id}', '${act.id}')" title="Edit activity">
            <svg viewBox="0 0 24 24"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/></svg>
          </button>
          <button class="btn-activity-action btn-activity-delete" onclick="deleteActivity('${stop.id}', '${act.id}')" title="Delete activity">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  });

  activitiesHTML += `</div>`;
  return activitiesHTML;
}

/**
 * Render Day-by-Day View in sidebar
 */
function renderDayByDay() {
  const container = document.getElementById("dayByDayContainer");
  const badge = document.getElementById("daysBadge");
  container.innerHTML = "";

  const totalDays = dateDifferenceInDays(activeTrip.startDate, activeTrip.endDate) + 1;
  badge.textContent = `${totalDays} ${totalDays === 1 ? 'Day' : 'Days'}`;

  // Generate date array
  const dates = [];
  let current = new Date(activeTrip.startDate);
  const end = new Date(activeTrip.endDate);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Pre-calculate stops mapping per day
  dates.forEach((dateObj, idx) => {
    const dateISO = dateObj.toISOString().split('T')[0];
    const dayNum = idx + 1;
    
    // Find what stops are active on this date
    const stopsOnThisDay = activeTrip.stops.filter(stop => {
      return dateISO >= stop.startDate && dateISO <= stop.endDate;
    });

    // Extract activities scheduled for this date across active stops
    let activitiesOnThisDay = [];
    stopsOnThisDay.forEach(stop => {
      if (stop.activities) {
        const matching = stop.activities.filter(a => a.date === dateISO);
        matching.forEach(m => {
          activitiesOnThisDay.push({
            city: stop.city,
            ...m
          });
        });
      }
    });

    // Sort day activities by start time
    activitiesOnThisDay.sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

    const dayBlock = document.createElement("div");
    dayBlock.className = "day-unit-block";
    
    let locationLabel = "Travel Day";
    if (stopsOnThisDay.length > 0) {
      locationLabel = stopsOnThisDay.map(s => s.city).join(" &rarr; ");
    }

    let activitiesListHTML = "";
    if (activitiesOnThisDay.length > 0) {
      activitiesListHTML = `<div class="day-activities-list">`;
      activitiesOnThisDay.forEach(act => {
        const timeStr = act.time ? `[${formatTime(act.time)}] ` : "";
        activitiesListHTML += `
          <div class="day-activity-bullet">
            <strong>${act.city}:</strong> ${timeStr}${act.name}
          </div>
        `;
      });
      activitiesListHTML += `</div>`;
    } else {
      activitiesListHTML = `<div class="day-no-activities">No activities scheduled</div>`;
    }

    dayBlock.innerHTML = `
      <div class="day-unit-header">
        <span class="day-number-label">Day ${dayNum}</span>
        <span class="day-date-label">${formatDateMedium(dateISO)}</span>
      </div>
      <div class="day-stop-location">
        <svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>${locationLabel}</span>
      </div>
      ${activitiesListHTML}
    `;

    container.appendChild(dayBlock);
  });
}

/**
 * Renders simple Route map flows (e.g. Paris → Amsterdam → Rome)
 */
function renderRouteFlow() {
  const container = document.getElementById("routeSummaryFlow");
  if (activeTrip.stops.length === 0) {
    container.innerHTML = `<span style="font-style:italic; color:var(--text-muted); font-size:0.95rem;">No stops added to timeline yet</span>`;
    return;
  }

  const citiesList = activeTrip.stops.map(s => s.city);
  let html = "";
  citiesList.forEach((city, index) => {
    html += `<span>${city}</span>`;
    if (index < citiesList.length - 1) {
      html += `<span class="route-arrow">&rarr;</span>`;
    }
  });
  container.innerHTML = html;
}

/**
 * Autocomplete Input Search filtering
 */
function handleCityInput(val) {
  const suggestionsBox = document.getElementById("citySuggestions");
  suggestionsBox.innerHTML = "";

  const query = val.trim().toLowerCase();
  if (query.length === 0) {
    suggestionsBox.classList.remove("visible");
    return;
  }

  const filtered = popularCities.filter(c => 
    c.city.toLowerCase().includes(query) || 
    c.country.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    suggestionsBox.classList.remove("visible");
    return;
  }

  suggestionsBox.classList.add("visible");
  filtered.forEach(item => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = `${item.city}, ${item.country}`;
    div.onclick = () => {
      document.getElementById("stopCityInput").value = item.city;
      suggestionsBox.classList.remove("visible");
      // Store temporary values to select corresponding images
      document.getElementById("stopCityInput").dataset.country = item.country;
      document.getElementById("stopCityInput").dataset.image = item.image;
    };
    suggestionsBox.appendChild(div);
  });
}

// Close autocomplete suggestions lists on clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("#stopCityInput")) {
    document.getElementById("citySuggestions").classList.remove("visible");
  }
});

/**
 * Adds Stop form submission handler
 */
function handleAddStopSubmit(e) {
  e.preventDefault();
  
  const cityInput = document.getElementById("stopCityInput");
  const city = cityInput.value.trim();
  const startDate = document.getElementById("stopStartDate").value;
  const endDate = document.getElementById("stopEndDate").value;

  // Read meta datasets if populated from autocomplete
  let country = cityInput.dataset.country || "Travel Destination";
  let image = cityInput.dataset.image || "";

  if (!image) {
    // Lookup matching static suggestions if typed manually
    const match = popularCities.find(c => c.city.toLowerCase() === city.toLowerCase());
    if (match) {
      country = match.country;
      image = match.image;
    } else {
      // Pick random fallback banner
      country = "Travel Stop";
      image = fallbackCityImages[Math.floor(Math.random() * fallbackCityImages.length)];
    }
  }

  // Date range validation checks
  if (new Date(startDate) > new Date(endDate)) {
    showToast("Departure date must be after arrival date.", "error");
    return;
  }

  if (startDate < activeTrip.startDate || endDate > activeTrip.endDate) {
    showToast(`Stops must fall within overall trip dates: ${formatDateShort(activeTrip.startDate)} to ${formatDateShort(activeTrip.endDate)}.`, "error");
    return;
  }

  // Check date overlaps
  const overlap = activeTrip.stops.some(stop => {
    return (startDate <= stop.endDate && endDate >= stop.startDate);
  });

  if (overlap) {
    if (!confirm("This stop overlaps with an existing destination. Do you want to add it anyway?")) {
      return;
    }
  }

  const newStop = {
    id: `stop-${Date.now()}`,
    city: city,
    country: country,
    image: image,
    startDate: startDate,
    endDate: endDate,
    transportToNext: "Train",
    activities: []
  };

  // Add to stops and auto-sort chronologically by start date
  activeTrip.stops.push(newStop);
  activeTrip.stops.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  // Sync to database
  saveTripToLocalStorage();
  
  // Close and re-render
  closeAddStopModal();
  renderTripInfo();
  renderTimeline();
  renderDayByDay();
  renderRouteFlow();

  showToast(`Added ${city} to your itinerary!`, "success");
}

/**
 * Edit Stop Modal populator
 */
function openEditStopModal(stopId) {
  const stop = activeTrip.stops.find(s => s.id === stopId);
  if (!stop) return;

  document.getElementById("editStopId").value = stop.id;
  document.getElementById("editStopCityInput").value = `${stop.city}, ${stop.country}`;
  document.getElementById("editStopStartDate").value = stop.startDate;
  document.getElementById("editStopEndDate").value = stop.endDate;

  // Set min/max limitations
  document.getElementById("editStopStartDate").min = activeTrip.startDate;
  document.getElementById("editStopStartDate").max = activeTrip.endDate;
  document.getElementById("editStopEndDate").min = activeTrip.startDate;
  document.getElementById("editStopEndDate").max = activeTrip.endDate;

  document.getElementById("editStopModal").classList.add("visible");
}

function closeEditStopModal() {
  document.getElementById("editStopModal").classList.remove("visible");
  document.getElementById("editStopForm").reset();
}

/**
 * Edit Stop Form submits
 */
function handleEditStopSubmit(e) {
  e.preventDefault();
  
  const stopId = document.getElementById("editStopId").value;
  const startDate = document.getElementById("editStopStartDate").value;
  const endDate = document.getElementById("editStopEndDate").value;

  const stopIndex = activeTrip.stops.findIndex(s => s.id === stopId);
  if (stopIndex === -1) return;

  const stop = activeTrip.stops[stopIndex];

  // Date range validation checks
  if (new Date(startDate) > new Date(endDate)) {
    showToast("Departure date must be after arrival date.", "error");
    return;
  }

  if (startDate < activeTrip.startDate || endDate > activeTrip.endDate) {
    showToast(`Dates must fall within overall trip dates (${formatDateShort(activeTrip.startDate)} to ${formatDateShort(activeTrip.endDate)}).`, "error");
    return;
  }

  // Adjust activity dates that fall outside the new stop boundaries
  if (stop.activities) {
    stop.activities.forEach(act => {
      if (act.date < startDate) act.date = startDate;
      if (act.date > endDate) act.date = endDate;
    });
  }

  stop.startDate = startDate;
  stop.endDate = endDate;

  // Sort stops by date again
  activeTrip.stops.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  saveTripToLocalStorage();
  closeEditStopModal();
  
  renderTripInfo();
  renderTimeline();
  renderDayByDay();
  renderRouteFlow();

  showToast(`Updated schedule for ${stop.city}.`, "success");
}

/**
 * Delete Stop Confirmation workflow
 */
let stopIdToDelete = null;

function confirmDeleteStop(stopId, cityName) {
  stopIdToDelete = stopId;
  document.getElementById("deleteStopCityName").textContent = cityName;
  document.getElementById("deleteConfirmModal").classList.add("visible");
}

function closeDeleteConfirmModal() {
  document.getElementById("deleteConfirmModal").classList.remove("visible");
  stopIdToDelete = null;
}

// Bind confirmation button click trigger
document.getElementById("btnConfirmDeleteStop").addEventListener("click", () => {
  if (!stopIdToDelete) return;

  const stop = activeTrip.stops.find(s => s.id === stopIdToDelete);
  const cityName = stop ? stop.city : "City";

  // Filter out the selected stop
  activeTrip.stops = activeTrip.stops.filter(s => s.id !== stopIdToDelete);
  
  saveTripToLocalStorage();
  closeDeleteConfirmModal();
  
  renderTripInfo();
  renderTimeline();
  renderDayByDay();
  renderRouteFlow();

  showToast(`Deleted ${cityName} from itinerary.`, "success");
});

/**
 * Activities Management Actions
 */
function openAddActivityModal(stopId) {
  const stop = activeTrip.stops.find(s => s.id === stopId);
  if (!stop) return;

  document.getElementById("activityForm").reset();
  document.getElementById("activityStopId").value = stopId;
  document.getElementById("activityId").value = "";
  document.getElementById("activityModalTitle").textContent = `Add Activity for ${stop.city}`;
  document.getElementById("activitySubmitText").textContent = "Add Activity";

  // Restrict activity date calendar input picker values exactly to stop date ranges
  const dateInput = document.getElementById("activityDateSelect");
  dateInput.min = stop.startDate;
  dateInput.max = stop.endDate;
  dateInput.value = stop.startDate; // default value

  document.getElementById("activityModal").classList.add("visible");
}

function openEditActivityModal(stopId, actId) {
  const stop = activeTrip.stops.find(s => s.id === stopId);
  if (!stop) return;
  const act = stop.activities.find(a => a.id === actId);
  if (!act) return;

  document.getElementById("activityStopId").value = stopId;
  document.getElementById("activityId").value = actId;
  document.getElementById("activityModalTitle").textContent = `Edit Activity: ${act.name}`;
  document.getElementById("activitySubmitText").textContent = "Save Changes";

  document.getElementById("activityNameInput").value = act.name;
  
  const dateInput = document.getElementById("activityDateSelect");
  dateInput.min = stop.startDate;
  dateInput.max = stop.endDate;
  dateInput.value = act.date;

  document.getElementById("activityTimeInput").value = act.time || "";
  document.getElementById("activityDurationInput").value = act.duration || "";
  document.getElementById("activityCostInput").value = act.cost || "";

  document.getElementById("activityModal").classList.add("visible");
}

function closeActivityModal() {
  document.getElementById("activityModal").classList.remove("visible");
  document.getElementById("activityForm").reset();
}

/**
 * Submits Activity Forms
 */
function handleActivitySubmit(e) {
  e.preventDefault();

  const stopId = document.getElementById("activityStopId").value;
  const actId = document.getElementById("activityId").value;

  const stopIndex = activeTrip.stops.findIndex(s => s.id === stopId);
  if (stopIndex === -1) return;

  const stop = activeTrip.stops[stopIndex];
  
  const name = document.getElementById("activityNameInput").value.trim();
  const date = document.getElementById("activityDateSelect").value;
  const time = document.getElementById("activityTimeInput").value;
  const duration = document.getElementById("activityDurationInput").value.trim();
  const cost = parseFloat(document.getElementById("activityCostInput").value) || null;

  // Validate dates bounds
  if (date < stop.startDate || date > stop.endDate) {
    showToast(`Activity date must fall between ${formatDateShort(stop.startDate)} and ${formatDateShort(stop.endDate)}.`, "error");
    return;
  }

  if (actId === "") {
    // CREATE mode
    const newAct = {
      id: `act-${Date.now()}`,
      name: name,
      date: date,
      time: time,
      duration: duration,
      cost: cost
    };
    
    if (!stop.activities) stop.activities = [];
    stop.activities.push(newAct);
    showToast(`Added activity "${name}"`, "success");
  } else {
    // EDIT mode
    const actIndex = stop.activities.findIndex(a => a.id === actId);
    if (actIndex === -1) return;

    stop.activities[actIndex] = {
      id: actId,
      name: name,
      date: date,
      time: time,
      duration: duration,
      cost: cost
    };
    showToast(`Updated activity "${name}"`, "success");
  }

  saveTripToLocalStorage();
  closeActivityModal();
  
  renderTimeline();
  renderDayByDay();
}

/**
 * Delete Activity Item
 */
function deleteActivity(stopId, actId) {
  const stopIndex = activeTrip.stops.findIndex(s => s.id === stopId);
  if (stopIndex === -1) return;
  const stop = activeTrip.stops[stopIndex];

  if (!confirm("Remove this activity from your schedule?")) return;

  const act = stop.activities.find(a => a.id === actId);
  const name = act ? act.name : "Activity";

  stop.activities = stop.activities.filter(a => a.id !== actId);

  saveTripToLocalStorage();
  renderTimeline();
  renderDayByDay();

  showToast(`Removed "${name}" from schedule.`, "success");
}

/**
 * Cycle transportation modes between stop connectors
 */
function cycleTransportMode(index) {
  const stop = activeTrip.stops[index];
  const modes = ["Train", "Flight", "Bus", "Car"];
  const currentIdx = modes.indexOf(stop.transportToNext || "Train");
  
  // Pick next mode cycling
  const nextIdx = (currentIdx + 1) % modes.length;
  stop.transportToNext = modes[nextIdx];

  saveTripToLocalStorage();
  renderTimeline();
}

function getTransportIcon(mode) {
  switch (mode) {
    case "Flight":
      return `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
    case "Bus":
      return `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M3 13h18"/></svg>`;
    case "Car":
      return `<svg viewBox="0 0 24 24"><rect x="1" y="11" width="22" height="7" rx="2"/><path d="M5 11l1.5-4.5h11L19 11M6 18h12"/></svg>`;
    default: // Train
      return `<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="15" rx="2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/><path d="M4 10h16M7 18l-3 3M17 18l3 3"/></svg>`;
  }
}

/**
 * Swapping Stop indexes (accessible ordering on Mobile and buttons)
 */
function swapStopPosition(idx1, idx2) {
  if (idx1 < 0 || idx1 >= activeTrip.stops.length || idx2 < 0 || idx2 >= activeTrip.stops.length) return;

  const temp = activeTrip.stops[idx1];
  activeTrip.stops[idx1] = activeTrip.stops[idx2];
  activeTrip.stops[idx2] = temp;

  // recaculate dates sequentially starting from overall trip date to maintain logical flow
  recalculateStopDatesSequentially();

  saveTripToLocalStorage();
  
  renderTimeline();
  renderDayByDay();
  renderRouteFlow();

  showToast("Reordered destinations and adjusted dates sequentially.", "success");
}

/**
 * Sequential Stop Dates shifting on reordering
 * Starts from trip start date, keeping durations intact
 */
function recalculateStopDatesSequentially() {
  let nextStartDate = new Date(activeTrip.startDate);
  
  activeTrip.stops.forEach(stop => {
    // Keep duration of each stop
    const duration = dateDifferenceInDays(stop.startDate, stop.endDate);
    
    // Save previous dates to calculate activity offsets
    const oldStartStr = stop.startDate;
    const oldStartDate = new Date(oldStartStr);

    const newStartStr = nextStartDate.toISOString().split('T')[0];
    const nextEndDate = new Date(nextStartDate);
    nextEndDate.setDate(nextEndDate.getDate() + duration);
    const newEndStr = nextEndDate.toISOString().split('T')[0];

    // Shift activities by same day offset
    if (stop.activities) {
      const dayOffset = dateDifferenceInDays(oldStartStr, newStartStr);
      stop.activities.forEach(act => {
        const actDateObj = new Date(act.date);
        actDateObj.setDate(actDateObj.getDate() + dayOffset);
        act.date = actDateObj.toISOString().split('T')[0];
      });
    }

    stop.startDate = newStartStr;
    stop.endDate = newEndStr;

    // Next stop starts immediately after this stop ends
    nextStartDate = new Date(nextEndDate);
    nextStartDate.setDate(nextStartDate.getDate() + 1);
  });
}

/**
 * Save current active trip state to localStorage
 */
function saveTripToLocalStorage() {
  const index = allTrips.findIndex(t => t.id === activeTrip.id);
  if (index !== -1) {
    allTrips[index] = activeTrip;
    localStorage.setItem('globaltrotter_trips', JSON.stringify(allTrips));
  }
}

/**
 * Desktop HTML5 Drag and Drop events binders
 */
function setupDragAndDropEvents(element, index) {
  element.addEventListener('dragstart', (e) => {
    dragSourceElement = element;
    element.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  });

  element.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    element.classList.add('drag-over');
  });

  element.addEventListener('dragleave', () => {
    element.classList.remove('drag-over');
  });

  element.addEventListener('dragend', () => {
    element.classList.remove('dragging');
    const items = document.querySelectorAll('.stop-card-wrapper');
    items.forEach(item => item.classList.remove('drag-over'));
  });

  element.addEventListener('drop', (e) => {
    e.preventDefault();
    element.classList.remove('drag-over');
    
    const sourceIdx = parseInt(e.dataTransfer.getData('text/plain'));
    const targetIdx = index;

    if (sourceIdx !== targetIdx) {
      // Re-position element in array
      const stopToMove = activeTrip.stops[sourceIdx];
      activeTrip.stops.splice(sourceIdx, 1);
      activeTrip.stops.splice(targetIdx, 0, stopToMove);

      // Adjust date timelines
      recalculateStopDatesSequentially();
      saveTripToLocalStorage();
      
      renderTimeline();
      renderDayByDay();
      renderRouteFlow();

      showToast("Reordered destinations via drag and drop.", "success");
    }
  });
}

/**
 * Save Itinerary Button Click loading simulation
 */
function saveItineraryState() {
  const btn = document.getElementById("btnSaveItinerary");
  if (btn.classList.contains("loading")) return;

  btn.disabled = true;
  btn.classList.add("loading");

  setTimeout(() => {
    btn.classList.remove("loading");
    btn.classList.add("success");

    setTimeout(() => {
      btn.classList.remove("success");
      btn.disabled = false;
      showToast("All itinerary changes saved and synchronized!", "success");
    }, 700);

  }, 1200);
}

/**
 * Navigate to Itinerary View Screen
 */
function goToItineraryView(e) {
  if (e) e.preventDefault();
  if (activeTrip) {
    window.location.href = `itinerary-view.html?tripId=${activeTrip.id}`;
  } else {
    window.location.href = 'itinerary-view.html';
  }
}

/**
 * Helper Modals triggers
 */
function openAddStopModal() {
  document.getElementById("addStopForm").reset();
  const cityInput = document.getElementById("stopCityInput");
  delete cityInput.dataset.country;
  delete cityInput.dataset.image;
  
  // Set min/max limitations to match overall trip boundaries
  document.getElementById("stopStartDate").min = activeTrip.startDate;
  document.getElementById("stopStartDate").max = activeTrip.endDate;
  document.getElementById("stopEndDate").min = activeTrip.startDate;
  document.getElementById("stopEndDate").max = activeTrip.endDate;
  
  // Set defaults
  document.getElementById("stopStartDate").value = activeTrip.startDate;
  document.getElementById("stopEndDate").value = activeTrip.endDate;

  document.getElementById("addStopModal").classList.add("visible");
  document.getElementById("stopCityInput").focus();
}

function closeAddStopModal() {
  document.getElementById("addStopModal").classList.remove("visible");
  document.getElementById("addStopForm").reset();
}

function closeModalOnBackdrop(event, modalId) {
  if (event.target === document.getElementById(modalId)) {
    if (modalId === 'addStopModal') closeAddStopModal();
    else if (modalId === 'editStopModal') closeEditStopModal();
    else if (modalId === 'activityModal') closeActivityModal();
    else if (modalId === 'deleteConfirmModal') closeDeleteConfirmModal();
  }
}

/**
 * Search/Filters helper to scan activities inside timeline cards
 */
function handleSimulatedSearch(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const stopCards = document.querySelectorAll(".stop-card-wrapper");

  stopCards.forEach(cardWrapper => {
    const cityName = cardWrapper.querySelector(".stop-city-name").textContent.toLowerCase();
    const countryName = cardWrapper.querySelector(".stop-country-name").textContent.toLowerCase();
    
    // Check activities
    const activitiesRows = cardWrapper.querySelectorAll(".activity-item-row");
    let matchActivity = false;
    
    activitiesRows.forEach(row => {
      const actTitle = row.querySelector(".activity-item-title").textContent.toLowerCase();
      if (actTitle.includes(normalizedQuery)) {
        row.style.backgroundColor = "var(--primary-glow)";
        row.style.borderColor = "var(--primary-light)";
        matchActivity = true;
      } else {
        row.style.backgroundColor = "";
        row.style.borderColor = "";
      }
    });

    if (normalizedQuery === "") {
      activitiesRows.forEach(row => {
        row.style.backgroundColor = "";
        row.style.borderColor = "";
      });
      cardWrapper.style.display = "";
      return;
    }

    if (cityName.includes(normalizedQuery) || countryName.includes(normalizedQuery) || matchActivity) {
      cardWrapper.style.display = "";
    } else {
      cardWrapper.style.display = "none";
    }
  });
}

/**
 * Date / Time Formatting utilities
 */
function formatDateShort(dateString) {
  const options = { month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function formatDateMedium(dateString) {
  const options = { month: 'short', day: 'numeric', weekday: 'short' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function formatDateLong(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function formatTime(time24) {
  const [hrs, mins] = time24.split(":");
  let hrsNum = parseInt(hrs);
  const ampm = hrsNum >= 12 ? "PM" : "AM";
  hrsNum = hrsNum % 12;
  hrsNum = hrsNum ? hrsNum : 12; // 0 matches 12
  return `${hrsNum}:${mins} ${ampm}`;
}

function dateDifferenceInDays(startStr, endStr) {
  const oneDay = 24 * 60 * 60 * 1000;
  const start = new Date(startStr);
  const end = new Date(endStr);
  return Math.round(Math.abs((end - start) / oneDay));
}
