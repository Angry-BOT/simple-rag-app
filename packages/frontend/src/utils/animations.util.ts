import gsap from 'gsap';

/**
 * GSAP animation utilities
 * Reusable animation functions for common effects
 */

/**
 * Fade in animation
 * @param element HTML element to animate
 * @param duration Animation duration in seconds
 */
export const fadeIn = (element: HTMLElement, duration = 0.5): gsap.core.Tween => {
  return gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration, ease: 'power2.out' }
  );
};

/**
 * Slide in animation from specified direction
 * @param element HTML element to animate
 * @param direction Direction to slide from
 * @param duration Animation duration in seconds
 */
export const slideIn = (
  element: HTMLElement,
  direction: 'left' | 'right' | 'up' | 'down' = 'left',
  duration = 0.5
): gsap.core.Tween => {
  const directions = {
    left: { x: -50 },
    right: { x: 50 },
    up: { y: -50 },
    down: { y: 50 },
  };

  return gsap.fromTo(
    element,
    { ...directions[direction], opacity: 0 },
    { x: 0, y: 0, opacity: 1, duration, ease: 'power2.out' }
  );
};

/**
 * Stagger animation for multiple elements
 * @param elements Array of HTML elements
 * @param stagger Delay between each animation in seconds
 */
export const staggerIn = (
  elements: HTMLElement[],
  stagger = 0.1
): gsap.core.Timeline => {
  return gsap.fromTo(
    elements,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger,
      ease: 'power2.out',
    }
  );
};

/**
 * Scale animation on hover
 * @param element HTML element to animate
 */
export const scaleOnHover = (element: HTMLElement): void => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.in' });
  });
};

/**
 * Pulse animation (continuous)
 * @param element HTML element to animate
 */
export const pulseAnimation = (element: HTMLElement): gsap.core.Timeline => {
  return gsap.timeline({ repeat: -1 }).to(element, {
    scale: 1.1,
    duration: 0.6,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: 1,
  });
};

/**
 * Bounce in animation
 * @param element HTML element to animate
 */
export const bounceIn = (element: HTMLElement): gsap.core.Tween => {
  return gsap.fromTo(
    element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    }
  );
};

