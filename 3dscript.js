// Array di messaggi romantici
const romanticMessages = [
  "Історія кохання починається...",
  "Наші серця б'ються одночасно",
  "Моя лінія життя перетинається з твоєю",
  "Ти мій місяць",
  "Ти моє сонце",
  "Ти мої зірки",
  "Я уже близько...",
  "Ох! Це так мило, ти заповнила моє серце 💞",
];

// Array di stati del raccoon
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

// Posizioni per il raccoon e per i messaggi
const positions = [
  { top: "200%", left: "0%" },
  { top: "200%", left: "0%" },
  { top: "200%", left: "0%" },  
  { top: "200%", left: "0%" },
  { top: "200%", left: "0%" },  
  { top: "200%", left: "0%" },
  { top: "200%", left: "0%" },   
  { top: "200%", left: "0%" }
];

const positionsM = [
  { left: "0%", top: "200%" },
  { left: "0%", top: "200%" },
  { left: "0%", top: "200%" },
  { left: "0%", top: "200%" },
  { left: "0%", top: "200%" },
  { left: "0%", top: "200%" },
  { left: "0%", top: "200%" }
];

// Array di immagini/video di sfondo per le pagine
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
const maxClicks = 8;
let currentPage;

const pagesContainer = document.getElementById('pagesContainer');
const heartSound = document.getElementById('heartSound');

// Smooth scroll function (duration: 1500ms)
function smoothScrollTo(target, duration) {
  let start = window.pageYOffset;
  let end = target.offsetTop;
  let distance = end - start;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    let elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * progress);
    if (elapsed < duration) requestAnimationFrame(animation);
  }
  requestAnimationFrame(animation);
}

function createPage(index) {
  const page = document.createElement('div');
  page.className = 'page';

  // Add SVG clip path once if not already present
  if (!document.getElementById('heart-svg-clip')) {
    const svgNS = `
      <svg width="0" height="0" style="position:absolute" id="heart-svg-clip" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.25 C0.355,0.0, 0.0,0.458, 0.5,0.875 C1.0,0.458, 0.645,0.0, 0.5,0.25 Z" />
          </clipPath>
        </defs>
      </svg>
    `;
    document.body.insertAdjacentHTML('afterbegin', svgNS);
  }

  // Create the blurred background element
  const bg = document.createElement('div');
  bg.className = 'page-bg';
  // If background is a video (mp4), insert a <video>
  if (pageBackgrounds[index].endsWith('.mp4')) {
    bg.innerHTML = `
      <video autoplay muted loop playsinline class="bg-video" style="width:100%; height:100%; object-fit:cover;">
        <source src="${pageBackgrounds[index]}" type="video/mp4">
      </video>
    `;
  } else {
    bg.style.backgroundImage = `url('${pageBackgrounds[index] || 'default.jpg'}')`;
  }
  page.appendChild(bg);

  // Clone the page template content
  const templateContent = document.getElementById('page-template').content.cloneNode(true);
  const container = templateContent.querySelector('.container');

  // Update the progress bar
  const progressFill = container.querySelector('.progress-fill');
  progressFill.style.width = `${(index / maxClicks) * 100}%`;

  // Set the romantic message
  const romanticMessage = container.querySelector('.romantic-message');
  romanticMessage.textContent =
    index === 0 ? romanticMessages[0] : romanticMessages[Math.min(index, romanticMessages.length - 1)];
  const posM = positionsM[index] || { left: '50%', top: '10%' };
  romanticMessage.style.left = posM.left;
  romanticMessage.style.top = posM.top;

  // Update the raccoon container and media
  const raccoonContainer = container.querySelector('.raccoon-container');
  const raccoon = container.querySelector('.raccoon');
  const currentState = raccoonStates[index] || raccoonStates[raccoonStates.length - 1];

  if (currentState.endsWith('.glb')) {
    raccoon.innerHTML = `
      <model-viewer 
        src="${currentState}" 
        autoplay 
        animation-name="dance" 
        auto-rotate 
        camera-controls 
        rotation-per-second="30deg"
        style="width:100%; height:100%; clip-path: url(#heartClip);"
      ></model-viewer>
    `;
    raccoon.style.backgroundImage = '';
  } else if (currentState.endsWith('.mp4')) {
    raccoon.innerHTML = `
      <video autoplay muted loop playsinline 
        style="width:100%; height:100%; object-fit:cover; clip-path: url(#heartClip);">
        <source src="${currentState}" type="video/mp4">
      </video>
    `;
    raccoon.style.backgroundImage = '';
  } else {
    raccoon.innerHTML = "";
    raccoon.style.backgroundImage = `url('${currentState}')`;
    raccoon.style.clipPath = "url(#heartClip)";
  }

  // Set raccoon container position
  const pos = positions[index] || positions[positions.length - 1];
  raccoonContainer.style.top = pos.top;
  raccoonContainer.style.left = pos.left;

  page.appendChild(container);
  return page;
}

// Attach event listeners to all raccoon containers within a page
function attachEvents(page) {
  const clickableElements = page.querySelectorAll('.raccoon-container');
  clickableElements.forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handleClick(e, el);
    });
  });
}

function animateRaccoon() {
  const raccoon = currentPage.querySelector('.raccoon');
  raccoon.classList.add('epic');
  setTimeout(() => {
    raccoon.classList.remove('epic');
  }, 1000);
}

// Create floating hearts relative to the clicked element
function createHearts(x, y, containerRect, container) {
  // Calculate position relative to the container
  const relX = x - containerRect.left;
  const relY = y - containerRect.top;
  for (let i = 0; i < 5; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = `${relX}px`;
    heart.style.top = `${relY}px`;
    heart.style.animation = `float ${2 + i}s linear forwards`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), (2 + i) * 1000);
  }
}

function showMark(page) {
  const raccoonContainer = page.querySelector('.raccoon-container');
  const mark = document.createElement('div');
  mark.className = 'picture-mark';
  mark.textContent = '✓';
  raccoonContainer.appendChild(mark);
  setTimeout(() => mark.remove(), 1000);
}

// Now the event handler accepts the element that was clicked
function handleClick(event, clickedElement) {
  if (clickCount >= maxClicks) return;
  clickCount++;

  animateRaccoon();
  // Get bounding rectangle of the clicked container
  const rect = clickedElement.getBoundingClientRect();
  createHearts(event.clientX, event.clientY, rect, clickedElement);
  showMark(currentPage);
  heartSound.currentTime = 0;
  heartSound.play();

  if (clickCount < maxClicks) {
    const newPage = createPage(clickCount);
    newPage.classList.add('soft-in');
    pagesContainer.appendChild(newPage);
    attachEvents(newPage);
    smoothScrollTo(newPage, 1500);
    currentPage = newPage;
  } else {
    setTimeout(() => {
      document.querySelector('.page-transition').style.opacity = '1';
      setTimeout(() => {
        window.location.href = 'love-letter.html';
      }, 1000);
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  currentPage = createPage(0);
  pagesContainer.appendChild(currentPage);
  attachEvents(currentPage);
});
