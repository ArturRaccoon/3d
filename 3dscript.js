const messaggiRomantici = [
  "Історія кохання починається...",
  "Наші серця б'ються одночасно",
  "Моя лінія життя перетинається з твоєю",
  "Ти мій місяць",
  "Ти моє сонце",
  "Ти мої зірки",
  "Я вже близько..."
];

const statiProcione = [
  'beggining.mp4',
  'sync.mp4',
  'lines.mp4',
  'moon.mp4',
  'sun.mp4',
  'stars.mp4',
  'heart.mp4'
];

const posizioni = [
  { top: "15%", left: "15%" },   // Era -100%, ora sicuro
  { top: "-30%", left: "10%" },   // Era -90%, ora sicuro  
  { top: "-50%", left: "0%" },   // Era -30%, migliorato
  { top: "45%", left: "15%" },   // Era -10%, ora sicuro
  { top: "20%", left: "25%" },   // Era -40%, ora sicuro
  { top: "30%", left: "18%" },   // Era -65%, ora sicuro
  { top: "40%", left: "22%" }    // Era -30%, migliorato
];

// Posizioni ottimizzate per mobile - centrate e sicure
const posizioniMobile = [
  { top: "20%", left: "15%" },   // Spostato dal bordo
  { top: "-50%", left: "12%" },   // Migliorato
  { top: "-60%", left: "5%" },   // Spostato dal bordo (era 0%)
  { top: "25%", left: "20%" },   // Spostato dal bordo (era 0%)
  { top: "35%", left: "15%" },   // Spostato dal bordo (era 0%)
  { top: "45%", left: "16%" },   // Spostato dal bordo (era 0%)
  { top: "50%", left: "14%" }    // Spostato dal bordo (era 0%)
];

const sfondiPagina = [
  'bg1.mp4',
  'bg2.mp4',
  'bg3.mp4',
  'bg4.mp4',
  'bg5.mp4',
  'bg6.mp4',
  'bg7.mp4',
  'bg8.jpg'
];

let contatoreClick = 0;
const maxClick = statiProcione.length;
let paginaCorrente;
let scrollInCorso = false;
const contenitorePagine = document.getElementById('pagesContainer');
const suonoCuore = document.getElementById('heartSound');

