// Mobile menu functionality
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');

// Add hamburger menu for mobile
const createMobileMenu = () => {
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    navbar.appendChild(hamburger);

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
};

createMobileMenu();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Close mobile menu if open
            document.querySelector('.hamburger')?.classList.remove('active');
            navLinks.classList.remove('active');
            
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.program-card, .feature, .info-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
};

// Initialize animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Program cards hover effect
document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('i').classList.add('fa-bounce');
    });
    
    card.addEventListener('mouseleave', function() {
        this.querySelector('i').classList.remove('fa-bounce');
    });
});

// Testimonials Carousel
const setupTestimonials = () => {
    const carousel = document.querySelector('.testimonials-carousel');
    const testimonials = carousel.querySelectorAll('.testimonial');
    const dotsContainer = carousel.querySelector('.dots');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    let currentIndex = 0;

    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showTestimonial(index));
        dotsContainer.appendChild(dot);
    });

    const showTestimonial = (index) => {
        testimonials.forEach(t => t.classList.remove('active'));
        dotsContainer.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        testimonials[index].classList.add('active');
        dotsContainer.children[index].classList.add('active');
        currentIndex = index;
    };

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    });

    // Auto-advance
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
};

// Course Finder
const setupCourseFinder = () => {
    const coursesData = [
        { name: 'Computer Science', level: 'bachelor', field: 'it' },
        { name: 'International Business', level: 'bachelor', field: 'business' },
        { name: 'Healthcare Management', level: 'master', field: 'health' },
        { name: 'Software Engineering', level: 'bachelor', field: 'it' },
        { name: 'Digital Design', level: 'bachelor', field: 'it' },
        { name: 'Business Analytics', level: 'master', field: 'business' },
        { name: 'Nursing', level: 'bachelor', field: 'health' },
        { name: 'Mechanical Engineering', level: 'bachelor', field: 'technology' },
    ];

    const coursesGrid = document.querySelector('.courses-grid');
    const levelFilter = document.getElementById('level-filter');
    const fieldFilter = document.getElementById('field-filter');
    const searchInput = document.getElementById('search-courses');

    const filterCourses = () => {
        const level = levelFilter.value;
        const field = fieldFilter.value;
        const search = searchInput.value.toLowerCase();

        const filteredCourses = coursesData.filter(course => {
            const levelMatch = !level || course.level === level;
            const fieldMatch = !field || course.field === field;
            const searchMatch = !search || course.name.toLowerCase().includes(search);
            return levelMatch && fieldMatch && searchMatch;
        });

        displayCourses(filteredCourses);
    };

    const displayCourses = (courses) => {
        coursesGrid.innerHTML = courses.map(course => `
            <div class="course-card fade-in">
                <h3>${course.name}</h3>
                <p>Level: ${course.level.charAt(0).toUpperCase() + course.level.slice(1)}</p>
                <p>Field: ${course.field.charAt(0).toUpperCase() + course.field.slice(1)}</p>
            </div>
        `).join('');

        // Trigger animation
        requestAnimationFrame(() => {
            coursesGrid.querySelectorAll('.course-card').forEach(card => {
                card.classList.add('animate');
            });
        });
    };

    levelFilter.addEventListener('change', filterCourses);
    fieldFilter.addEventListener('change', filterCourses);
    searchInput.addEventListener('input', filterCourses);

    // Initial display
    displayCourses(coursesData);
};

// Campus Map
const setupCampusMap = () => {
    const mapLocations = {
        main: { lat: 52.0704, lng: 4.3251 },
        library: { lat: 52.0706, lng: 4.3255 },
        sports: { lat: 52.0702, lng: 4.3248 },
        cafeteria: { lat: 52.0705, lng: 4.3253 }
    };

    let map;

    // Initialize the map (using Leaflet.js)
    const initMap = () => {
        // Load Leaflet.js dynamically
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        document.head.appendChild(link);

        script.onload = () => {
            map = L.map('campus-interactive-map').setView([52.0704, 4.3251], 17);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            // Add markers
            Object.entries(mapLocations).forEach(([key, pos]) => {
                L.marker([pos.lat, pos.lng])
                    .addTo(map)
                    .bindPopup(key.charAt(0).toUpperCase() + key.slice(1));
            });
        };
    };

    document.querySelectorAll('.map-location').forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.dataset.location;
            if (map && mapLocations[location]) {
                map.setView([mapLocations[location].lat, mapLocations[location].lng], 18);
                document.querySelectorAll('.map-location').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    initMap();
};

// Language Switcher
const setupLanguageSwitcher = () => {
    const translations = {
        en: {
            home: 'Home',
            programs: 'Programs',
            'course-finder': 'Find Your Course',
            testimonials: 'Student Stories',
            campus: 'Campus Life',
            contact: 'Contact'
        },
        nl: {
            home: 'Home',
            programs: 'Programma\'s',
            'course-finder': 'Vind Je Opleiding',
            testimonials: 'Studentenverhalen',
            campus: 'Campus Leven',
            contact: 'Contact'
        }
    };

    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update text content
            Object.entries(translations[lang]).forEach(([key, value]) => {
                document.querySelectorAll(`[data-translate="${key}"]`).forEach(el => {
                    el.textContent = value;
                });
            });
        });
    });
};

// Initialize all new features
document.addEventListener('DOMContentLoaded', () => {
    setupTestimonials();
    setupCourseFinder();
    setupCampusMap();
    setupLanguageSwitcher();
});
