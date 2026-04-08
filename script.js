// Wedding Invitation Script Logic

document.addEventListener('DOMContentLoaded', () => {
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('mainContent');
    const openBtn = document.getElementById('openInvitation');
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    // Handle Open Invitation
    openBtn.addEventListener('click', () => {
        // Unlock Scrolling
        document.body.classList.remove('overflow-hidden');
        
        // Hide Cover with Slide-out
        cover.classList.add('cover-out');
        
        // Show Main Content
        mainContent.classList.remove('opacity-0');
        mainContent.classList.add('opacity-100');
        
        bgMusic.currentTime = 57.5;
        bgMusic.play();
        isPlaying = true;
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>'; // show pause icon when music is playing
        
        // Scroll to top of main content (just in case)
        window.scrollTo(0, 0);

        // Start AOS animations with full settings only after the content is visible
        setTimeout(() => {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }, 100);
    });

    // Music Toggle Logic
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            bgMusic.play();
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

    // Simple RSVP Mock (Preventing form submission reload)
    const rsvpForm = document.querySelector('form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Mengirim...';
            btn.disabled = true;
            
            // Mock delay
            setTimeout(() => {
                alert('Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.');
                btn.innerText = 'Sudah Terkonfirmasi';
                btn.classList.add('bg-green-600');
                btn.classList.remove('bg-gold');
            }, 1500);
        });
    }

    // Scroll to section handling for inner links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Countdown Timer Logic
    const targetDate = new Date("June 26, 2026 14:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");

        if (!daysEl) return;

        if (distance < 0) {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minsEl.innerText = "00";
            secsEl.innerText = "00";
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = d.toString().padStart(2, '0');
        hoursEl.innerText = h.toString().padStart(2, '0');
        minsEl.innerText = m.toString().padStart(2, '0');
        secsEl.innerText = s.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Guest Name Handling from URL (?to=Nama%20Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestTo = urlParams.get('to');
    const guestEl = document.getElementById('guestName');
    
    if (guestTo && guestEl) {
        guestEl.innerText = guestTo;
    }

    // Cover Slideshow Logic (Cover Page)
    const coverImages = [
        'img/cover/slide1.jpeg',
        'img/cover/slide2.jpeg',
        'img/cover/slide3.jpeg'
    ];

    function initSlideshow() {
        const container = document.getElementById('coverSlideshow');
        if (!container) return;

        coverImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = `slide ${index === 0 ? 'active' : ''}`;
            container.appendChild(img);
        });

        let currentActive = 0;
        const slides = container.querySelectorAll('.slide');

        if (slides.length > 1) {
            setInterval(() => {
                slides[currentActive].classList.remove('active');
                currentActive = (currentActive + 1) % slides.length;
                slides[currentActive].classList.add('active');
            }, 3000); // 3 Seconds for cover
        }
    }
    
    initSlideshow();

    // Gallery Carousel Logic
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const thumbs = document.querySelectorAll('.thumb-item');
    const thumbnailsContainer = document.getElementById('carouselThumbnails');
    
    if (track) {
        const slides = Array.from(track.children);
        let currentIndex = 0;
        let slideInterval;

        function updateCarousel(skipScroll = false) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update Thumbnails Active State
            thumbs.forEach((thumb, index) => {
                if (index === currentIndex) {
                    thumb.classList.add('active');
                    
                    // Horizontally center the active thumbnail in its container (WITHOUT vertical page jumping)
                    if (!skipScroll && thumbnailsContainer) {
                        const scrollLeft = thumb.offsetLeft - (thumbnailsContainer.offsetWidth / 2) + (thumb.offsetWidth / 2);
                        thumbnailsContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                    }
                } else {
                    thumb.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        }

        function startTimer() {
            slideInterval = setInterval(nextSlide, 4000); // 4 seconds duration
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        // Thumbnail Click Events
        thumbs.forEach((thumb) => {
            thumb.addEventListener('click', () => {
                currentIndex = parseInt(thumb.getAttribute('data-index')) || 0;
                updateCarousel();
                resetTimer();
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetTimer();
            });
        }

        // Initialization (Ensures all elements are set without initial scroll jump)
        updateCarousel(true);
        startTimer();
    }
});

// Global function (accessible from onclick attributes)
window.saveToCalendar = () => {
    const title = encodeURIComponent("Pemberkatan & Resepsi Riandino & Aurora");
    const details = encodeURIComponent("Pemberkatan: GBKP KM 7 (14:00 WIB, 26 Juni), Resepsi: Jambur Namaken (07:00 WIB, 27 Juni)");
    const location = encodeURIComponent("GBKP KM 7, Jambur Namaken");
    const dates = "20260626T070000Z/20260627T100000Z"; 
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(googleUrl, '_blank');
};