// Scroll morbido e lento
function scorrimentoFluido(target, durata = 2200) {
  if (scrollInCorso) return;
  
  scrollInCorso = true;
  const inizio = window.pageYOffset;
  const fine = target.offsetTop;
  const distanza = fine - inizio;
  const tempoInizio = performance.now();

  // Easing più morbido - combinazione di ease-in-out con rallentamento finale
  function easingMorbido(t) {
    if (t < 0.5) {
      return 2 * t * t;
    } else {
      return 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  }

  function passoScorrimento(tempoCorrente) {
    const trascorso = tempoCorrente - tempoInizio;
    const progresso = Math.min(trascorso / durata, 1);
    const progressoEased = easingMorbido(progresso);
    
    window.scrollTo(0, inizio + distanza * progressoEased);
    
    if (progresso < 1) {
      requestAnimationFrame(passoScorrimento);
    } else {
      scrollInCorso = false;
    }
  }

  requestAnimationFrame(passoScorrimento);
}

function creaPagina(indice) {
  const pagina = document.createElement('div');
  pagina.className = 'page soft-in';
  pagina.setAttribute('data-page-index', indice);

  const sfondo = document.createElement('div');
  sfondo.className = 'page-bg';

  if (sfondiPagina[indice].endsWith('.mp4')) {
    sfondo.innerHTML = `
      <video autoplay muted playsinline loop class="bg-video" style="width:100%; height:100%; object-fit:cover;">
        <source src="${sfondiPagina[indice]}" type="video/mp4">
      </video>
    `;
  } else {
    sfondo.style.backgroundImage = `url('${sfondiPagina[indice]}')`;
  }

  pagina.appendChild(sfondo);

  const contenitore = document.createElement('div');
  contenitore.className = 'container';

  const barraProgresso = document.createElement('div');
  barraProgresso.className = 'progress-bar';
  barraProgresso.innerHTML = `<div class="progress-fill" style="width:${(indice / (maxClick - 1)) * 100}%"></div>`;
  contenitore.appendChild(barraProgresso);

  const messaggio = document.createElement('div');
  messaggio.className = 'romantic-message';
  messaggio.textContent = messaggiRomantici[indice];
  Object.assign(messaggio.style, posizioniMobile[indice] || {});
  contenitore.appendChild(messaggio);

  const contenitoreProcione = document.createElement('div');
  contenitoreProcione.className = 'raccoon-container';
  Object.assign(contenitoreProcione.style, posizioni[indice] || {});

  const elementoMedia = document.createElement('div');
  elementoMedia.className = 'raccoon';

  elementoMedia.innerHTML = `
    <video autoplay muted playsinline loop style="width:100%; height:100%; object-fit:contain;">
      <source src="${statiProcione[indice]}" type="video/mp4">
    </video>
  `;

  const passiTotali = statiProcione.length - 1;
  const passo = Math.max(0, Math.min(indice, passiTotali));
  const velocita = 3.2 - (passo / passiTotali) * (3.2 - 0.4);
  elementoMedia.style.setProperty('--heartbeat-speed', `${velocita.toFixed(2)}s`);

  contenitoreProcione.appendChild(elementoMedia);
  contenitore.appendChild(contenitoreProcione);
  pagina.appendChild(contenitore);

  return pagina;
}

function collegaEventi(pagina) {
  const contenitoreProcione = pagina.querySelector('.raccoon-container');

  const gestisciClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Evita doppi click durante lo scroll
    if (scrollInCorso) return;

    // PERMETTE IL CLICK ANCHE SE GIA' CLICCATO, SOLO SE SIAMO ALL'ULTIMA PAGINA
    if (contenitoreProcione.dataset.clicked === 'true' && contatoreClick < maxClick) return;

    contenitoreProcione.dataset.clicked = 'true';

    if (contatoreClick < maxClick) {
      gestisciInterazione(e, contenitoreProcione);
    }
  };

  contenitoreProcione.addEventListener('click', gestisciClick);
  contenitoreProcione.addEventListener('touchstart', gestisciClick, { passive: false });
}

function gestisciInterazione(evento, contenitore) {
  contatoreClick++;
  animaElementi(contenitore, evento);

  if (contatoreClick < maxClick) {
    // Breve delay prima di creare la nuova pagina per evitare lag
    setTimeout(() => {
      const nuovaPagina = creaPagina(contatoreClick);
      contenitorePagine.appendChild(nuovaPagina);
      
      // Scroll morbido con delay maggiore
      setTimeout(() => {
        scorrimentoFluido(nuovaPagina, 2500);
      }, 300);
      
      collegaEventi(nuovaPagina);
      paginaCorrente = nuovaPagina;
    }, 400);
  } else {
    // Dopo l'ultima interazione, mostra le frasi finali sull'ultima pagina
    setTimeout(() => {
      mostraFrasiFinaliSovrapposte();
    }, 800);
  }
}

function animaElementi(contenitore, evento) {
  const procione = contenitore.querySelector('.raccoon');
  procione.classList.add('epic');
  setTimeout(() => procione.classList.remove('epic'), 1000);

  creaCuori(evento, contenitore);
  suonoCuore.play().catch(() => { });
}

function creaCuori(evento, contenitore) {
  const rettangolo = contenitore.getBoundingClientRect();
  const x = evento.clientX - rettangolo.left;
  const y = evento.clientY - rettangolo.top;

  for (let i = 0; i < 5; i++) {
    const cuore = document.createElement('div');
    cuore.className = 'heart';
    cuore.style.left = `${x}px`;
    cuore.style.top = `${y}px`;
    cuore.style.animation = `float ${1.5 + i * 0.3}s linear forwards`;

    contenitore.appendChild(cuore);
    setTimeout(() => cuore.remove(), (1.5 + i * 0.3) * 1000);
  }
}

