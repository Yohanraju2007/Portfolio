/* ===== YOHAN PORTFOLIO - script.js ===== */

// ─── Custom Cursor ───────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, follX = 0, follY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  follX += (mouseX - follX) * 0.12;
  follY += (mouseY - follY) * 0.12;
  follower.style.left = follX + 'px';
  follower.style.top = follY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, label, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
    follower.style.borderColor = 'rgba(200,176,106,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.borderColor = 'rgba(200,176,106,0.5)';
  });
});

// ─── Nav Scroll ───────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── Mobile Menu ─────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ─── Hero Canvas: Fluid Orbs ─────────────────────────────────────
(function initHeroCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const orbs = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 5; i++) {
    orbs.push({
      x: Math.random() * 1200, y: Math.random() * 800,
      r: 180 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      hue: i % 2 === 0 ? 42 : 38,
      sat: 50 + Math.random() * 30,
      alpha: 0.04 + Math.random() * 0.06
    });
  }

  function drawOrbs() {
    ctx.clearRect(0, 0, W, H);
    orbs.forEach(o => {
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r) o.x = W + o.r;
      if (o.x > W + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = H + o.r;
      if (o.y > H + o.r) o.y = -o.r;
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `hsla(${o.hue},${o.sat}%,55%,${o.alpha})`);
      g.addColorStop(1, `hsla(${o.hue},${o.sat}%,55%,0)`);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(drawOrbs);
  }
  drawOrbs();
})();

// ─── Contact Canvas: Fluid Smoke ─────────────────────────────────
(function initContactCanvas() {
  const canvas = document.getElementById('contactCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({length: 60}, () => ({
    x: Math.random() * 1400 - 200,
    y: Math.random() * 900,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -0.2 - Math.random() * 0.4,
    size: 60 + Math.random() * 120,
    alpha: 0.02 + Math.random() * 0.05,
    phase: Math.random() * Math.PI * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.005;
    particles.forEach(p => {
      p.x += p.vx + Math.sin(t + p.phase) * 0.3;
      p.y += p.vy;
      if (p.y < -p.size) p.y = H + p.size;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, `rgba(200,176,106,${p.alpha})`);
      g.addColorStop(0.5, `rgba(180,160,90,${p.alpha * 0.5})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Scroll Reveal ────────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.about-grid, .project-card, .photo-section, .skill-group, .section-title, .section-label'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// ─── 3D Tilt on Project Cards ────────────────────────────────────
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
});

// ─── Hero Profile Photo Upload ────────────────────────────────────
const heroPhotoPlaceholder = document.getElementById('heroPhoto');
const photoCard = document.querySelector('.photo-card');

// Add an upload label to the photo card
const uploadLabel = document.createElement('label');
uploadLabel.innerHTML = '📷 Add Your Photo';
uploadLabel.setAttribute('for', 'heroPhotoInput');
photoCard.appendChild(uploadLabel);

const heroInput = document.createElement('input');
heroInput.type = 'file';
heroInput.id = 'heroPhotoInput';
heroInput.accept = 'image/*';
heroInput.hidden = true;
document.body.appendChild(heroInput);

heroInput.addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = document.createElement('img');
  img.src = url;
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;';
  const initials = heroPhotoPlaceholder.querySelector('.photo-initials');
  if (initials) initials.remove();
  const shimmer = heroPhotoPlaceholder.querySelector('.photo-shimmer');
  if (shimmer) shimmer.remove();
  heroPhotoPlaceholder.appendChild(img);
});

// ─── Project Photo Upload ─────────────────────────────────────────
window.handlePhotoUpload = function(input, displayId) {
  const display = document.getElementById(displayId);
  if (!display || !input.files[0]) return;
  const url = URL.createObjectURL(input.files[0]);
  const img = document.createElement('img');
  img.src = url;
  display.appendChild(img);
};

// ─── Bulk Photo Upload (Gallery) ──────────────────────────────────
window.handleBulkUpload = function(input) {
  const gallery = document.getElementById('photoGallery');
  Array.from(input.files).forEach(file => {
    const url = URL.createObjectURL(file);
    const item = document.createElement('div');
    item.className = 'gallery-item';
    const img = document.createElement('img');
    img.src = url;
    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '✕';
    del.addEventListener('click', () => item.remove());
    item.appendChild(img);
    item.appendChild(del);
    gallery.appendChild(item);
  });
};

// Drag and drop for gallery
const dropZone = document.getElementById('dropZone');
if (dropZone) {
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.style.borderColor = 'rgba(200,176,106,0.7)';
    dropZone.style.background = 'rgba(200,176,106,0.05)';
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '';
    dropZone.style.background = '';
  });
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.style.borderColor = '';
    dropZone.style.background = '';
    const gallery = document.getElementById('photoGallery');
    Array.from(e.dataTransfer.files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const img = document.createElement('img');
      img.src = url;
      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = '✕';
      del.addEventListener('click', () => item.remove());
      item.appendChild(img);
      item.appendChild(del);
      gallery.appendChild(item);
    });
  });
}

// ─── Smooth Active Nav Link ───────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(l => {
    l.style.color = '';
    if (l.getAttribute('href') === '#' + current) {
      l.style.color = 'var(--accent)';
    }
  });
});
// ─── Lightbox: Show Full Photo ─────────────────────────────────────
// Create the lightbox elements dynamically
const lightbox = document.createElement('div');
lightbox.id = 'imageLightbox';
lightbox.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:10000; cursor:zoom-out; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s ease;';

const lightboxImg = document.createElement('img');
lightboxImg.style.cssText = 'max-width:90%; max-height:90%; border:2px solid var(--gold); border-radius:10px; transform:scale(0.9); transition:transform 0.3s ease;';

lightbox.appendChild(lightboxImg);
document.body.appendChild(lightbox);

// Function to open the lightbox
window.openFullImage = function(src) {
  lightboxImg.src = src;
  lightbox.style.display = 'flex';
  setTimeout(() => {
    lightbox.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1)';
  }, 10);
};

// ─── Lightbox: Show Full Photo ─────────────────────────────────────
// Create the lightbox elements dynamically
const lightbox = document.createElement('div');
lightbox.id = 'imageLightbox';
lightbox.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:10000; cursor:zoom-out; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s ease;';

const lightboxImg = document.createElement('img');
lightboxImg.style.cssText = 'max-width:90%; max-height:90%; border:2px solid var(--gold); border-radius:10px; transform:scale(0.9); transition:transform 0.3s ease;';

lightbox.appendChild(lightboxImg);
document.body.appendChild(lightbox);

// Function to open the lightbox
window.openFullImage = function(src) {
  lightboxImg.src = src;
  lightbox.style.display = 'flex';
  setTimeout(() => {
    lightbox.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1)';
  }, 10);
};

// Close lightbox on click
lightbox.addEventListener('click', () => {
  lightbox.style.opacity = '0';
  lightboxImg.style.transform = 'scale(0.9)';
  setTimeout(() => { lightbox.style.display = 'none'; }, 300);
});