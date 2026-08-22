// State tracking variables
let trips = [];
let activeTrip = null;
let currentMonth = null; // 0-indexed (0 = Jan, 11 = Dec)
let currentYear = null;
let selectedDateStr = null; // "YYYY-MM-DD"
let currentViewMode = 'calendar'; // 'calendar' or 'timeline'
let expandedDays = []; // Array of dates ("YYYY-MM-DD") that are expanded in Timeline
let currentUserId = localStorage.getItem('globaltrotter_userId') || 'user-jay';

// Default mock trips matching the schema in dashboard.js & trips.js
const defaultTrips = [
  {
    id: "trip-tokyo",
    userId: "user-jay",
    destination: "Tokyo Exploration",
    startDate: "2026-10-12",
    endDate: "2026-10-22",
    citiesVal: 3,
    activitiesVal: 6,
    budget: 2800,
    status: "Upcoming",
    description: "Immersive exploration of Japan's bustling capital, historic shrines in Kyoto, and scenic hot springs in Hakone.",
    banner: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
    stops: [
      {
        id: "stop-tokyo-1",
        city: "Tokyo",
        country: "Japan",
        startDate: "2026-10-12",
        endDate: "2026-10-16",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80",
        activities: [
          { id: "act-tokyo-1", name: "Meiji Jingu Shrine Visit", date: "2026-10-13", time: "10:00", duration: "2 hours", cost: 0, category: "Sightseeing" },
          { id: "act-tokyo-2", name: "Shibuya Crossing Walk", date: "2026-10-13", time: "16:00", duration: "1 hour", cost: 0, category: "Sightseeing" },
          { id: "act-tokyo-3", name: "Dinner at Sukiyabashi Jiro", date: "2026-10-14", time: "19:30", duration: "2.5 hours", cost: 250, category: "Food" }
        ]
      },
      {
        id: "stop-tokyo-2",
        city: "Hakone",
        country: "Japan",
        startDate: "2026-10-16",
        endDate: "2026-10-18",
        image: "https://images.unsplash.com/photo-1509009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80",
        activities: [
          { id: "act-tokyo-4", name: "Lake Ashi Cruise", date: "2026-10-17", time: "11:00", duration: "1.5 hours", cost: 20, category: "Adventure" }
        ]
      },
      {
        id: "stop-tokyo-3",
        city: "Kyoto",
        country: "Japan",
        startDate: "2026-10-18",
        endDate: "2026-10-22",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
        activities: [
          { id: "act-tokyo-5", name: "Kinkaku-ji Golden Pavilion", date: "2026-10-19", time: "09:00", duration: "2 hours", cost: 5, category: "Culture" },
          { id: "act-tokyo-6", name: "Fushimi Inari Shrine Hike", date: "2026-10-20", time: "14:00", duration: "3 hours", cost: 0, category: "Adventure" }
        ]
      }
    ]
  },
  {
    id: "trip-paris",
    userId: "user-jay",
    destination: "Romantic Paris Gateway",
    startDate: "2026-12-05",
    endDate: "2026-12-10",
    citiesVal: 2,
    activitiesVal: 3,
    budget: 1450,
    status: "Draft",
    description: "A cultural getaway featuring art galleries in Paris and a relaxing canal cruise in Amsterdam.",
    banner: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
    stops: [
      {
        id: "stop-paris-1",
        city: "Paris",
        country: "France",
        startDate: "2026-12-05",
        endDate: "2026-12-08",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
        activities: [
          { id: "act-paris-1", name: "Eiffel Tower Visit", date: "2026-12-06", time: "10:00", duration: "2 hours", cost: 25, category: "Sightseeing" },
          { id: "act-paris-2", name: "Louvre Museum", date: "2026-12-07", time: "11:00", duration: "3 hours", cost: 22, category: "Culture" }
        ]
      },
      {
        id: "stop-paris-2",
        city: "Amsterdam",
        country: "Netherlands",
        startDate: "2026-12-08",
        endDate: "2026-12-10",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
        activities: [
          { id: "act-paris-3", name: "Canal Cruise", date: "2026-12-09", time: "15:00", duration: "1.5 hours", cost: 18, category: "Transport" }
        ]
      }
    ]
  }
];

// Month name lookup table
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Document Load Event
document.addEventListener("DOMContentLoaded", () => {
  initLocalStorage();
  loadTripCalendarData();
});

