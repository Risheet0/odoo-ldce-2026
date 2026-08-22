// ==========================================================================
// GlobalTrotters Discover Activities - Business Logic & Datastore Updates
// ==========================================================================

// Premium Activities Catalog grouped by city name
const activitiesDatabase = [
  // Paris
  {
    city: "Paris",
    name: "Eiffel Tower Guided Summit Tour",
    category: "Sightseeing",
    description: "Explore the most famous iron tower in the world with a professional guide. Step out onto the summit deck for stunning panoramic views of the city.",
    durationMinutes: 120,
    durationText: "2 hours",
    costNumeric: 25,
    costText: "$25",
    rating: 4.9,
    location: "Champ de Mars, Paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Paris",
    name: "Louvre Museum Masterpieces Walk",
    category: "Culture",
    description: "Skip the lines and explore historical masterpieces. Witness the enigmatic Mona Lisa, Venus de Milo, and Winged Victory of Samothrace.",
    durationMinutes: 180,
    durationText: "3 hours",
    costNumeric: 22,
    costText: "$22",
    rating: 4.8,
    location: "Rue de Rivoli, Paris",
    image: "https://images.unsplash.com/photo-1597922450056-2721335c7241?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Paris",
    name: "Seine River Dinner Cruise",
    category: "Food & Dining",
    description: "Indulge in a premium 3-course French dinner accompanied by live musicians while cruising past illuminated monuments of the Seine.",
    durationMinutes: 150,
    durationText: "2.5 hours",
    costNumeric: 65,
    costText: "$65",
    rating: 4.7,
    location: "Port de la Bourdonnais, Paris",
    image: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Paris",
    name: "Palace of Versailles Guided Day Trip",
    category: "Culture",
    description: "Tour the famous Hall of Mirrors, King's state apartments, and wander the beautifully landscaped Royal Gardens.",
    durationMinutes: 360,
    durationText: "6 hours",
    costNumeric: 45,
    costText: "$45",
    rating: 4.8,
    location: "Versailles, Paris Outskirts",
    image: "https://images.unsplash.com/photo-1601823984263-b87b59798b70?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Paris",
    name: "Montmartre Artisanal Bakery Crawl",
    category: "Food & Dining",
    description: "Follow a culinary expert around cobblestone streets. Sample freshly baked baguettes, croissants, local cheeses, and macarons.",
    durationMinutes: 120,
    durationText: "2 hours",
    costNumeric: 14,
    costText: "$14",
    rating: 4.9,
    location: "Montmartre District, Paris",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
  },

  // Tokyo
  {
    city: "Tokyo",
    name: "Shibuya Crossing & Izakaya Crawl",
    category: "Food & Dining",
    description: "Navigate the world's busiest pedestrian crossing, and dive into hidden alleyways. Enjoy yakitori and cold drinks in tiny, atmospheric bars.",
    durationMinutes: 180,
    durationText: "3 hours",
    costNumeric: 40,
    costText: "$40",
    rating: 4.9,
    location: "Shinjuku & Shibuya, Tokyo",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Tokyo",
    name: "Sushi Making Masterclass with Chef",
    category: "Food & Dining",
    description: "Learn historical techniques of slicing fresh sashimi and styling nigiri rolls from a professional sushi artisan.",
    durationMinutes: 150,
    durationText: "2.5 hours",
    costNumeric: 55,
    costText: "$55",
    rating: 4.8,
    location: "Tsukiji Outer Market, Tokyo",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Tokyo",
    name: "Mount Fuji Scenic Day Hiking Tour",
    category: "Nature",
    description: "Wander through nature trails around Hakone and Arakurayama Sengen Park for stunning, classic views of Mount Fuji.",
    durationMinutes: 480,
    durationText: "Full day",
    costNumeric: 80,
    costText: "$80",
    rating: 4.9,
    location: "Fuji Five Lakes, Tokyo Outskirts",
    image: "https://images.unsplash.com/photo-1509009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Tokyo",
    name: "Robot Restaurant Entertainment Show",
    category: "Entertainment",
    description: "Experience the neon flashing lights, giant robots, traditional drummers, and sci-fi dances in Shinjuku's Kabukicho.",
    durationMinutes: 90,
    durationText: "1.5 hours",
    costNumeric: 50,
    costText: "$50",
    rating: 4.6,
    location: "Kabukicho, Tokyo",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Tokyo",
    name: "Senso-ji Asakusa Heritage Guided Walk",
    category: "Culture",
    description: "Explore Tokyo's oldest temple, walk through Nakamise shopping street, and learn the history of samurai and Geisha culture.",
    durationMinutes: 120,
    durationText: "2 hours",
    costNumeric: 0,
    costText: "Free",
    rating: 4.7,
    location: "Asakusa, Tokyo",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80"
  },

  // Amsterdam
  {
    city: "Amsterdam",
    name: "Canal Ring Cruise & Cheese Tasting",
    category: "Sightseeing",
    description: "Glide along UNESCO-listed canals on a historical wooden barge. Sample Dutch Gouda cheeses accompanied by wines.",
    durationMinutes: 90,
    durationText: "1.5 hours",
    costNumeric: 25,
    costText: "$25",
    rating: 4.8,
    location: "Prinsengracht, Amsterdam",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Amsterdam",
    name: "Van Gogh Museum Semi-Private Tour",
    category: "Culture",
    description: "Dive deep into the world's largest collection of paintings, drawings, and letters of Vincent van Gogh, led by an art historian.",
    durationMinutes: 120,
    durationText: "2 hours",
    costNumeric: 30,
    costText: "$30",
    rating: 4.9,
    location: "Museum Square, Amsterdam",
    image: "https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?auto=format&fit=crop&w=400&q=80"
  },

  // Rome
  {
    city: "Rome",
    name: "Colosseum Underground & Arena Floor",
    category: "Culture",
    description: "Access subterranean tunnels where gladiators prepared. Walk directly onto the Arena Floor for breathtaking structural views.",
    durationMinutes: 180,
    durationText: "3 hours",
    costNumeric: 45,
    costText: "$45",
    rating: 4.9,
    location: "Piazza del Colosseo, Rome",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Rome",
    name: "Pasta & Tiramisu Making Class",
    category: "Food & Dining",
    description: "Roll out fresh Italian egg pasta and whip up creamy Tiramisu desserts in a charming local villa.",
    durationMinutes: 180,
    durationText: "3 hours",
    costNumeric: 50,
    costText: "$50",
    rating: 4.9,
    location: "Trastevere District, Rome",
    image: "https://images.unsplash.com/photo-1563379971899-660589a01cd3?auto=format&fit=crop&w=400&q=80"
  },

  // Dubai
  {
    city: "Dubai",
    name: "Burj Khalifa Top Deck Observation",
    category: "Sightseeing",
    description: "Ascend to the 124th and 125th floors of the tallest tower in the world. Behold the futuristic Arabian desert landscape.",
    durationMinutes: 90,
    durationText: "1.5 hours",
    costNumeric: 42,
    costText: "$42",
    rating: 4.8,
    location: "Downtown Dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "Dubai",
    name: "Desert Safari, Dune Bashing & BBQ",
    category: "Adventure",
    description: "Cross high golden sand dunes in a 4x4 cruiser. Relax in a traditional Bedouin camp with camel riding, belly dances, and BBQ dinners.",
    durationMinutes: 360,
    durationText: "6 hours",
    costNumeric: 55,
    costText: "$55",
    rating: 4.9,
    location: "Al Lahbab Desert, Dubai",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
  },

  // London
  {
    city: "London",
    name: "Tower of London Crown Jewels Walk",
    category: "Culture",
    description: "Explore the ancient fortress, see the world-famous Crown Jewels collection, and hear dark tales from the Beefeaters.",
    durationMinutes: 150,
    durationText: "2.5 hours",
    costNumeric: 35,
    costText: "$35",
    rating: 4.8,
    location: "St Katharine's & Wapping, London",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80"
  },
  {
    city: "London",
    name: "British Museum Treasures Tour",
    category: "Culture",
    description: "Stand before the Rosetta Stone, Parthenon sculptures, and ancient mummies, guided by an archaeological specialist.",
    durationMinutes: 120,
    durationText: "2 hours",
    costNumeric: 0,
    costText: "Free",
    rating: 4.7,
    location: "Great Russell St, London",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80"
  }
];

