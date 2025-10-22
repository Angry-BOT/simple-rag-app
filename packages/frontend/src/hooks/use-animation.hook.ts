import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

/**
 * Animation configuration interface
 */
interface AnimationConfig {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  trigger?: 'mount' | 'manual';
  duration?: number;
  ease?: string;
}

/**
 * Custom hook for GSAP animations
 * Provides a ref and control functions for animations
 * Automatically handles cleanup
 *
 * @param config Animation configuration
 * @returns Object with ref and animation controls
 */
export const useAnimation = (
  config: AnimationConfig
): {
  ref: RefObject<HTMLDivElement>;
  play: () => void;
  reverse: () => void;
  restart: () => void;
} => {
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      if (config.from && config.to) {
        animationRef.current = gsap.fromTo(
          ref.current,
          config.from,
          {
            ...config.to,
            duration: config.duration || 0.5,
            ease: config.ease || 'power2.out',
          }
        );
      } else if (config.to) {
        animationRef.current = gsap.to(ref.current, {
          ...config.to,
          duration: config.duration || 0.5,
          ease: config.ease || 'power2.out',
        });
      } else if (config.from) {
        animationRef.current = gsap.from(ref.current, {
          ...config.from,
          duration: config.duration || 0.5,
          ease: config.ease || 'power2.out',
        });
      }

      // Play animation immediately if trigger is mount (default)
      if (config.trigger !== 'manual' && animationRef.current) {
        animationRef.current.play();
      }
    }, ref);

    return () => ctx.revert();
  }, [config]);

  return {
    ref,
    play: () => animationRef.current?.play(),
    reverse: () => animationRef.current?.reverse(),
    restart: () => animationRef.current?.restart(),
  };
};