/**
 * Checks for localStorage data, sets defaults if empty
 */
function initLocalStorage() {
  const stored = localStorage.getItem('globaltrotter_trips');
  if (!stored) {
    localStorage.setItem('globaltrotter_trips', JSON.stringify(defaultTrips));
    trips = [...defaultTrips];
  } else {
    try {
      trips = JSON.parse(stored);
    } catch (e) {
      console.error("Corrupted local storage data. Re-initializing...", e);
      localStorage.setItem('globaltrotter_trips', JSON.stringify(defaultTrips));
      trips = [...defaultTrips];
    }
  }
}

/**
 * Simulated fetching trips list with premium skeleton loading animations
 */
function loadTripCalendarData() {
  const skeleton = document.getElementById('skeletonContainer');
  const workspace = document.getElementById('calendarWorkspace');
  const empty = document.getElementById('emptyCalendarState');
  const errorPanel = document.getElementById('errorState');

  skeleton.style.display = 'grid';
  workspace.style.display = 'none';
  empty.style.display = 'none';
  errorPanel.style.display = 'none';

  setTimeout(() => {
    try {
      // Re-read storage
      const stored = localStorage.getItem('globaltrotter_trips');
      trips = JSON.parse(stored || '[]');
      trips = trips.filter(t => !t.userId || t.userId === currentUserId);

      if (trips.length === 0) {
        skeleton.style.display = 'none';
        empty.style.display = 'flex';
        return;
      }

      // Determine active trip ID from query parameters or default to first trip
      const urlParams = new URLSearchParams(window.location.search);
      let tripId = urlParams.get('tripId');
      
      activeTrip = trips.find(t => t.id === tripId);
      if (!activeTrip) {
        activeTrip = trips[0];
      }

      // Initialize calendar view to start month of trip
      if (activeTrip.startDate) {
        const start = new Date(activeTrip.startDate);
        currentMonth = start.getMonth();
        currentYear = start.getFullYear();
        selectedDateStr = activeTrip.startDate;
      } else {
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
      }

      // Initialize expanded days list in timeline
      initializeExpandedDays();

      skeleton.style.display = 'none';
      workspace.style.display = 'grid';

      populateTripSelector();
      renderPageDetails();
      renderActiveView();

    } catch (e) {
      console.error("Failed to load calendar", e);
      skeleton.style.display = 'none';
      errorPanel.style.display = 'flex';
    }
  }, 600);
}

/**
 * Initializes all days in trip stops as expanded by default
 */
function initializeExpandedDays() {
  expandedDays = [];
  if (!activeTrip.stops) return;
  
  activeTrip.stops.forEach(stop => {
    const dates = getDatesRange(stop.startDate, stop.endDate);
    expandedDays.push(...dates);
  });
}

/**
 * Populate trip select dropdown in header
 */
function populateTripSelector() {
  const select = document.getElementById('headerTripSelect');
  select.innerHTML = '';
  
  trips.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.destination;
    opt.selected = t.id === activeTrip.id;
    select.appendChild(opt);
  });
}

/**
 * Switch trip when selected in dropdown
 */
function switchActiveTrip(tripId) {
  // Push state to browser query params
  const url = new URL(window.location.href);
  url.searchParams.set('tripId', tripId);
  window.history.pushState({}, '', url);
  
  loadTripCalendarData();
}

/**
 * Renders trip summary details inside header and sidebar summary metrics
 */
function renderPageDetails() {
  // Page Header fields
  document.getElementById('metaTripName').textContent = activeTrip.destination;
  document.getElementById('metaDatesText').textContent = `${formatDateShort(activeTrip.startDate)} – ${formatDateShort(activeTrip.endDate)}`;
  
  const citiesCount = activeTrip.stops ? activeTrip.stops.length : (activeTrip.citiesVal || 0);
  let activitiesCount = 0;
  if (activeTrip.stops) {
    activeTrip.stops.forEach(s => {
      activitiesCount += s.activities ? s.activities.length : 0;
    });
  } else {
    activitiesCount = activeTrip.activitiesVal || 0;
  }
  
  document.getElementById('metaStopsCount').textContent = `${citiesCount} ${citiesCount === 1 ? 'City' : 'Cities'}`;
  document.getElementById('metaActivitiesCount').textContent = `${activitiesCount} ${activitiesCount === 1 ? 'Activity' : 'Activities'}`;
  
  // Right Sidebar metrics fields
  const totalDays = activeTrip.startDate && activeTrip.endDate ? 
    Math.round((new Date(activeTrip.endDate) - new Date(activeTrip.startDate)) / (1000 * 60 * 60 * 24)) + 1 : 0;
    
  document.getElementById('sumDuration').textContent = `${totalDays} ${totalDays === 1 ? 'Day' : 'Days'}`;
  document.getElementById('sumCities').textContent = citiesCount;
  document.getElementById('sumActivities').textContent = activitiesCount;
  document.getElementById('sumBudget').textContent = `$${(activeTrip.budget || 0).toLocaleString()}`;
  
  // Populate Next Activity alert
  renderNextActivityAlert();
}

