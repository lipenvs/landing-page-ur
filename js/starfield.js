// ═══════════════════════════════════════════
// Starfield + Meteor Animation (Canvas)
// Stars twinkle gently but do NOT move.
// A meteor streaks from upper-left to lower-right occasionally.
// ═══════════════════════════════════════════

(function () {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let meteors = [];
  let animationId;
  let meteorTimerId = null;
  let isPageVisible = true;

  // ── Config ──
  const STAR_COUNT = 140;
  const STAR_MIN_SIZE = 0.3;
  const STAR_MAX_SIZE = 1.2;
  const STAR_MAX_ALPHA = 0.8;
  const STAR_MIN_ALPHA = 0.3;
  const TWINKLE_SPEED_MIN = 0.002;
  const TWINKLE_SPEED_MAX = 0.008;

  const METEOR_INTERVAL_MIN = 5000;
  const METEOR_INTERVAL_MAX = 10000;
  const METEOR_SPEED = 3;             // much slower
  const METEOR_LENGTH = 180;          // long tail
  const METEOR_THICKNESS = 1.2;

  // ── Resize ──
  function resize() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  // ── Create stars ──
  function getStarCount() {
    const area = width * height;
    const refArea = 1920 * 1080; // desktop reference
    return Math.round(STAR_COUNT * Math.min(area / refArea, 1));
  }

  function createStars() {
    stars = [];
    const count = getStarCount();
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: STAR_MIN_SIZE + Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE),
        alpha: STAR_MIN_ALPHA + Math.random() * (STAR_MAX_ALPHA - STAR_MIN_ALPHA),
        twinkleSpeed: TWINKLE_SPEED_MIN + Math.random() * (TWINKLE_SPEED_MAX - TWINKLE_SPEED_MIN),
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  // ── Spawn meteor ──
  // Direction: upper-left → lower-right (matching reference image)
  // The angle is roughly 30-40 degrees from horizontal
  function spawnMeteor() {
    // Start from upper-left quadrant area
    const startX = width * (0.3 + Math.random() * 0.3);
    const startY = -10;
    // Angle: going down-right at ~35 degrees below horizontal
    const angle = (30 + Math.random() * 15) * (Math.PI / 180);

    meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * METEOR_SPEED,
      vy: Math.sin(angle) * METEOR_SPEED,
      life: 1,
      decay: 0.004 + Math.random() * 0.003, // slower fade for slower travel
    });
  }

  // ── Schedule next meteor ──
  function scheduleMeteor() {
    if (!isPageVisible) return;
    const delay = METEOR_INTERVAL_MIN + Math.random() * (METEOR_INTERVAL_MAX - METEOR_INTERVAL_MIN);
    meteorTimerId = setTimeout(() => {
      if (isPageVisible) spawnMeteor();
      scheduleMeteor();
    }, delay);
  }

  // ── Pause/resume on tab visibility ──
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isPageVisible = false;
      clearTimeout(meteorTimerId);
      meteorTimerId = null;
      meteors.length = 0;
    } else {
      isPageVisible = true;
      scheduleMeteor();
    }
  });

  // ── Draw ──
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Stars
    for (const s of stars) {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= STAR_MAX_ALPHA) { s.alpha = STAR_MAX_ALPHA; s.twinkleDir = -1; }
      if (s.alpha <= STAR_MIN_ALPHA) { s.alpha = STAR_MIN_ALPHA; s.twinkleDir = 1; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fill();
    }

    // Meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= m.decay;

      if (m.life <= 0 || m.x > width + 50 || m.y > height + 50) {
        meteors.splice(i, 1);
        continue;
      }

      // Tail direction (opposite of travel)
      const dirX = -m.vx / METEOR_SPEED;
      const dirY = -m.vy / METEOR_SPEED;
      const tailX = m.x + dirX * METEOR_LENGTH;
      const tailY = m.y + dirY * METEOR_LENGTH;

      // Gradient: bright at head, fading along tail
      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.life * 0.9})`);
      grad.addColorStop(0.3, `rgba(255, 255, 255, ${m.life * 0.4})`);
      grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = METEOR_THICKNESS;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Bright glowing head
      const headGlow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 6);
      headGlow.addColorStop(0, `rgba(255, 255, 255, ${m.life * 0.8})`);
      headGlow.addColorStop(0.4, `rgba(255, 255, 255, ${m.life * 0.2})`);
      headGlow.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.beginPath();
      ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = headGlow;
      ctx.fill();

      // Solid bright core
      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${m.life})`;
      ctx.fill();
    }

    animationId = requestAnimationFrame(draw);
  }

  // ── Init ──
  function init() {
    resize();
    createStars();
    draw();
    scheduleMeteor();

    // Spawn one shortly after load
    setTimeout(spawnMeteor, 2000);
  }

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
