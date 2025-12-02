/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__list a[href*=' + sectionId + ']')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            sectionsClass.classList.add('active-link')
        } else {
            sectionsClass.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

// Project Modals functionality
document.addEventListener('DOMContentLoaded', function () {
    // Modal functionality
    const projectBtns = document.querySelectorAll('.view-project-btn');
    const projectModals = document.querySelectorAll('.project-modal');
    const closeBtns = document.querySelectorAll('.close-modal');

    projectBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        });
    });

    function closeProjectModal(modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove('closing');
            document.body.style.overflow = "auto";
        }, 300); // Match animation duration
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const modal = this.closest('.project-modal');
            closeProjectModal(modal);
        });
    });

    window.addEventListener('click', function (e) {
        if (e.target.classList.contains('project-modal')) {
            closeProjectModal(e.target);
        }
    });


    // Initialize all carousels
    document.querySelectorAll('.carousel').forEach(carousel => {
        const inner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const indicators = carousel.querySelectorAll('.indicator');

        let currentIndex = 0;
        const itemCount = items.length;

        function updateCarousel() {
            inner.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update indicators
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // Next button
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % itemCount;
            updateCarousel();
        });

        // Previous button
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + itemCount) % itemCount;
            updateCarousel();
        });

        // Indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });

        // Optional: Auto-rotate carousel
        let rotateInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % itemCount;
            updateCarousel();
        }, 5000);

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(rotateInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            rotateInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % itemCount;
                updateCarousel();
            }, 5000);
        });
    });

    // Certificate Modal functionality
    const certificateBtns = document.querySelectorAll('.view-certificate-btn');
    const certificateModal = document.getElementById('certificate-modal');
    const certificateImage = document.getElementById('certificate-image');
    const certificateClose = document.querySelector('.certificate-modal-close');

    // Open modal
    certificateBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const certificateSrc = this.getAttribute('data-certificate');
            certificateImage.src = certificateSrc;
            certificateModal.classList.add("show");
            document.body.style.overflow = "hidden";
        });
    });

    // Close modal
    function closeCertificateModal() {
        // Jangan langsung hapus "show"
        certificateModal.classList.add("closing");

        // Tunggu animasi selesai
        setTimeout(() => {
            certificateModal.classList.remove("show", "closing");
            certificateImage.src = "";
            document.body.style.overflow = "auto";
        }, 300); // sama dengan durasi fadeOut
    }

    certificateClose.addEventListener('click', closeCertificateModal);

    window.addEventListener('click', function (e) {
        if (e.target === certificateModal) {
            closeCertificateModal();
        }
    });

});

