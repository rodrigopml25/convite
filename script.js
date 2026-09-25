// ⚠️ Troque pelo endpoint que o Formspree te deu (formspree.io/f/xxxxabcd)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/SEU_ID_AQUI';

const noBtn = document.getElementById('no');
const yesBtn = document.getElementById('yes');
const card = document.querySelector('.card');
const question = document.getElementById('question');
const typeStep = document.getElementById('typeStep');
const dateStep = document.getElementById('dateStep');
const result = document.getElementById('result');
const dateInput = document.getElementById('dateInput');
const confirmDateBtn = document.getElementById('confirmDate');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');

let chosenType = '';
let chosenEmoji = '';
let chosenDate = '';

function showStep(el) {
  [question, typeStep, dateStep, result].forEach(s => s.classList.remove('show'));
  el.classList.add('show');
}

const nopeMessages = [
  "Tenta de novo 😏",
  "Quase!",
  "Não foi dessa vez",
  "Hmm, será?",
  "Ainda não!"
];
let noClicks = 0;

function fleeButton() {
  const btnRect = noBtn.getBoundingClientRect();

  noBtn.style.position = 'fixed';
  noBtn.style.transition = 'left 0.15s ease, top 0.15s ease';

  const maxX = window.innerWidth - btnRect.width - 12;
  const maxY = window.innerHeight - btnRect.height - 12;
  const randomX = Math.max(12, Math.floor(Math.random() * maxX));
  const randomY = Math.max(12, Math.floor(Math.random() * maxY));

  noBtn.style.left = randomX + 'px';
  noBtn.style.top = randomY + 'px';

  noClicks++;
  if (noClicks <= nopeMessages.length) {
    noBtn.textContent = nopeMessages[noClicks - 1];
  }

  // aumenta o botão SIM um pouco a cada tentativa, por diversão
  const growth = Math.min(1 + noClicks * 0.06, 1.6);
  yesBtn.style.transform = `translateX(calc(-100% - 8px)) scale(${growth})`;
}

noBtn.addEventListener('mouseenter', () => {
  if (window.matchMedia('(pointer: fine)').matches) fleeButton();
});
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  fleeButton();
});
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  fleeButton();
}, { passive: false });

yesBtn.addEventListener('click', () => {
  showStep(typeStep);
});

document.querySelectorAll('.option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    chosenType = btn.dataset.type;
    chosenEmoji = btn.dataset.emoji;
    setTimeout(() => showStep(dateStep), 300);
  });
});

async function sendAnswer(type, date) {
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        mensagem: `Ela disse SIM! Tipo de encontro: ${type} — Data: ${date}`,
        tipo_de_encontro: type,
        data_escolhida: date
      })
    });
  } catch (e) {
    // envio falhou silenciosamente — a mensagem na tela já foi mostrada pra ela
  }
}

confirmDateBtn.addEventListener('click', () => {
  if (!dateInput.value) {
    dateInput.style.borderColor = 'var(--no)';
    return;
  }
  const [year, month, day] = dateInput.value.split('-');
  chosenDate = `${day}/${month}/${year}`;

  resultTitle.textContent = `${chosenEmoji} Combinado!`;
  resultText.textContent = `${chosenType} no dia ${chosenDate}. Mal posso esperar por esse momento com você 💕`;

  showStep(result);
  sendAnswer(chosenType, chosenDate);
});

// fundo com corações flutuando
const heartsContainer = document.getElementById('hearts');
const heartChars = ['❤️', '💕', '💖', '💗'];

function spawnHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (16 + Math.random() * 18) + 'px';
  const duration = 6 + Math.random() * 6;
  h.style.animationDuration = duration + 's';
  heartsContainer.appendChild(h);
  setTimeout(() => h.remove(), duration * 1000);
}

setInterval(spawnHeart, 500);
for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 200);
