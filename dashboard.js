// State tracking variables
let upcomingTripsCount = 2;
let totalCitiesCount = 6;
let totalActivitiesCount = 18;
let totalBudgetAmount = 4250;

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

// Unsplash travel banner image pool to assign random realistic banners to user created trips
const bannerImages = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80", // Desert Road
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80", // Lake Boat
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80", // Beach Sunrise
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80", // Greece Blue
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"  // Map & Camera
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
  notificationDropdown.classList.toggle('visible');
}

// Hide notification drawer on clicking outside
document.addEventListener('click', (event) => {
  const isClickInside = notificationDropdown.contains(event.target) || event.target.closest('.notification-bell-btn');
  if (!isClickInside && notificationDropdown.classList.contains('visible')) {
    notificationDropdown.classList.remove('visible');
  }
});

/**
 * Clear all notifications lists
 */
function clearNotifications() {
  notificationList.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No new notifications</div>`;
  bellBadge.style.display = 'none';
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
    
    // Format dates
    const startDateFormatted = formatDate(startDateStr);
    const endDateFormatted = formatDate(endDateStr);

    // Create Card elements
    const article = document.createElement('article');
    article.className = 'trip-card';
    article.id = tripId;
    article.style.opacity = '0';
    article.style.transform = 'translateY(15px)';
    article.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    article.innerHTML = `
      <button class="trip-delete-btn" onclick="deleteTrip('${tripId}', ${citiesVal}, ${activitiesVal}, ${budgetVal})" aria-label="Remove trip to ${destination}">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="trip-card-banner">
        <img src="${randomImage}" alt="Scenic banner for ${destination}" class="trip-banner-img">
        <span class="trip-status-badge" style="background-color: var(--primary);">Upcoming</span>
      </div>
      <div class="trip-card-body">
        <h4 class="trip-destination">${destination}</h4>
        <div class="trip-dates">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${startDateFormatted} - ${endDateFormatted}
        </div>
        
        <div class="trip-details-grid">
          <div class="trip-detail-item">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            ${citiesVal} ${citiesVal === 1 ? 'City' : 'Cities'}
          </div>
          <div class="trip-detail-item">
            <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2 12 12 22 17 12 22 2 17 12 12"/></svg>
            ${activitiesVal} Activities
          </div>
        </div>

        <div class="trip-progress-container">
          <div class="trip-progress-header">
            <span>Planning Stage</span>
            <strong>0%</strong>
          </div>
          <div class="trip-progress-bar-bg">
            <div class="trip-progress-bar-fg" style="width: 0%;"></div>
          </div>
        </div>

        <button class="btn-view-trip" onclick="showSimulatedAction('Viewing details for ${destination}')">View Trip</button>
      </div>
    `;

    // Hide empty state if active
    if (upcomingTripsCount === 0) {
      tripsGrid.style.display = 'grid';
      emptyTripsState.style.display = 'none';
    }

    // Prepend to grid list
    tripsGrid.prepend(article);
    
    // Animation fade-in trigger
    setTimeout(() => {
      article.style.opacity = '1';
      article.style.transform = 'translateY(0)';
    }, 50);

    // Update Counters
    upcomingTripsCount++;
    totalCitiesCount += citiesVal;
    totalActivitiesCount += activitiesVal;
    totalBudgetAmount += budgetVal;
    updateOverviewStats();

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
function deleteTrip(tripId, cities, activities, budget) {
  const card = document.getElementById(tripId);
  if (!card) return;

  // Visual removal animations
  card.style.opacity = '0';
  card.style.transform = 'scale(0.9)';
  
  setTimeout(() => {
    card.remove();
    
    // Decrement states
    upcomingTripsCount--;
    totalCitiesCount -= cities;
    totalActivitiesCount -= activities;
    totalBudgetAmount -= budget;
    updateOverviewStats();

    // Check empty state
    if (upcomingTripsCount === 0) {
      tripsGrid.style.display = 'none';
      emptyTripsState.style.display = 'flex';
    }

    showToast('Trip removed from your planner', 'success');
  }, 400);
}

/**
 * Update UI milestone labels
 */
function updateOverviewStats() {
  statTripsEl.textContent = upcomingTripsCount;
  statDestinationsEl.textContent = totalCitiesCount;
  statActivitiesEl.textContent = totalActivitiesCount;
  statBudgetEl.textContent = `$${totalBudgetAmount.toLocaleString()}`;
}

/**
 * Filters existing trip cards matching search keywords
 */
function handleSimulatedSearch(query) {
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

  if (upcomingTripsCount > 0) {
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