/*=============== CONTACT FORM ===============*/
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const name = contactForm.querySelector('input[name="user_name"]').value.trim();
            const email = contactForm.querySelector('input[name="user_email"]').value.trim();
            const message = contactForm.querySelector('textarea[name="user_message"]').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                showContactMessage('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showContactMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('.contact__button');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // Prepare form data for Formspree
                const formData = new FormData();
                formData.append('user_name', name);
                formData.append('user_email', email);
                formData.append('user_message', message);
                formData.append('_next', 'thanks.html');

                // Submit to Formspree
                const response = await fetch('https://formspree.io/f/xblyoadd', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    showContactMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    // Error
                    showContactMessage('Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                // Network error
                showContactMessage('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Reset loading state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    function showContactMessage(message, type) {
        if (contactMessage) {
            contactMessage.textContent = message;
            contactMessage.className = `contact__message ${type === 'success' ? 'success' : 'error'}`;

            // Auto-hide message after 5 seconds
            setTimeout(() => {
                contactMessage.textContent = '';
                contactMessage.className = 'contact__message';
            }, 5000);
        }
    }
});

/*=============== MODERN ANIMATIONS ===============*/

// Animasi untuk stats counter
document.addEventListener('DOMContentLoaded', function() {
  // Animate stats counter
  const statNumbers = document.querySelectorAll('.hero__stat-number');
  
  if (statNumbers.length > 0) {
    const animateCounter = (element, target, duration = 1500) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + '+';
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + '+';
        }
      }, 16);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        statNumbers.forEach(stat => {
          const text = stat.textContent.replace('+', '');
          const target = parseInt(text);
          if (!isNaN(target)) {
            animateCounter(stat, target);
          }
        });
        statsObserver.unobserve(entries[0].target);
      }
    }, { threshold: 0.5 });
    
    if (document.querySelector('.hero__stats')) {
      statsObserver.observe(document.querySelector('.hero__stats'));
    }
  }
  
  // Floating animation for image
  const heroImage = document.querySelector('.hero__image-wrapper');
  if (heroImage) {
    heroImage.style.animation = 'float 6s ease-in-out infinite';
  }
  
  // Add float animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
  `;
  document.head.appendChild(style);
});

/*=============== ENHANCED ANIMATIONS ===============*/

document.addEventListener('DOMContentLoaded', function() {
  // Animate progress bars when in view
  const skillCards = document.querySelectorAll('.skill-card');
  
  const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillCard = entry.target;
        const progressBar = skillCard.querySelector('.skill-card__progress-bar');
        
        // Reset and animate progress bar
        if (progressBar) {
          const width = progressBar.style.width;
          progressBar.style.width = '0%';
          
          setTimeout(() => {
            progressBar.style.width = width;
            progressBar.style.transition = 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
          }, 300);
        }
        
        // Add bounce effect
        skillCard.style.animation = 'none';
        setTimeout(() => {
          skillCard.style.animation = 'bounceIn 0.6s ease';
        }, 100);
        
        observer.unobserve(skillCard);
      }
    });
  };
  
  const skillObserver = new IntersectionObserver(animateSkills, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });
  
  skillCards.forEach(card => {
    skillObserver.observe(card);
  });
  
  // Add click effects to social links
  const socialLinks = document.querySelectorAll('.social-connect__link');
  
  socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Add ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add bounce animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
      }
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Stats counter animation
  const statNumbers = document.querySelectorAll('.hero__stat-number');
  
  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        statNumbers.forEach((stat, index) => {
          setTimeout(() => {
            const text = stat.textContent.replace('+', '');
            const target = parseInt(text);
            if (!isNaN(target)) {
              animateCounter(stat, target);
            }
          }, index * 300);
        });
        statsObserver.unobserve(entries[0].target);
      }
    }, { threshold: 0.5 });
    
    if (document.querySelector('.hero__stats')) {
      statsObserver.observe(document.querySelector('.hero__stats'));
    }
  }
  
  function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
        // Add celebration effect
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
          element.style.transition = 'transform 0.3s ease';
        }, 300);
      } else {
        element.textContent = Math.floor(current) + '+';
      }
    }, 16);
  }
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Filter functionality
  const filterButtons = document.querySelectorAll('.works__filter-btn');
  const workCards = document.querySelectorAll('.works__card');
  
  // Filter cards based on category
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      // Show/hide cards based on filter
      workCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || filterValue === category) {
          // Show card with animation
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          // Hide card with animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Add click effect to cards
  workCards.forEach(card => {
    card.addEventListener('click', function() {
      // Add click animation
      this.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        this.style.transform = 'translateY(-10px) scale(1.02)';
      }, 200);
      
      // Toggle a "selected" state
      this.classList.toggle('selected');
      
      // In a real implementation, you might want to:
      // 1. Open a modal with more details
      // 2. Navigate to a project page
      // 3. Show more information
      const cardTitle = this.querySelector('.works__name').textContent;
      console.log('Clicked on:', cardTitle);
    });
  });
  
  // Add CSS for selected state
  const style = document.createElement('style');
  style.textContent = `
    .works__card.selected {
      border-color: var(--first-color);
      box-shadow: 0 0 0 3px rgba(var(--first-color-rgb, 100, 100, 255), 0.2);
      transform: translateY(-10px) scale(1.02);
    }
    
    .works__card.selected::after {
      opacity: 1;
    }
    
    .works__card.selected .works__circle {
      opacity: 0.3;
      transform: scale(1.15);
    }
  `;
  document.head.appendChild(style);
});

// Portfolio Background Interactions
document.addEventListener('DOMContentLoaded', function() {
  // Create particles
  createParticles();
  
  // Create floating shapes
  createFloatingShapes();
  
  // Initialize mouse interactions
  initMouseInteractions();
  
  // Initialize scroll progress
  initScrollProgress();
  
  // Initialize parallax effects
  initParallaxEffects();
  
  // Initialize dynamic background
  initDynamicBackground();
});

// Create floating particles
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random properties
    const size = Math.random() * 60 + 20;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    // Apply styles
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = Math.random() * 0.2 + 0.1;
    
    // Random color variation
    const hue = Math.floor(Math.random() * 60) + 200; // Blue-purple range
    particle.style.background = `radial-gradient(circle at 30% 30%, hsl(${hue}, 80%, 60%) 0%, transparent 70%)`;
    
    particlesContainer.appendChild(particle);
  }
}

// Create floating shapes
function createFloatingShapes() {
  const shapesContainer = document.getElementById('floatingShapes');
  const shapeTypes = ['circle', 'triangle', 'square'];
  const shapeCount = 15;
  
  for (let i = 0; i < shapeCount; i++) {
    const shape = document.createElement('div');
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    
    shape.classList.add('shape', type);
    
    // Random properties
    const size = Math.random() * 80 + 40;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 30 + 20;
    const delay = Math.random() * 10;
    const hue = Math.floor(Math.random() * 60) + 200;
    
    // Apply styles
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${posX}%`;
    shape.style.top = `${posY}%`;
    shape.style.animationDuration = `${duration}s`;
    shape.style.animationDelay = `${delay}s`;
    shape.style.opacity = Math.random() * 0.15 + 0.05;
    
    // Color based on type
    if (type === 'circle') {
      shape.style.background = `radial-gradient(circle, hsl(${hue}, 80%, 60%) 0%, transparent 70%)`;
    } else if (type === 'triangle') {
      shape.style.borderBottomColor = `hsl(${hue}, 80%, 60%)`;
    } else {
      shape.style.background = `hsl(${hue}, 80%, 60%)`;
    }
    
    shapesContainer.appendChild(shape);
  }
}

