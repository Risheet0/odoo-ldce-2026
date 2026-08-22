// ==========================================================================
// GlobalTrotters - Trip Budget & Cost Breakdown Logic
// Premium Travel Finance Dashboard Engine
// ==========================================================================

// Global State
let activeTrip = null;
let allTrips = [];
let currentCurrency = "INR"; // Default to ₹ INR as per specification, switchable to USD/EUR/GBP
let filterCategory = "All";
let filterCity = "All";
let filterSearch = "";
let sortMode = "date_asc";
let expenseIdToDelete = null;

// Category Config & Visual Branding
const CATEGORY_CONFIG = {
  "Accommodation": {
    name: "Accommodation",
    shortName: "Stay",
    color: "#2D6A4F", // Forest Sage Green
    bgClass: "cat-accommodation",
    icon: `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  },
  "Activities": {
    name: "Activities",
    shortName: "Activities",
    color: "#D97706", // Warm Amber
    bgClass: "cat-activities",
    icon: `<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2 12 12 22 17 12 22 2 17 12 12"/></svg>`
  },
  "Transport": {
    name: "Transport",
    shortName: "Transport",
    color: "#2563EB", // Ocean Blue
    bgClass: "cat-transport",
    icon: `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
  },
  "Meals": {
    name: "Meals",
    shortName: "Meals",
    color: "#C2593F", // Terracotta
    bgClass: "cat-meals",
    icon: `<svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`
  },
  "Other": {
    name: "Other",
    shortName: "Other",
    color: "#656D4A", // Earthy Olive
    bgClass: "cat-other",
    icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  }
};

// Currency symbol map
const CURRENCY_SYMBOLS = {
  "INR": "₹",
  "USD": "$",
  "EUR": "€",
  "GBP": "£"
};

// Document Load Event
document.addEventListener("DOMContentLoaded", () => {
  initBudgetDashboard();
});

/**
 * Initialize Trip Budget Dashboard
 */
function initBudgetDashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  let tripId = urlParams.get("tripId");

  const skeleton = document.getElementById("budgetSkeletonLoader");
  const mainContent = document.getElementById("budgetMainContent");
  const errorState = document.getElementById("budgetErrorState");

  // Load Trips list from LocalStorage
  const stored = localStorage.getItem("globaltrotter_trips");
  if (stored) {
    try {
      allTrips = JSON.parse(stored);
    } catch (e) {
      allTrips = [];
    }
  }

  // Fallback to default trips if empty
  if (!allTrips || allTrips.length === 0) {
    if (typeof defaultTrips !== "undefined" && defaultTrips.length > 0) {
      allTrips = [...defaultTrips];
    } else {
      allTrips = [];
    }
  }

  // Select active trip
  if (!tripId && allTrips.length > 0) {
    tripId = allTrips[0].id;
  }

  if (!tripId || allTrips.length === 0) {
    showBudgetError("No Trips Available", "Please create a trip from your dashboard first to track its budget.");
    return;
  }

  activeTrip = allTrips.find(t => t.id === tripId);
  if (!activeTrip) {
    activeTrip = allTrips[0];
  }

  // Ensure relational expenses structure is initialized on the trip
  ensureTripExpensesInitialized(activeTrip);

  // Sync Currency from Trip or Local Storage
  if (activeTrip.currency && CURRENCY_SYMBOLS[activeTrip.currency]) {
    currentCurrency = activeTrip.currency;
  }
  const currSelect = document.getElementById("currencySelector");
  if (currSelect) {
    currSelect.value = currentCurrency;
  }

  // Populate Trip Selector in header
  populateTripSelector();

  // Show Skeleton loader for smooth transition
  skeleton.style.display = "flex";
  mainContent.style.display = "none";
  errorState.style.display = "none";

  setTimeout(() => {
    skeleton.style.display = "none";
    mainContent.style.display = "flex";

    // Render all dashboard sections
    renderBudgetDashboard();
  }, 450);
}

/**
 * Display Error view
 */
function showBudgetError(title, message) {
  document.getElementById("budgetSkeletonLoader").style.display = "none";
  document.getElementById("budgetMainContent").style.display = "none";
  const errorPanel = document.getElementById("budgetErrorState");
  errorPanel.style.display = "flex";
  document.getElementById("errorTitle").textContent = title;
  document.getElementById("errorMessage").textContent = message;
}

/**
 * Helper to ensure trip has realistic initial expenses matching its stops & activities
 */
function ensureTripExpensesInitialized(trip) {
  if (!trip.expenses) {
    trip.expenses = [];
  }

  // If expenses array is completely empty, populate initial realistic category expenses from stops & activities
  if (trip.expenses.length === 0 && trip.stops && trip.stops.length > 0) {
    
    // Check if it's the default Tokyo trip to align with standard travel planning values
    if (trip.id === "trip-tokyo") {
      trip.budget = 100000; // ₹100,000 planned budget
      trip.currency = "INR";
      currentCurrency = "INR";

      trip.expenses = [
        // Accommodation
        {
          id: "exp-tokyo-stay-1",
          name: "Park Hyatt Tokyo (4 nights)",
          category: "Accommodation",
          city: "Tokyo",
          date: "2026-10-12",
          cost: 15000,
          notes: "Shinjuku City booking #9812A"
        },
        {
          id: "exp-tokyo-stay-2",
          name: "Hakone Onsen Traditional Ryokan",
          category: "Accommodation",
          city: "Hakone",
          date: "2026-10-16",
          cost: 8000,
          notes: "Includes open-air hot spring bath"
        },
        {
          id: "exp-tokyo-stay-3",
          name: "Kyoto Heritage Machiya Residence",
          category: "Accommodation",
          city: "Kyoto",
          date: "2026-10-18",
          cost: 7000,
          notes: "Traditional tatami suite near Gion"
        },
        // Activities
        {
          id: "exp-tokyo-act-1",
          name: "Meiji Jingu Shrine Tour & Charm",
          category: "Activities",
          city: "Tokyo",
          date: "2026-10-13",
          cost: 2000,
          notes: "Guided cultural walk"
        },
        {
          id: "exp-tokyo-act-2",
          name: "TeamLab Planets Digital Museum",
          category: "Activities",
          city: "Tokyo",
          date: "2026-10-14",
          cost: 3500,
          notes: "Express admission ticket"
        },
        {
          id: "exp-tokyo-act-3",
          name: "Lake Ashi Pirate Boat Cruise",
          category: "Activities",
          city: "Hakone",
          date: "2026-10-17",
          cost: 2500,
          notes: "Hakone ropeway & cruise pass"
        },
        {
          id: "exp-tokyo-act-4",
          name: "Kinkaku-ji Golden Pavilion & Tea",
          category: "Activities",
          city: "Kyoto",
          date: "2026-10-19",
          cost: 4000,
          notes: "Matcha green tea tasting"
        },
        {
          id: "exp-tokyo-act-5",
          name: "Fushimi Inari Guided Hiking Excursion",
          category: "Activities",
          city: "Kyoto",
          date: "2026-10-20",
          cost: 8000,
          notes: "Summit hike & private photographer"
        },
        // Transport
        {
          id: "exp-tokyo-trans-1",
          name: "Tokyo Narita Express & Suica Pass",
          category: "Transport",
          city: "Tokyo",
          date: "2026-10-12",
          cost: 3000,
          notes: "Airport train & prepaid subway card"
        },
        {
          id: "exp-tokyo-trans-2",
          name: "Romancecar Express to Hakone",
          category: "Transport",
          city: "Hakone",
          date: "2026-10-16",
          cost: 2500,
          notes: "Reserved observation deck seat"
        },
        {
          id: "exp-tokyo-trans-3",
          name: "Shinkansen Bullet Train (Hakone to Kyoto)",
          category: "Transport",
          city: "Kyoto",
          date: "2026-10-18",
          cost: 8500,
          notes: "Nozomi high-speed line"
        },
        {
          id: "exp-tokyo-trans-4",
          name: "Kyoto Bus & Subway Transit Card",
          category: "Transport",
          city: "Kyoto",
          date: "2026-10-19",
          cost: 4000,
          notes: "3-day unlimited pass"
        },
        // Meals
        {
          id: "exp-tokyo-meal-1",
          name: "Sukiyabashi Jiro Chef Omakase Dinner",
          category: "Meals",
          city: "Tokyo",
          date: "2026-10-14",
          cost: 5500,
          notes: "Michelin sushi tasting"
        },
        {
          id: "exp-tokyo-meal-2",
          name: "Shinjuku Omoide Yokocho Izakaya",
          category: "Meals",
          city: "Tokyo",
          date: "2026-10-15",
          cost: 1500,
          notes: "Yakitori & local draft beers"
        },
        {
          id: "exp-tokyo-meal-3",
          name: "Hakone Traditional Kaiseki Feast",
          category: "Meals",
          city: "Hakone",
          date: "2026-10-16",
          cost: 2000,
          notes: "Seasonal multi-course dinner"
        },
        {
          id: "exp-tokyo-meal-4",
          name: "Kyoto Gion Kaiseki & Tofu Banquet",
          category: "Meals",
          city: "Kyoto",
          date: "2026-10-20",
          cost: 3000,
          notes: "Historic riverside restaurant"
        },
        // Other
        {
          id: "exp-tokyo-other-1",
          name: "Unlimited Pocket Wi-Fi & eSIM",
          category: "Other",
          city: "Tokyo",
          date: "2026-10-12",
          cost: 2000,
          notes: "11-day high speed data"
        },
        {
          id: "exp-tokyo-other-2",
          name: "Comprehensive Travel Insurance",
          category: "Other",
          city: "Tokyo",
          date: "2026-10-12",
          cost: 1500,
          notes: "Medical & flight delay coverage"
        },
        {
          id: "exp-tokyo-other-3",
          name: "Luggage Forwarding (Tokyo to Kyoto)",
          category: "Other",
          city: "Kyoto",
          date: "2026-10-18",
          cost: 1500,
          notes: "Yamato Transport luggage transfer"
        }
      ];
    } else if (trip.id === "trip-paris") {
      trip.budget = 75000;
      trip.currency = "INR";
      trip.expenses = [
        {
          id: "exp-paris-stay-1",
          name: "Boutique Hotel Le Marais (3 nights)",
          category: "Accommodation",
          city: "Paris",
          date: "2026-12-05",
          cost: 24000,
          notes: "Central Paris stay"
        },
        {
          id: "exp-paris-stay-2",
          name: "Canal House Boutique Amsterdam",
          category: "Accommodation",
          city: "Amsterdam",
          date: "2026-12-08",
          cost: 16000,
          notes: "Heritage canal suite"
        },
        {
          id: "exp-paris-act-1",
          name: "Eiffel Tower Guided Summit Tour",
          category: "Activities",
          city: "Paris",
          date: "2026-12-06",
          cost: 2500,
          notes: "Skip the line ticket"
        },
        {
          id: "exp-paris-act-2",
          name: "Louvre Museum Masterpieces Walk",
          category: "Activities",
          city: "Paris",
          date: "2026-12-07",
          cost: 2200,
          notes: "Guided art tour"
        },
        {
          id: "exp-paris-act-3",
          name: "Amsterdam Canal Cruise & Wine",
          category: "Activities",
          city: "Amsterdam",
          date: "2026-12-09",
          cost: 1800,
          notes: "Evening canal boat"
        },
        {
          id: "exp-paris-trans-1",
          name: "Eurostar High-Speed Train (Paris to Amsterdam)",
          category: "Transport",
          city: "Amsterdam",
          date: "2026-12-08",
          cost: 9500,
          notes: "First class cabin"
        },
        {
          id: "exp-paris-meal-1",
          name: "Seine River Dinner Cruise",
          category: "Meals",
          city: "Paris",
          date: "2026-12-06",
          cost: 6500,
          notes: "3-course gourmet dinner"
        },
        {
          id: "exp-paris-other-1",
          name: "European eSIM & Insurance",
          category: "Other",
          city: "Paris",
          date: "2026-12-05",
          cost: 2500,
          notes: "Data roaming pack"
        }
      ];
    } else {
      // For any user-created trip, populate base expenses from activities
      trip.budget = trip.budget || 50000;
      trip.stops.forEach(stop => {
        // Add estimated stay
        trip.expenses.push({
          id: `exp-${stop.id}-stay`,
          name: `${stop.city} Hotel / Accommodation`,
          category: "Accommodation",
          city: stop.city,
          date: stop.startDate,
          cost: 12000,
          notes: "Estimated hotel reservation"
        });

        // Add activities
        if (stop.activities) {
          stop.activities.forEach(act => {
            const costVal = parseFloat(act.cost) || 1500;
            trip.expenses.push({
              id: `exp-act-${act.id || Date.now()}`,
              name: act.name,
              category: "Activities",
              city: stop.city,
              date: act.date || stop.startDate,
              cost: costVal > 0 ? costVal : 1200,
              notes: "Scheduled activity admission"
            });
          });
        }

        // Add transport
        trip.expenses.push({
          id: `exp-${stop.id}-trans`,
          name: `${stop.city} Local Transport & Transit`,
          category: "Transport",
          city: stop.city,
          date: stop.startDate,
          cost: 3500,
          notes: "Train / taxi passes"
        });
      });
    }

    saveTripsToLocalStorage();
  }
}

/**
 * Populate trip switcher dropdown
 */
function populateTripSelector() {
  const select = document.getElementById("tripSelectorSelect");
  if (!select) return;

  select.innerHTML = "";
  allTrips.forEach(trip => {
    const opt = document.createElement("option");
    opt.value = trip.id;
    opt.textContent = trip.destination;
    if (trip.id === activeTrip.id) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

/**
 * Format currency amounts nicely
 */
function formatMoney(amount, currency = currentCurrency) {
  const num = Math.round(Number(amount) || 0);
  const symbol = CURRENCY_SYMBOLS[currency] || "₹";
  
  if (currency === "INR") {
    // Indian numbering format (₹85,000)
    return symbol + num.toLocaleString("en-IN");
  }
  return symbol + num.toLocaleString("en-US");
}

/**
 * Master Render of the entire Budget Dashboard
 */
function renderBudgetDashboard() {
  if (!activeTrip) return;

  // 1. Calculate Core Financial Totals
  const totalCost = activeTrip.expenses.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
  const plannedBudget = parseFloat(activeTrip.budget) || (totalCost > 0 ? totalCost * 1.2 : 50000);
  const tripDays = Math.max(1, dateDifferenceInDays(activeTrip.startDate, activeTrip.endDate) + 1);
  const dailyAverage = Math.round(totalCost / tripDays);
  const dailyPlannedTarget = Math.round(plannedBudget / tripDays);
  const remainingBudget = plannedBudget - totalCost;
  const isOverBudget = totalCost > plannedBudget;
  const overBudgetAmount = totalCost - plannedBudget;
  const usagePercent = plannedBudget > 0 ? Math.round((totalCost / plannedBudget) * 100) : 0;

  // 2. Render Page Header Meta
  document.getElementById("tripNameText").textContent = activeTrip.destination;
  document.getElementById("tripDatesText").textContent = `${formatDateShort(activeTrip.startDate)} – ${formatDateLong(activeTrip.endDate)}`;
  document.getElementById("tripDurationText").textContent = `${tripDays} ${tripDays === 1 ? 'Day' : 'Days'}`;

  // Update sidebar links with active trip context
  const exploreLink = document.getElementById("sidebarExploreLink");
  if (exploreLink) exploreLink.href = `explore.html?tripId=${activeTrip.id}`;
  const activitiesLink = document.getElementById("sidebarActivitiesLink");
  if (activitiesLink) activitiesLink.href = `activities.html?tripId=${activeTrip.id}`;

  // 3. Render 4 Overview Summary Cards
  document.getElementById("cardTotalEstimatedCost").textContent = formatMoney(totalCost);
  document.getElementById("cardDailyAverageCost").textContent = `${formatMoney(dailyAverage)}/day`;
  document.getElementById("cardPlannedBudget").textContent = formatMoney(plannedBudget);
  
  const remainingCardVal = document.getElementById("cardRemainingBudget");
  const remainingSub = document.getElementById("cardRemainingSubContainer");
  
  if (isOverBudget) {
    remainingCardVal.textContent = formatMoney(overBudgetAmount);
    remainingCardVal.style.color = "var(--error)";
    remainingSub.innerHTML = `<span class="status-pill-over">Over Budget by ${formatMoney(overBudgetAmount)}</span>`;
  } else {
    remainingCardVal.textContent = formatMoney(remainingBudget);
    remainingCardVal.style.color = "var(--text-primary)";
    remainingSub.innerHTML = `<span class="status-pill-remaining">${formatMoney(remainingBudget)} remaining</span>`;
  }

  // 4. Render Over-Budget / Savings Alert Banner
  renderAlertBanner(isOverBudget, overBudgetAmount, plannedBudget, dailyPlannedTarget, tripDays);

  // 5. Render Trip Budget Usage Progress Bar
  renderBudgetProgressBar(totalCost, plannedBudget, usagePercent, remainingBudget, isOverBudget);

  // 6. Render Cost Breakdown by Category & Donut Chart
  renderCategoryBreakdownAndDonut(totalCost);

  // 7. Render Spending by City
  renderSpendingByCity(totalCost);

  // 8. Render Daily Expenses Breakdown
  renderDailyExpenses(tripDays, dailyPlannedTarget);

  // 9. Render Filterable Expense Details List
  renderExpenseDetailsTable();

  // 10. Handle Zero/Empty State
  const zeroState = document.getElementById("budgetZeroState");
  const mainWrapper = document.getElementById("budgetMainContent");
  if (activeTrip.expenses.length === 0) {
    zeroState.style.display = "flex";
    document.getElementById("zeroStateItineraryBtn").href = `itinerary.html?tripId=${activeTrip.id}`;
  } else {
    zeroState.style.display = "none";
  }
}

/**
 * Render Alert Banners
 */
function renderAlertBanner(isOverBudget, overBudgetAmount, plannedBudget, dailyPlannedTarget, tripDays) {
  const banner = document.getElementById("budgetAlertBanner");
  const heading = document.getElementById("alertHeadingText");
  const body = document.getElementById("alertBodyText");
  const actionBtn = document.getElementById("alertActionBtn");
  const iconSvg = document.getElementById("alertIconSvg");

  // Check if any specific day has high spending
  const daySpike = findHighestSpendingDay(dailyPlannedTarget);

  if (isOverBudget) {
    banner.style.display = "flex";
    banner.className = "budget-alert-banner warning";
    heading.textContent = `You're over budget by ${formatMoney(overBudgetAmount)}`;
    body.textContent = "Your estimated trip spending exceeds your planned limit. Consider adjusting accommodation or reducing optional activities.";
    actionBtn.textContent = "Increase Budget Limit";
    actionBtn.style.display = "block";
    iconSvg.innerHTML = `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`;
  } else if (daySpike && daySpike.excess > 0) {
    banner.style.display = "flex";
    banner.className = "budget-alert-banner warning";
    heading.textContent = `⚠ High spending on Day ${daySpike.dayNumber} (${daySpike.city})`;
    body.textContent = `Your estimated spending for this day is ${formatMoney(daySpike.total)}, which is ${formatMoney(daySpike.excess)} above your daily target (${formatMoney(dailyPlannedTarget)}/day).`;
    actionBtn.textContent = "Manage Expenses";
    actionBtn.style.display = "block";
    iconSvg.innerHTML = `<polygon points="12 2 22 20 2 20 12 2"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`;
  } else {
    // Within budget and no extreme spikes
    banner.style.display = "flex";
    banner.className = "budget-alert-banner info";
    heading.textContent = `✓ Your budget is well balanced`;
    body.textContent = `You have ${formatMoney(plannedBudget - activeTrip.expenses.reduce((s, e) => s + (parseFloat(e.cost) || 0), 0))} remaining out of your ${formatMoney(plannedBudget)} planned budget.`;
    actionBtn.style.display = "none";
    iconSvg.innerHTML = `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`;
  }
}

