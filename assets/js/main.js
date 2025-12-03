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

// Modern Projects Interactions - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
  initModernProjects();
});

function initModernProjects() {
  // 1. Create and insert filter buttons
  createFilterButtons();
  
  // 2. Add data-category to project cards
  addCategoriesToProjects();
  
  // 3. Initialize modals
  initModernModals();
  
  // 4. Initialize carousels
  initModernCarousels();
  
  // 5. Add scroll animations
  initScrollAnimations();
  
  // 6. Add mouse effects
  initMouseEffects();
  
  // 7. Add project tags
  addProjectTags();
  
  // 8. Initialize image lazy loading
  initImageLoading();
}

// 1. Filter Buttons
function createFilterButtons() {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;
  
  const filterContainer = document.createElement('div');
  filterContainer.className = 'projects__filter container';
  
  const filters = [
    { id: 'all', text: 'All Projects', icon: 'ri-grid-fill' },
    { id: 'architecture', text: 'Architecture', icon: 'ri-building-4-line' },
    { id: 'low-poly', text: 'Low Poly', icon: 'ri-shapes-line' },
    { id: 'hardsurface', text: 'Hard Surface', icon: 'ri-cpu-line' },
    { id: 'environment', text: 'Environment', icon: 'ri-landscape-line' }
  ];
  
  filters.forEach(filter => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.setAttribute('data-filter', filter.id);
    btn.innerHTML = `
      <i class="${filter.icon}"></i>
      <span>${filter.text}</span>
    `;
    
    if (filter.id === 'all') {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Animation for button click
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
      
      filterProjects(filter.id);
    });
    
    filterContainer.appendChild(btn);
  });
  
  // Insert after section title
  const sectionTitle = projectsSection.querySelector('.section__title');
  if (sectionTitle && filterContainer) {
    sectionTitle.insertAdjacentElement('afterend', filterContainer);
  }
}

// 2. Add categories to projects
function addCategoriesToProjects() {
  const projectsCards = document.querySelectorAll('.projects__card');
  const categories = [
    'architecture',  // Mosque
    'low-poly',      // Sushi
    'hardsurface',   // Turret
    'low-poly',      // Animals
    'architecture',  // House
    'environment',   // Castle 1
    'environment',   // Castle 2
    'environment',   // Castle 3
    'environment'    // Castle 4
  ];
  
  projectsCards.forEach((card, index) => {
    card.setAttribute('data-category', categories[index] || 'all');
  });
}

// 3. Filter Projects Function
function filterProjects(filterValue) {
  const projectsCards = document.querySelectorAll('.projects__card');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // Update active button
  filterBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-filter') === filterValue) {
      btn.classList.add('active');
    }
  });
  
  // Filter projects with animation
  projectsCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    
    if (filterValue === 'all' || cardCategory === filterValue) {
      // Show with animation
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) rotateX(0) scale(1)';
      }, 50);
    } else {
      // Hide with animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px) rotateX(10deg) scale(0.95)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

// 4. Modal System
function initModernModals() {
  const modalBtns = document.querySelectorAll('.view-project-btn');
  const modals = document.querySelectorAll('.project-modal');
  const closeBtns = document.querySelectorAll('.close-modal');
  
  // Open modal with animation
  modalBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        // Add ripple effect to button
        createRippleEffect(this, e);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset carousel to first slide
        resetCarouselToFirst(modal);
        
        // Start carousel auto-slide
        startCarouselAutoSlide(modal);
      }
    });
  });
  
  // Close modal
  closeBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const modal = this.closest('.project-modal');
      closeModal(modal);
    });
  });
  
  // Close modal on outside click
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.project-modal.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Stop carousel auto-slide
    stopCarouselAutoSlide(modal);
  }
}

