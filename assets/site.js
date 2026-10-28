const siteIntro = document.querySelector('[data-site-intro]');
const introEnabled = document.documentElement.classList.contains('play-neon-intro');
const finishSiteIntro = () => {
  document.documentElement.classList.remove('play-neon-intro');
  siteIntro?.remove();
};
if (introEnabled && siteIntro) {
  siteIntro.addEventListener('animationend', (event) => {
    if (event.target === siteIntro && event.animationName === 'neon-intro-dismiss') finishSiteIntro();
  });
  siteIntro.querySelector('[data-intro-skip]')?.addEventListener('click', finishSiteIntro);
} else {
  siteIntro?.remove();
}

// ClickSpark effect adapted to the site's dependency-free HTML/CSS/JS setup.
const clickSparkLayer = document.createElement('canvas');
clickSparkLayer.className = 'click-spark-layer';
clickSparkLayer.setAttribute('aria-hidden', 'true');
document.body.prepend(clickSparkLayer);

const sparkContext = clickSparkLayer.getContext('2d');
const sparkColors = ['#fb3eb4', '#a373f6', '#c4fabb', '#fff7ba'];
const sparkBursts = [];
const sparkMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const sparkConfig = { count: 8, size: 8, radius: 34, duration: 480, gravity: 0.18 };
let sparkFrame = 0;
let lastSparkPointer = { time: 0, x: 0, y: 0 };

const resizeSparkLayer = () => {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  clickSparkLayer.width = Math.ceil(window.innerWidth * ratio);
  clickSparkLayer.height = Math.ceil(window.innerHeight * ratio);
  clickSparkLayer.style.width = `${window.innerWidth}px`;
  clickSparkLayer.style.height = `${window.innerHeight}px`;
  sparkContext?.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const drawSparkStar = (context, x, y, radius, rotation) => {
  context.beginPath();
  for (let point = 0; point < 8; point += 1) {
    const angle = rotation + (Math.PI * point) / 4;
    const distance = point % 2 === 0 ? radius : radius * 0.2;
    const px = x + Math.cos(angle) * distance;
    const py = y + Math.sin(angle) * distance;
    if (point === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.fill();
};

const startSparkBurst = (x, y) => {
  if (!sparkContext || sparkMotionReduced.matches) return;
  const sparks = Array.from({ length: sparkConfig.count }, (_, index) => ({
    angle: (Math.PI * 2 * index) / sparkConfig.count + (Math.random() - 0.5) * 0.18,
    distance: sparkConfig.radius * (0.78 + Math.random() * 0.44),
    size: sparkConfig.size * (0.75 + Math.random() * 0.5),
    color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
    rotation: Math.random() * Math.PI,
  }));
  sparkBursts.push({ x, y, start: performance.now(), sparks });
  if (sparkBursts.length > 32) sparkBursts.shift();
  if (!sparkFrame) sparkFrame = requestAnimationFrame(drawSparkBursts);
};

function drawSparkBursts(now) {
  sparkFrame = 0;
  if (!sparkContext) return;
  sparkContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let burstIndex = sparkBursts.length - 1; burstIndex >= 0; burstIndex -= 1) {
    const burst = sparkBursts[burstIndex];
    const progress = Math.min((now - burst.start) / sparkConfig.duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    burst.sparks.forEach((spark) => {
      const travel = spark.distance * eased;
      const x = burst.x + Math.cos(spark.angle) * travel;
      const y = burst.y + Math.sin(spark.angle) * travel + sparkConfig.gravity * 500 * (progress ** 2) * 0.5;
      sparkContext.save();
      sparkContext.globalAlpha = 1 - progress;
      sparkContext.fillStyle = spark.color;
      sparkContext.shadowColor = spark.color;
      sparkContext.shadowBlur = 5;
      drawSparkStar(sparkContext, x, y, spark.size * (1 - progress * 0.45), spark.rotation + progress * 0.35);
      sparkContext.restore();
    });
    if (progress >= 1) sparkBursts.splice(burstIndex, 1);
  }
  if (sparkBursts.length) sparkFrame = requestAnimationFrame(drawSparkBursts);
}

document.addEventListener('pointerdown', (event) => {
  if (event.target instanceof Element && event.target.closest('[data-site-intro]')) return;
  if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
  lastSparkPointer = { time: performance.now(), x: event.clientX, y: event.clientY };
  startSparkBurst(event.clientX, event.clientY);
}, true);

document.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('[data-site-intro]')) return;
  if (event.detail !== 0) {
    const recentPointer = performance.now() - lastSparkPointer.time < 700
      && Math.hypot(event.clientX - lastSparkPointer.x, event.clientY - lastSparkPointer.y) < 12;
    if (!recentPointer) startSparkBurst(event.clientX, event.clientY);
    return;
  }
  const target = event.target instanceof Element ? event.target : document.body;
  const bounds = target.getBoundingClientRect();
  startSparkBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
}, true);