/**
 * Find day with highest excess above daily budget
 */
function findHighestSpendingDay(dailyPlannedTarget) {
  if (!activeTrip || !activeTrip.expenses || activeTrip.expenses.length === 0) return null;

  const dates = getTripDatesArray(activeTrip.startDate, activeTrip.endDate);
  let maxExcess = 0;
  let topSpikeDay = null;

  dates.forEach((dateObj, idx) => {
    const dateISO = dateObj.toISOString().split("T")[0];
    const dayNumber = idx + 1;
    
    // Find stop
    const activeStop = activeTrip.stops ? activeTrip.stops.find(s => dateISO >= s.startDate && dateISO <= s.endDate) : null;
    const cityName = activeStop ? activeStop.city : (activeTrip.stops && activeTrip.stops[0] ? activeTrip.stops[0].city : "Stop");

    // Sum day expenses
    const dayExpenses = activeTrip.expenses.filter(e => e.date === dateISO);
    const dayTotal = dayExpenses.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);

    const excess = dayTotal - dailyPlannedTarget;
    if (excess > maxExcess) {
      maxExcess = excess;
      topSpikeDay = {
        dayNumber: dayNumber,
        date: dateISO,
        city: cityName,
        total: dayTotal,
        excess: excess
      };
    }
  });

  return topSpikeDay;
}

