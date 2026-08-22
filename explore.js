// ==========================================================================
// GlobalTrotters Discover Screen - Business Logic & localStorage integration
// ==========================================================================

// Comprehensive Cities Dataset
const citiesDatabase = [
  {
    city: "Paris",
    country: "France",
    region: "Europe",
    description: "The City of Light is a global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.",
    costIndex: "Expensive",
    popularity: 95,
    language: "French",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Tokyo",
    country: "Japan",
    region: "Asia",
    description: "Japan's busy capital mixes ultra-modern skyscrapers with historic Shinto shrines. It is renowned for its incredible culinary scene, anime culture, and cherry blossom seasons.",
    costIndex: "Expensive",
    popularity: 98,
    language: "Japanese",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    region: "Asia",
    description: "Known for luxury shopping, ultramodern architecture, and a lively nightlife scene. Burj Khalifa, an 830m-tall tower, dominates the skyscraper-filled skyline.",
    costIndex: "Expensive",
    popularity: 92,
    language: "Arabic",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    description: "The capital of England and the United Kingdom, London is a 21st-century city with history stretching back to Roman times, home to iconic Big Ben and Parliament.",
    costIndex: "Expensive",
    popularity: 94,
    language: "English",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    description: "Renowned for its artistic heritage, elaborate canal system, and narrow houses with gabled facades, legacies of the city's 17th-century Golden Age.",
    costIndex: "Moderate",
    popularity: 88,
    language: "Dutch",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Rome",
    country: "Italy",
    region: "Europe",
    description: "A potent blend of haunting ruins, awe-inspiring art, and vibrant street life. Italy's hot-blooded capital is one of the world's most romantic and charismatic cities.",
    costIndex: "Moderate",
    popularity: 96,
    language: "Italian",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Kyoto",
    country: "Japan",
    region: "Asia",
    description: "Famous for its thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses, keeping ancient cultures alive.",
    costIndex: "Moderate",
    popularity: 87,
    language: "Japanese",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Barcelona",
    country: "Spain",
    region: "Europe",
    description: "The cosmopolitan capital of Spain's Catalonia region, known for its art and architecture, notably the fantastical Sagrada Família church designed by Antoni Gaudí.",
    costIndex: "Moderate",
    popularity: 91,
    language: "Spanish",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "New York",
    country: "United States",
    region: "North America",
    description: "Comprising 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that's among the world's major centers.",
    costIndex: "Expensive",
    popularity: 97,
    language: "English",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Venice",
    country: "Italy",
    region: "Europe",
    description: "The capital of northern Italy's Veneto region, built on more than 100 small islands in a lagoon in the Adriatic Sea. It has no roads, just canals lined with Renaissance palaces.",
    costIndex: "Expensive",
    popularity: 89,
    language: "Italian",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Sydney",
    country: "Australia",
    region: "Oceania",
    description: "Capital of New South Wales and one of Australia's largest cities, best known for its Sydney Opera House, with a distinctive sail-like design, and massive Harbour Bridge.",
    costIndex: "Expensive",
    popularity: 90,
    language: "English",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Cape Town",
    country: "South Africa",
    region: "Africa",
    description: "A port city on South Africa's southwest coast, on a peninsula beneath the imposing Table Mountain. Rotating cable cars climb to the mountain's flat top.",
    costIndex: "Budget",
    popularity: 85,
    language: "English",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Rio de Janeiro",
    country: "Brazil",
    region: "South America",
    description: "A huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop Mount Corcovado and for its sprawling Carnival festival.",
    costIndex: "Budget",
    popularity: 86,
    language: "Portuguese",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Cairo",
    country: "Egypt",
    region: "Africa",
    description: "Egypt's sprawling capital, set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum, housing a trove of antiquities including royal mummies.",
    costIndex: "Budget",
    popularity: 84,
    language: "Arabic",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Reykjavik",
    country: "Iceland",
    region: "Europe",
    description: "Iceland's coastal capital, home to the National and Saga museums, tracing Iceland's Viking heritage. The striking concrete Hallgrímskirkja church is a key landmark.",
    costIndex: "Expensive",
    popularity: 83,
    language: "Icelandic",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Bangkok",
    country: "Thailand",
    region: "Asia",
    description: "Thailand's capital, known for ornate shrines and vibrant street life. The boat-filled Chao Phraya River feeds its network of canals, flowing past the Royal Grand Palace.",
    costIndex: "Budget",
    popularity: 93,
    language: "Thai",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80"
  },
  {
    city: "Queenstown",
    country: "New Zealand",
    region: "Oceania",
    description: "Nestled on the shores of the crystal clear Lake Wakatipu and set against the dramatic Southern Alps, Queenstown is the adventure capital of the Southern Hemisphere.",
    costIndex: "Moderate",
    popularity: 82,
    language: "English",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
  }
];