/**
 * Renders Today/Upcoming activity widgets if applicable
 */
function renderNextActivityAlert() {
  const widget = document.getElementById('upcomingAlertWidget');
  if (!activeTrip.stops) {
    widget.style.display = 'none';
    return;
  }

  // Gather all activities, sort chronologically
  const activities = [];
  activeTrip.stops.forEach(s => {
    if (s.activities) {
      s.activities.forEach(a => {
        activities.push({ ...a, city: s.city });
      });
    }
  });

  activities.sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time || '00:00'}`);
    const dateTimeB = new Date(`${b.date}T${b.time || '00:00'}`);
    return dateTimeA - dateTimeB;
  });

  // Find first activity that is today or in the future
  const now = new Date();
  const next = activities.find(a => {
    const actDateTime = new Date(`${a.date}T${a.time || '00:00'}`);
    return actDateTime >= now;
  });

  if (next) {
    widget.style.display = 'flex';
    document.getElementById('alertActivityName').textContent = next.name;
    document.getElementById('alertActivityTime').textContent = `${formatDateFull(next.date)} • ${formatTime(next.time)}`;
    document.getElementById('alertActivityCity').textContent = next.city;
  } else {
    // If no future activities, hide widget
    widget.style.display = 'none';
  }
}

/**
 * Handles navigation to existing builder routes
 */
function navigateToItinerary() {
  window.location.href = `itinerary.html?tripId=${activeTrip.id}`;
}

function navigateToAddActivity() {
  window.location.href = `itinerary.html?tripId=${activeTrip.id}&focus=activities`;
}

/**
 * Switch view between Monthly Calendar and Timeline
 */
function switchViewMode(mode) {
  currentViewMode = mode;
  
  const calendarBtn = document.getElementById('calendarViewBtn');
  const timelineBtn = document.getElementById('timelineViewBtn');
  const calendarContainer = document.getElementById('calendarViewContainer');
  const timelineContainer = document.getElementById('timelineViewContainer');

  if (mode === 'calendar') {
    calendarBtn.classList.add('active');
    timelineBtn.classList.remove('active');
    calendarContainer.style.display = 'block';
    timelineContainer.style.display = 'none';
  } else {
    timelineBtn.classList.add('active');
    calendarBtn.classList.remove('active');
    timelineContainer.style.display = 'block';
    calendarContainer.style.display = 'none';
  }
  
  renderActiveView();
}

/**
 * Renders active view panel
 */
function renderActiveView() {
  if (currentViewMode === 'calendar') {
    renderCalendarView();
  } else {
    renderTimelineView();
  }
}

/**
 * ==========================================================================
 * CALENDAR VIEW CONTROLLERS
 * ==========================================================================
 */

/**
 * Navigate calendar month
 */
function navigateMonth(direction) {
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  renderCalendarView();
}

function navigateToday() {
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  renderCalendarView();
}

/**
 * Renders monthly calendar grid
 */
function renderCalendarView() {
  document.getElementById('calendarMonthTitle').textContent = `${monthNames[currentMonth]} ${currentYear}`;
  
  const grid = document.getElementById('calendarGridMesh');
  grid.innerHTML = '';

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Day of week (0 = Sun, 1 = Mon...)
  // Adjust day index so week starts on Monday
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();

  const totalCells = 42; // standard 7x6 calendar grid

  // Collect stops dates range for coloring
  const tripStart = activeTrip.startDate ? new Date(activeTrip.startDate) : null;
  const tripEnd = activeTrip.endDate ? new Date(activeTrip.endDate) : null;
  
  if (tripStart) tripStart.setHours(0,0,0,0);
  if (tripEnd) tripEnd.setHours(0,0,0,0);

  const today = new Date();
  today.setHours(0,0,0,0);

  // Generate calendar grid dates array
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    
    let cellDayNum = 0;
    let cellMonth = currentMonth;
    let cellYear = currentYear;
    let isOutside = false;

    if (i < startOffset) {
      // Prev month dates
      cellDayNum = prevMonthTotalDays - startOffset + i + 1;
      cellMonth = currentMonth - 1;
      isOutside = true;
      if (cellMonth < 0) {
        cellMonth = 11;
        cellYear -= 1;
      }
    } else if (i >= startOffset + totalDays) {
      // Next month dates
      cellDayNum = i - startOffset - totalDays + 1;
      cellMonth = currentMonth + 1;
      isOutside = true;
      if (cellMonth > 11) {
        cellMonth = 0;
        cellYear += 1;
      }
    } else {
      // Current month dates
      cellDayNum = i - startOffset + 1;
    }

    const cellDate = new Date(cellYear, cellMonth, cellDayNum);
    cellDate.setHours(0,0,0,0);
    
    // Formatting date string as "YYYY-MM-DD"
    const dateStr = formatDateStr(cellDate);
    cell.setAttribute('data-date', dateStr);

    if (isOutside) {
      cell.classList.add('outside-month');
    }

    // Checking if cells fall in active trip dates
    if (tripStart && tripEnd && cellDate >= tripStart && cellDate <= tripEnd) {
      cell.classList.add('within-trip-period');
      if (cellDate.getTime() === tripStart.getTime()) cell.classList.add('trip-start-day');
      if (cellDate.getTime() === tripEnd.getTime()) cell.classList.add('trip-end-day');
    }

    // Checking today
    if (cellDate.getTime() === today.getTime()) {
      cell.classList.add('is-today');
    }

    // Selected cell highlight
    if (selectedDateStr === dateStr) {
      cell.classList.add('selected');
    }

    // Header date display
    cell.innerHTML = `<span class="cell-day-num">${cellDayNum}</span>`;

    // Render cell daily activities list
    const dailyActivities = getDailyActivities(dateStr);
    if (dailyActivities.length > 0) {
      const actContainer = document.createElement('div');
      actContainer.className = 'cell-activities-list';
      
      dailyActivities.forEach(act => {
        const item = document.createElement('div');
        item.className = `cell-activity-item ${(act.category || 'other').toLowerCase()}`;
        item.textContent = `${act.time || ''} ${act.name}`;
        actContainer.appendChild(item);
      });
      
      cell.appendChild(actContainer);
    }

    // Cell Click event: Select date, open right panel details
    cell.addEventListener('click', () => {
      selectCalendarDate(dateStr);
    });

    grid.appendChild(cell);
  }

  // Populate Selected day list panel if open
  if (selectedDateStr) {
    populateSelectedDayPanel(selectedDateStr);
  }
}

/**
 * Highlights a date in the calendar and opens side panels
 */
function selectCalendarDate(dateStr) {
  selectedDateStr = dateStr;
  
  // Highlight cell visual state
  const cells = document.querySelectorAll('.calendar-day-cell');
  cells.forEach(c => {
    if (c.getAttribute('data-date') === dateStr) {
      c.classList.add('selected');
    } else {
      c.classList.remove('selected');
    }
  });

  populateSelectedDayPanel(dateStr);
}

/**
 * ==========================================================================
 * RIGHT SIDEBAR DAY DETAIL PANEL & DRAG-AND-DROP REORDERING
 * ==========================================================================
 */

/**
 * Populates right sidebar draggable items matching selected dates
 */
function populateSelectedDayPanel(dateStr) {
  const panel = document.getElementById('selectedDayPanel');
  const title = document.getElementById('selectedDayTitle');
  const list = document.getElementById('selectedDayActivitiesList');

  // Format header title (e.g. "Saturday, 13 October")
  title.textContent = formatDateHeader(dateStr);
  list.innerHTML = '';

  const dailyActivities = getDailyActivities(dateStr);

  if (dailyActivities.length === 0) {
    list.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No activities scheduled for this day</div>`;
    panel.style.display = 'block';
    return;
  }

  dailyActivities.forEach((act, idx) => {
    const card = document.createElement('div');
    card.className = 'draggable-activity-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-act-id', act.id);
    card.setAttribute('data-stop-id', act.stopId);
    card.setAttribute('data-index', idx);
    
    // Image indicator or icon based on category type
    card.innerHTML = `
      <div class="drag-indicator-grip">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="15" x2="16" y2="15"/></svg>
      </div>
      <div class="drag-card-time">${formatTime(act.time)}</div>
      <div class="drag-card-title">${act.name}</div>
      
      <!-- Mobile up/down sorting clicks buttons -->
      <div class="mobile-sort-actions">
        <button class="mobile-arrow-btn" onclick="moveActivityMobile(event, '${act.stopId}', '${act.id}', -1)" title="Move Up">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button class="mobile-arrow-btn" onclick="moveActivityMobile(event, '${act.stopId}', '${act.id}', 1)" title="Move Down">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
    `;

    // Click card to open edit modal
    card.addEventListener('click', (e) => {
      // Prevent opening edit on dragging or clicking sort arrows
      if (e.target.closest('.mobile-sort-actions') || e.target.closest('.drag-indicator-grip')) {
        return;
      }
      openQuickEdit(act.stopId, act.id);
    });

    // Wire Drag and Drop API Events
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('drop', handleDrop);
    card.addEventListener('dragend', handleDragEnd);

    list.appendChild(card);
  });

  // Display mobile tip banner if mobile dimensions active
  const tipBanner = panel.querySelector('.mobile-tip-banner');
  if (window.innerWidth <= 768) {
    tipBanner.style.display = 'block';
  } else {
    tipBanner.style.display = 'none';
  }

  panel.style.display = 'block';
}