// Fallback Generic Activities dataset for custom typed cities
const genericActivities = [
  {
    name: "Walking History & Architecture Tour",
    category: "Sightseeing",
    description: "Unravel local legends, iconic buildings, and hidden monuments on a walking path with a resident guide.",
    durationMinutes: 120,
    durationText: "2 hours",
    costNumeric: 15,
    costText: "$15",
    rating: 4.6,
    location: "City Center Square",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Traditional Food Tasting Trail",
    category: "Food & Dining",
    description: "Taste typical delicacies and street snacks, visiting long-standing local diners and family-owned markets.",
    durationMinutes: 150,
    durationText: "2.5 hours",
    costNumeric: 30,
    costText: "$30",
    rating: 4.8,
    location: "Old Town Market Place",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Sunset Nature Trail Hiking",
    category: "Nature",
    description: "Climb beautiful natural trails and enjoy panoramic scenic views as the sun drops behind mountains.",
    durationMinutes: 180,
    durationText: "3 hours",
    costNumeric: 0,
    costText: "Free",
    rating: 4.7,
    location: "National Reserve Ridges",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Evening Pub & Live Music Crawl",
    category: "Nightlife",
    description: "Explore the trendiest local cocktail spots and live jazz lounges, getting a true feel for local nightlife.",
    durationMinutes: 240,
    durationText: "4 hours",
    costNumeric: 20,
    costText: "$20",
    rating: 4.5,
    location: "Entertainment District",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Museum of Fine Arts guided tour",
    category: "Culture",
    description: "Admire beautiful classical and contemporary art pieces, hearing backstories of artists and historical items.",
    durationMinutes: 120,
    durationText: "2 hours",
    costNumeric: 12,
    costText: "$12",
    rating: 4.7,
    location: "Museum Boulevard",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80"
  }
];

