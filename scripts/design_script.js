document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('#buttons button');
    const galleries = document.querySelectorAll('.gallery-content');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all galleries
            galleries.forEach(gallery => gallery.classList.remove('active'));
            
            // Show the target gallery
            const targetId = button.getAttribute('data-target');
            const targetGallery = document.getElementById(targetId);
            if (targetGallery) {
                targetGallery.classList.add('active');
            }
        });
    });

    // --- LIGHTBOX GALLERY IMPLEMENTATION ---
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentGalleryItems = [];
    let currentIndex = -1;

    // Wrap target gallery images on load
    const imagesToWrap = document.querySelectorAll(
        '#poster-gallery .gallery img, #banner-gallery .gallery img, #id-cards-gallery .gallery img, #certificates-gallery .gallery img, #brochures-gallery .gallery img, #wish-cards-gallery .gallery img'
    );

    imagesToWrap.forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.className = 'gallery-item';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        overlay.innerHTML = '<i class="fa-solid fa-expand"></i>';

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(overlay);

        // Click handler to open lightbox
        wrapper.addEventListener('click', () => {
            const activeGallery = wrapper.closest('.gallery-content');
            if (activeGallery) {
                currentGalleryItems = Array.from(activeGallery.querySelectorAll('.gallery-item'));
                currentIndex = currentGalleryItems.indexOf(wrapper);
                openLightbox();
            }
        });
    });

    function openLightbox() {
        lightbox.classList.add('active');
        updateLightboxImage();
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    }

    function updateLightboxImage() {
        if (currentIndex >= 0 && currentIndex < currentGalleryItems.length) {
            const activeItem = currentGalleryItems[currentIndex];
            const img = activeItem.querySelector('img');
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = img.src;
                lightboxImg.style.opacity = '1';
            }, 100);
        }
    }

    function showNext() {
        if (currentGalleryItems.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentGalleryItems.length;
        updateLightboxImage();
    }

    function showPrev() {
        if (currentGalleryItems.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
        updateLightboxImage();
    }

    // Event Listeners for controls
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    // Close on clicking backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Keyboard support (Escape and arrow keys)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
});