function closeSelectedDayPanel() {
  document.getElementById('selectedDayPanel').style.display = 'none';
  
  // Remove highlighted cell selection in calendar view
  const cells = document.querySelectorAll('.calendar-day-cell');
  cells.forEach(c => c.classList.remove('selected'));
  selectedDateStr = null;
}

/**
 * Draggability Handlers
 */
let dragSrcEl = null;

function handleDragStart(e) {
  this.classList.add('dragging');
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary for allowing drops
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
}

/**
 * Drop handler - reorganizes stops activities list indices
 */
function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();

  if (dragSrcEl !== this) {
    const stopId = this.getAttribute('data-stop-id');
    const sourceIdx = parseInt(dragSrcEl.getAttribute('data-index'));
    const targetIdx = parseInt(this.getAttribute('data-index'));

    reorderActivities(stopId, sourceIdx, targetIdx);
  }
  return false;
}

/**
 * Re-indexes activities arrays in state and localstorage
 */
function reorderActivities(stopId, srcIdx, targetIdx) {
  const stopIndex = activeTrip.stops.findIndex(s => s.id === stopId);
  if (stopIndex === -1) return;

  const stop = activeTrip.stops[stopIndex];
  
  // Filter activities matching the active date
  const selectedDate = selectedDateStr;
  const dateActivities = stop.activities.filter(a => a.date === selectedDate);
  const otherActivities = stop.activities.filter(a => a.date !== selectedDate);

  // Swap elements
  const moved = dateActivities.splice(srcIdx, 1)[0];
  dateActivities.splice(targetIdx, 0, moved);

  // Re-combine and update stop activities
  stop.activities = [...dateActivities, ...otherActivities];

  // Update trips list
  const tripIdx = trips.findIndex(t => t.id === activeTrip.id);
  if (tripIdx !== -1) {
    trips[tripIdx] = activeTrip;
    localStorage.setItem('globaltrotter_trips', JSON.stringify(trips));
  }

  // Reload views
  renderActiveView();
  if (selectedDateStr) {
    populateSelectedDayPanel(selectedDateStr);
  }
  showToast('Activity order updated', 'success');
}

