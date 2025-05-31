const romanticMessages = [
  "Історія кохання починається...",
  "Наші серця б'ються одночасно",
  "Моя лінія життя перетинається з твоєю",
  "Ти мій місяць",
  "Ти моє сонце",
  "Ти мої зірки",
  "Я уже близько..."
];

const raccoonStates = [
  'beggining.mp4',
  'sync.mp4',
  'lines.mp4',
  'moon.mp4',
  'sun.mp4',
  'stars.mp4',
  'heart.mp4'
];

const positions = [
  { top: "30%", left: "10%" },
  { top: "38%", left: "10%" },
  { top: "50%", left: "10%" },
  { top: "60%", left: "0%" },
  { top: "50%", left: "10%" },
  { top: "65%", left: "15%" },
  { top: "30%", left: "10%" }
];

const positionsM = [
  { left: "10%", top: "10%" },
  { left: "10%", top: "15%" },
  { left: "20%", top: "30%" },
  { left: "20%", top: "10%" },
  { left: "30%", top: "50%" },
  { left: "50%", top: "60%" },
  { left: "40%", top: "10%" }
];

const pageBackgrounds = [
  'bg1.mp4',
  'bg2.mp4',
  'bg3.mp4',
  'bg4.mp4',
  'bg5.mp4',
  'bg6.mp4',
  'bg7.mp4'
];

let clickCount = 0;
const maxClicks = 7;
const maxPageIndex = raccoonStates.length - 1;

let currentPage;
const pagesContainer = document.getElementById('pagesContainer');
const heartSound = document.getElementById('heartSound');
const heartbeatAudio = new Audio('heartbeat.mp3');
heartbeatAudio.preload = 'auto';

function smoothScrollTo(target, duration) {
  const start = window.pageYOffset;
  const end = target.offsetTop;
  const distance = end - start;
  const startTime = performance.now();

  function scrollStep(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * progress);
    if (elapsed < duration) {
      requestAnimationFrame(scrollStep);
    } else {
      window.scrollTo(0, target.offsetTop);
    }
  }

  requestAnimationFrame(scrollStep);
}

function createPage(index) {
  const page = document.createElement('div');
  page.className = 'page soft-in';

  const bg = document.createElement('div');
  bg.className = 'page-bg';

  if (pageBackgrounds[index].endsWith('.mp4')) {
    bg.innerHTML = `
      <video autoplay muted playsinline loop class="bg-video">
        <source src="${pageBackgrounds[index]}" type="video/mp4">
      </video>`;
  } else {
    bg.style.backgroundImage = `url('${pageBackgrounds[index]}')`;
  }

  page.appendChild(bg);

  const container = document.createElement('div');
  container.className = 'container';

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  const progressPercent = (index / maxPageIndex) * 100;
  progressBar.innerHTML = `<div class="progress-fill" style="width:${progressPercent}%;"></div>`;
  container.appendChild(progressBar);

  const message = document.createElement('div');
  message.className = 'romantic-message';
  message.textContent = romanticMessages[index];
  Object.assign(message.style, positionsM[index] || {});
  container.appendChild(message);

  const raccoonContainer = document.createElement('div');
  raccoonContainer.className = 'raccoon-container';
  raccoonContainer.dataset.clicked = "false";
  Object.assign(raccoonContainer.style, positions[index] || {});

  const mediaElement = document.createElement('div');
  mediaElement.className = 'raccoon';
  mediaElement.innerHTML = `
    <video autoplay muted playsinline loop style="width:100%; height:100%; object-fit:contain;">
      <source src="${raccoonStates[index]}" type="video/mp4">
    </video>`;
  mediaElement.classList.add('heartbeat');

  const minSpeed = 0.8;
  const maxSpeed = 3.0;
  const step = Math.min(index, maxPageIndex);
  const speed = maxSpeed - (step / maxPageIndex) * (maxSpeed - minSpeed);
  mediaElement.style.setProperty('--heartbeat-speed', `${speed.toFixed(2)}s`);

  heartbeatAudio.pause();
  heartbeatAudio.currentTime = 0;
  heartbeatAudio.playbackRate = 1 / speed;
  heartbeatAudio.play().catch(() => {});

  raccoonContainer.appendChild(mediaElement);
  container.appendChild(raccoonContainer);
  page.appendChild(container);
  return page;
}