// Global State
let searchQuery = "";
let selectedCountry = "";
let selectedRegions = [];
let selectedCost = null;
let selectedPopularity = "All";
let activeSort = "popularity";
let activeTripId = null;
let trips = [];
let userId = "user-jay";
let apiFailure = false;

// DOM Elements
const exploreSearchInput = document.getElementById("exploreSearchInput");
const topbarSearchInput = document.getElementById("topbarSearchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const resultsGrid = document.getElementById("resultsGrid");
const skeletonGrid = document.getElementById("skeletonGrid");
const emptySearchState = document.getElementById("emptySearchState");
const errorSearchState = document.getElementById("errorSearchState");
const resultsCountText = document.getElementById("resultsCountText");
const featuredDestinationsSection = document.getElementById("featuredDestinationsSection");
const featuredGrid = document.getElementById("featuredGrid");
const filterCountryInput = document.getElementById("filterCountryInput");
const filterCountryDropdown = document.getElementById("filterCountryDropdown");
const filtersSidebar = document.getElementById("filtersSidebar");

// Document Load Event
document.addEventListener("DOMContentLoaded", () => {
  initializeExplorePage();
});

/**
 * Setup data states, parses parameters, and triggers first load
 */
function initializeExplorePage() {
  // Load session userId or set default
  const storedUser = localStorage.getItem("globaltrotter_userId");
  if (storedUser) {
    userId = storedUser;
  } else {
    localStorage.setItem("globaltrotter_userId", userId);
  }

  // Load Trips
  const storedTrips = localStorage.getItem("globaltrotter_trips");
  if (storedTrips) {
    trips = JSON.parse(storedTrips);
  }

  // Parse Query Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const tripIdParam = urlParams.get("tripId");
  if (tripIdParam) {
    activeTripId = tripIdParam;
    const activeTrip = trips.find(t => t.id === activeTripId);
    if (activeTrip) {
      // Configure back to itinerary button
      const backNavContainer = document.getElementById("backNavContainer");
      const backToTripBtn = document.getElementById("backToTripBtn");
      backToTripBtn.href = `itinerary.html?tripId=${activeTripId}`;
      backToTripBtn.innerHTML = `
        <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to "${activeTrip.destination}" Itinerary
      `;
      backNavContainer.style.display = "block";
    }
  }

  // Generate unique countries dropdown lists
  populateCountryFilterDropdown();

  // Initial rendering
  renderFeaturedDestinations();
  applyFiltersAndRender();
}

/**
 * Create country dropdown dynamically from unique countries in the dataset
 */
function populateCountryFilterDropdown() {
  const uniqueCountries = [...new Set(citiesDatabase.map(c => c.country))].sort();
  filterCountryDropdown.innerHTML = "";
  
  uniqueCountries.forEach(country => {
    const item = document.createElement("div");
    item.className = "filter-dropdown-item";
    item.textContent = country;
    item.onclick = () => {
      filterCountryInput.value = country;
      selectedCountry = country;
      filterCountryDropdown.classList.remove("visible");
      applyFiltersAndRender();
    };
    filterCountryDropdown.appendChild(item);
  });
}

/**
 * Handle autocomplete filter matching for countries
 */
function handleCountryFilterInput(val) {
  selectedCountry = val.trim();
  const query = val.toLowerCase().trim();
  const items = filterCountryDropdown.querySelectorAll(".filter-dropdown-item");
  let matches = 0;

  items.forEach(item => {
    if (item.textContent.toLowerCase().includes(query)) {
      item.style.display = "block";
      matches++;
    } else {
      item.style.display = "none";
    }
  });

  if (query.length > 0 && matches > 0) {
    filterCountryDropdown.classList.add("visible");
  } else {
    filterCountryDropdown.classList.remove("visible");
  }

  applyFiltersAndRender();
}

// Close dropdown on click outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".filter-country-search")) {
    filterCountryDropdown.classList.remove("visible");
  }
});

