/**
 * animations.ts
 * - Chứa các hàm animation cho minigame
 * - Dễ dàng import và sử dụng trong MinigameCanvas hoặc Minigame2
 */

/**
 * Hiệu ứng bounce cho sticker hoặc icon
 */
export function bounce(element: HTMLElement, duration: number = 600) {
  if (!element) return;
  element.animate([
    { transform: 'translateY(0px)' },
    { transform: 'translateY(-20px)' },
    { transform: 'translateY(0px)' }
  ], {
    duration: duration,
    iterations: 1,
    easing: 'ease-out'
  });
}

/**
 * Fade in effect
 */
export function fadeIn(element: HTMLElement, duration: number = 500) {
  if (!element) return;
  element.style.opacity = '0';
  element.style.display = 'block';
  element.animate([
    { opacity: 0 },
    { opacity: 1 }
  ], {
    duration: duration,
    fill: 'forwards'
  });
}

/**
 * Confetti simple animation (tạo nhiều div nhỏ rơi)
 */
export function confetti(container: HTMLElement, count: number = 30) {
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const confetto = document.createElement('div');
    confetto.style.position = 'absolute';
    confetto.style.width = '8px';
    confetto.style.height = '8px';
    confetto.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetto.style.top = '0px';
    confetto.style.left = `${Math.random() * container.offsetWidth}px`;
    confetto.style.borderRadius = '50%';
    container.appendChild(confetto);

    const fall = confetto.animate([
      { transform: 'translateY(0px)' },
      { transform: `translateY(${container.offsetHeight + 20}px) rotate(${Math.random()*360}deg)` }
    ], {
      duration: 2000 + Math.random() * 1000,
      iterations: 1,
      easing: 'ease-in'
    });

    fall.onfinish = () => container.removeChild(confetto);
  }
}