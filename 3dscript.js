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

  // Content
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
  animateElements(container, event);

  if (clickCount < maxClicks) { 
      // Finché non arrivi all'ultimo stato
      const newPage = createPage(clickCount);
      pagesContainer.appendChild(newPage);
      smoothScrollTo(newPage, 1000);
      attachEvents(newPage);
      currentPage = newPage;
  } else {
      // Al settimo click (maxClicks), mostra frasi finali senza aggiungere pagina
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
  // Crea overlay finale
  const overlayFinale = document.createElement('div');
  overlayFinale.id = 'finalPage';

  const testo1 = document.createElement('div');
  testo1.className = 'epic-text';
  testo1.id = 'finalText1';
  testo1.textContent = "Ох! Це так мило! Ти заповнила моє серце💓";

  const testo2 = document.createElement('div');
  testo2.className = 'epic-text';
  testo2.id = 'finalText2';
  testo2.style.display = 'none';
  testo2.textContent = "Я кохаю тебе";

  const testo3 = document.createElement('div');
  testo3.className = 'epic-text';
  testo3.id = 'finalText3';
  testo3.style.display = 'none';
  testo3.textContent = "А ти мене?";

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

  overlayFinale.appendChild(testo1);
  overlayFinale.appendChild(testo2);
  overlayFinale.appendChild(testo3);
  overlayFinale.appendChild(buttonsContainer);

  document.body.appendChild(overlayFinale);

  // Animazioni sequenziali testi e mostra bottoni
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
              element.style.animation = '';
          }, 500);
      }, delay);
  };

  showText(testo1, 500);
  showText(testo2, 2000); // dopo testo1
  showText(testo3, 4000);

  setTimeout(() => {
      hideText(testo2, 6000);
      setTimeout(() => {
          showText(testo2, 6500);
      }, 500);
  }, 500);

  setTimeout(() => {
      hideText(testo3, 8000);
      setTimeout(() => {
          showText(testo3, 8500);
      }, 500);
  }, 500);

  setTimeout(() => {
      buttonsContainer.style.display = 'flex';
      buttonsContainer.style.animation = 'textReveal 1.5s ease forwards';
  }, 10500);
}

document.addEventListener('DOMContentLoaded', () => {
  currentPage = createPage(0);
  pagesContainer.appendChild(currentPage);
  attachEvents(currentPage);
});
