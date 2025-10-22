import { useEffect, useRef, type RefObject } from 'react';

/**
 * Custom hook for auto-scrolling to bottom
 * Useful for chat interfaces where new messages appear at the bottom
 *
 * @param dependency Value that triggers auto-scroll when it changes
 * @returns Ref object to attach to the scrollable container
 */
export const useAutoScroll = <T,>(dependency: T): RefObject<HTMLDivElement> => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [dependency]);

  return scrollRef;
};

