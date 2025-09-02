/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form'),
   contactMessage = document.getElementById('contact__message')

const sendEmail = (e) => {
   e.preventDefault()

   // serviceID - templateID - #form - publicKey
   emailjs.sendForm('service_kbyiinc', 'template_mg62wp9', '#contact-form', 'ZLFTsikxYTonmdzw7')

      .then(() => {
         // Show sent message
         contactMessage.textContent = 'Message sent successfully ✅'

         // Remove message after five seconds
         setTimeout(() => {
            contactMessage.textContent = ''
         }, 5000)

         // Clear input fields
         contactForm.reset()
      }, () => {
         // Show error message
         contactMessage.textContent = 'Message not sent (service error) ❌'
      })
}
contactForm.addEventListener('submit', sendEmail)

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

const scrollActive = () =>{
   const scrollDown = window.scrollY

   sections.forEach(current =>{
      const sectionHeight = current.offsetHeight,
         sectionTop = current.offsetTop - 58,
         sectionId = current.getAttribute('id'),
         sectionsClass = document.querySelector('.nav__list a[href*=' + sectionId + ']')

      if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
         sectionsClass.classList.add('active-link')
      }else{
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

   certificateBtns.forEach(btn => {
      btn.addEventListener('click', function () {
         const certificateSrc = this.getAttribute('data-certificate');
         certificateImage.src = certificateSrc;
         certificateModal.style.display = "block";
         document.body.style.overflow = "hidden";
      });
   });

   
   function closeCertificateModal() {
      certificateModal.classList.add('closing');
      setTimeout(() => {
         certificateModal.style.display = "none";
         certificateModal.classList.remove('closing');
         document.body.style.overflow = "auto";
         certificateImage.src = "";
      }, 300); // Match animation duration
   }

   certificateClose.addEventListener('click', closeCertificateModal);

   window.addEventListener('click', function (e) {
      if (e.target === certificateModal) {
         closeCertificateModal();

   certificateClose.addEventListener('click', function () {
      certificateModal.style.display = "none";
      document.body.style.overflow = "auto";
      certificateImage.src = "";
   });

   window.addEventListener('click', function (e) {
      if (e.target === certificateModal) {
         certificateModal.style.display = "none";
         document.body.style.overflow = "auto";
         certificateImage.src = "";

      }
   });
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
   origin: 'top',
   distance:'60px',
   duration: 2500,
   delay: 400,
   // reset: true, // Animation repeat
})

sr.reveal('')