/**
 * Mobile reorder list shifting Up/Down clicks
 */
function moveActivityMobile(event, stopId, actId, direction) {
  event.stopPropagation();
  
  const stopIndex = activeTrip.stops.findIndex(s => s.id === stopId);
  if (stopIndex === -1) return;

  const stop = activeTrip.stops[stopIndex];
  const dateActivities = stop.activities.filter(a => a.date === selectedDateStr);
  const otherActivities = stop.activities.filter(a => a.date !== selectedDateStr);

  const curIdx = dateActivities.findIndex(a => a.id === actId);
  if (curIdx === -1) return;

  const targetIdx = curIdx + direction;
  if (targetIdx < 0 || targetIdx >= dateActivities.length) return;

  // Swap elements
  const temp = dateActivities[curIdx];
  dateActivities[curIdx] = dateActivities[targetIdx];
  dateActivities[targetIdx] = temp;

  // Re-combine and update stop
  stop.activities = [...dateActivities, ...otherActivities];

  // Update localStorage
  const tripIdx = trips.findIndex(t => t.id === activeTrip.id);
  if (tripIdx !== -1) {
    trips[tripIdx] = activeTrip;
    localStorage.setItem('globaltrotter_trips', JSON.stringify(trips));
  }

  renderActiveView();
  populateSelectedDayPanel(selectedDateStr);
  showToast('Activity order updated', 'success');
}

