const romanticMessages = [
  "Історія кохання починається...",
  "Наші серця б'ються одночасно",
  "Моя лінія життя перетинається з твоєю",
  "Ти мій місяць",
  "Ти моє сонце",
  "Ти мої зірки",
  "Я уже близько...",
  "Ох! Це так мило, ти заповнила моє серце 💞"
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
  { left: "40%", top: "70%" },
  { left: "20%", top: "20%" }
];

const pageBackgrounds = [
  'bg1.mp4', 'bg2.mp4', 'bg3.mp4', 'bg4.mp4',
  'bg5.mp4', 'bg6.mp4', 'bg7.mp4', 'bg8.jpg'
];

let clickCount = 0;
const maxClicks = raccoonStates.length - 1;
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
    if (elapsed < duration) requestAnimationFrame(scrollStep);
  }

  requestAnimationFrame(scrollStep);
}

function createPage(index) {
  const page = document.createElement('div');
  page.className = 'page soft-in';

  const bg = document.createElement('div');
  bg.className = 'page-bg';
  if (pageBackgrounds[index].endsWith('.mp4')) {
    bg.innerHTML = `<video autoplay muted playsinline loop class="bg-video">
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
  progressBar.innerHTML = `<div class="progress-fill" style="width:${(index / maxClicks) * 100}%"></div>`;
  container.appendChild(progressBar);

  const message = document.createElement('div');
  message.className = 'romantic-message';
  message.textContent = romanticMessages[index];
  Object.assign(message.style, positionsM[index] || {});
  container.appendChild(message);

  const raccoonContainer = document.createElement('div');
  raccoonContainer.className = 'raccoon-container';
  Object.assign(raccoonContainer.style, positions[index] || {});

  const mediaElement = document.createElement('div');
  mediaElement.className = 'raccoon';

  if (raccoonStates[index].endsWith('.glb')) {
    mediaElement.innerHTML = `
      <model-viewer src="${raccoonStates[index]}" autoplay animation-name="dance" auto-rotate camera-controls style="width:100%; height:100%;">
      </model-viewer>`;
  } else {
    mediaElement.innerHTML = `<video autoplay muted playsinline loop style="width:100%; height:100%; object-fit:contain;">
      <source src="${raccoonStates[index]}" type="video/mp4">
    </video>`;
    mediaElement.classList.add('heartbeat');

    const step = Math.max(0, Math.min(index, raccoonStates.length - 1));
    const speed = 2 - (step / (raccoonStates.length - 1)) * 1.2;
    mediaElement.style.setProperty('--heartbeat-speed', `${speed.toFixed(2)}s`);
    heartbeatAudio.pause();
    heartbeatAudio.currentTime = 0;
    heartbeatAudio.playbackRate = 1 / speed;
    heartbeatAudio.play().catch(() => {});
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
  animateElements(container, event);
  if (clickCount < maxClicks) {
    const newPage = createPage(clickCount);
    pagesContainer.appendChild(newPage);
    smoothScrollTo(newPage, 1000);
    attachEvents(newPage);
    currentPage = newPage;
  } else {
    mostraFrasiFinaliSovrapposte();
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
  const t2 = t1.cloneNode();
  t2.id = 'finalText2';
  const t3 = t1.cloneNode();
  t3.id = 'finalText3';

  const container = document.createElement('div');
  container.id = 'buttonsContainer';

  const phrases = [
    { el: t1, text: 'Ох! Це так мило! Ти заповнила моє серце💓' },
    { el: t2, text: 'Я кохаю тебе' },
    { el: t3, text: 'А ти мене?' }
  ];

  phrases.forEach((p, i) => {
    p.el.textContent = p.text;
    p.el.style.display = 'none';
    overlay.appendChild(p.el);
  });

  const options = ['Sì', 'Oui', 'Yes', 'Так'];
  options.forEach(txt => {
    const b = document.createElement('button');
    b.className = 'answer-button';
    b.textContent = txt;
    b.onclick = () => alert(`Grazie per aver scelto "${txt}"! 💕`);
    container.appendChild(b);
  });

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Animazioni frasi
  setTimeout(() => phrases[0].el.style.display = 'block', 500);
  setTimeout(() => phrases[1].el.style.display = 'block', 2500);
  setTimeout(() => phrases[2].el.style.display = 'block', 4500);
  setTimeout(() => {
    phrases[1].el.style.display = 'none';
    setTimeout(() => phrases[1].el.textContent = 'Я кохаю тебе', 500);
    setTimeout(() => phrases[1].el.style.display = 'block', 1000);
  }, 6500);
  setTimeout(() => {
    phrases[2].el.style.display = 'none';
    setTimeout(() => phrases[2].el.textContent = 'А ти мене?', 500);
    setTimeout(() => phrases[2].el.style.display = 'block', 1000);
  }, 8500);
  setTimeout(() => {
    container.style.display = 'flex';
    container.style.animation = 'textReveal 1.5s ease forwards';
  }, 10500);
}

document.addEventListener('DOMContentLoaded', () => {
  currentPage = createPage(0);
  pagesContainer.appendChild(currentPage);
  attachEvents(currentPage);
});
