// State tracking variables
let trips = [];

// DOM Elements
const sidebar = document.getElementById('sidebar');
const notificationDropdown = document.getElementById('notificationDropdown');
const bellBadge = document.getElementById('bellBadge');
const notificationList = document.getElementById('notificationList');
const tripsGrid = document.getElementById('tripsGrid');
const emptyTripsState = document.getElementById('emptyTripsState');
const createTripModal = document.getElementById('createTripModal');
const createTripForm = document.getElementById('createTripForm');

// Stats Counters Elements
const statTripsEl = document.getElementById('statTrips');
const statDestinationsEl = document.getElementById('statDestinations');
const statActivitiesEl = document.getElementById('statActivities');
const statBudgetEl = document.getElementById('statBudget');

// Initialize data from localStorage or default data
const defaultTrips = [
  {
    id: "trip-tokyo",
    destination: "Tokyo Exploration",
    startDate: "2026-10-12",
    endDate: "2026-10-22",
    citiesVal: 3,
    activitiesVal: 6,
    budget: 2800,
    status: "Upcoming",
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
          {
            id: "act-tokyo-1",
            name: "Meiji Jingu Shrine Visit",
            date: "2026-10-13",
            time: "10:00",
            duration: "2 hours",
            cost: 0
          },
          {
            id: "act-tokyo-2",
            name: "Shibuya Crossing Walk",
            date: "2026-10-13",
            time: "16:00",
            duration: "1 hour",
            cost: 0
          },
          {
            id: "act-tokyo-3",
            name: "Dinner at Sukiyabashi Jiro",
            date: "2026-10-14",
            time: "19:30",
            duration: "2.5 hours",
            cost: 250
          }
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
          {
            id: "act-tokyo-4",
            name: "Lake Ashi Cruise",
            date: "2026-10-17",
            time: "11:00",
            duration: "1.5 hours",
            cost: 20
          }
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
          {
            id: "act-tokyo-5",
            name: "Kinkaku-ji Golden Pavilion",
            date: "2026-10-19",
            time: "09:00",
            duration: "2 hours",
            cost: 5
          },
          {
            id: "act-tokyo-6",
            name: "Fushimi Inari Shrine Hike",
            date: "2026-10-20",
            time: "14:00",
            duration: "3 hours",
            cost: 0
          }
        ]
      }
    ]
  },
  {
    id: "trip-paris",
    destination: "Romantic Paris Gateway",
    startDate: "2026-12-05",
    endDate: "2026-12-10",
    citiesVal: 2,
    activitiesVal: 3,
    budget: 1450,
    status: "Draft",
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
          {
            id: "act-paris-1",
            name: "Eiffel Tower Visit",
            date: "2026-12-06",
            time: "10:00",
            duration: "2 hours",
            cost: 25
          },
          {
            id: "act-paris-2",
            name: "Louvre Museum",
            date: "2026-12-07",
            time: "11:00",
            duration: "3 hours",
            cost: 22
          }
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
          {
            id: "act-paris-3",
            name: "Canal Cruise",
            date: "2026-12-09",
            time: "15:00",
            duration: "1.5 hours",
            cost: 18
          }
        ]
      }
    ]
  }
];

function initLocalStorage() {
  const stored = localStorage.getItem('globaltrotter_trips');
  if (!stored) {
    localStorage.setItem('globaltrotter_trips', JSON.stringify(defaultTrips));
    trips = [...defaultTrips];
  } else {
    trips = JSON.parse(stored);
  }
}
initLocalStorage();

// Unsplash travel banner image pool to assign random realistic banners to user created trips
const bannerImages = [
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80", // Forest Trail
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80", // Sunset Alps
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // Scenic Yosemite Lake
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80", // Woodland Highway Road
  "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80"  // Ancient Temples Sunset
];

/**
 * Mobile Sidebar Navigation Toggle
 */
function toggleSidebar() {
  sidebar.classList.toggle('visible');
}

// Close mobile sidebar on clicking outside it
document.addEventListener('click', (event) => {
  if (window.innerWidth <= 1024) {
    const isClickInside = sidebar.contains(event.target) || event.target.closest('.menu-toggle-btn');
    if (!isClickInside && sidebar.classList.contains('visible')) {
      sidebar.classList.remove('visible');
    }
  }
});

/**
 * Toggles the visibility of notification drawer
 */
function toggleNotifications() {
  if (notificationDropdown) {
    notificationDropdown.classList.toggle('visible');
  }
}

// Hide notification drawer on clicking outside
document.addEventListener('click', (event) => {
  if (notificationDropdown) {
    const isClickInside = notificationDropdown.contains(event.target) || event.target.closest('.notification-bell-btn');
    if (!isClickInside && notificationDropdown.classList.contains('visible')) {
      notificationDropdown.classList.remove('visible');
    }
  }
});