// 5. Ripple Effect
function createRippleEffect(element, event) {
  const ripple = document.createElement('div');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: rippleExpand 0.6s ease-out;
    width: ${size}px;
    height: ${size}px;
    top: ${y}px;
    left: ${x}px;
    pointer-events: none;
    z-index: 1;
  `;
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleExpand {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// 6. Carousel System
function initModernCarousels() {
  // Initialize all carousels on page load
  document.querySelectorAll('.carousel').forEach(carousel => {
    initCarousel(carousel);
  });
  
  // Handle carousel navigation
  document.addEventListener('click', function(e) {
    // Handle carousel navigation buttons
    if (e.target.closest('.carousel-control')) {
      const button = e.target.closest('.carousel-control');
      handleCarouselNavigation(button);
    }
    
    // Handle indicator clicks
    if (e.target.closest('.indicator')) {
      const indicator = e.target.closest('.indicator');
      handleIndicatorClick(indicator);
    }
  });
  
  // Add touch swipe support
  document.querySelectorAll('.carousel').forEach(carousel => {
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', e => {
      endX = e.changedTouches[0].clientX;
      handleSwipe(carousel, startX, endX);
    });
  });
}

function initCarousel(carousel) {
  const items = carousel.querySelectorAll('.carousel-item');
  const indicators = carousel.querySelectorAll('.indicator');
  
  // Initialize first item as active
  if (items.length > 0) {
    items[0].classList.add('active');
  }
  if (indicators.length > 0) {
    indicators[0].classList.add('active');
  }
  
  // Store interval ID for auto-slide
  carousel.dataset.intervalId = null;
}

function handleCarouselNavigation(button) {
  const carousel = button.closest('.carousel');
  const items = carousel.querySelectorAll('.carousel-item');
  const indicators = carousel.querySelectorAll('.indicator');
  
  let currentIndex = Array.from(items).findIndex(item => 
    item.classList.contains('active')
  );
  
  if (button.classList.contains('prev')) {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
  } else if (button.classList.contains('next')) {
    currentIndex = (currentIndex + 1) % items.length;
  }
  
  updateCarousel(carousel, currentIndex);
}

function handleIndicatorClick(indicator) {
  const slideTo = parseInt(indicator.getAttribute('data-slide-to'));
  const carousel = indicator.closest('.carousel');
  updateCarousel(carousel, slideTo);
}

function handleSwipe(carousel, startX, endX) {
  const swipeThreshold = 50;
  const difference = startX - endX;
  
  if (Math.abs(difference) > swipeThreshold) {
    const items = carousel.querySelectorAll('.carousel-item');
    const currentIndex = Array.from(items).findIndex(item => 
      item.classList.contains('active')
    );
    
    if (difference > 0) {
      // Swipe left - next
      updateCarousel(carousel, (currentIndex + 1) % items.length);
    } else {
      // Swipe right - previous
      updateCarousel(carousel, (currentIndex - 1 + items.length) % items.length);
    }
  }
}

function updateCarousel(carousel, newIndex) {
  const inner = carousel.querySelector('.carousel-inner');
  const items = carousel.querySelectorAll('.carousel-item');
  const indicators = carousel.querySelectorAll('.indicator');
  
  // Update carousel position
  if (inner) {
    inner.style.transform = `translateX(-${newIndex * 100}%)`;
  }
  
  // Update active item
  items.forEach((item, index) => {
    item.classList.remove('active');
    if (index === newIndex) {
      item.classList.add('active');
    }
  });
  
  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.remove('active');
    if (index === newIndex) {
      indicator.classList.add('active');
    }
  });
}

function resetCarouselToFirst(modal) {
  const carousel = modal.querySelector('.carousel');
  if (carousel) {
    updateCarousel(carousel, 0);
  }
}

function startCarouselAutoSlide(modal) {
  const carousel = modal.querySelector('.carousel');
  if (!carousel) return;
  
  // Clear existing interval
  if (carousel.dataset.intervalId) {
    clearInterval(carousel.dataset.intervalId);
  }
  
  // Start new interval
  carousel.dataset.intervalId = setInterval(() => {
    const nextBtn = carousel.querySelector('.carousel-control.next');
    if (nextBtn) {
      handleCarouselNavigation(nextBtn);
    }
  }, 4000);
}

function stopCarouselAutoSlide(modal) {
  const carousel = modal.querySelector('.carousel');
  if (carousel && carousel.dataset.intervalId) {
    clearInterval(carousel.dataset.intervalId);
    carousel.dataset.intervalId = null;
  }
}

// 7. Scroll Animations
function initScrollAnimations() {
  const projectsCards = document.querySelectorAll('.projects__card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay based on index
        setTimeout(() => {
          entry.target.style.animation = 'cardEntrance 0.8s forwards';
        }, index * 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  projectsCards.forEach(card => {
    observer.observe(card);
  });
}

// 8. Mouse Effects
function initMouseEffects() {
  const projectsCards = document.querySelectorAll('.projects__card');
  
  projectsCards.forEach(card => {
    // Mouse move effect for 3D tilt
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = ((centerY - y) / centerY) * 5;
      
      this.style.transform = `
        translateY(-15px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        scale(1.02)
      `;
      
      // Parallax effect on image
      const img = this.querySelector('.projects__img');
      if (img) {
        const depth = 20;
        const moveX = (x - centerX) / depth;
        const moveY = (y - centerY) / depth;
        img.style.transform = `
          scale(1.15) 
          translate(${moveX}px, ${moveY}px) 
          rotateZ(${rotateY * 0.2}deg)
        `;
      }
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      
      const img = this.querySelector('.projects__img');
      if (img) {
        img.style.transform = '';
      }
    });
    
    // Card click effect
    card.addEventListener('click', function(e) {
      if (!e.target.closest('.view-project-btn') && !e.target.closest('button')) {
        // Create click effect
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      }
    });
  });
}

// 9. Add Project Tags
function addProjectTags() {
  const projectsCards = document.querySelectorAll('.projects__card');
  const tagsData = [
    ['3D Modeling', 'Architecture', 'Blender'],
    ['Low Poly', 'Food', 'Stylized'],
    ['Hard Surface', 'Sci-Fi', 'Weapon'],
    ['Low Poly', 'Animals', 'Cute'],
    ['Architecture', 'Traditional', 'House'],
    ['Low Poly', 'Fantasy', 'Environment'],
    ['Low Poly', 'Castle', 'Environment'],
    ['Low Poly', 'Castle', 'Environment'],
    ['Low Poly', 'Castle', 'Environment']
  ];
  
  projectsCards.forEach((card, index) => {
    // Check if tags already exist
    if (card.querySelector('.projects__tags')) return;
    
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'projects__tags';
    
    tagsData[index].forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'project-tag';
      tagElement.textContent = tag;
      
      // Add hover effect
      tagElement.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
        this.style.boxShadow = '0 8px 20px rgba(var(--first-color-rgb), 0.2)';
      });
      
      tagElement.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
      });
      
      tagsContainer.appendChild(tagElement);
    });
    
    // Insert tags after description
    const description = card.querySelector('.projects__description');
    if (description) {
      description.parentNode.insertBefore(tagsContainer, description.nextSibling);
    }
  });
}

// 10. Image Loading
function initImageLoading() {
  const projectImages = document.querySelectorAll('.projects__img');
  
  projectImages.forEach(img => {
    // Add loading class if image hasn't loaded
    if (!img.complete) {
      img.classList.add('loading');
      
      img.addEventListener('load', function() {
        this.classList.remove('loading');
        this.style.animation = 'imageFocus 0.8s ease-out';
      });
      
      img.addEventListener('error', function() {
        this.classList.remove('loading');
        this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="200" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="%23999">Image not found</text></svg>';
      });
    }
  });
}

// Initialize CSS variables
addCSSVariables();

// 12. Handle window resize
window.addEventListener('resize', function() {
  // Reset card transforms on resize
  document.querySelectorAll('.projects__card').forEach(card => {
    card.style.transform = '';
  });
});

// 13. Handle page load
window.addEventListener('load', function() {
  // Add loaded class for animations
  document.body.classList.add('loaded');
  
  // Animate filter buttons on load
  setTimeout(() => {
    document.querySelectorAll('.filter-btn').forEach((btn, index) => {
      setTimeout(() => {
        btn.style.animation = 'pulse 2s infinite';
      }, index * 100);
    });
  }, 1000);
});



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