/**
 * Helper fetches sorted day activities across active trip stops
 */
function getDailyActivities(dateStr) {
  if (!activeTrip.stops) return [];

  const list = [];
  activeTrip.stops.forEach(stop => {
    if (stop.activities) {
      stop.activities.forEach(act => {
        if (act.date === dateStr) {
          list.push({ ...act, stopId: stop.id });
        }
      });
    }
  });

  // Sort daily items chronologically
  list.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  return list;
}

/**
 * ==========================================================================
 * TIMELINE VIEW CONTROLLERS
 * ==========================================================================
 */

/**
 * Renders vertical travel timeline route flows
 */
function renderTimelineView() {
  const container = document.getElementById('timelineRouteFlow');
  container.innerHTML = '';

  if (!activeTrip.stops || activeTrip.stops.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">No stops mapped for this trip. Go to Itinerary Builder.</div>`;
    return;
  }

  // Sort stops chronologically
  const sortedStops = [...activeTrip.stops].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  let dayCounter = 1;

  sortedStops.forEach((stop, stopIdx) => {
    // 1. Render City Transitions (e.g. Paris -> Amsterdam)
    if (stopIdx > 0) {
      const prevStop = sortedStops[stopIdx - 1];
      const transition = document.createElement('div');
      transition.className = 'timeline-city-transition';
      transition.innerHTML = `
        <div class="transition-node-pill">
          <span>${prevStop.city}</span>
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <span>${stop.city}</span>
        </div>
      `;
      container.appendChild(transition);
    }

    // 2. Gather dates spanning this stop
    const stopDates = getDatesRange(stop.startDate, stop.endDate);

    stopDates.forEach(dateStr => {
      const dailyActivities = getDailyActivities(dateStr);
      const isExpanded = expandedDays.includes(dateStr);
      
      const daySection = document.createElement('div');
      daySection.className = `timeline-day-section ${!isExpanded ? 'collapsed' : ''}`;
      
      const isTravelDay = stop.startDate === dateStr && stopIdx > 0;
      if (isTravelDay) daySection.classList.add('travel-day');

      // Expand/Collapse day headers
      daySection.innerHTML = `
        <div class="timeline-day-header" onclick="toggleTimelineDay('${dateStr}')">
          <div class="day-header-left">
            <div class="timeline-dot"></div>
            <span class="day-title-text">Day ${dayCounter} • ${formatDateHeaderShort(dateStr)}</span>
            <span class="day-meta-text">(${stop.city} • ${dailyActivities.length} ${dailyActivities.length === 1 ? 'Activity' : 'Activities'})</span>
          </div>
          <div class="day-header-right">
            <svg class="header-arrow-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="timeline-day-body">
          <!-- Activities list -->
        </div>
      `;

      const body = daySection.querySelector('.timeline-day-body');

      if (dailyActivities.length === 0) {
        body.innerHTML = `
          <div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem; border: 1.5px dashed var(--border); border-radius: var(--radius-md); text-align: center;">
            No activities scheduled for this day
          </div>
        `;
      } else {
        dailyActivities.forEach(act => {
          const card = document.createElement('div');
          card.className = 'timeline-activity-card';
          
          card.innerHTML = `
            <div class="activity-time-pill">${formatTime(act.time)}</div>
            <div class="activity-detail-block">
              <div class="activity-card-title">${act.name}</div>
              <div class="activity-card-meta">
                <span class="activity-category-indicator ${(act.category || 'other').toLowerCase()}">${act.category || 'Other'}</span>
                ${act.duration ? `
                  <span>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    ${act.duration}
                  </span>
                ` : ''}
                <span>${stop.city}</span>
              </div>
            </div>
            ${act.cost ? `<div class="activity-cost-badge">$${act.cost}</div>` : ''}
          `;
          
          card.addEventListener('click', () => openQuickEdit(stop.id, act.id));
          body.appendChild(card);
        });
      }

      container.appendChild(daySection);
      dayCounter++;
    });
  });
}

