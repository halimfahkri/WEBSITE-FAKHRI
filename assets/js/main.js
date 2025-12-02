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