// Mouse interactions
function initMouseInteractions() {
  const interactiveArea = document.getElementById('interactiveArea');
  const cursorTrail = document.getElementById('cursorTrail');
  const particles = document.querySelectorAll('.particle');
  const shapes = document.querySelectorAll('.shape');
  
  let mouseX = 0;
  let mouseY = 0;
  let trailX = 0;
  let trailY = 0;
  const speed = 0.1;
  
  // Mouse move effect
  interactiveArea.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show cursor trail
    cursorTrail.style.opacity = '0.5';
    
    // Apply magnetic effect to particles
    particles.forEach(particle => {
      const rect = particle.getBoundingClientRect();
      const particleX = rect.left + rect.width / 2;
      const particleY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2)
      );
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        const angle = Math.atan2(mouseY - particleY, mouseX - particleX);
        const moveX = Math.cos(angle) * force * 20;
        const moveY = Math.sin(angle) * force * 20;
        
        particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });
    
    // Apply effect to shapes
    shapes.forEach(shape => {
      const rect = shape.getBoundingClientRect();
      const shapeX = rect.left + rect.width / 2;
      const shapeY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(mouseX - shapeX, 2) + Math.pow(mouseY - shapeY, 2)
      );
      
      if (distance < 200) {
        const force = (200 - distance) / 200;
        shape.style.transform += ` scale(${1 + force * 0.2})`;
      }
    });
  });
  
  // Mouse leave effect
  interactiveArea.addEventListener('mouseleave', () => {
    cursorTrail.style.opacity = '0';
  });
  
  // Smooth cursor trail animation
  function animateCursorTrail() {
    trailX += (mouseX - trailX) * speed;
    trailY += (mouseY - trailY) * speed;
    
    cursorTrail.style.left = `${trailX}px`;
    cursorTrail.style.top = `${trailY}px`;
    
    // Pulsing effect
    const scale = 1 + Math.sin(Date.now() * 0.002) * 0.2;
    cursorTrail.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    requestAnimationFrame(animateCursorTrail);
  }
  
  animateCursorTrail();
}

// Scroll progress indicator
function initScrollProgress() {
  const scrollProgress = document.getElementById('scrollProgress');
  
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
  });
}

// Parallax effects
function initParallaxEffects() {
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxLayers.forEach((layer, index) => {
      const speed = 0.5 * (index + 1);
      const yPos = -(scrolled * speed);
      layer.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Dynamic background effects
function initDynamicBackground() {
  const waves = document.querySelectorAll('.wave');
  const grid = document.querySelector('.background-grid');
  
  // Wave interaction on scroll
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset * 0.5;
    
    waves.forEach((wave, index) => {
      wave.style.transform = `translateX(${scrolled * (index + 1) * 0.1}px)`;
    });
    
    // Grid distortion effect
    grid.style.transform = `skewY(${Math.sin(scrolled * 0.001) * 2}deg)`;
  });
  
  // Random light bursts
  setInterval(() => {
    const bursts = document.querySelectorAll('.light-burst');
    bursts.forEach(burst => {
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      burst.style.left = `${randomX}%`;
      burst.style.top = `${randomY}%`;
    });
  }, 10000);
  
  // Color shift animation
  setInterval(() => {
    const hueShift = Math.sin(Date.now() * 0.0005) * 30;
    document.documentElement.style.setProperty('--hue-shift', `${hueShift}`);
  }, 50);
}


/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true, // Animation repeat
})

sr.reveal('.hero', { origin: 'top', delay: 200 })
sr.reveal('.about-summary', { origin: 'right', delay: 400 })
sr.reveal('.skills-highlights', { origin: 'left', delay: 600 })
sr.reveal('.social-connect', { origin: 'bottom', delay: 800 })
sr.reveal('.projects__card, .works__card, .experience__card', { interval: 100 })

