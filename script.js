// Navigation burger menu for mobile
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle navigation menu
    nav.classList.toggle('active');
    burger.classList.toggle('active');

    // Animate links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        burger.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission
const form = document.querySelector('.contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add this to your existing script.js
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
    
        try {
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {
                document.getElementById('form-success').style.display = 'block';
                document.getElementById('contactForm').reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again.');
        }
    });
});

// Animate stats when in viewport
const stats = document.querySelectorAll('.stat-item');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

stats.forEach(stat => {
    stat.style.opacity = 0;
    stat.style.transform = 'translateY(20px)';
    stat.style.transition = 'all 0.5s ease-in-out';
    observer.observe(stat);
});

// Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let isTransitioning = false;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (!isTransitioning) goToSlide(index);
        });
        dots.appendChild(dot);
    });

    const allDots = document.querySelectorAll('.dot');

    function goToSlide(n) {
        if (n === currentSlide) return;
        isTransitioning = true;

        slides[currentSlide].classList.remove('active');
        allDots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        allDots[currentSlide].classList.add('active');

        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    function nextSlide() {
        if (!isTransitioning) goToSlide(currentSlide + 1);
    }

    setInterval(nextSlide, 5000);

});

// Admin page access
let keySequence = '';
const targetSequence = 'nss';
const resetDelay = 1000; // Reset after 1 second

document.addEventListener('keydown', function(event) {
    // Only process if not typing in an input or textarea
    if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        // Add the pressed key to the sequence
        keySequence += event.key.toLowerCase();
        
        // Check if the sequence matches
        if (keySequence.includes(targetSequence)) {
            window.location.href = 'admin.html';
            keySequence = '';
        }
        
        // Reset the sequence after a delay
        setTimeout(() => {
            keySequence = '';
        }, resetDelay);
    }
});

// script.js root scope
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('tutorial-overlay');
  if (!overlay) return;

  var seen = null;
  try {
    seen = localStorage.getItem('tutorialSeen');
  } catch (e) {
    seen = null;
  }

  var show = !seen;
  if (show) {
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
  }

  var skipBtn = document.getElementById('tutorial-skip');

  function dismiss() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    try {
      localStorage.setItem('tutorialSeen', '1');
    } catch (e) {}
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dismiss();
    });
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) dismiss();
  });

  setTimeout(function () {
    if (overlay.classList.contains('show')) dismiss();
  }, 15000);
});