/**
 * Render Budget Usage Progress Bar
 */
function renderBudgetProgressBar(totalCost, plannedBudget, usagePercent, remainingBudget, isOverBudget) {
  const ratioSpent = document.getElementById("progressRatioSpent");
  const ratioTotal = document.getElementById("progressRatioTotal");
  const percentBadge = document.getElementById("progressPercentBadge");
  const fillBar = document.getElementById("budgetProgressBarFill");
  const metaSpent = document.getElementById("progressMetaSpent");
  const metaRemaining = document.getElementById("progressMetaRemaining");
  const statusGuidance = document.getElementById("progressStatusGuidance");

  ratioSpent.textContent = formatMoney(totalCost);
  ratioTotal.textContent = formatMoney(plannedBudget);
  metaSpent.textContent = formatMoney(totalCost);
  metaRemaining.textContent = formatMoney(Math.abs(remainingBudget));

  // Cap visual width at 100% for bar, but show real percentage in badge
  const visualWidth = Math.min(100, Math.max(0, usagePercent));
  fillBar.style.width = `${visualWidth}%`;

  if (isOverBudget) {
    fillBar.className = "budget-progress-fill status-over";
    percentBadge.className = "status-pill-over";
    percentBadge.textContent = `${usagePercent}% (Over Budget)`;
    statusGuidance.innerHTML = `<span style="color: var(--error);">⚠ Spending exceeds planned funds by ${formatMoney(Math.abs(remainingBudget))}</span>`;
  } else if (usagePercent > 85) {
    fillBar.className = "budget-progress-fill status-warn";
    percentBadge.className = "status-pill-remaining";
    percentBadge.style.backgroundColor = "rgba(217, 119, 6, 0.15)";
    percentBadge.style.color = "var(--accent)";
    percentBadge.textContent = `${usagePercent}% Used`;
    statusGuidance.innerHTML = `<span style="color: var(--accent);">Approaching planned budget limit (${formatMoney(remainingBudget)} remaining)</span>`;
  } else {
    fillBar.className = "budget-progress-fill status-good";
    percentBadge.className = "status-pill-remaining";
    percentBadge.textContent = `${usagePercent}% Used`;
    statusGuidance.innerHTML = `<span style="color: var(--primary);">✓ You are safely within your planned travel budget</span>`;
  }
}