window.addEventListener('resize', resizeSparkLayer, { passive: true });
resizeSparkLayer();

const animatedContent = [...document.querySelectorAll('[data-animated-content]')];
const contentMotionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (animatedContent.length && !contentMotionReduced && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('has-scroll-reveal');
  const contentObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  animatedContent.forEach((element) => contentObserver.observe(element));
}

const menuTextLoop = document.querySelector('[data-text-loop]');
if (menuTextLoop) {
  const svg = menuTextLoop.querySelector('svg');
  const track = menuTextLoop.querySelector('[data-loop-track]');
  const head = menuTextLoop.querySelector('[data-loop-head]');
  const tail = menuTextLoop.querySelector('[data-loop-tail]');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const phraseUnit = '變好吃的魔法 真的　✦　';
  const measure = document.createElementNS(svgNamespace, 'text');
  measure.classList.add('menu-text-loop-measure');
  measure.setAttribute('font-size', '46');
  measure.setAttribute('font-weight', '900');
  measure.setAttribute('letter-spacing', '12');
  measure.textContent = phraseUnit;
  svg.append(measure);

  const pathLength = track.getTotalLength();
  const unitLength = Math.max(measure.getComputedTextLength(), 1);
  const loopText = phraseUnit.repeat(Math.max(1, Math.floor(pathLength / unitLength)));
  [head, tail].forEach((pathText) => {
    pathText.textContent = loopText;
    pathText.parentElement.setAttribute('textLength', String(pathLength));
    pathText.parentElement.setAttribute('lengthAdjust', 'spacing');
  });
  measure.remove();

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let travel = 0;
  let speed = motionPreference.matches ? 0 : 70;
  let previousTime = 0;
  let animationFrame = 0;
  let isVisible = true;
  const updateTextPosition = () => {
    head.setAttribute('startOffset', String(travel));
    tail.setAttribute('startOffset', String(travel - pathLength));
  };
  const animateTextLoop = (time) => {
    animationFrame = 0;
    if (!isVisible || document.hidden || motionPreference.matches) return;
    if (previousTime) {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      travel = (travel + speed * delta) % pathLength;
      updateTextPosition();
    }
    previousTime = time;
    animationFrame = requestAnimationFrame(animateTextLoop);
  };
  const startTextLoop = () => {
    if (!animationFrame && isVisible && !document.hidden && !motionPreference.matches) {
      previousTime = 0;
      animationFrame = requestAnimationFrame(animateTextLoop);
    }
  };
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) {
      speed = 0;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      updateTextPosition();
    } else {
      speed = 70;
      startTextLoop();
    }
  });
  document.addEventListener('visibilitychange', startTextLoop);
  const loopObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) startTextLoop();
    else {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  });
  loopObserver.observe(menuTextLoop);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(animationFrame);
    loopObserver.disconnect();
  }, { once: true });
  updateTextPosition();
  document.fonts?.ready.then(updateTextPosition).catch(() => {});
  startTextLoop();
}

const pageMenu = document.querySelector('.bubble-overlay');
const pageMenuToggle = document.querySelector('.menu-sticker');
const setPageMenu = (open) => {
  if (!pageMenu || !pageMenuToggle) return;
  document.body.classList.toggle('menu-open', open);
  pageMenu.classList.toggle('open', open);
  pageMenu.setAttribute('aria-hidden', String(!open));
  pageMenuToggle.setAttribute('aria-expanded', String(open));
  if (open) pageMenu.querySelector('a')?.focus();
  else pageMenuToggle.focus();
};
pageMenuToggle?.addEventListener('click', () => setPageMenu(pageMenuToggle.getAttribute('aria-expanded') !== 'true'));
document.querySelector('.bubble-menu-backdrop')?.addEventListener('click', () => setPageMenu(false));
pageMenu?.addEventListener('click', (event) => { if (event.target === pageMenu) setPageMenu(false); });
pageMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setPageMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && pageMenuToggle?.getAttribute('aria-expanded') === 'true') setPageMenu(false);
});