/**
 * Sync search queries between main search and sidebar header search
 */
function syncAndExecuteSearch(val) {
  exploreSearchInput.value = val;
  handleSearchInput(val);
}

/**
 * Main search input handler
 */
function handleSearchInput(val) {
  searchQuery = val.trim();
  if (topbarSearchInput.value !== val) {
    topbarSearchInput.value = val;
  }

  if (searchQuery.length > 0) {
    clearSearchBtn.style.display = "flex";
    // Hide featured destinations panel when actively searching
    featuredDestinationsSection.style.display = "none";
  } else {
    clearSearchBtn.style.display = "none";
    featuredDestinationsSection.style.display = "block";
  }

  applyFiltersAndRender();
}

/**
 * Executes search directly from Try badges
 */
function executeQuickSearch(cityName) {
  exploreSearchInput.value = cityName;
  handleSearchInput(cityName);
}

/**
 * Clear active search inputs
 */
function clearSearch() {
  exploreSearchInput.value = "";
  topbarSearchInput.value = "";
  handleSearchInput("");
}

/**
 * Toggles Cost filters chips
 */
function toggleCostFilter(element) {
  const cost = element.getAttribute("data-cost");
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
 * Toggle mobile sidebar filters drawer
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
 * Clear filter states
 */
function clearAllFilters() {
  selectedCountry = "";
  filterCountryInput.value = "";
  filterCountryDropdown.classList.remove("visible");

  selectedRegions = [];
  const regionChecks = document.querySelectorAll("input[name='regionFilter']");
  regionChecks.forEach(c => c.checked = false);

  selectedCost = null;
  const chips = document.querySelectorAll(".filter-chip-btn");
  chips.forEach(c => c.classList.remove("active"));

  selectedPopularity = "All";
  const popRadios = document.querySelectorAll("input[name='popularityFilter']");
  popRadios.forEach(r => {
    if (r.value === "All") r.checked = true;
    else r.checked = false;
  });

  applyFiltersAndRender();
}

/**
 * Triggered on checkbox and radio filters state changes
 */
function applyFilters() {
  // Collect regions checked
  const regionChecks = document.querySelectorAll("input[name='regionFilter']:checked");
  selectedRegions = Array.from(regionChecks).map(c => c.value);

  // Collect popularity select
  const popRadio = document.querySelector("input[name='popularityFilter']:checked");
  selectedPopularity = popRadio ? popRadio.value : "All";

  applyFiltersAndRender();
}

/**
 * Handles sorting selection
 */
function applySorting(val) {
  activeSort = val;
  applyFiltersAndRender();
}

/**
 * Main filtering and sorting engine
 */
function applyFiltersAndRender() {
  // Show skeleton loaders during simulated database fetching delay
  resultsGrid.style.display = "none";
  skeletonGrid.style.display = "grid";
  emptySearchState.style.display = "none";
  errorSearchState.style.display = "none";
  resultsCountText.textContent = "Loading cities...";

  setTimeout(() => {
    skeletonGrid.style.display = "none";

    // Handle error simulation
    if (apiFailure) {
      errorSearchState.style.display = "flex";
      resultsCountText.textContent = "Error loading cities";
      return;
    }

    // Filter cities
    let filtered = citiesDatabase.filter(city => {
      // 1. Text Search matching name, country, or region
      if (searchQuery.length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesText = 
          city.city.toLowerCase().includes(query) || 
          city.country.toLowerCase().includes(query) || 
          city.region.toLowerCase().includes(query);
        if (!matchesText) return false;
      }

      // 2. Country match
      if (selectedCountry.length > 0) {
        if (city.country.toLowerCase() !== selectedCountry.toLowerCase()) return false;
      }

      // 3. Regions checked matches (ANY)
      if (selectedRegions.length > 0) {
        if (!selectedRegions.includes(city.region)) return false;
      }

      // 4. Cost Index matching
      if (selectedCost) {
        if (city.costIndex !== selectedCost) return false;
      }

      // 5. Popularity levels
      if (selectedPopularity === "Most Popular") {
        if (city.popularity < 90) return false;
      } else if (selectedPopularity === "Trending") {
        if (city.popularity < 80) return false;
      }

      return true;
    });

    // Sort cities
    filtered.sort((a, b) => {
      if (activeSort === "popularity") {
        return b.popularity - a.popularity;
      } else if (activeSort === "cost_asc") {
        return getCostValue(a.costIndex) - getCostValue(b.costIndex);
      } else if (activeSort === "cost_desc") {
        return getCostValue(b.costIndex) - getCostValue(a.costIndex);
      } else if (activeSort === "name") {
        return a.city.localeCompare(b.city);
      }
      return 0;
    });

    // Update count labels
    resultsCountText.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'destination' : 'destinations'}`;

    // Render elements
    renderCityCards(filtered);
  }, 400); // realistic responsive delay
}

/**
 * Returns integer weight values for cost comparison sorting
 */
function getCostValue(level) {
  if (level === "Budget") return 1;
  if (level === "Moderate") return 2;
  return 3;
}

/**
 * Generates HTML list cards
 */
function renderCityCards(citiesList) {
  resultsGrid.innerHTML = "";

  if (citiesList.length === 0) {
    resultsGrid.style.display = "none";
    emptySearchState.style.display = "flex";
    return;
  }

  resultsGrid.style.display = "grid";
  emptySearchState.style.display = "none";

  citiesList.forEach(city => {
    const card = document.createElement("article");
    card.className = "city-card";
    
    // Check if the city is already in stops of the active trip (if activeTripId is set)
    let isAdded = false;
    if (activeTripId) {
      const tripObj = trips.find(t => t.id === activeTripId);
      if (tripObj && tripObj.stops) {
        isAdded = tripObj.stops.some(stop => stop.city.toLowerCase() === city.city.toLowerCase());
      }
    }

    card.innerHTML = `
      <div class="city-image-container" onclick="openCityDetailsDrawer('${city.city}')">
        <img src="${city.image}" alt="Beautiful scenery in ${city.city}" class="city-card-img" loading="lazy">
        <div class="city-image-overlay"></div>
        <span class="city-region-badge">${city.region}</span>
        <span class="city-popularity-badge">${city.popularity}/100</span>
      </div>
      <div class="city-card-body">
        <div onclick="openCityDetailsDrawer('${city.city}')" style="cursor: pointer;">
          <h4 class="city-card-title">${city.city}</h4>
          <span class="city-card-country">${city.country}</span>
          <p class="city-card-desc">${city.description}</p>
        </div>
        <div class="city-card-meta" onclick="openCityDetailsDrawer('${city.city}')" style="cursor: pointer;">
          <span class="city-cost-indicator">Cost: ${getCostSymbols(city.costIndex)}</span>
          <span class="city-popularity-metric">Score: <strong>${city.popularity}</strong></span>
        </div>
        <button id="addBtn-${city.city.replace(/\s+/g, '-')}" class="btn-add-to-trip ${isAdded ? 'added' : ''}" 
                onclick="event.stopPropagation(); handleAddButtonTrigger('${city.city}')" ${isAdded ? 'disabled' : ''}>
          ${isAdded ? 'Added ✓' : 'Add to Trip'}
        </button>
      </div>
    `;
    resultsGrid.appendChild(card);
  });
}

/**
 * Return styled dollar signs for cost index
 */
function getCostSymbols(level) {
  if (level === "Budget") return "<span>$</span>$$";
  if (level === "Moderate") return "<span>$$</span>$";
  return "<span>$$$</span>";
}

/**
 * Render Popular destinations section (before searching / by default)
 */
function renderFeaturedDestinations() {
  featuredGrid.innerHTML = "";
  
  // Display the top 5 highest popularity cities in our database
  const popular = [...citiesDatabase].sort((a,b) => b.popularity - a.popularity).slice(0, 5);

  popular.forEach(city => {
    const card = document.createElement("article");
    card.className = "city-card";
    
    let isAdded = false;
    if (activeTripId) {
      const tripObj = trips.find(t => t.id === activeTripId);
      if (tripObj && tripObj.stops) {
        isAdded = tripObj.stops.some(stop => stop.city.toLowerCase() === city.city.toLowerCase());
      }
    }

    card.innerHTML = `
      <div class="city-image-container" onclick="openCityDetailsDrawer('${city.city}')">
        <img src="${city.image}" alt="Beautiful scenery in ${city.city}" class="city-card-img">
        <div class="city-image-overlay"></div>
        <span class="city-region-badge">${city.region}</span>
      </div>
      <div class="city-card-body">
        <div onclick="openCityDetailsDrawer('${city.city}')" style="cursor: pointer;">
          <h4 class="city-card-title">${city.city}</h4>
          <span class="city-card-country">${city.country}</span>
        </div>
        <button id="featAddBtn-${city.city.replace(/\s+/g, '-')}" class="btn-add-to-trip ${isAdded ? 'added' : ''}" 
                onclick="event.stopPropagation(); handleAddButtonTrigger('${city.city}')" ${isAdded ? 'disabled' : ''}>
          ${isAdded ? 'Added ✓' : 'Add to Trip'}
        </button>
      </div>
    `;
    featuredGrid.appendChild(card);
  });
}

/**
 * Drawer Detail Slideout Toggle
 */
function openCityDetailsDrawer(cityName) {
  const city = citiesDatabase.find(c => c.city.toLowerCase() === cityName.toLowerCase());
  if (!city) return;

  document.getElementById("drawerCityImage").src = city.image;
  document.getElementById("drawerCityImage").alt = `Beautiful view of ${city.city}`;
  document.getElementById("drawerCityName").textContent = city.city;
  document.getElementById("drawerCityLocation").textContent = `${city.country} • ${city.region}`;
  document.getElementById("drawerCostBadge").textContent = city.costIndex === 'Budget' ? '$' : (city.costIndex === 'Moderate' ? '$$' : '$$$');
  document.getElementById("drawerPopularityText").textContent = `${city.popularity}/100`;
  document.getElementById("drawerPopularityBar").style.width = `${city.popularity}%`;
  document.getElementById("drawerCityDescription").textContent = city.description;
  document.getElementById("drawerRegionText").textContent = city.region;
  document.getElementById("drawerLanguageText").textContent = city.language;

  // Configure drawer Add to Trip button click
  const drawerAddButton = document.getElementById("drawerAddButton");
  drawerAddButton.setAttribute("onclick", `handleAddFromDrawer('${city.city}')`);
  
  // Set added state if already in active trip
  let isAdded = false;
  if (activeTripId) {
    const tripObj = trips.find(t => t.id === activeTripId);
    if (tripObj && tripObj.stops) {
      isAdded = tripObj.stops.some(stop => stop.city.toLowerCase() === city.city.toLowerCase());
    }
  }

  if (isAdded) {
    drawerAddButton.classList.add("added");
    drawerAddButton.disabled = true;
    drawerAddButton.innerHTML = "Added ✓";
  } else {
    drawerAddButton.classList.remove("added");
    drawerAddButton.disabled = false;
    drawerAddButton.innerHTML = `
      <svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:3; margin-right:8px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add to Trip Plan
    `;
  }

  document.getElementById("cityDetailsDrawer").classList.add("visible");
}

function closeCityDetailsDrawer() {
  document.getElementById("cityDetailsDrawer").classList.remove("visible");
}

function closeDrawerOnBackdrop(event) {
  if (event.target === document.getElementById("cityDetailsDrawer")) {
    closeCityDetailsDrawer();
  }
}

/**
 * Master Add Button routing trigger
 */
function handleAddButtonTrigger(cityName) {
  openAddToTripModal(cityName);
}

/**
 * Handle adding from Details Drawer
 */
function handleAddFromDrawer(cityName) {
  closeCityDetailsDrawer();
  openAddToTripModal(cityName);
}

/**
 * Add To Trip Modal Management
 */
function openAddToTripModal(cityName) {
  const city = citiesDatabase.find(c => c.city.toLowerCase() === cityName.toLowerCase());
  if (!city) return;

  document.getElementById("modalSelectedCity").value = city.city;

  const tripSelect = document.getElementById("modalTripSelect");
  const tripSelectorGroup = document.getElementById("modalTripSelectorGroup");
  const tripBanner = document.getElementById("modalSelectedTripBanner");
  const arrivalInput = document.getElementById("modalArrivalDate");
  const departureInput = document.getElementById("modalDepartureDate");

  // Reset form
  document.getElementById("addToTripForm").reset();

  if (activeTripId) {
    // We already have active trip context from itinerary.html! Bypassing selector.
    const activeTripObj = trips.find(t => t.id === activeTripId);
    if (activeTripObj) {
      tripSelectorGroup.style.display = "none";
      tripSelect.removeAttribute("required");

      // Render Active trip banner overview
      document.getElementById("modalSelectedTripName").textContent = activeTripObj.destination;
      document.getElementById("modalSelectedTripStatus").textContent = activeTripObj.status;
      document.getElementById("modalSelectedTripStatus").style.backgroundColor = activeTripObj.status === 'Draft' ? 'var(--accent)' : 'var(--primary)';
      document.getElementById("modalSelectedTripDates").textContent = `${formatDateShort(activeTripObj.startDate)} to ${formatDateShort(activeTripObj.endDate)}`;
      tripBanner.style.display = "block";

      // Configure Min/Max boundaries to target trip limits
      arrivalInput.min = activeTripObj.startDate;
      arrivalInput.max = activeTripObj.endDate;
      departureInput.min = activeTripObj.startDate;
      departureInput.max = activeTripObj.endDate;

      // Assign defaults
      arrivalInput.value = activeTripObj.startDate;
      departureInput.value = activeTripObj.endDate;
    }
  } else {
    // No active trip in URL context. Show dropdown of available trips.
    tripSelectorGroup.style.display = "block";
    tripSelect.setAttribute("required", "");
    tripBanner.style.display = "none";

    tripSelect.innerHTML = '<option value="" disabled selected>-- Select a trip --</option>';
    
    if (trips.length === 0) {
      tripSelect.innerHTML = '<option value="" disabled>No upcoming trips planned. Create one first!</option>';
      arrivalInput.disabled = true;
      departureInput.disabled = true;
    } else {
      arrivalInput.disabled = false;
      departureInput.disabled = false;

      trips.forEach(trip => {
        const option = document.createElement("option");
        option.value = trip.id;
        option.textContent = `${trip.destination} (${formatDateShort(trip.startDate)} - ${formatDateShort(trip.endDate)})`;
        tripSelect.appendChild(option);
      });
    }
  }

  document.getElementById("addToTripModal").classList.add("visible");
}

function closeAddToTripModal() {
  document.getElementById("addToTripModal").classList.remove("visible");
}

/**
 * Handle Trip Selection changes inside Modal (when activeTripId is not provided)
 */
function handleModalTripSelectionChange(tripId) {
  const selectedTrip = trips.find(t => t.id === tripId);
  const arrivalInput = document.getElementById("modalArrivalDate");
  const departureInput = document.getElementById("modalDepartureDate");

  if (selectedTrip) {
    // Lock dates within trip bounds
    arrivalInput.min = selectedTrip.startDate;
    arrivalInput.max = selectedTrip.endDate;
    departureInput.min = selectedTrip.startDate;
    departureInput.max = selectedTrip.endDate;

    // Set default values
    arrivalInput.value = selectedTrip.startDate;
    departureInput.value = selectedTrip.endDate;
  }
}

/**
 * Submits city stops creation directly to localStorage schema
 */
function handleAddToTripSubmit(event) {
  event.preventDefault();

  const cityName = document.getElementById("modalSelectedCity").value;
  const arrival = document.getElementById("modalArrivalDate").value;
  const departure = document.getElementById("modalDepartureDate").value;
  
  let targetTripId = activeTripId;
  if (!targetTripId) {
    targetTripId = document.getElementById("modalTripSelect").value;
  }

  if (!targetTripId) {
    showToast("Please select a valid trip to proceed.", "error");
    return;
  }

  const tripObj = trips.find(t => t.id === targetTripId);
  if (!tripObj) {
    showToast("Selected trip was not found.", "error");
    return;
  }

  // 1. Date logic check
  if (new Date(arrival) > new Date(departure)) {
    showToast("Departure date must be after arrival date.", "error");
    return;
  }

  if (arrival < tripObj.startDate || departure > tripObj.endDate) {
    showToast(`Stop dates must fall within overall trip boundaries: ${formatDateShort(tripObj.startDate)} to ${formatDateShort(tripObj.endDate)}.`, "error");
    return;
  }

  // 2. Prevent adding duplicates to the same trip
  if (!tripObj.stops) {
    tripObj.stops = [];
  }
  const isDuplicate = tripObj.stops.some(stop => stop.city.toLowerCase() === cityName.toLowerCase());
  if (isDuplicate) {
    showToast(`${cityName} is already added as a stop in this trip.`, "error");
    closeAddToTripModal();
    return;
  }

  // Fetch full city details
  const city = citiesDatabase.find(c => c.city.toLowerCase() === cityName.toLowerCase());

  // 3. Create stop object matching schema in itinerary.js
  const newStop = {
    id: `stop-${Date.now()}`,
    city: city.city,
    country: city.country,
    image: city.image,
    startDate: arrival,
    endDate: departure,
    transportToNext: "Train",
    activities: []
  };

  // Append & Sort stops chronologically
  tripObj.stops.push(newStop);
  tripObj.stops.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  // 4. Update trip stats (cities count)
  tripObj.citiesVal = tripObj.stops.length;

  // 5. Save back to localStorage
  localStorage.setItem("globaltrotter_trips", JSON.stringify(trips));

  // 6. Success Feedback animations
  const submitBtn = event.target.querySelector(".submit-btn");
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");

  setTimeout(() => {
    submitBtn.classList.remove("loading");
    submitBtn.classList.add("success");

    setTimeout(() => {
      submitBtn.classList.remove("success");
      submitBtn.disabled = false;
      
      closeAddToTripModal();
      showToast(`Added ${city.city} to your planner!`, "success");

      // Render changes locally (update card button Added state)
      const btnId = `addBtn-${city.city.replace(/\s+/g, '-')}`;
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.classList.add("added");
        btn.disabled = true;
        btn.textContent = "Added ✓";
      }

      const featBtnId = `featAddBtn-${city.city.replace(/\s+/g, '-')}`;
      const featBtn = document.getElementById(featBtnId);
      if (featBtn) {
        featBtn.classList.add("added");
        featBtn.disabled = true;
        featBtn.textContent = "Added ✓";
      }
      
      // Update local state copy
      initializeExplorePage();
    }, 700);

  }, 1000);
}

/**
 * Handle backdrop modal clicks closing
 */
function closeModalOnBackdrop(event, modalId) {
  if (event.target === document.getElementById(modalId)) {
    if (modalId === "addToTripModal") closeAddToTripModal();
  }
}

/**
 * Simulated Floating Toasts System
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

/**
 * Simulated action trigger helper
 */
function showSimulatedAction(text) {
  showToast(text, "success");
}

/**
 * Simulate API failure toggle
 */
function toggleApiErrorSim(checked) {
  apiFailure = checked;
  applyFiltersAndRender();
}

/**
 * Error state Retry trigger
 */
function retryLoadingDestinations() {
  document.getElementById("apiFailureToggle").checked = false;
  apiFailure = false;
  applyFiltersAndRender();
}

/**
 * Date Medium Formatter (e.g. "Oct 12")
 */
function formatDateShort(dateString) {
  const options = { month: "short", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

/**
 * Safe Logout Transition
 */
function handleLogout() {
  showToast("Logging out safely...", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}
