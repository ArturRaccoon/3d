const romanticMessages = [
    "Історія кохання починається...",
    "Наші серця б'ються одночасно",
    "Моя лінія життя перетинається тобою",
    "Ти мій місяць",
    "Ти моє сонце",
    "Ти мої зірки",
    "Я уже близько...",
    "Ох! Це так мило, ти заповнила моє серце 💞",
];

const raccoonStates = [
    'beggining.mp4',
    'sync.mp4',
    'lines.mp4',
    'moon.mp4',
    'sun.mp4',
    'stars.mp4',
    'heart.mp4',
    'raccoon.glb'
];

const positions = [
    { top: "30%", left: "10%" },
    { top: "10%", left: "69%" },
    { top: "20%", left: "10%" },
    { top: "60%", left: "50%" },
    { top: "10%", left: "30%" },
    { top: "65%", left: "65%" },
    { top: "30%", left: "30%" },
    { top: "50%", left: "50%" }
];

const positionsM = [
    { left: "10%", top: "10%" },
    { left: "60%", top: "15%" },
    { left: "20%", top: "30%" },
    { left: "50%", top: "90%" },
    { left: "30%", top: "50%" },
    { left: "70%", top: "60%" },
    { left: "40%", top: "70%" }
];

const pageBackgrounds = [
    'bg1.mp4',
    'bg2.mp4',
    'bg3.mp4',
    'bg4.mp4',
    'bg5.mp4',
    'bg6.mp4',
    'bg7.mp4',
    'bg8.jpg'
];

let clickCount = 0;
const maxClicks = raccoonStates.length - 1;
let currentPage;
const pagesContainer = document.getElementById('pagesContainer');
const heartSound = document.getElementById('heartSound');

function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const end = target.offsetTop;
    const distance = end - start;
    const startTime = performance.now();

    function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + distance * progress);
        if (elapsed < duration) requestAnimationFrame(scrollStep);
    }
    
    requestAnimationFrame(scrollStep);
}

function createPage(index) {
    const page = document.createElement('div');
    page.className = 'page soft-in';

    // Background
    const bg = document.createElement('div');
    bg.className = 'page-bg';
    
    if (pageBackgrounds[index].endsWith('.mp4')) {
        bg.innerHTML = `
            <video 
                autoplay 
                muted 
                playsinline 
                loop 
                class="bg-video"
                style="width:100%; height:100%; object-fit:cover;"
            >
                <source src="${pageBackgrounds[index]}" type="video/mp4">
            </video>
        `;
    } else {
        bg.style.backgroundImage = `url('${pageBackgrounds[index]}')`;
    }
    
    page.appendChild(bg);

    // Page content
    const container = document.createElement('div');
    container.className = 'container';
    
    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = `<div class="progress-fill" style="width:${(index / maxClicks) * 100}%"></div>`;
    container.appendChild(progressBar);

    // Romantic message
    const message = document.createElement('div');
    message.className = 'romantic-message';
    message.textContent = romanticMessages[index];
    Object.assign(message.style, positionsM[index] || {});
    container.appendChild(message);

    // Raccoon container
    const raccoonContainer = document.createElement('div');
    raccoonContainer.className = 'raccoon-container';
    Object.assign(raccoonContainer.style, positions[index] || {});

    const mediaElement = document.createElement('div');
    mediaElement.className = 'raccoon';
    
    if (raccoonStates[index].endsWith('.glb')) {
        mediaElement.innerHTML = `
            <model-viewer 
                src="${raccoonStates[index]}" 
                autoplay 
                animation-name="dance" 
                auto-rotate 
                camera-controls 
                style="width:100%; height:100%;"
            ></model-viewer>
        `;
    } else {
        mediaElement.innerHTML = `
            <video 
                autoplay 
                muted 
                playsinline 
                loop 
                style="width:100%; height:100%; object-fit:contain;"
            >
                <source src="${raccoonStates[index]}" type="video/mp4">
            </video>
        `;
    }
    
    raccoonContainer.appendChild(mediaElement);
    container.appendChild(raccoonContainer);
    page.appendChild(container);
    
    return page;
}

function attachEvents(page) {
    const raccoonContainer = page.querySelector('.raccoon-container');
    
    const handleClick = (e) => {
        e.preventDefault();
        if (clickCount < maxClicks) handleInteraction(e, raccoonContainer);
    };

    raccoonContainer.addEventListener('click', handleClick);
    raccoonContainer.addEventListener('touchstart', handleClick, { passive: false });
}

function handleInteraction(event, container) {
    clickCount++;
    animateElements(container);
    
    if (clickCount <= maxClicks) {
        const newPage = createPage(clickCount);
        pagesContainer.appendChild(newPage);
        smoothScrollTo(newPage, 1000);
        attachEvents(newPage);
        currentPage = newPage;
    } else {
        setTimeout(() => {
            document.querySelector('.page-transition').style.opacity = '1';
            setTimeout(() => window.location.href = 'love-letter.html', 1000);
        }, 1000);
    }
}

function animateElements(container) {
    // Heart animation
    createHearts(container);
    heartSound.play().catch(() => {});

    // Raccoon animation
    const raccoon = container.querySelector('.raccoon');
    raccoon.classList.add('epic');
    setTimeout(() => raccoon.classList.remove('epic'), 1000);
}

function createHearts(container) {
    const rect = container.getBoundingClientRect();
    const x = rect.left + rect.width/2;
    const y = rect.top + rect.height/2;
    
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        Object.assign(heart.style, {
            left: `${x}px`,
            top: `${y}px`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${1.5 + i * 0.3}s`
        });
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2000 + i * 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    currentPage = createPage(0);
    pagesContainer.appendChild(currentPage);
    attachEvents(currentPage);
});
