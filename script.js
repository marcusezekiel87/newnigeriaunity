// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdown() {
  const launchDate = new Date('2026-08-01T00:00:00').getTime();
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;
    
    if (distance < 0) {
      document.getElementById('cd-days').textContent = '0';
      document.getElementById('cd-hours').textContent = '0';
      document.getElementById('cd-mins').textContent = '0';
      document.getElementById('cd-secs').textContent = '0';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ============================================
// STATE MOSAIC - Generate all 37 tiles
// ============================================
function initStateMosaic() {
  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
    'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun',
    'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara'
  ];
  
  // States with episodes ready (first 4 + others in production)
  const liveStates = new Set([
    'Benue',    // Tiv
    'Anambra',  // Igbo
    'Kano',     // Hausa
    'Oyo',      // Yoruba
    'Kaduna', 'Jigawa', 'Bauchi', 'Enugu'  // Plus 4 more = 8 total shown in hero
  ]);
  
  const mosaic = document.getElementById('mosaic');
  
  states.forEach(state => {
    const tile = document.createElement('div');
    tile.className = 'state-tile';
    
    if (liveStates.has(state)) {
      tile.classList.add('live');
    } else {
      tile.classList.add('upcoming');
    }
    
    tile.innerHTML = `
      <span class="tooltip">${state}</span>
      ${state}
    `;
    
    mosaic.appendChild(tile);
  });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// SHARE YOUR STORY - FORM HANDLER
// ============================================
function initFormHandler() {
  // Find the form in the share-story section
  const form = document.querySelector('.share-form');
  
  if (!form) {
    console.warn('Share form not found in DOM');
    return;
  }
  
  // Check if form has a button, if not add one
  let submitBtn = form.querySelector('button');
  if (!submitBtn) {
    submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Share Your Story';
    form.appendChild(submitBtn);
  }
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      story: formData.get('story'),
      timestamp: new Date().toISOString()
    };
    
    // Validate
    if (!data.name || !data.email || !data.story) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      
      // Store submission locally (in production, send to backend)
      const submissions = JSON.parse(localStorage.getItem('nnu_stories') || '[]');
      submissions.push(data);
      localStorage.setItem('nnu_stories', JSON.stringify(submissions));
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.style.cssText = `
        background: #008753;
        color: white;
        padding: 16px;
        border-radius: 4px;
        margin-top: 16px;
        font-weight: 600;
      `;
      successMsg.textContent = '✓ Thank you! Your story has been received. We\'ll be in touch soon.';
      form.appendChild(successMsg);
      
      // Reset form
      form.reset();
      submitBtn.textContent = 'Share Your Story';
      submitBtn.disabled = false;
      
      // Remove success message after 5 seconds
      setTimeout(() => successMsg.remove(), 5000);
      
      console.log('Story submission stored:', data);
    } catch (error) {
      console.error('Error submitting story:', error);
      alert('There was an error submitting your story. Please try again.');
      submitBtn.textContent = 'Share Your Story';
      submitBtn.disabled = false;
    }
  });
}

// ============================================
// MOBILE NAV TOGGLE (Optional Enhancement)
// ============================================
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
  }
}

// ============================================
// SMOOTH SCROLL ANCHOR LINKS
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// INITIALIZE ALL ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🇳🇬 New Nigeria Unity — Initializing...');
  
  initCountdown();
  initStateMosaic();
  initScrollReveal();
  initFormHandler();
  initMobileNav();
  initSmoothScroll();
  
  console.log('✓ All features initialized');
});
