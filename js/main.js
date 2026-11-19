// Cafecita · interacciones

// Nav: fondo al hacer scroll + menú móvil
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

// Tabs del menú
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.toggle('is-active', t === tab);
      t.setAttribute('aria-selected', t === tab);
    });
    panels.forEach(p => {
      const active = p.id === tab.dataset.tab;
      p.hidden = !active;
      p.classList.toggle('is-active', active);
      if (active) showItem(p.querySelector('[data-tag]') || p.querySelector('.items li'));
    });
  });
});

// Ficha de la bebida seleccionada
const featureImgs = {
  calientes: { src: 'assets/img/cup-hot.png', size: '355 ml' },
  frias:     { src: 'assets/img/cup-cold.png', size: '473 ml' },
  extras:    { src: 'assets/img/bean-cream.png', size: 'Extra' },
};
const featureImg = document.getElementById('featureImg');
const featureTag = document.getElementById('featureTag');

function showItem(li) {
  if (!li) return;
  const panel = li.closest('.panel');
  const info = featureImgs[panel.id];
  const name = li.querySelector('span').firstChild.textContent.trim();

  document.querySelectorAll('.items li').forEach(el => el.classList.toggle('is-current', el === li));
  document.getElementById('featureName').textContent = name;
  document.getElementById('featureDesc').textContent = li.dataset.desc;
  document.getElementById('featurePrice').textContent = li.querySelector('b').textContent;
  document.getElementById('featureSize').textContent = info.size;

  featureTag.hidden = !li.dataset.tag;
  featureTag.textContent = li.dataset.tag || '';

  if (!featureImg.src.endsWith(info.src)) featureImg.src = info.src;
  featureImg.classList.remove('swap');
  void featureImg.offsetWidth;
  featureImg.classList.add('swap');
}

document.querySelectorAll('.items li').forEach(li => {
  li.addEventListener('click', () => showItem(li));
  li.addEventListener('mouseenter', () => showItem(li));
  li.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showItem(li); }
  });
});
showItem(document.querySelector('#calientes [data-tag]'));

// Horario: marca el día de hoy y si está abierto
const schedule = { 0: [9, 20], 1: [8, 21], 2: [8, 21], 3: [8, 21], 4: [8, 21], 5: [8, 21], 6: [9, 20] };
const now = new Date();
const [opens, closes] = schedule[now.getDay()];
const hour = now.getHours() + now.getMinutes() / 60;
const isOpen = hour >= opens && hour < closes;
const status = document.getElementById('openStatus');

status.textContent = isOpen ? 'Abierto ahora' : 'Cerrado ahora';
status.classList.toggle('is-closed', !isOpen);
document.querySelector(`#hoursList [data-day="${now.getDay()}"]`).classList.add('is-today');

// Mismo estado en el inicio
const heroStatus = document.getElementById('heroStatus');
const nextOpen = schedule[(now.getDay() + (hour >= closes ? 1 : 0)) % 7][0];
heroStatus.textContent = isOpen
  ? `Abierto · cierra a las ${closes}:00`
  : `Cerrado · abre a las ${nextOpen}:00`;
heroStatus.classList.toggle('is-closed', !isOpen);

// Etiquetas de precio del inicio: abren la pestaña correcta del menú
document.querySelectorAll('[data-tab-link]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector(`.tab[data-tab="${link.dataset.tabLink}"]`).click();
  });
});

// Los vasos siguen un poco al ratón (solo en escritorio)
const heroVisual = document.querySelector('.hero__visual');
if (window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelector('.hero').addEventListener('mousemove', e => {
    const r = heroVisual.getBoundingClientRect();
    heroVisual.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
    heroVisual.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
  });
}

// Mini test de mood
const moods = {
  sueno:   { drink: 'Expresso doble · $27', why: 'Corto y cargado. Sirve para despertar.' },
  calor:   { drink: 'Soda italiana · $57', why: 'De fresa o de mango, con bastante hielo.' },
  antojo:  { drink: 'Chocolate helado · $52', why: 'Dulce y frío, para la tarde.' },
  chill:   { drink: 'Té Chai · $42', why: 'Lleva canela y especias. Va bien sin prisa.' },
  estudio: { drink: 'Latte + vainilla · $52', why: 'Un latte con sabor vainilla. Dura toda la sesión.' },
};

const moodButtons = document.querySelectorAll('#moodOptions button');
const moodResult = document.getElementById('moodResult');
const moodDrink = document.getElementById('moodDrink');
const moodWhy = document.getElementById('moodWhy');

moodButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const pick = moods[btn.dataset.mood];
    moodButtons.forEach(b => b.classList.toggle('is-active', b === btn));
    moodDrink.textContent = pick.drink;
    moodWhy.textContent = pick.why;
    moodResult.classList.remove('bump');
    void moodResult.offsetWidth; // reinicia la animación
    moodResult.classList.add('bump');
  });
});

// Aparición al hacer scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
