/* Lightweight drifting stars. No libraries or external assets needed. */
(() => {
  const canvas = document.getElementById('starfield');
  const context = canvas.getContext('2d');
  if (!context) return;
  const button = document.getElementById('star-motion');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let width = 0;
  let height = 0;
  let stars = [];
  let frame = null;
  let previous = 0;

  function draw(delta = 0) {
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.y -= delta * star.speed;
      star.x += delta * star.speed * 0.16;
      if (star.y < -2) star.y = height + 2;
      if (star.x > width + 2) star.x = -2;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(218, 231, 255, ${star.alpha})`;
      context.fill();
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(180, Math.max(35, Math.round(width * height / 9000)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.35 + Math.random() * 0.85,
      alpha: 0.18 + Math.random() * 0.5,
      speed: 2 + Math.random() * 5
    }));
    draw();
  }

  function animate(time) {
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    draw(delta);
    frame = requestAnimationFrame(animate);
  }

  function updateMotion() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previous = 0;
    button.textContent = paused ? 'Play stars' : 'Pause stars';
    if (!paused && !document.hidden) frame = requestAnimationFrame(animate);
  }

  button.hidden = false;
  button.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reducedMotion.addEventListener('change', () => {
    paused = reducedMotion.matches;
    updateMotion();
  });
  document.addEventListener('visibilitychange', updateMotion);
  window.addEventListener('resize', resize);
  resize();
  updateMotion();
})();