function attachEvents(page) {
  const raccoonContainer = page.querySelector('.raccoon-container');
  const handleClick = (e) => {
    e.preventDefault();
    if (raccoonContainer.dataset.clicked === "true") return;

    raccoonContainer.dataset.clicked = "true";
    if (clickCount < maxClicks) {
      handleInteraction(e, raccoonContainer);
    }
  };

  raccoonContainer.addEventListener('click', handleClick);
  raccoonContainer.addEventListener('touchstart', handleClick, { passive: false });
}

function handleInteraction(event, container) {
  clickCount++;
  animateElements(container, event);

  if (clickCount <= maxPageIndex) {
    const newPage = createPage(clickCount);
    pagesContainer.appendChild(newPage);
    smoothScrollTo(newPage, 1000);
    attachEvents(newPage);
    currentPage = newPage;
  } else if (clickCount === maxClicks) {
    setTimeout(() => {
      mostraFrasiFinaliSovrapposte();
    }, 1200);
  }
}

function animateElements(container, event) {
  const raccoon = container.querySelector('.raccoon');
  raccoon.classList.add('epic');
  setTimeout(() => raccoon.classList.remove('epic'), 1000);
  createHearts(event, container);
  heartSound.play().catch(() => {});
}

function createHearts(event, container) {
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  for (let i = 0; i < 5; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.animation = `float ${1.5 + i * 0.3}s linear forwards`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), (1.5 + i * 0.3) * 1000);
  }
}

function mostraFrasiFinaliSovrapposte() {
  const overlay = document.createElement('div');
  overlay.id = 'finalPage';

  const t1 = document.createElement('div');
  t1.className = 'epic-text';
  t1.id = 'finalText1';
  t1.textContent = "Ох";

  const t2 = document.createElement('div');
  t2.className = 'epic-text';
  t2.id = 'finalText2';
  t2.style.display = 'none';
  t2.textContent = "Це так мило! Ти заповнила моє серце💓";

  const t3 = document.createElement('div');
  t3.className = 'epic-text';
  t3.id = 'finalText3';
  t3.style.display = 'none';
  t3.textContent = "Я кохаю тебе";

  const t4 = document.createElement('div');
  t4.className = 'epic-text';
  t4.id = 'finalText4';
  t4.style.display = 'none';
  t4.textContent = "А ти мене?";

  const buttonsContainer = document.createElement('div');
  buttonsContainer.id = 'buttonsContainer';

  const buttonsData = [
    { text: 'Sì', lang: 'it' },
    { text: 'Oui', lang: 'fr' },
    { text: 'Yes', lang: 'en' },
    { text: 'Так', lang: 'uk' }
  ];

  buttonsData.forEach(btnData => {
    const btn = document.createElement('button');
    btn.className = 'answer-button';
    btn.textContent = btnData.text;
    btn.addEventListener('click', () => {
      alert(`Grazie per aver scelto "${btnData.text}"! 💕`);
    });
    buttonsContainer.appendChild(btn);
  });

  overlay.appendChild(t1);
  overlay.appendChild(t2);
  overlay.appendChild(t3);
  overlay.appendChild(t4);
  overlay.appendChild(buttonsContainer);
  document.body.appendChild(overlay);

  const showText = (element, delay) => {
    setTimeout(() => {
      element.style.display = 'block';
      element.style.animation = 'textReveal 1.5s ease forwards';
    }, delay);
  };

  const hideText = (element, delay) => {
    setTimeout(() => {
      element.style.animation = 'fadeOut 0.5s ease forwards';
      setTimeout(() => {
        element.style.display = 'none';
      }, 500);
    }, delay);
  };

  showText(t1, 500);
  showText(t2, 2000);
  hideText(t2, 4000);
  showText(t3, 4500);
  showText(t4, 6500);

  setTimeout(() => {
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.animation = 'textReveal 1.5s ease forwards';
  }, 8500);
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';
  currentPage = createPage(0);
  pagesContainer.appendChild(currentPage);
  attachEvents(currentPage);
});
