// =============================================
// HEADER SCROLL EFFECT
// =============================================
(function() {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = y;
  }, { passive: true });
})();

// =============================================
// MOBILE MENU
// =============================================
(function() {
  const burger = document.getElementById('burger-btn');
  const menu = document.getElementById('mobile-menu');
  const close = document.getElementById('menu-close');
  const links = menu.querySelectorAll('a');

  function open() {
    menu.classList.add('mobile-menu--open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('mobile-menu--open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', open);
  close.addEventListener('click', closeMenu);
  links.forEach(l => l.addEventListener('click', closeMenu));
})();

// =============================================
// SMOOTH SCROLL FOR NAV LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
(function() {
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('reveal')) {
          entry.target.classList.add('reveal--visible');
        }
        if (entry.target.classList.contains('reveal-stagger')) {
          entry.target.classList.add('reveal-stagger--visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();

// =============================================
// STAKEHOLDER MAP (Canvas scatter plot)
// =============================================
(function() {
  const canvas = document.getElementById('stakeholder-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Data: { name, x (support 0-100), y (influence 0-100), color }
  const stakeholders = [
    // Champions (green) - high support, high influence
    { name: 'ШИЯ ВШЭ',             x: 80, y: 93, color: '#2a7d3f' },
    { name: 'ФМЭиМП ВШЭ',          x: 95, y: 90, color: '#2a7d3f' },
    { name: 'Деп. ин. языков',      x: 78, y: 87, color: '#2a7d3f' },
    { name: 'Школа востоков.',       x: 85, y: 75, color: '#2a7d3f' },
    // Critics (red) - low support, high influence
    { name: 'ЦФИ НИУ ВШЭ',         x: 35, y: 85, color: '#c45a3c' },
    { name: 'Академ. сообщество',    x: 30, y: 65, color: '#c45a3c' },
    // Supporters (blue) - high support, medium/low influence
    { name: 'Каф. иссл. Китая',     x: 68, y: 48, color: '#3068a8' },
    { name: 'Студенты',              x: 88, y: 46, color: '#3068a8' },
    { name: 'Центр подг. ФГН',       x: 65, y: 40, color: '#3068a8' },
    { name: 'Препод. кит.яз.',       x: 90, y: 38, color: '#3068a8' },
    { name: 'ИКВИА',                 x: 78, y: 25, color: '#3068a8' },
    { name: 'Слушатели ДПО',         x: 80, y: 22, color: '#3068a8' },
    { name: 'ИДПО (СПб)',            x: 92, y: 12, color: '#3068a8' },
    // Passive (gray) - low support, low influence
    { name: 'Частные школы',         x: 38, y: 22, color: '#999' },
    { name: 'Репетиторы',            x: 48, y: 10, color: '#999' },
  ];

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width - 32; // subtract padding
    const h = Math.min(w * 0.6, 560);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    const pad = { top: 30, right: 30, bottom: 50, left: 60 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    // Quadrant backgrounds
    const cx = pad.left + plotW * 0.5;
    const cy = pad.top + plotH * 0.5;

    // Top-left: Critics (red tint)
    ctx.fillStyle = 'rgba(196,90,60,0.04)';
    ctx.fillRect(pad.left, pad.top, plotW * 0.5, plotH * 0.5);
    // Top-right: Champions (green tint)
    ctx.fillStyle = 'rgba(42,125,63,0.04)';
    ctx.fillRect(cx, pad.top, plotW * 0.5, plotH * 0.5);
    // Bottom-right: Supporters (blue tint)
    ctx.fillStyle = 'rgba(48,104,168,0.04)';
    ctx.fillRect(cx, cy, plotW * 0.5, plotH * 0.5);
    // Bottom-left: Passive (gray tint)
    ctx.fillStyle = 'rgba(153,153,153,0.04)';
    ctx.fillRect(pad.left, cy, plotW * 0.5, plotH * 0.5);

    // Grid lines
    ctx.strokeStyle = '#d4d1ca';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);

    // Center cross
    ctx.beginPath();
    ctx.moveTo(cx, pad.top);
    ctx.lineTo(cx, pad.top + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pad.left, cy);
    ctx.lineTo(pad.left + plotW, cy);
    ctx.stroke();

    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = '#bab9b4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.lineTo(pad.left + plotW, pad.top + plotH);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#5a6478';
    ctx.font = '500 12px General Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Уровень поддержки', pad.left + plotW / 2, h - 8);
    ctx.save();
    ctx.translate(14, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Уровень влияния', 0, 0);
    ctx.restore();

    // Axis tick labels
    ctx.font = '400 11px General Sans, sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.fillText('Низкая', pad.left + plotW * 0.25, h - 25);
    ctx.fillText('Высокая', pad.left + plotW * 0.75, h - 25);
    ctx.textAlign = 'right';
    ctx.fillText('Низкое', pad.left - 8, cy + 4);
    ctx.fillText('Высокое', pad.left - 8, pad.top + plotH * 0.2);

    // Quadrant labels
    ctx.font = '700 13px Cabinet Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(196,90,60,0.35)';
    ctx.fillText('Критики', pad.left + plotW * 0.25, pad.top + 22);
    ctx.fillStyle = 'rgba(42,125,63,0.35)';
    ctx.fillText('Чемпионы', pad.left + plotW * 0.75, pad.top + 22);
    ctx.fillStyle = 'rgba(48,104,168,0.25)';
    ctx.fillText('Сторонники', pad.left + plotW * 0.75, pad.top + plotH - 10);
    ctx.fillStyle = 'rgba(153,153,153,0.3)';
    ctx.fillText('Пассивные', pad.left + plotW * 0.25, pad.top + plotH - 10);

    // Plot dots
    const dotR = Math.max(6, Math.min(9, w / 140));
    const fontSize = Math.max(10, Math.min(12, w / 100));
    ctx.font = '500 ' + fontSize + 'px General Sans, sans-serif';

    stakeholders.forEach(s => {
      const px = pad.left + (s.x / 100) * plotW;
      const py = pad.top + (1 - s.y / 100) * plotH;

      // Shadow
      ctx.beginPath();
      ctx.arc(px, py, dotR + 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();

      // Label
      ctx.fillStyle = '#1a2744';
      ctx.textAlign = 'left';
      let lx = px + dotR + 5;
      let ly = py + 4;
      // Avoid overflow on right
      const tw = ctx.measureText(s.name).width;
      if (lx + tw > w - pad.right) {
        ctx.textAlign = 'right';
        lx = px - dotR - 5;
      }
      ctx.fillText(s.name, lx, ly);
    });
  }

  draw();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 150);
  });
})();

// =============================================
// ACTIVE NAV LINK HIGHLIGHT
// =============================================
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.background = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--color-text)';
            link.style.background = 'var(--color-primary-light)';
          }
        });
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(s => observer.observe(s));
})();