const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.slide')];
  const dots = carousel.querySelector('.carousel-dots');
  let index = 0;
  let timer;

  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.style.transform = `translateX(-${index * 100}%)`;
      slide.setAttribute('aria-hidden', String(slideIndex !== index));
    });
    [...dots.children].forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', String(dotIndex === index));
    });
  };

  slides.forEach((_, slideIndex) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `顯示第 ${slideIndex + 1} 張餐點照片`);
    dot.addEventListener('click', () => { goTo(slideIndex); restart(); });
    dots.append(dot);
  });

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => goTo(index + 1), 5000);
  };
  carousel.querySelector('[data-prev]').addEventListener('click', () => { goTo(index - 1); restart(); });
  carousel.querySelector('[data-next]').addEventListener('click', () => { goTo(index + 1); restart(); });
  carousel.addEventListener('mouseenter', () => window.clearInterval(timer));
  carousel.addEventListener('mouseleave', restart);
  carousel.addEventListener('focusin', () => window.clearInterval(timer));
  carousel.addEventListener('focusout', restart);
  goTo(0);
  restart();
}

const filterButtons = document.querySelectorAll('[data-filter]');
const menuCards = document.querySelectorAll('.menu-card[data-category]');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    menuCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

const menuDialog = document.querySelector('[data-menu-dialog]');
const menuDetailImage = menuDialog?.querySelector('[data-menu-detail-image]');
const menuDetailTitle = menuDialog?.querySelector('[data-menu-detail-title]');
document.querySelectorAll('[data-menu-detail]').forEach((card) => {
  card.addEventListener('click', () => {
    const image = card.querySelector('img');
    if (!menuDialog || !menuDetailImage || !menuDetailTitle || !image) return;
    menuDetailImage.src = image.src;
    menuDetailImage.alt = image.alt;
    menuDetailTitle.textContent = card.dataset.detail ?? image.alt;
    menuDialog.showModal();
  });
});
menuDialog?.querySelector('.menu-detail-close')?.addEventListener('click', () => menuDialog.close());
menuDialog?.addEventListener('click', (event) => { if (event.target === menuDialog) menuDialog.close(); });

const staffGallery = document.querySelector('[data-staff-gallery]');
if (staffGallery) {
  const staffSlides = [...staffGallery.querySelectorAll('[data-staff-slide]')];
  const staffDots = [...document.querySelectorAll('[data-staff-dot]')];
  const staffStatus = document.querySelector('[data-staff-status]');
  let activeStaff = 0;
  let wheelLocked = false;

  const showStaff = (nextIndex) => {
    activeStaff = (nextIndex + staffSlides.length) % staffSlides.length;
    staffSlides.forEach((slide, index) => {
      slide.classList.remove('is-active', 'is-before', 'is-after');
      const offset = (index - activeStaff + staffSlides.length) % staffSlides.length;
      if (offset === 0) slide.classList.add('is-active');
      else if (offset === 1) slide.classList.add('is-after');
      else if (offset === staffSlides.length - 1) slide.classList.add('is-before');
      slide.setAttribute('aria-hidden', String(offset !== 0));
    });

    staffDots.forEach((dot, index) => {
      const selected = index === activeStaff;
      dot.classList.toggle('is-current', selected);
      if (selected) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });

    const name = staffSlides[activeStaff].querySelector('.staff-caption strong')?.textContent?.trim() ?? '';
    if (staffStatus) staffStatus.textContent = `${name} ・ ${String(activeStaff + 1).padStart(2, '0')} / ${String(staffSlides.length).padStart(2, '0')}`;
  };

  document.querySelector('[data-staff-prev]')?.addEventListener('click', () => showStaff(activeStaff - 1));
  document.querySelector('[data-staff-next]')?.addEventListener('click', () => showStaff(activeStaff + 1));
  staffDots.forEach((dot) => dot.addEventListener('click', () => showStaff(Number(dot.dataset.staffDot))));

  staffGallery.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || event.deltaY === 0) return;
    event.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    showStaff(activeStaff + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => { wheelLocked = false; }, 560);
  }, { passive: false });

  staffGallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      showStaff(activeStaff + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showStaff(activeStaff - 1);
    }
  });

  const staffDialog = document.querySelector('[data-staff-dialog]');
  const detailImage = staffDialog?.querySelector('[data-detail-image]');
  staffSlides.forEach((slide) => {
    const card = slide.querySelector('[data-staff-detail]');
    card?.addEventListener('click', () => {
      const image = card.querySelector('img');
      if (!staffDialog || !detailImage || !image) return;
      detailImage.src = image.src;
      detailImage.alt = image.alt;
      staffDialog.showModal();
    });
  });
  staffDialog?.querySelector('.staff-detail-close')?.addEventListener('click', () => staffDialog.close());
  staffDialog?.addEventListener('click', (event) => { if (event.target === staffDialog) staffDialog.close(); });

  showStaff(0);
}