/**
 * Clear all notifications lists
 */
function clearNotifications() {
  if (notificationList) {
    notificationList.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No new notifications</div>`;
  }
  if (bellBadge) {
    bellBadge.style.display = 'none';
  }
  showToast('All notifications dismissed', 'success');
}

/**
 * Create Trip Modal Actions
 */
function openCreateTripModal() {
  createTripModal.classList.add('visible');
  document.getElementById('modalDestination').focus();
}

function closeCreateTripModal() {
  createTripModal.classList.remove('visible');
  createTripForm.reset();
}

function closeCreateTripModalOnBackdrop(event) {
  if (event.target === createTripModal) {
    closeCreateTripModal();
  }
}

/**
 * Simulated Floating Toasts System (Dynamically injects markup to ensure visual conformity)
 */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('dashboardToast');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'dashboardToast';
    // Style directly to avoid dependency checks
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
    toastContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
    toastContainer.style.color = '#10B981';
    toastContainer.style.border = '1px solid rgba(16, 185, 129, 0.3)';
  } else {
    toastContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
    toastContainer.style.color = '#EF4444';
    toastContainer.style.border = '1px solid rgba(239, 68, 68, 0.3)';
  }

  toastContainer.textContent = message;
  toastContainer.style.transform = 'translateY(0)';
  toastContainer.style.opacity = '1';

  setTimeout(() => {
    toastContainer.style.transform = 'translateY(-20px)';
    toastContainer.style.opacity = '0';
  }, 3500);
}

/**
 * Display action helper messages
 */
function showSimulatedAction(text) {
  showToast(text, 'success');
}

/**
 * Render all trips dynamically from the trips state
 */
function renderTrips() {
  tripsGrid.innerHTML = '';
  
  if (trips.length === 0) {
    tripsGrid.style.display = 'none';
    emptyTripsState.style.display = 'flex';
  } else {
    tripsGrid.style.display = 'grid';
    emptyTripsState.style.display = 'none';
    
    trips.forEach(trip => {
      const article = document.createElement('article');
      article.className = 'trip-card';
      article.id = trip.id;
      
      // Calculate dynamic counts
      const citiesCount = trip.stops ? trip.stops.length : (trip.citiesVal || 0);
      const activitiesCount = trip.stops ? trip.stops.reduce((sum, s) => sum + (s.activities ? s.activities.length : 0), 0) : (trip.activitiesVal || 0);
      
      // Calculate planning progress percentage
      let progressPercent = 0;
      if (trip.stops && trip.stops.length > 0) {
        // Base progress on stops and activities
        const hasActivities = trip.stops.some(s => s.activities && s.activities.length > 0);
        progressPercent = hasActivities ? 65 : 35;
        if (trip.status === 'Completed') progressPercent = 100;
      } else {
        progressPercent = 10; // concept/draft
      }
      if (trip.id === 'trip-tokyo') progressPercent = 65;
      if (trip.id === 'trip-paris') progressPercent = 25;
      
      const startDateFormatted = formatDate(trip.startDate);
      const endDateFormatted = formatDate(trip.endDate);
      
      article.innerHTML = `
        <button class="trip-delete-btn" onclick="deleteTrip('${trip.id}')" aria-label="Remove trip to ${trip.destination}">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="trip-card-banner">
          <img src="${trip.banner}" alt="Scenic banner for ${trip.destination}" class="trip-banner-img">
          <span class="trip-status-badge" style="background-color: ${trip.status === 'Draft' ? 'var(--accent)' : 'var(--primary)'};">${trip.status}</span>
        </div>
        <div class="trip-card-body">
          <h4 class="trip-destination">${trip.destination}</h4>
          <div class="trip-dates">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${startDateFormatted} - ${endDateFormatted}
          </div>
          
          <div class="trip-details-grid">
            <div class="trip-detail-item">
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              ${citiesCount} ${citiesCount === 1 ? 'City' : 'Cities'}
            </div>
            <div class="trip-detail-item">
              <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2 12 12 22 17 12 22 2 17 12 12"/></svg>
              ${activitiesCount} ${activitiesCount === 1 ? 'Activity' : 'Activities'}
            </div>
          </div>
  
          <div class="trip-progress-container">
            <div class="trip-progress-header">
              <span>${trip.status === 'Draft' ? 'Concept Draft' : 'Planning Stage'}</span>
              <strong>${progressPercent}%</strong>
            </div>
            <div class="trip-progress-bar-bg">
              <div class="trip-progress-bar-fg" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
  
          <button class="btn-view-trip" onclick="viewTrip('${trip.id}')">View Trip</button>
        </div>
      `;
      tripsGrid.appendChild(article);
    });
  }
  updateOverviewStats();
}

/**
 * Navigate to Itinerary View page for a trip
 */
function viewTrip(tripId) {
  window.location.href = `itinerary-view.html?tripId=${tripId}`;
}

/**
 * Submits form inputs and appends trip card dynamically
 */
function handleCreateTripSubmit(event) {
  event.preventDefault();
  
  const submitBtn = createTripModal.querySelector('.submit-btn');
  if (submitBtn.classList.contains('loading')) return;

  const destination = document.getElementById('modalDestination').value.trim();
  const startDateStr = document.getElementById('modalStartDate').value;
  const endDateStr = document.getElementById('modalEndDate').value;
  const citiesVal = parseInt(document.getElementById('modalCities').value) || 1;
  const activitiesVal = parseInt(document.getElementById('modalActivities').value) || 3;
  const budgetVal = parseInt(document.getElementById('modalBudget').value) || 1000;

  // Simple checks
  if (new Date(startDateStr) > new Date(endDateStr)) {
    showToast('End date must be after start date.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  setTimeout(() => {
    // Generate trip ID
    const tripId = `trip-${Date.now()}`;
    const randomImage = bannerImages[Math.floor(Math.random() * bannerImages.length)];
    
    // Create new Trip object
    const newTrip = {
      id: tripId,
      destination: destination,
      startDate: startDateStr,
      endDate: endDateStr,
      citiesVal: citiesVal,
      activitiesVal: activitiesVal,
      budget: budgetVal,
      status: "Upcoming",
      banner: randomImage,
      stops: []
    };

    // Save to State and LocalStorage
    trips.unshift(newTrip);
    localStorage.setItem('globaltrotter_trips', JSON.stringify(trips));

    // Render trips
    renderTrips();

    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');

    setTimeout(() => {
      submitBtn.classList.remove('success');
      submitBtn.disabled = false;
      closeCreateTripModal();
      showToast('New trip added successfully!', 'success');
    }, 700);

  }, 1000);
}

/**
 * Handle Trip Deletion
 */
function deleteTrip(tripId) {
  const card = document.getElementById(tripId);
  if (!card) return;

  if (!confirm('Are you sure you want to delete this trip and all its stops/activities?')) return;

  // Visual removal animations
  card.style.opacity = '0';
  card.style.transform = 'scale(0.9)';
  
  setTimeout(() => {
    // Remove from state & localStorage
    trips = trips.filter(t => t.id !== tripId);
    localStorage.setItem('globaltrotter_trips', JSON.stringify(trips));
    
    // Re-render
    renderTrips();
    showToast('Trip removed from your planner', 'success');
  }, 400);
}

/**
 * Update UI milestone labels
 */
function updateOverviewStats() {
  if (!statTripsEl) return;
  const upcomingTripsCount = trips.length;
  const totalCitiesCount = trips.reduce((sum, t) => sum + (t.stops ? t.stops.length : (t.citiesVal || 0)), 0);
  const totalActivitiesCount = trips.reduce((sum, t) => sum + (t.stops ? t.stops.reduce((sSum, s) => sSum + (s.activities ? s.activities.length : 0), 0) : (t.activitiesVal || 0)), 0);
  const totalBudgetAmount = trips.reduce((sum, t) => sum + (t.budget || 0), 0);

  statTripsEl.textContent = upcomingTripsCount;
  statDestinationsEl.textContent = totalCitiesCount;
  statActivitiesEl.textContent = totalActivitiesCount;
  statBudgetEl.textContent = `$${totalBudgetAmount.toLocaleString()}`;
}

// Call renderTrips initially to display local storage data
document.addEventListener('DOMContentLoaded', () => {
  if (tripsGrid) {
    renderTrips();
  }
});

/**
 * Filters existing trip cards matching search keywords
 */
function handleSimulatedSearch(query) {
  if (!tripsGrid) return;
  const normalizedQuery = query.toLowerCase().trim();
  const cards = tripsGrid.querySelectorAll('.trip-card');
  let matchCount = 0;

  cards.forEach(card => {
    const destinationName = card.querySelector('.trip-destination').textContent.toLowerCase();
    if (destinationName.includes(normalizedQuery)) {
      card.style.display = '';
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (trips.length > 0) {
    if (matchCount === 0) {
      // If query has no matches, show simple text notification or hide grid
      // Let's keep it simple: just hide items.
    }
  }
}

/**
 * Date helper formats (e.g. "Oct 12")
 */
function formatDate(dateString) {
  const options = { month: 'short', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

/**
 * Logout transition flow
 */
function handleLogout() {
  showToast('Logging out safely...', 'success');
  
  setTimeout(() => {
    // Redirect back to login page
    window.location.href = 'index.html';
  }, 1500);
}