/**
 * Toggle timeline day collapse state
 */
function toggleTimelineDay(dateStr) {
  const index = expandedDays.indexOf(dateStr);
  if (index !== -1) {
    expandedDays.splice(index, 1); // collapse
  } else {
    expandedDays.push(dateStr); // expand
  }
  
  // Re-render
  renderTimelineView();
}

/**
 * Helper returns dates array between start & end dates (inclusive)
 */
function getDatesRange(startStr, endStr) {
  const dates = [];
  const start = new Date(startStr);
  const end = new Date(endStr);
  
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(formatDateStr(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

/**
 * ==========================================================================
 * QUICK EDIT MODAL FLOWS
 * ==========================================================================
 */

/**
 * Opens Activity Quick Editing Dialog Form
 */
function openQuickEdit(stopId, actId) {
  const stop = activeTrip.stops.find(s => s.id === stopId);
  if (!stop) return;
  const act = stop.activities.find(a => a.id === actId);
  if (!act) return;

  document.getElementById('editActId').value = act.id;
  document.getElementById('editStopId').value = stopId;
  document.getElementById('editActName').value = act.name;
  
  const dateSelect = document.getElementById('editActDate');
  // Date select bounded by active trip start/end date range
  dateSelect.min = activeTrip.startDate;
  dateSelect.max = activeTrip.endDate;
  dateSelect.value = act.date;
  
  document.getElementById('editActTime').value = act.time || '';
  document.getElementById('editActDuration').value = act.duration || '';
  document.getElementById('editActCost').value = act.cost || '';
  document.getElementById('editActCategory').value = act.category || 'Other';
  document.getElementById('editActCityDisplay').value = `${stop.city}, ${stop.country}`;

  document.getElementById('quickEditModal').classList.add('visible');
  document.getElementById('editActName').focus();
}

function closeQuickEditModal() {
  document.getElementById('quickEditModal').classList.remove('visible');
  document.getElementById('quickEditForm').reset();
}

function closeQuickEditModalOnBackdrop(event) {
  if (event.target === document.getElementById('quickEditModal')) {
    closeQuickEditModal();
  }
}

/**
 * Quick edit form submit handler
 */
function handleQuickEditSubmit(event) {
  event.preventDefault();

  const submitBtn = document.querySelector('#quickEditModal .submit-btn');
  if (submitBtn.classList.contains('loading')) return;

  const actId = document.getElementById('editActId').value;
  const stopId = document.getElementById('editStopId').value;

  const nameVal = document.getElementById('editActName').value.trim();
  const dateVal = document.getElementById('editActDate').value;
  const timeVal = document.getElementById('editActTime').value;
  const durationVal = document.getElementById('editActDuration').value.trim();
  const costVal = parseFloat(document.getElementById('editActCost').value) || null;
  const categoryVal = document.getElementById('editActCategory').value;

  // Find target stop based on selected date
  const targetStop = activeTrip.stops.find(s => dateVal >= s.startDate && dateVal <= s.endDate);
  if (!targetStop) {
    showToast(`Failed: selected date is outside your planner's stop bounds. Ensure stops cover this date.`, 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  setTimeout(() => {
    // 1. Find source stop
    const srcStopIndex = activeTrip.stops.findIndex(s => s.id === stopId);
    if (srcStopIndex === -1) return;
    const srcStop = activeTrip.stops[srcStopIndex];

    // 2. Find activity index in source
    const actIdx = srcStop.activities.findIndex(a => a.id === actId);
    if (actIdx === -1) return;
    
    // Remove activity from source
    const [activityToUpdate] = srcStop.activities.splice(actIdx, 1);

    // 3. Update activity properties
    activityToUpdate.name = nameVal;
    activityToUpdate.date = dateVal;
    activityToUpdate.time = timeVal;
    activityToUpdate.duration = durationVal;
    activityToUpdate.cost = costVal;
    activityToUpdate.category = categoryVal;

    // 4. Push updated activity to target stop
    if (!targetStop.activities) targetStop.activities = [];
    targetStop.activities.push(activityToUpdate);

    // Save active state to localStorage
    const tripIdx = trips.findIndex(t => t.id === activeTrip.id);
    if (tripIdx !== -1) {
      trips[tripIdx] = activeTrip;
      localStorage.setItem('globaltrotter_trips', JSON.stringify(trips));
    }

    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');

    setTimeout(() => {
      submitBtn.classList.remove('success');
      submitBtn.disabled = false;
      closeQuickEditModal();
      
      // Update UI components
      populateTripSelector();
      renderPageDetails();
      renderActiveView();
      if (selectedDateStr) {
        populateSelectedDayPanel(selectedDateStr);
      }
      showToast('Activity changes updated successfully!', 'success');
    }, 500);

  }, 600);
}

/**
 * ==========================================================================
 * UTILITY HELPERS & GLOBAL LAYOUT ACTIONS
 * ==========================================================================
 */

/**
 * Converts date objects to string: "YYYY-MM-DD"
 */
function formatDateStr(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

/**
 * Date formats helper (e.g. "Sat, 13 September")
 */
function formatDateHeader(dateString) {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function formatDateHeaderShort(dateString) {
  const options = { day: 'numeric', month: 'short' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function formatDateFull(dateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function formatDateShort(dateString) {
  const options = { month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

/**
 * Formats time: "14:00" -> "02:00 PM"
 */
function formatTime(timeStr) {
  if (!timeStr) return '--:--';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHr = h % 12 || 12;
  return `${displayHr}:${minutes} ${ampm}`;
}

/**
 * Sidebar and Global Shell helpers
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('visible');
}

document.addEventListener('click', (event) => {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth <= 1024) {
    const isClickInside = sidebar.contains(event.target) || event.target.closest('.menu-toggle-btn');
    if (!isClickInside && sidebar.classList.contains('visible')) {
      sidebar.classList.remove('visible');
    }
  }
});

function toggleNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) dropdown.classList.toggle('visible');
}

document.addEventListener('click', (event) => {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) {
    const isClickInside = dropdown.contains(event.target) || event.target.closest('.notification-bell-btn');
    if (!isClickInside && dropdown.classList.contains('visible')) {
      dropdown.classList.remove('visible');
    }
  }
});

function clearNotifications() {
  const list = document.getElementById('notificationList');
  const badge = document.getElementById('bellBadge');
  if (list) list.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No new notifications</div>`;
  if (badge) badge.style.display = 'none';
  showToast('All notifications dismissed', 'success');
}

/**
 * Simulated Floating Toasts System
 */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('dashboardToast');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'dashboardToast';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.padding = '12px 20px';
    toastContainer.style.borderRadius = '8px';
    toastContainer.style.fontSize = '0.9rem';
    toastContainer.style.fontWeight = '500';
    toastContainer.style.zIndex = '2000';
    toastContainer.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
    toastContainer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    toastContainer.style.transform = 'translateY(-20px)';
    toastContainer.style.opacity = '0';
    document.body.appendChild(toastContainer);
  }

  if (type === 'success') {
    toastContainer.style.backgroundColor = 'rgba(45, 106, 79, 0.15)';
    toastContainer.style.color = '#2D6A4F';
    toastContainer.style.border = '1px solid rgba(45, 106, 79, 0.3)';
  } else {
    toastContainer.style.backgroundColor = 'rgba(217, 56, 56, 0.15)';
    toastContainer.style.color = '#D93838';
    toastContainer.style.border = '1px solid rgba(217, 56, 56, 0.3)';
  }

  toastContainer.textContent = message;
  toastContainer.style.transform = 'translateY(0)';
  toastContainer.style.opacity = '1';

  setTimeout(() => {
    toastContainer.style.transform = 'translateY(-20px)';
    toastContainer.style.opacity = '0';
  }, 3500);
}

function showSimulatedAction(text) {
  showToast(text, 'success');
}

function handleLogout() {
  showToast('Logging out safely...', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}