function mostraFrasiFinaliSovrapposte() {
  // Trova l'ultima pagina creata
  const ultimaPagina = contenitorePagine.lastElementChild;
  
  // Crea l'overlay delle frasi finali
  const overlayFinale = document.createElement('div');
  overlayFinale.className = 'final-overlay';
  overlayFinale.id = 'finalPage';
  
  // Contenitore dei testi
  const contenitoreTesti = document.createElement('div');
  contenitoreTesti.className = 'epic-text-container';
  
  // Testi dinamici
  const testo1 = document.createElement('div');
  testo1.className = 'epic-text';
  testo1.id = 'finalText1';
  
  const testo2 = document.createElement('div');
  testo2.className = 'epic-text';
  testo2.id = 'finalText2';
  
  const testo3 = document.createElement('div');
  testo3.className = 'epic-text';
  testo3.id = 'finalText3';
  
  contenitoreTesti.appendChild(testo1);
  contenitoreTesti.appendChild(testo2);
  contenitoreTesti.appendChild(testo3);
  
  // Contenitore bottoni
  const contenitoreBottoni = document.createElement('div');
  contenitoreBottoni.id = 'buttonsContainer';
  
  const bottoni = [
    { testo: 'Sì', lingua: 'it' },
    { testo: 'Oui', lingua: 'fr' },
    { testo: 'Yes', lingua: 'en' },
    { testo: 'Так', lingua: 'uk' }
  ];

  bottoni.forEach(bottone => {
    const btn = document.createElement('button');
    btn.textContent = bottone.testo;
    btn.className = 'answer-button';
    btn.addEventListener('click', () => {
      alert(`Grazie per aver scelto "${bottone.testo}"! 💕`);
    });
    contenitoreBottoni.appendChild(btn);
  });
  
  overlayFinale.appendChild(contenitoreTesti);
  overlayFinale.appendChild(contenitoreBottoni);
  
  // Aggiungi l'overlay all'ultima pagina
  ultimaPagina.style.position = 'relative';
  ultimaPagina.appendChild(overlayFinale);
  
  // Inizialmente nascosti
  testo1.style.display = 'none';
  testo2.style.display = 'none';
  testo3.style.display = 'none';
  contenitoreBottoni.style.display = 'none';
  
  // Sequenza delle frasi animate usando le classi CSS
  const mostraTesto = (elemento, testo, delay) => {
    setTimeout(() => {
      elemento.textContent = testo;
      elemento.style.display = 'block';
      elemento.style.animation = 'textReveal 1.5s ease forwards';
    }, delay);
  };
  
  const nascondiTesto = (elemento, delay) => {
    setTimeout(() => {
      elemento.style.animation = 'fadeOut 0.5s ease forwards';
    }, delay);
  };
  
  // Sequenza temporizzata delle frasi
  mostraTesto(testo1, "Ох", 500);
  
  setTimeout(() => {
    mostraTesto(testo2, "Це так мило", 2000);
  }, 500);
  
  setTimeout(() => {
    mostraTesto(testo3, "Ти заповнила моє серце", 4000);
  }, 500);
  
  setTimeout(() => {
    nascondiTesto(testo2, 6000);
    setTimeout(() => {
      mostraTesto(testo2, "Я кохаю тебе", 6500);
    }, 500);
  }, 500);
  
  setTimeout(() => {
    nascondiTesto(testo3, 8000);
    setTimeout(() => {
      mostraTesto(testo3, "А ти мене?", 8500);
    }, 500);
  }, 500);
  
  setTimeout(() => {
    contenitoreBottoni.style.display = 'flex';
    contenitoreBottoni.style.animation = 'textReveal 1.5s ease forwards';
  }, 10500);
}

// Inizializzazione ottimizzata
document.addEventListener('DOMContentLoaded', () => {
  // Preload delle prime immagini/video per ridurre lag
  const preloadMedia = () => {
    sfondiPagina.slice(0, 3).forEach(src => {
      if (src.endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'metadata';
      } else {
        const img = new Image();
        img.src = src;
      }
    });
  };
  
  preloadMedia();
  
  // Crea la prima pagina
  paginaCorrente = creaPagina(0);
  contenitorePagine.appendChild(paginaCorrente);
  collegaEventi(paginaCorrente);
});