/**
 * Render Category Breakdown Details & Interactive SVG Donut Chart
 */
function renderCategoryBreakdownAndDonut(totalCost) {
  const categoryGrid = document.getElementById("categoryDetailsGrid");
  const chartLegendGrid = document.getElementById("chartLegendGrid");
  const donutSvg = document.getElementById("donutSvg");
  const centerAmount = document.getElementById("donutCenterAmount");
  const centerLabel = document.querySelector(".donut-center-label");

  categoryGrid.innerHTML = "";
  chartLegendGrid.innerHTML = "";
  donutSvg.innerHTML = "";
  centerAmount.textContent = formatMoney(totalCost);
  centerLabel.textContent = "Total Cost";

  // Calculate sum for each category
  const categoriesList = ["Accommodation", "Activities", "Transport", "Meals", "Other"];
  const categoryData = [];

  categoriesList.forEach(catKey => {
    const config = CATEGORY_CONFIG[catKey];
    const catExpenses = activeTrip.expenses.filter(e => e.category.toLowerCase() === catKey.toLowerCase());
    const amount = catExpenses.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
    const percent = totalCost > 0 ? Math.round((amount / totalCost) * 100) : 0;
    
    categoryData.push({
      key: catKey,
      name: config.name,
      shortName: config.shortName,
      color: config.color,
      bgClass: config.bgClass,
      icon: config.icon,
      amount: amount,
      percent: percent,
      count: catExpenses.length
    });
  });

  // 1. Render Category Cards
  categoryData.forEach(item => {
    const card = document.createElement("div");
    card.className = "category-expense-item";
    card.onclick = () => {
      // Filter expense details table to this category
      handleTableCategoryFilter(item.name);
      document.getElementById("filterCategorySelect").value = item.name;
      const el = document.getElementById("expenseItemsList");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    card.innerHTML = `
      <div class="category-item-left">
        <div class="category-icon-wrapper ${item.bgClass}">
          ${item.icon}
        </div>
        <div class="category-info-box">
          <div class="category-title-row">
            <span class="category-title">${item.name}</span>
            <span class="category-amount">${formatMoney(item.amount)}</span>
          </div>
          <div class="category-progress-mini-track">
            <div class="category-progress-mini-fill" style="width: ${item.percent}%; background-color: ${item.color};"></div>
          </div>
          <div class="category-meta-foot">
            <span>${item.count} ${item.count === 1 ? 'item' : 'items'}</span>
            <span><strong>${item.percent}%</strong> of total</span>
          </div>
        </div>
      </div>
    `;
    categoryGrid.appendChild(card);
  });

  // 2. Render Donut Chart SVG
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  let cumulativePercent = 0;

  if (totalCost === 0) {
    // Empty circle placeholder
    const emptyCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    emptyCircle.setAttribute("cx", "50");
    emptyCircle.setAttribute("cy", "50");
    emptyCircle.setAttribute("r", radius);
    emptyCircle.setAttribute("fill", "none");
    emptyCircle.setAttribute("stroke", "var(--border)");
    emptyCircle.setAttribute("stroke-width", "26");
    donutSvg.appendChild(emptyCircle);
  } else {
    categoryData.forEach(item => {
      if (item.amount <= 0) return;

      const sliceRatio = item.amount / totalCost;
      const strokeLength = sliceRatio * circumference;
      const strokeDashoffset = -cumulativePercent * circumference;
      cumulativePercent += sliceRatio;

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "50");
      circle.setAttribute("cy", "50");
      circle.setAttribute("r", radius);
      circle.setAttribute("class", "donut-segment");
      circle.setAttribute("stroke", item.color);
      circle.setAttribute("stroke-dasharray", `${strokeLength} ${circumference}`);
      circle.setAttribute("stroke-dashoffset", strokeDashoffset);

      // Interactive hover effects
      circle.onmouseenter = () => {
        centerAmount.textContent = formatMoney(item.amount);
        centerLabel.textContent = `${item.name} (${item.percent}%)`;
      };
      circle.onmouseleave = () => {
        centerAmount.textContent = formatMoney(totalCost);
        centerLabel.textContent = "Total Cost";
      };
      circle.onclick = () => {
        handleTableCategoryFilter(item.name);
        document.getElementById("filterCategorySelect").value = item.name;
      };

      donutSvg.appendChild(circle);
    });
  }

  // 3. Render Chart Legend Grid
  categoryData.forEach(item => {
    const legItem = document.createElement("div");
    legItem.className = "chart-legend-item";
    legItem.onmouseenter = () => {
      centerAmount.textContent = formatMoney(item.amount);
      centerLabel.textContent = `${item.name} (${item.percent}%)`;
    };
    legItem.onmouseleave = () => {
      centerAmount.textContent = formatMoney(totalCost);
      centerLabel.textContent = "Total Cost";
    };
    legItem.onclick = () => {
      handleTableCategoryFilter(item.name);
      document.getElementById("filterCategorySelect").value = item.name;
    };

    legItem.innerHTML = `
      <div class="chart-legend-left">
        <span class="legend-dot" style="background-color: ${item.color};"></span>
        <span class="chart-legend-name">${item.name}</span>
      </div>
      <span class="chart-legend-val">${item.percent}%</span>
    `;
    chartLegendGrid.appendChild(legItem);
  });
}

