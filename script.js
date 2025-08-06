// Main portfolio script - imports separated functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Photo rotation functionality
    const profilePhoto = document.getElementById('profile-photo');
    const photoCount = 2; // Update this to match the number of photos you have
    
    if (profilePhoto && photoCount > 1) {
        let currentPhoto = 1;
        
        // Function to rotate photos
        function rotatePhoto() {
            currentPhoto = (currentPhoto % photoCount) + 1;
            profilePhoto.src = `assets/photo${currentPhoto}.jpg`;
            
            // Add fade effect
            profilePhoto.style.opacity = 0;
            setTimeout(() => {
                profilePhoto.style.opacity = 1;
            }, 100);
        }
        
        // Rotate every 5 seconds (5000ms)
        setInterval(rotatePhoto, 5000);
        
        // Add transition effect to the photo
        profilePhoto.style.transition = 'opacity 0.5s ease';
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const sections = document.querySelectorAll('section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    const timelineObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Add animation to hero elements
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    setTimeout(() => {
        heroText.style.animation = 'fadeInLeft 1s ease forwards';
        heroImage.style.animation = 'fadeInRight 1s ease forwards';
    }, 100);
});