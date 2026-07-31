// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky nav
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const burger = document.getElementById('burger');
const links = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  links.classList.toggle('open');
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  links.classList.remove('open');
}));

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 70);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Active link highlight
const sections = [...document.querySelectorAll('section[id]')];
window.addEventListener('scroll', () => {
  const y = window.scrollY + 120;
  let current = sections[0]?.id;
  sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
  links.querySelectorAll('a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}, { passive: true });

/* Gallery: images/1.jpeg ... images/20.jpeg
   Any file that is missing is simply hidden. */
const TOTAL_IMAGES = 20;
const grid = document.getElementById('galleryGrid');
const available = [];

for (let i = 1; i <= TOTAL_IMAGES; i++) {
  const fig = document.createElement('figure');
  const img = document.createElement('img');
  img.src = `images/${i}.jpeg`;
  img.alt = `Borah Travels trip photo ${i}`;
  img.loading = 'lazy';
  img.addEventListener('error', () => fig.remove());
  img.addEventListener('load', () => {
    available.push(img.src);
    fig.dataset.index = available.length - 1;
  });
  fig.appendChild(img);
  fig.addEventListener('click', () => openLightbox(img.src));
  grid.appendChild(fig);
}

// Empty-state placeholder while no photos are added yet
setTimeout(() => {
  if (!grid.children.length) {
    const ph = document.createElement('div');
    ph.className = 'placeholder';
    ph.style.gridColumn = '1 / -1';
    ph.style.padding = '3rem 1rem';
    ph.textContent = 'Add your photos to the images folder as 1.jpeg … 20.jpeg';
    grid.appendChild(ph);
  }
}, 2500);

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let current = 0;

function openLightbox(src) {
  current = Math.max(0, available.indexOf(src));
  lbImg.src = src;
  lb.classList.add('open');
}
function step(dir) {
  if (!available.length) return;
  current = (current + dir + available.length) % available.length;
  lbImg.src = available[current];
}
document.getElementById('lbClose').addEventListener('click', () => lb.classList.remove('open'));
document.getElementById('lbPrev').addEventListener('click', () => step(-1));
document.getElementById('lbNext').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') lb.classList.remove('open');
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

// Enquiry form -> sends all details to WhatsApp
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const msg =
    `*New Booking Enquiry - Borah Travels*\n` +
    `Name: ${f.name.value || '-'}\n` +
    `Phone: ${f.phone.value || '-'}\n` +
    `Vehicle: ${f.vehicle.value || '-'}\n` +
    `Travel Date: ${f.date.value || '-'}\n` +
    `Details: ${f.message.value || '-'}`;
  window.open('https://wa.me/919854784711?text=' + encodeURIComponent(msg), '_blank');
  document.getElementById('formNote').textContent =
    `Thanks ${f.name.value || ''}! Opening WhatsApp with your details. You can also call 098547 84711.`;
});