/**
 * Render Spending by City / Destination
 */
function renderSpendingByCity(totalCost) {
  const container = document.getElementById("citySpendingGrid");
  const topBadge = document.getElementById("mostExpensiveCityBadge");
  container.innerHTML = "";

  // Get distinct cities from stops or expenses
  const citiesMap = {};
  
  if (activeTrip.stops && activeTrip.stops.length > 0) {
    activeTrip.stops.forEach(s => {
      citiesMap[s.city] = {
        city: s.city,
        country: s.country,
        image: s.image,
        total: 0
      };
    });
  }

  // Sum expenses per city
  activeTrip.expenses.forEach(e => {
    const cityName = e.city || (activeTrip.stops && activeTrip.stops[0] ? activeTrip.stops[0].city : "Destination");
    if (!citiesMap[cityName]) {
      citiesMap[cityName] = {
        city: cityName,
        country: "",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80",
        total: 0
      };
    }
    citiesMap[cityName].total += (parseFloat(e.cost) || 0);
  });

  const cityList = Object.values(citiesMap);
  cityList.sort((a, b) => b.total - a.total); // Highest spending first

  if (cityList.length > 0 && cityList[0].total > 0) {
    topBadge.textContent = `Top Stop: ${cityList[0].city} (${formatMoney(cityList[0].total)})`;
  } else {
    topBadge.textContent = "Destination Overview";
  }

  cityList.forEach((c, index) => {
    const percent = totalCost > 0 ? Math.round((c.total / totalCost) * 100) : 0;
    const card = document.createElement("div");
    card.className = "city-spending-card";
    card.onclick = () => {
      handleTableCityFilter(c.city);
      document.getElementById("filterCitySelect").value = c.city;
      const el = document.getElementById("expenseItemsList");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    card.innerHTML = `
      <img src="${c.image}" alt="${c.city}" class="city-spending-thumb" loading="lazy">
      <div class="city-spending-details">
        <div class="city-spending-top">
          <div class="city-spending-name">
            <span>${c.city}</span>
            <span class="city-spending-rank">#${index + 1}</span>
          </div>
          <span class="city-spending-amount">${formatMoney(c.total)}</span>
        </div>
        <div class="city-spending-track">
          <div class="city-spending-fill" style="width: ${percent}%;"></div>
        </div>
        <div class="city-spending-meta">
          <span>${c.country || 'Destination'}</span>
          <span><strong>${percent}%</strong> of trip cost</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * Render Daily Expenses Breakdown
 */
function renderDailyExpenses(tripDays, dailyPlannedTarget) {
  const container = document.getElementById("dailyExpensesContainer");
  const targetBadge = document.getElementById("dailyBudgetLimitBadge");
  targetBadge.textContent = `Target: ${formatMoney(dailyPlannedTarget)}/day`;
  container.innerHTML = "";

  const dates = getTripDatesArray(activeTrip.startDate, activeTrip.endDate);

  dates.forEach((dateObj, idx) => {
    const dateISO = dateObj.toISOString().split("T")[0];
    const dayNumber = idx + 1;
    
    // Find active stop
    const activeStop = activeTrip.stops ? activeTrip.stops.find(s => dateISO >= s.startDate && dateISO <= s.endDate) : null;
    const cityName = activeStop ? activeStop.city : (activeTrip.stops && activeTrip.stops[0] ? activeTrip.stops[0].city : "Travel Day");

    // Gather day expenses
    const dayExpenses = activeTrip.expenses.filter(e => e.date === dateISO);
    const dayTotal = dayExpenses.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
    const isOverDayBudget = dailyPlannedTarget > 0 && dayTotal > dailyPlannedTarget;

    // Category splits
    const actTotal = dayExpenses.filter(e => e.category.toLowerCase() === "activities").reduce((s, e) => s + (parseFloat(e.cost) || 0), 0);
    const mealTotal = dayExpenses.filter(e => e.category.toLowerCase() === "meals").reduce((s, e) => s + (parseFloat(e.cost) || 0), 0);
    const stayTotal = dayExpenses.filter(e => e.category.toLowerCase() === "accommodation").reduce((s, e) => s + (parseFloat(e.cost) || 0), 0);
    const transTotal = dayExpenses.filter(e => e.category.toLowerCase() === "transport").reduce((s, e) => s + (parseFloat(e.cost) || 0), 0);
    const otherTotal = dayExpenses.filter(e => e.category.toLowerCase() === "other").reduce((s, e) => s + (parseFloat(e.cost) || 0), 0);

    const card = document.createElement("div");
    card.className = `daily-expense-card ${isOverDayBudget ? 'is-over-daily-budget' : ''}`;
    card.id = `daily-card-${dayNumber}`;

    card.innerHTML = `
      <div class="daily-card-header-col">
        <div class="daily-badge-row">
          <span class="daily-day-badge">Day ${dayNumber}</span>
          ${isOverDayBudget ? `<span class="daily-over-alert-pill">High Spending</span>` : ''}
        </div>
        <span class="daily-date-label">${formatDateMedium(dateISO)}</span>
        <span class="daily-city-label">
          <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2.5;"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
          ${cityName}
        </span>
      </div>

      <div class="daily-chips-grid">
        ${stayTotal > 0 ? `<div class="daily-cat-chip" title="Stay / Accommodation"><svg viewBox="0 0 24 24" style="stroke: #2D6A4F;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> Stay: <strong>${formatMoney(stayTotal)}</strong></div>` : ''}
        ${actTotal > 0 ? `<div class="daily-cat-chip" title="Activities"><svg viewBox="0 0 24 24" style="stroke: #D97706;"><polygon points="12 2 2 7 12 12 22 7 12 2 12 12 22 17 12 22 2 17 12 12"/></svg> Activities: <strong>${formatMoney(actTotal)}</strong></div>` : ''}
        ${mealTotal > 0 ? `<div class="daily-cat-chip" title="Meals & Dining"><svg viewBox="0 0 24 24" style="stroke: #C2593F;"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg> Meals: <strong>${formatMoney(mealTotal)}</strong></div>` : ''}
        ${transTotal > 0 ? `<div class="daily-cat-chip" title="Transportation"><svg viewBox="0 0 24 24" style="stroke: #2563EB;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> Transport: <strong>${formatMoney(transTotal)}</strong></div>` : ''}
        ${otherTotal > 0 ? `<div class="daily-cat-chip" title="Other Expenses"><svg viewBox="0 0 24 24" style="stroke: #656D4A;"><circle cx="12" cy="12" r="10"/></svg> Other: <strong>${formatMoney(otherTotal)}</strong></div>` : ''}
        ${dayExpenses.length === 0 ? `<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">No expenses recorded</span>` : ''}
      </div>

      <div class="daily-total-col">
        <span class="daily-total-label">Day Total</span>
        <div class="daily-total-amount">${formatMoney(dayTotal)}</div>
      </div>

      <div class="daily-toggle-arrow">
        <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    `;

    // Drawer with detailed items
    const drawer = document.createElement("div");
    drawer.className = "daily-expanded-drawer";
    drawer.id = `drawer-day-${dayNumber}`;

    let itemsHtml = "";
    if (dayExpenses.length === 0) {
      itemsHtml = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 6px 0;">No individual expenses for this date. Click "+ Add Expense" to schedule one.</div>`;
    } else {
      itemsHtml = `<div class="daily-drawer-list">`;
      dayExpenses.forEach(exp => {
        const config = CATEGORY_CONFIG[exp.category] || CATEGORY_CONFIG["Other"];
        itemsHtml += `
          <div class="daily-drawer-item">
            <div class="daily-drawer-item-left">
              <span class="drawer-cat-tag ${config.bgClass}">${exp.category}</span>
              <strong>${exp.name}</strong>
              ${exp.notes ? `<span style="color: var(--text-muted); font-size: 0.8rem;">• ${exp.notes}</span>` : ''}
            </div>
            <strong>${formatMoney(exp.cost)}</strong>
          </div>
        `;
      });
      itemsHtml += `</div>`;
    }

    drawer.innerHTML = itemsHtml;

    // Toggle drawer click
    card.onclick = () => {
      const isOpen = card.classList.contains("open");
      card.classList.toggle("open");
      drawer.classList.toggle("visible");
    };

    container.appendChild(card);
    container.appendChild(drawer);
  });
}

