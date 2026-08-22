// DOM Elements
const formsWrapper = document.getElementById('formsWrapper');
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const statusToast = document.getElementById('statusToast');
const toastMessage = document.getElementById('toastMessage');
const toastIconError = document.getElementById('toastIconError');
const toastIconSuccess = document.getElementById('toastIconSuccess');

// Eye icon SVG path data
const eyeOpenSVG = `<svg viewBox="0 0 24 24" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeClosedSVG = `<svg viewBox="0 0 24 24" class="eye-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

/**
 * Switch between Login and Register tabs
 * @param {string} mode - 'login' or 'register'
 */
function switchTab(mode) {
  if (mode === 'login') {
    // Toggles active button status
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    
    // Slide transition
    formsWrapper.style.transform = 'translateX(0%)';
    loginView.classList.remove('hidden');
    registerView.classList.add('hidden');
  } else {
    // Toggles active button status
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    
    // Slide transition
    formsWrapper.style.transform = 'translateX(-50%)';
    registerView.classList.remove('hidden');
    loginView.classList.add('hidden');
  }
}

/**
 * Toggle between password/text input visibility
 * @param {string} inputId - Target input element ID
 * @param {HTMLButtonElement} button - Toggle action button
 */
function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    button.innerHTML = eyeClosedSVG;
    button.setAttribute('aria-label', 'Hide password');
  } else {
    input.type = 'password';
    button.innerHTML = eyeOpenSVG;
    button.setAttribute('aria-label', 'Show password');
  }
}

/**
 * Displays a simulated interactive action message
 * @param {string} msg - Context message to print
 */
function showSimulatedAction(msg) {
  showToast(msg, 'success');
}

/**
 * Toast notifications banner management
 * @param {string} text - Text message to show
 * @param {string} type - 'success' or 'error'
 */
let toastTimeout;
function showToast(text, type = 'success') {
  clearTimeout(toastTimeout);
  
  toastMessage.textContent = text;
  statusToast.className = `status-toast visible ${type}`;
  
  if (type === 'error') {
    toastIconError.style.display = 'block';
    toastIconSuccess.style.display = 'none';
  } else {
    toastIconSuccess.style.display = 'block';
    toastIconError.style.display = 'none';
  }
  
  toastTimeout = setTimeout(() => {
    statusToast.classList.remove('visible');
  }, 4000);
}

/**
 * Form Validator & Simulated Submit
 * @param {Event} event - HTML submit event
 * @param {string} type - 'login' or 'register'
 */
function handleFormSubmit(event, type) {
  event.preventDefault();
  
  const submitBtn = document.getElementById(type === 'login' ? 'loginSubmit' : 'registerSubmit');
  if (submitBtn.classList.contains('loading') || submitBtn.classList.contains('success')) return;

  // Inputs validation values
  if (type === 'login') {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    // Reset borders
    emailInput.style.borderColor = '';
    passwordInput.style.borderColor = '';

    if (!validateEmail(emailInput.value)) {
      emailInput.style.borderColor = 'var(--error)';
      showToast('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    if (passwordInput.value.length < 8) {
      passwordInput.style.borderColor = 'var(--error)';
      showToast('Password must be at least 8 characters long.', 'error');
      passwordInput.focus();
      return;
    }

    // Trigger premium simulation
    triggerSimulatedLoading(submitBtn, 'Sign In successful!', () => {
      showToast('Welcome back to GlobalTrotters! Redirecting...', 'success');
      localStorage.setItem('globaltrotter_userId', 'user-jay');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });

  } else {
    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const termsCheck = document.getElementById('agreeTerms');
    
    // Reset borders
    nameInput.style.borderColor = '';
    emailInput.style.borderColor = '';
    passwordInput.style.borderColor = '';

    if (nameInput.value.trim() === '') {
      nameInput.style.borderColor = 'var(--error)';
      showToast('Please enter your full name.', 'error');
      nameInput.focus();
      return;
    }

    if (!validateEmail(emailInput.value)) {
      emailInput.style.borderColor = 'var(--error)';
      showToast('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    if (passwordInput.value.length < 8) {
      passwordInput.style.borderColor = 'var(--error)';
      showToast('Password must be at least 8 characters long.', 'error');
      passwordInput.focus();
      return;
    }

    if (!termsCheck.checked) {
      showToast('You must agree to the Terms of Service and Privacy Policy.', 'error');
      return;
    }

    // Trigger premium simulation
    triggerSimulatedLoading(submitBtn, 'Account Created!', () => {
      showToast('Adventure awaits! Redirecting to dashboard...', 'success');
      localStorage.setItem('globaltrotter_userId', 'user-jay');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }
}

/**
 * Email validation utility helper
 * @param {string} email 
 * @returns {boolean}
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Handle loading and completion micro-animations on primary buttons
 * @param {HTMLButtonElement} btn - Active button
 * @param {string} toastMsg - Toast string on completion
 * @param {Function} callback - Post loading success operation
 */
function triggerSimulatedLoading(btn, toastMsg, callback) {
  btn.disabled = true;
  btn.classList.add('loading');
  
  // Simulate network roundtrip latency
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.classList.add('success');
    
    setTimeout(() => {
      callback();
      
      // Reset after demonstration
      setTimeout(() => {
        btn.classList.remove('success');
        btn.disabled = false;
      }, 2000);
    }, 500);

  }, 1800);
}
