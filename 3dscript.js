const romanticMessages = [
  "Історія кохання починається...",
  "Наші серця б'ються одночасно",
  "Моя лінія життя перетинається тобою",
  "Ти мій місяць",
  "Ти моє сонце",
  "Ти мої зірки",
  "Я уже близько...",
  "Ох! Це так мило, ти заповнила моє серцe !",
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
const maxClicks = 8;
let currentPage;

const pagesContainer = document.getElementById('pagesContainer');
const heartSound = document.getElementById('heartSound');

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

  const bg = document.createElement('div');
  bg.className = 'page-bg';

  if (pageBackgrounds[index].endsWith('.mp4')) {
    bg.innerHTML = `
      <video autoplay muted loop playsinline class="bg-video" style="width:100%; height:100%; object-fit:cover;">
        <source src="${pageBackgrounds[index]}" type="video/mp4">
      </video>
    `;
  } else {
    bg.style.backgroundImage = `url('${pageBackgrounds[index]}')`;
  }

  page.appendChild(bg);

  const templateContent = document.getElementById('page-template').content.cloneNode(true);
  const container = templateContent.querySelector('.container');

  const progressFill = container.querySelector('.progress-fill');
  progressFill.style.width = `${(index / maxClicks) * 100}%`;

  const romanticMessage = container.querySelector('.romantic-message');
  romanticMessage.textContent =
    index === 0 ? romanticMessages[0] : romanticMessages[Math.min(index, romanticMessages.length - 1)];

  const posM = positionsM[index] || { left: '50%', top: '10%' };
  if (window.innerWidth > 600) {
    romanticMessage.style.position = 'absolute';
    romanticMessage.style.left = posM.left;
    romanticMessage.style.top = posM.top;
  } else {
    romanticMessage.style.position = 'relative';
    romanticMessage.style.left = '0';
    romanticMessage.style.top = '0';
    romanticMessage.style.margin = '10px auto';
  }

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
        style="width:100%; height:100%;">
      </model-viewer>
    `;
    raccoon.style.backgroundImage = '';
  } else if (currentState.endsWith('.mp4')) {
    raccoon.innerHTML = `
      <video autoplay muted loop playsinline style="width:100%; height:100%; object-fit:cover;">
        <source src="${currentState}" type="video/mp4">
      </video>
    `;
    raccoon.style.backgroundImage = '';
  } else {
    raccoon.innerHTML = "";
    raccoon.style.backgroundImage = `url('${currentState}')`;
  }

  const pos = positions[index] || positions[positions.length - 1];
  if (window.innerWidth > 600) {
    raccoonContainer.style.position = 'absolute';
    raccoonContainer.style.top = pos.top;
    raccoonContainer.style.left = pos.left;
  } else {
    raccoonContainer.style.position = 'relative';
    raccoonContainer.style.top = '0';
    raccoonContainer.style.left = '0';
    raccoonContainer.style.margin = '20px auto';
  }

  page.appendChild(container);
  return page;
}

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
  setTimeout(() => raccoon.classList.remove('epic'), 1000);
}

function createHearts(x, y, containerRect, container) {
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

function handleClick(event, clickedElement) {
  if (clickCount >= maxClicks) return;
  clickCount++;

  animateRaccoon();

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

function goToNextPage() {
  if (clickCount >= maxClicks) return;
  clickCount++;

  const newPage = createPage(clickCount);
  newPage.classList.add('soft-in');
  pagesContainer.appendChild(newPage);
  attachEvents(newPage);
  smoothScrollTo(newPage, 1500);
  currentPage = newPage;

  if (clickCount >= maxClicks) {
    setTimeout(() => {
      document.querySelector('.page-transition').style.opacity = '1';
      setTimeout(() => {
        window.location.href = 'love-letter.html';
      }, 1000);
    }, 1000);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const isMobile = window.innerWidth <= 600;
  document.body.classList.add(isMobile ? "mobile" : "desktop");

  currentPage = createPage(0);
  pagesContainer.appendChild(currentPage);
  attachEvents(currentPage);
});
