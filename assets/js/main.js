/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact__message')

const sendEmail = (e) =>{
    e.preventDevault()

    // serviceID - templateID - #form - publicKey
    emailjs.sendForm('service_kbyiinc','template_mg62wp9','#contact-form','ZLFTsikxYTonmdzw7')

    .then(() =>{
        // Show sent message
        contactMessage.textContent = 'Message sent successfully ✅'

        // Remove message after five seconds
        setTimeout(() =>{
           contactMessage.textContent = ''
        }, 5000)

        // Clear input fields
        contactForm.reset()
    }, () =>{
        // Show error message
        contactMessage.textContent = 'Message not sent (service error) ❌'
    })
}
contactForm.addEventListener('submit', sendEmail)

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
    const scrollUp = document.getElementById('scroll-up')
     // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                    : scrollUp.classList.remove('show-scroll') 
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/


/*=============== SCROLL REVEAL ANIMATION ===============*/

// Project Modals functionality
document.addEventListener('DOMContentLoaded', function() {
   // Modal functionality
   const projectBtns = document.querySelectorAll('.view-project-btn');
   const projectModals = document.querySelectorAll('.project-modal');
   const closeBtns = document.querySelectorAll('.close-modal');

   projectBtns.forEach(btn => {
      btn.addEventListener('click', function() {
         const modalId = this.getAttribute('data-modal');
         const modal = document.getElementById(modalId);
         modal.style.display = "block";
         document.body.style.overflow = "hidden";
      });
   });

   closeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
         const modal = this.closest('.project-modal');
         modal.style.display = "none";
         document.body.style.overflow = "auto";
      });
   });

   window.addEventListener('click', function(e) {
      if (e.target.classList.contains('project-modal')) {
         e.target.style.display = "none";
         document.body.style.overflow = "auto";
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
});