// Global States
let searchQuery = "";
let selectedCategory = "All";
let selectedTypes = [];
let selectedCost = null;
let selectedDurations = [];
let activeSort = "recommended";
let trips = [];
let userId = "user-jay";
let apiFailure = false;

// Active contextual IDs
let activeTripId = null;
let activeStopId = null;

// DOM Elements
const exploreSearchInput = document.getElementById("exploreSearchInput");
const topbarSearchInput = document.getElementById("topbarSearchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const resultsGrid = document.getElementById("resultsGrid");
const skeletonGrid = document.getElementById("skeletonGrid");
const emptySearchState = document.getElementById("emptySearchState");
const errorSearchState = document.getElementById("errorSearchState");
const resultsCountText = document.getElementById("resultsCountText");
const popularExperiencesSection = document.getElementById("popularExperiencesSection");
const featuredGrid = document.getElementById("featuredGrid");
const tripSelectorSelect = document.getElementById("tripSelectorSelect");
const stopSelectorSelect = document.getElementById("stopSelectorSelect");
const filtersSidebar = document.getElementById("filtersSidebar");
const categoryStrip = document.getElementById("categoryStrip");

// Document Ready
document.addEventListener("DOMContentLoaded", () => {
  initializeActivitiesPage();
});

/**
 * Parses context query parameters, configures selectors and pulls data from localStorage
 */
function initializeActivitiesPage() {
  // Load session userId
  const storedUser = localStorage.getItem("globaltrotter_userId");
  if (storedUser) {
    userId = storedUser;
  }

  // Load Trips
  const storedTrips = localStorage.getItem("globaltrotter_trips");
  if (storedTrips) {
    trips = JSON.parse(storedTrips);
  }

  // Parse Query Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const tripIdParam = urlParams.get("tripId");
  const stopIdParam = urlParams.get("stopId");

  if (tripIdParam) activeTripId = tripIdParam;
  if (stopIdParam) activeStopId = stopIdParam;

  // Build select option arrays
  buildSelectorDropdowns();

  // Set Back link if in context
  configureBackToItineraryLink();

  // Load active data
  updateContextBanner();
  renderPopularExperiences();
  applyFiltersAndRender();
}

/**
 * Configure back navigation link
 */
function configureBackToItineraryLink() {
  const backNavContainer = document.getElementById("backNavContainer");
  const backToTripBtn = document.getElementById("backToTripBtn");

  if (activeTripId) {
    backToTripBtn.href = `itinerary.html?tripId=${activeTripId}`;
    backNavContainer.style.display = "block";
  } else {
    backNavContainer.style.display = "none";
  }
}

/**
 * Formulate Selector Options
 */
function buildSelectorDropdowns() {
  // Populate Trip Selector Dropdown
  tripSelectorSelect.innerHTML = '<option value="" disabled selected>-- Select a Trip --</option>';
  trips.forEach(trip => {
    const option = document.createElement("option");
    option.value = trip.id;
    option.textContent = trip.destination;
    if (trip.id === activeTripId) {
      option.selected = true;
    }
    tripSelectorSelect.appendChild(option);
  });

  // Populate Stop Selector Dropdown based on activeTripId
  populateStopSelector();
}

/**
 * Populate stop selector options depending on active trip
 */
function populateStopSelector() {
  stopSelectorSelect.innerHTML = '<option value="" disabled selected>-- Select a Stop Location --</option>';
  
  if (!activeTripId) {
    stopSelectorSelect.innerHTML = '<option value="" disabled>Select a trip first...</option>';
    return;
  }

  const selectedTrip = trips.find(t => t.id === activeTripId);
  if (selectedTrip && selectedTrip.stops && selectedTrip.stops.length > 0) {
    selectedTrip.stops.forEach(stop => {
      const option = document.createElement("option");
      option.value = stop.id;
      option.textContent = `${stop.city}, ${stop.country} (${formatDateShort(stop.startDate)} - ${formatDateShort(stop.endDate)})`;
      if (stop.id === activeStopId) {
        option.selected = true;
      }
      stopSelectorSelect.appendChild(option);
    });
  } else {
    stopSelectorSelect.innerHTML = '<option value="" disabled>No stops added to this trip.</option>';
    activeStopId = null;
  }
}

/**
 * Sync active trip and stop labels
 */
function updateContextBanner() {
  const tripLabel = document.getElementById("contextTripName");
  const cityLabel = document.getElementById("contextCityName");

  const selectedTrip = trips.find(t => t.id === activeTripId);
  if (selectedTrip) {
    tripLabel.textContent = selectedTrip.destination;
    
    const selectedStop = selectedTrip.stops ? selectedTrip.stops.find(s => s.id === activeStopId) : null;
    if (selectedStop) {
      cityLabel.innerHTML = `<svg viewBox="0 0 24 24" class="context-marker-icon"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg> ${selectedStop.city}, ${selectedStop.country}`;
    } else {
      cityLabel.textContent = "Select Stop Location";
      activeStopId = null;
    }
  } else {
    tripLabel.textContent = "No Trip Selected";
    cityLabel.textContent = "Select Stop Location";
    activeTripId = null;
    activeStopId = null;
  }
}

/**
 * Handle Trip Selector shifts
 */
function handleTripSelectionChange(tripId) {
  activeTripId = tripId;
  activeStopId = null; // reset stop selection

  const selectedTrip = trips.find(t => t.id === activeTripId);
  if (selectedTrip && selectedTrip.stops && selectedTrip.stops.length > 0) {
    activeStopId = selectedTrip.stops[0].id; // auto-select first stop
  }

  buildSelectorDropdowns();
  configureBackToItineraryLink();
  updateContextBanner();
  renderPopularExperiences();
  applyFiltersAndRender();
}

/**
 * Handle Stop Selector shifts
 */
function handleStopSelectionChange(stopId) {
  activeStopId = stopId;
  updateContextBanner();
  renderPopularExperiences();
  applyFiltersAndRender();
}

/**
 * Get active Stop details (city and country)
 */
function getActiveStopDetails() {
  if (!activeTripId || !activeStopId) return null;
  const trip = trips.find(t => t.id === activeTripId);
  if (!trip) return null;
  return trip.stops ? trip.stops.find(s => s.id === activeStopId) : null;
}

/**
 * Fetch activities dataset matching current city location
 */
function getActivitiesForCurrentStop() {
  const stop = getActiveStopDetails();
  if (!stop) return genericActivities; // fallback to generic if no stop context

  const matched = activitiesDatabase.filter(act => act.city.toLowerCase() === stop.city.toLowerCase());
  return matched.length > 0 ? matched : genericActivities;
}

/**
 * Sync search queries between main search and top bar search
 */
function syncAndExecuteSearch(val) {
  exploreSearchInput.value = val;
  handleSearchInput(val);
}

/**
 * Main search text query input
 */
function handleSearchInput(val) {
  searchQuery = val.trim();
  if (topbarSearchInput.value !== val) {
    topbarSearchInput.value = val;
  }

  if (searchQuery.length > 0) {
    clearSearchBtn.style.display = "flex";
    popularExperiencesSection.style.display = "none";
  } else {
    clearSearchBtn.style.display = "none";
    popularExperiencesSection.style.display = "block";
  }

  applyFiltersAndRender();
}

function clearSearch() {
  exploreSearchInput.value = "";
  topbarSearchInput.value = "";
  handleSearchInput("");
}

/**
 * Scroll chip ribbon selection
 */
function selectCategory(category, element) {
  selectedCategory = category;
  
  // Highlight active chip
  const chips = categoryStrip.querySelectorAll(".category-chip");
  chips.forEach(c => c.classList.remove("active"));
  element.classList.add("active");

  applyFiltersAndRender();
}

/**
 * Cost chip filters toggle
 */
function toggleCostFilter(cost, element) {
  const chips = document.querySelectorAll(".filter-chip-btn");

  if (selectedCost === cost) {
    selectedCost = null;
    element.classList.remove("active");
  } else {
    selectedCost = cost;
    chips.forEach(c => c.classList.remove("active"));
    element.classList.add("active");
  }

  applyFiltersAndRender();
}

/**
 * Mobile Filter slideout panels
 */
function toggleMobileFilters() {
  filtersSidebar.classList.toggle("visible");
}

// Close mobile filters drawer on clicking outside
document.addEventListener("click", (e) => {
  if (window.innerWidth <= 992) {
    const isClickInside = filtersSidebar.contains(e.target) || e.target.closest(".btn-mobile-filters");
    if (!isClickInside && filtersSidebar.classList.contains("visible")) {
      filtersSidebar.classList.remove("visible");
    }
  }
});

/**
 * Reset filter states
 */
function clearAllFilters() {
  selectedCategory = "All";
  const chips = categoryStrip.querySelectorAll(".category-chip");
  chips.forEach(c => {
    if (c.getAttribute("data-category") === "All") c.classList.add("active");
    else c.classList.remove("active");
  });

  selectedTypes = [];
  const typeChecks = document.querySelectorAll("input[name='typeFilter']");
  typeChecks.forEach(c => c.checked = false);

  selectedCost = null;
  const costChips = document.querySelectorAll(".filter-chip-btn");
  costChips.forEach(c => c.classList.remove("active"));

  selectedDurations = [];
  const durChecks = document.querySelectorAll("input[name='durationFilter']");
  durChecks.forEach(c => c.checked = false);

  applyFiltersAndRender();
}

/**
 * Gather filters values and compute
 */
function applyFilters() {
  // Types checkboxes
  const typeChecks = document.querySelectorAll("input[name='typeFilter']:checked");
  selectedTypes = Array.from(typeChecks).map(c => c.value);

  // Durations checkboxes
  const durChecks = document.querySelectorAll("input[name='durationFilter']:checked");
  selectedDurations = Array.from(durChecks).map(c => c.value);

  applyFiltersAndRender();
}

function applySorting(val) {
  activeSort = val;
  applyFiltersAndRender();
}

/**
 * Main filtering and sorting execution
 */
function applyFiltersAndRender() {
  resultsGrid.style.display = "none";
  skeletonGrid.style.display = "grid";
  emptySearchState.style.display = "none";
  errorSearchState.style.display = "none";
  resultsCountText.textContent = "Loading experiences...";

  setTimeout(() => {
    skeletonGrid.style.display = "none";

    if (apiFailure) {
      errorSearchState.style.display = "flex";
      resultsCountText.textContent = "Error loading activities";
      return;
    }

    const rawActivities = getActivitiesForCurrentStop();

    // Filter list
    let filtered = rawActivities.filter(act => {
      // 1. Text Search matching name, description, category
      if (searchQuery.length > 0) {
        const query = searchQuery.toLowerCase();
        const matches = 
          act.name.toLowerCase().includes(query) || 
          act.description.toLowerCase().includes(query) || 
          act.category.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // 2. Scrolling Category strip match
      if (selectedCategory !== "All") {
        if (act.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // 3. Sidebar Type checkbox match (ANY)
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(act.category)) return false;
      }

      // 4. Cost Index matching
      if (selectedCost) {
        if (selectedCost === "Free" && act.costNumeric !== 0) return false;
        if (selectedCost === "Budget" && (act.costNumeric === 0 || act.costNumeric > 15)) return false;
        if (selectedCost === "Moderate" && (act.costNumeric <= 15 || act.costNumeric > 45)) return false;
        if (selectedCost === "Expensive" && act.costNumeric <= 45) return false;
      }

      // 5. Duration match (ANY)
      if (selectedDurations.length > 0) {
        let matchDuration = false;
        if (selectedDurations.includes("Under 1 hour") && act.durationMinutes < 60) matchDuration = true;
        if (selectedDurations.includes("1–3 hours") && (act.durationMinutes >= 60 && act.durationMinutes <= 180)) matchDuration = true;
        if (selectedDurations.includes("3–6 hours") && (act.durationMinutes > 180 && act.durationMinutes <= 360)) matchDuration = true;
        if (selectedDurations.includes("Full day") && act.durationMinutes > 360) matchDuration = true;
        if (!matchDuration) return false;
      }

      return true;
    });

    // Sort list
    filtered.sort((a, b) => {
      if (activeSort === "recommended") {
        return b.rating - a.rating; // sort by highest rating
      } else if (activeSort === "popularity") {
        return b.rating - a.rating;
      } else if (activeSort === "cost_asc") {
        return a.costNumeric - b.costNumeric;
      } else if (activeSort === "cost_desc") {
        return b.costNumeric - a.costNumeric;
      } else if (activeSort === "duration_asc") {
        return a.durationMinutes - b.durationMinutes;
      } else if (activeSort === "duration_desc") {
        return b.durationMinutes - a.durationMinutes;
      }
      return 0;
    });

    resultsCountText.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'experience' : 'experiences'}`;
    renderActivityCards(filtered);
  }, 400);
}

/**
 * Dynamic HTML render of experiences cards
 */
function renderActivityCards(list) {
  resultsGrid.innerHTML = "";

  if (list.length === 0) {
    resultsGrid.style.display = "none";
    emptySearchState.style.display = "flex";
    return;
  }

  resultsGrid.style.display = "grid";
  emptySearchState.style.display = "none";

  // Get stops timeline activities to compare Added status
  const currentStop = getActiveStopDetails();
  const addedActivityNames = currentStop && currentStop.activities ? currentStop.activities.map(a => a.name.toLowerCase()) : [];

  list.forEach(act => {
    const card = document.createElement("article");
    card.className = "city-card";
    
    const isAdded = addedActivityNames.includes(act.name.toLowerCase());
    const costText = act.costNumeric === 0 ? "Free" : act.costText;

    card.innerHTML = `
      <div class="city-image-container" onclick="openActivityDetailsDrawer('${act.name}')">
        <img src="${act.image}" alt="Beautiful photo of ${act.name}" class="city-card-img" loading="lazy">
        <div class="city-image-overlay"></div>
        <span class="city-region-badge">${act.category}</span>
        <span class="city-popularity-badge">${act.rating} ★</span>
      </div>
      <div class="city-card-body">
        <div onclick="openActivityDetailsDrawer('${act.name}')" style="cursor: pointer;">
          <h4 class="city-card-title">${act.name}</h4>
          <span class="city-card-country">${act.durationText} • ${act.location}</span>
          <p class="city-card-desc">${act.description}</p>
        </div>
        <div class="city-card-meta" onclick="openActivityDetailsDrawer('${act.name}')" style="cursor: pointer;">
          <span class="city-cost-indicator">Cost: <strong>${costText}</strong></span>
          <span class="city-popularity-metric">Rating: <strong>${act.rating}</strong></span>
        </div>
        <button id="addBtn-${act.name.replace(/\s+/g, '-')}" class="btn-add-to-trip ${isAdded ? 'added' : ''}" 
                onclick="event.stopPropagation(); handleAddOrRemoveBtn('${act.name}', ${isAdded})">
          <span class="btn-text-label">${isAdded ? 'Added ✓' : 'Add to Trip'}</span>
        </button>
      </div>
    `;
    resultsGrid.appendChild(card);
  });
}

/**
 * Render featured destinations Popular Experiences section
 */
function renderPopularExperiences() {
  featuredGrid.innerHTML = "";
  const raw = getActivitiesForCurrentStop();
  
  // Take top 3 highest rated experiences for this city
  const popular = [...raw].sort((a,b) => b.rating - a.rating).slice(0, 3);
  const currentStop = getActiveStopDetails();
  const addedActivityNames = currentStop && currentStop.activities ? currentStop.activities.map(a => a.name.toLowerCase()) : [];

  const stopLabel = currentStop ? `${currentStop.city}, ${currentStop.country}` : "Selected Destination";
  document.getElementById("featuredSectionTitle").textContent = `Popular Experiences in ${stopLabel}`;

  popular.forEach(act => {
    const card = document.createElement("article");
    card.className = "city-card";
    
    const isAdded = addedActivityNames.includes(act.name.toLowerCase());
    const costText = act.costNumeric === 0 ? "Free" : act.costText;

    card.innerHTML = `
      <div class="city-image-container" onclick="openActivityDetailsDrawer('${act.name}')">
        <img src="${act.image}" alt="Beautiful photo of ${act.name}" class="city-card-img">
        <div class="city-image-overlay"></div>
        <span class="city-region-badge">${act.category}</span>
      </div>
      <div class="city-card-body">
        <div onclick="openActivityDetailsDrawer('${act.name}')" style="cursor: pointer;">
          <h4 class="city-card-title">${act.name}</h4>
          <span class="city-card-country">${act.durationText} • ${costText}</span>
        </div>
        <button id="featAddBtn-${act.name.replace(/\s+/g, '-')}" class="btn-add-to-trip ${isAdded ? 'added' : ''}" 
                onclick="event.stopPropagation(); handleAddOrRemoveBtn('${act.name}', ${isAdded})">
          <span class="btn-text-label">${isAdded ? 'Added ✓' : 'Add to Trip'}</span>
        </button>
      </div>
    `;
    featuredGrid.appendChild(card);
  });
}

/**
 * Dynamic Details Drawer populating
 */
function openActivityDetailsDrawer(activityName) {
  const raw = getActivitiesForCurrentStop();
  const act = raw.find(a => a.name.toLowerCase() === activityName.toLowerCase());
  if (!act) return;

  document.getElementById("drawerActivityImage").src = act.image;
  document.getElementById("drawerActivityImage").alt = `Scenic image for ${act.name}`;
  document.getElementById("drawerActivityName").textContent = act.name;
  document.getElementById("drawerActivityCategory").textContent = act.category;
  document.getElementById("drawerCostBadge").textContent = act.costNumeric === 0 ? "Free" : act.costText;
  document.getElementById("drawerRatingText").textContent = `${act.rating} ★`;
  document.getElementById("drawerRatingBar").style.width = `${(act.rating / 5.0) * 100}%`;
  document.getElementById("drawerActivityDescription").textContent = act.description;
  document.getElementById("drawerDurationText").textContent = act.durationText;
  document.getElementById("drawerLocationText").textContent = act.location;

  // Set action footer
  const drawerAddButton = document.getElementById("drawerAddButton");
  drawerAddButton.setAttribute("onclick", `handleDrawerBtnClick('${act.name}')`);
  
  const currentStop = getActiveStopDetails();
  const isAdded = currentStop && currentStop.activities && currentStop.activities.some(a => a.name.toLowerCase() === act.name.toLowerCase());

  if (isAdded) {
    drawerAddButton.classList.add("added");
    drawerAddButton.innerHTML = "Added ✓ (Click to Remove)";
    // Hover toggle effect on drawer button too
    drawerAddButton.onmouseenter = () => {
      drawerAddButton.style.backgroundColor = "var(--error)";
      drawerAddButton.style.borderColor = "var(--error)";
      drawerAddButton.textContent = "Remove Experience";
    };
    drawerAddButton.onmouseleave = () => {
      drawerAddButton.style.backgroundColor = "";
      drawerAddButton.style.borderColor = "";
      drawerAddButton.textContent = "Added ✓";
    };
  } else {
    drawerAddButton.classList.remove("added");
    drawerAddButton.disabled = false;
    drawerAddButton.onmouseenter = null;
    drawerAddButton.onmouseleave = null;
    drawerAddButton.innerHTML = "Schedule Experience";
  }

  document.getElementById("activityDetailsDrawer").classList.add("visible");
}

function closeActivityDetailsDrawer() {
  document.getElementById("activityDetailsDrawer").classList.remove("visible");
}

function closeDrawerOnBackdrop(event) {
  if (event.target === document.getElementById("activityDetailsDrawer")) {
    closeActivityDetailsDrawer();
  }
}

/**
 * Handle Add/Remove trigger buttons directly on card
 */
function handleAddOrRemoveBtn(activityName, isAdded) {
  if (isAdded) {
    // Already added: trigger remove confirmation
    confirmRemoveActivity(activityName);
  } else {
    // Not added: open scheduling modal
    openAddActivityModal(activityName);
  }
}

function handleDrawerBtnClick(activityName) {
  const currentStop = getActiveStopDetails();
  const isAdded = currentStop && currentStop.activities && currentStop.activities.some(a => a.name.toLowerCase() === activityName.toLowerCase());
  
  closeActivityDetailsDrawer();
  
  if (isAdded) {
    confirmRemoveActivity(activityName);
  } else {
    openAddActivityModal(activityName);
  }
}

/**
 * Open scheduling modal
 */
function openAddActivityModal(activityName) {
  const raw = getActivitiesForCurrentStop();
  const act = raw.find(a => a.name.toLowerCase() === activityName.toLowerCase());
  if (!act) return;

  const currentStop = getActiveStopDetails();
  if (!currentStop) {
    showToast("Please select a trip and stop location first.", "error");
    return;
  }

  document.getElementById("addActivityForm").reset();

  document.getElementById("modalActivityLabel").textContent = act.name;
  document.getElementById("modalSelectedActivityName").value = act.name;
  document.getElementById("modalSelectedActivityCost").value = act.costNumeric;
  document.getElementById("modalSelectedActivityDuration").value = act.durationText;

  // Build Date selector dropdown with dates inside stop boundaries
  const dateSelect = document.getElementById("modalActivityDateSelect");
  dateSelect.innerHTML = "";

  const dates = getDatesListInRange(currentStop.startDate, currentStop.endDate);
  dates.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = formatDateLong(d);
    dateSelect.appendChild(opt);
  });

  document.getElementById("addActivityModal").classList.add("visible");
}

function closeAddActivityModal() {
  document.getElementById("addActivityModal").classList.remove("visible");
}

/**
 * Return array of ISO dates between start and end inclusive
 */
function getDatesListInRange(startStr, endStr) {
  const dates = [];
  let curr = new Date(startStr);
  const end = new Date(endStr);
  while (curr <= end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

/**
 * Submit activity scheduling form
 */
function handleActivitySubmit(event) {
  event.preventDefault();

  const name = document.getElementById("modalSelectedActivityName").value;
  const cost = parseFloat(document.getElementById("modalSelectedActivityCost").value) || 0;
  const duration = document.getElementById("modalSelectedActivityDuration").value;
  const date = document.getElementById("modalActivityDateSelect").value;
  const time = document.getElementById("modalActivityTimeInput").value;

  const currentStop = getActiveStopDetails();
  if (!currentStop) return;

  // Prevent duplicate additions
  if (!currentStop.activities) {
    currentStop.activities = [];
  }
  const isDuplicate = currentStop.activities.some(a => a.name.toLowerCase() === name.toLowerCase());
  if (isDuplicate) {
    showToast(`"${name}" is already scheduled on this stop itinerary.`, "error");
    closeAddActivityModal();
    return;
  }

  // Create new activity object matching itinerary schema
  const newActivity = {
    id: `act-${Date.now()}`,
    name: name,
    date: date,
    time: time || null,
    duration: duration,
    cost: cost
  };

  // Append and save to localStorage
  currentStop.activities.push(newActivity);
  
  // Update trip stats (activities count)
  const tripObj = trips.find(t => t.id === activeTripId);
  tripObj.activitiesVal = tripObj.stops.reduce((sum, s) => sum + (s.activities ? s.activities.length : 0), 0);

  localStorage.setItem("globaltrotter_trips", JSON.stringify(trips));

  // Success animations
  const submitBtn = event.target.querySelector(".submit-btn");
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");

  setTimeout(() => {
    submitBtn.classList.remove("loading");
    submitBtn.classList.add("success");

    setTimeout(() => {
      submitBtn.classList.remove("success");
      submitBtn.disabled = false;
      closeAddActivityModal();
      
      showToast(`Scheduled "${name}" on your itinerary!`, "success");
      
      // Re-render UI state
      renderPopularExperiences();
      applyFiltersAndRender();
    }, 700);

  }, 1000);
}

/**
 * Confirms deletion of scheduled experiences
 */
function confirmRemoveActivity(activityName) {
  const currentStop = getActiveStopDetails();
  if (!currentStop) return;

  const confirmed = confirm(`Are you sure you want to remove "${activityName}" from your scheduled stop itinerary?`);
  if (!confirmed) return;

  // Filter out matching activity
  currentStop.activities = currentStop.activities.filter(a => a.name.toLowerCase() !== activityName.toLowerCase());

  // Save changes
  const tripObj = trips.find(t => t.id === activeTripId);
  tripObj.activitiesVal = tripObj.stops.reduce((sum, s) => sum + (s.activities ? s.activities.length : 0), 0);
  localStorage.setItem("globaltrotter_trips", JSON.stringify(trips));

  showToast(`Removed "${activityName}" from your schedule.`, "success");

  // Re-render UI panels immediately
  renderPopularExperiences();
  applyFiltersAndRender();
}

/**
 * Handle modal backdrop close triggers
 */
function closeModalOnBackdrop(event, modalId) {
  if (event.target === document.getElementById(modalId)) {
    if (modalId === "addActivityModal") closeAddActivityModal();
  }
}

/**
 * Floating Toasts System
 */
function showToast(message, type = "success") {
  let toastContainer = document.getElementById("dashboardToast");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "dashboardToast";
    toastContainer.style.position = "fixed";
    toastContainer.style.top = "20px";
    toastContainer.style.right = "20px";
    toastContainer.style.padding = "12px 20px";
    toastContainer.style.borderRadius = "8px";
    toastContainer.style.fontSize = "0.9rem";
    toastContainer.style.fontWeight = "500";
    toastContainer.style.zIndex = "2000";
    toastContainer.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
    toastContainer.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    toastContainer.style.transform = "translateY(-20px)";
    toastContainer.style.opacity = "0";
    document.body.appendChild(toastContainer);
  }

  if (type === "success") {
    toastContainer.style.backgroundColor = "rgba(45, 106, 79, 0.15)";
    toastContainer.style.color = "#2D6A4F";
    toastContainer.style.border = "1px solid rgba(45, 106, 79, 0.3)";
  } else {
    toastContainer.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
    toastContainer.style.color = "#EF4444";
    toastContainer.style.border = "1px solid rgba(239, 68, 68, 0.3)";
  }

  toastContainer.textContent = message;
  toastContainer.style.transform = "translateY(0)";
  toastContainer.style.opacity = "1";

  setTimeout(() => {
    toastContainer.style.transform = "translateY(-20px)";
    toastContainer.style.opacity = "0";
  }, 3500);
}

function showSimulatedAction(text) {
  showToast(text, "success");
}

function toggleApiErrorSim(checked) {
  apiFailure = checked;
  applyFiltersAndRender();
}

function retryLoadingActivities() {
  document.getElementById("apiFailureToggle").checked = false;
  apiFailure = false;
  applyFiltersAndRender();
}

/**
 * Formatting utilities
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

function handleLogout() {
  showToast("Logging out safely...", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}