/**
 * Render Expense Details Table / Cards with live filters & sorts
 */
function renderExpenseDetailsTable() {
  const container = document.getElementById("expenseItemsList");
  const countText = document.getElementById("tableItemCountText");
  const emptyState = document.getElementById("emptyTableState");
  const citySelect = document.getElementById("filterCitySelect");

  // Populate city filter options if needed
  populateCityFilterOptions(citySelect);

  container.innerHTML = "";

  // Apply filters
  let filtered = activeTrip.expenses.filter(exp => {
    // Search keyword
    if (filterSearch.trim() !== "") {
      const q = filterSearch.toLowerCase().trim();
      const matchName = exp.name.toLowerCase().includes(q);
      const matchNotes = exp.notes ? exp.notes.toLowerCase().includes(q) : false;
      const matchCat = exp.category.toLowerCase().includes(q);
      const matchCity = exp.city ? exp.city.toLowerCase().includes(q) : false;
      if (!matchName && !matchNotes && !matchCat && !matchCity) return false;
    }

    // Category filter
    if (filterCategory !== "All") {
      if (exp.category.toLowerCase() !== filterCategory.toLowerCase()) return false;
    }

    // City filter
    if (filterCity !== "All") {
      if ((exp.city || "").toLowerCase() !== filterCity.toLowerCase()) return false;
    }

    return true;
  });

  // Apply sorts
  filtered.sort((a, b) => {
    if (sortMode === "cost_desc") return (parseFloat(b.cost) || 0) - (parseFloat(a.cost) || 0);
    if (sortMode === "cost_asc") return (parseFloat(a.cost) || 0) - (parseFloat(b.cost) || 0);
    if (sortMode === "name_asc") return a.name.localeCompare(b.name);
    if (sortMode === "date_desc") return new Date(b.date) - new Date(a.date);
    // default: date_asc
    return new Date(a.date) - new Date(b.date);
  });

  countText.textContent = `Showing ${filtered.length} of ${activeTrip.expenses.length} items`;

  if (filtered.length === 0) {
    emptyState.style.display = "flex";
    return;
  }
  emptyState.style.display = "none";

  filtered.forEach(exp => {
    const config = CATEGORY_CONFIG[exp.category] || CATEGORY_CONFIG["Other"];
    const row = document.createElement("div");
    row.className = "expense-row-card";
    row.id = `exp-row-${exp.id}`;

    row.innerHTML = `
      <div class="expense-row-left">
        <div class="expense-category-dot-icon ${config.bgClass}">
          ${config.icon}
        </div>
        <div class="expense-main-info">
          <h4 class="expense-title-text">${exp.name}</h4>
          <div class="expense-meta-tags">
            <span class="expense-cat-pill">${exp.category}</span>
            <span class="expense-meta-dot">•</span>
            <span>${exp.city || 'Trip Stop'}</span>
            <span class="expense-meta-dot">•</span>
            <span>${formatDateShort(exp.date)}</span>
            ${exp.notes ? `<span class="expense-meta-dot">•</span><span style="font-style: italic; color: var(--text-muted);">${exp.notes}</span>` : ''}
          </div>
        </div>
      </div>

      <div class="expense-row-right">
        <div class="expense-cost-amount">${formatMoney(exp.cost)}</div>
        <div class="expense-row-actions">
          <button class="btn-expense-action" onclick="openEditExpenseModal('${exp.id}')" title="Edit expense details">
            <svg viewBox="0 0 24 24"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/></svg>
          </button>
          <button class="btn-expense-action btn-delete" onclick="confirmDeleteExpense('${exp.id}', '${escapeQuotes(exp.name)}')" title="Delete this expense">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });
}

/**
 * Populate city dropdown options for filtering
 */
function populateCityFilterOptions(select) {
  if (!select) return;
  const currentVal = select.value;

  const citiesSet = new Set();
  if (activeTrip.stops) {
    activeTrip.stops.forEach(s => citiesSet.add(s.city));
  }
  activeTrip.expenses.forEach(e => {
    if (e.city) citiesSet.add(e.city);
  });

  select.innerHTML = '<option value="All">All Cities</option>';
  citiesSet.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    if (city === filterCity) opt.selected = true;
    select.appendChild(opt);
  });
}

// Table filter actions
function handleTableSearch(val) {
  filterSearch = val;
  const topInput = document.getElementById("topbarSearchInput");
  const localInput = document.getElementById("expenseSearchInput");
  if (topInput && topInput.value !== val) topInput.value = val;
  if (localInput && localInput.value !== val) localInput.value = val;
  renderExpenseDetailsTable();
}

function handleTableCategoryFilter(val) {
  filterCategory = val;
  renderExpenseDetailsTable();
}

function handleTableCityFilter(val) {
  filterCity = val;
  renderExpenseDetailsTable();
}

function handleTableSort(val) {
  sortMode = val;
  renderExpenseDetailsTable();
}

function clearTableFilters() {
  filterSearch = "";
  filterCategory = "All";
  filterCity = "All";
  sortMode = "date_asc";

  document.getElementById("expenseSearchInput").value = "";
  document.getElementById("topbarSearchInput").value = "";
  document.getElementById("filterCategorySelect").value = "All";
  document.getElementById("filterCitySelect").value = "All";
  document.getElementById("sortExpensesSelect").value = "date_asc";

  renderExpenseDetailsTable();
  showToast("Filters reset", "success");
}

/**
 * Handle Trip Switching
 */
function handleTripSwitch(tripId) {
  activeTrip = allTrips.find(t => t.id === tripId);
  if (!activeTrip) return;

  ensureTripExpensesInitialized(activeTrip);

  // Update browser URL without reload
  const newUrl = `${window.location.pathname}?tripId=${activeTrip.id}`;
  window.history.pushState({ path: newUrl }, '', newUrl);

  // Re-render
  filterCategory = "All";
  filterCity = "All";
  filterSearch = "";
  renderBudgetDashboard();
  showToast(`Switched to ${activeTrip.destination}`, "success");
}

/**
 * Handle Currency Changing
 */
function handleCurrencyChange(currency) {
  currentCurrency = currency;
  if (activeTrip) {
    activeTrip.currency = currency;
    saveTripsToLocalStorage();
  }
  renderBudgetDashboard();
  showToast(`Currency set to ${CURRENCY_SYMBOLS[currency]} ${currency}`, "success");
}

/**
 * Modal Actions: Add / Edit Expense
 */
function openAddExpenseModal() {
  document.getElementById("expenseForm").reset();
  document.getElementById("modalExpenseId").value = "";
  document.getElementById("expenseModalTitle").textContent = "Add Trip Expense";
  document.getElementById("expenseSubmitBtnText").textContent = "Save Expense";

  populateModalCityOptions();

  // Default date to trip start date
  const dateInput = document.getElementById("modalExpenseDateInput");
  dateInput.min = activeTrip.startDate;
  dateInput.max = activeTrip.endDate;
  dateInput.value = activeTrip.startDate;

  selectModalCategory("Accommodation");

  document.getElementById("expenseModal").classList.add("visible");
  document.getElementById("expenseTitleInput").focus();
}

function openEditExpenseModal(expenseId) {
  const exp = activeTrip.expenses.find(e => e.id === expenseId);
  if (!exp) return;

  document.getElementById("modalExpenseId").value = exp.id;
  document.getElementById("expenseModalTitle").textContent = "Edit Expense";
  document.getElementById("expenseSubmitBtnText").textContent = "Update Expense";

  document.getElementById("expenseTitleInput").value = exp.name;
  document.getElementById("modalExpenseAmountInput").value = exp.cost;
  
  populateModalCityOptions(exp.city);

  const dateInput = document.getElementById("modalExpenseDateInput");
  dateInput.min = activeTrip.startDate;
  dateInput.max = activeTrip.endDate;
  dateInput.value = exp.date || activeTrip.startDate;

  selectModalCategory(exp.category);

  document.getElementById("expenseModal").classList.add("visible");
}

function closeExpenseModal() {
  document.getElementById("expenseModal").classList.remove("visible");
  document.getElementById("expenseForm").reset();
}

function closeExpenseModalOnBackdrop(event) {
  if (event.target === document.getElementById("expenseModal")) {
    closeExpenseModal();
  }
}

function selectModalCategory(catName, clickedEl = null) {
  const buttons = document.querySelectorAll(".category-radio-btn");
  buttons.forEach(btn => {
    const isTarget = btn.getAttribute("data-cat") === catName;
    if (isTarget) {
      btn.classList.add("selected");
      btn.querySelector("input").checked = true;
    } else {
      btn.classList.remove("selected");
    }
  });
}

function populateModalCityOptions(selectedCity = null) {
  const select = document.getElementById("modalExpenseCitySelect");
  select.innerHTML = "";

  const citiesSet = new Set();
  if (activeTrip.stops && activeTrip.stops.length > 0) {
    activeTrip.stops.forEach(s => citiesSet.add(s.city));
  } else {
    citiesSet.add(activeTrip.destination);
  }

  citiesSet.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    if (selectedCity && city === selectedCity) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

/**
 * Handle Add/Edit Expense Form Submit
 */
function handleExpenseFormSubmit(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("expenseSubmitBtn");
  if (submitBtn.classList.contains("loading")) return;

  const expId = document.getElementById("modalExpenseId").value;
  const title = document.getElementById("expenseTitleInput").value.trim();
  const selectedRadio = document.querySelector("input[name='expenseCategoryRadio']:checked");
  const category = selectedRadio ? selectedRadio.value : "Other";
  const city = document.getElementById("modalExpenseCitySelect").value;
  const date = document.getElementById("modalExpenseDateInput").value;
  const amount = parseFloat(document.getElementById("modalExpenseAmountInput").value);

  if (isNaN(amount) || amount < 0) {
    showToast("Please enter a valid expense amount.", "error");
    return;
  }

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  setTimeout(() => {
    if (expId === "") {
      // Create new expense
      const newExpense = {
        id: `exp-${Date.now()}`,
        name: title,
        category: category,
        city: city,
        date: date,
        cost: amount,
        notes: ""
      };
      activeTrip.expenses.unshift(newExpense);
      showToast(`Added "${title}" (${formatMoney(amount)})`, "success");
    } else {
      // Edit existing expense
      const expIdx = activeTrip.expenses.findIndex(e => e.id === expId);
      if (expIdx !== -1) {
        activeTrip.expenses[expIdx].name = title;
        activeTrip.expenses[expIdx].category = category;
        activeTrip.expenses[expIdx].city = city;
        activeTrip.expenses[expIdx].date = date;
        activeTrip.expenses[expIdx].cost = amount;
        showToast(`Updated "${title}"`, "success");
      }
    }

    saveTripsToLocalStorage();
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
    closeExpenseModal();

    // Re-render
    renderBudgetDashboard();
  }, 400);
}

/**
 * Modal Actions: Edit Planned Budget
 */
function openEditBudgetModal() {
  document.getElementById("modalPlannedBudgetInput").value = activeTrip.budget || 100000;
  document.getElementById("budgetModal").classList.add("visible");
  document.getElementById("modalPlannedBudgetInput").focus();
}

function closeBudgetModal() {
  document.getElementById("budgetModal").classList.remove("visible");
}

function closeBudgetModalOnBackdrop(event) {
  if (event.target === document.getElementById("budgetModal")) {
    closeBudgetModal();
  }
}

function handleBudgetFormSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById("budgetSubmitBtn");
  const budgetVal = parseFloat(document.getElementById("modalPlannedBudgetInput").value);

  if (isNaN(budgetVal) || budgetVal <= 0) {
    showToast("Please enter a valid budget amount.", "error");
    return;
  }

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  setTimeout(() => {
    activeTrip.budget = budgetVal;
    saveTripsToLocalStorage();

    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
    closeBudgetModal();

    renderBudgetDashboard();
    showToast(`Trip budget limit updated to ${formatMoney(budgetVal)}`, "success");
  }, 400);
}

/**
 * Delete Expense Confirmation
 */
function confirmDeleteExpense(expId, expName) {
  expenseIdToDelete = expId;
  document.getElementById("deleteExpenseName").textContent = `"${expName}"`;
  document.getElementById("deleteExpenseConfirmModal").classList.add("visible");
}

function closeDeleteExpenseModal() {
  document.getElementById("deleteExpenseConfirmModal").classList.remove("visible");
  expenseIdToDelete = null;
}

function closeDeleteModalOnBackdrop(event) {
  if (event.target === document.getElementById("deleteExpenseConfirmModal")) {
    closeDeleteExpenseModal();
  }
}

document.getElementById("btnConfirmDeleteExpenseAction").addEventListener("click", () => {
  if (!expenseIdToDelete) return;

  const expIndex = activeTrip.expenses.findIndex(e => e.id === expenseIdToDelete);
  if (expIndex !== -1) {
    const deletedName = activeTrip.expenses[expIndex].name;
    activeTrip.expenses.splice(expIndex, 1);
    saveTripsToLocalStorage();
    
    closeDeleteExpenseModal();
    renderBudgetDashboard();
    showToast(`Removed "${deletedName}" from trip budget`, "success");
  }
});

/**
 * Helper: Save updated trips array to LocalStorage
 */
function saveTripsToLocalStorage() {
  localStorage.setItem("globaltrotter_trips", JSON.stringify(allTrips));
}

/**
 * Helper: Generate array of dates between two dates inclusive
 */
function getTripDatesArray(startDateStr, endDateStr) {
  const dates = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  let curr = new Date(start);

  while (curr <= end) {
    dates.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

/**
 * Helper: Escape quotes for inline HTML handler strings
 */
function escapeQuotes(str) {
  if (!str) return "";
  return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

/**
 * Helper: Short and Medium Date formatters
 */
function formatDateShort(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateMedium(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatDateLong(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function dateDifferenceInDays(d1, d2) {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
