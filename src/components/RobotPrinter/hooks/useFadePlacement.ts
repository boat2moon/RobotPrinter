import { useState, useEffect, useRef } from 'react';

/**
 * Hook for handling fade animation during placement changes.
 * Returns the current display placement, fading state, and whether it has ever faded.
 *
 * @param placement - The target placement ('top' | 'bottom')
 * @param fadeDuration - Duration of fade out in ms (default 100ms)
 */
export function useFadePlacement(
  placement: 'top' | 'bottom',
  fadeDuration = 100
): { displayPlacement: 'top' | 'bottom'; isFading: boolean; hasFaded: boolean } {
  const [displayPlacement, setDisplayPlacement] = useState(placement);
  const [isFading, setIsFading] = useState(false);
  const [hasFaded, setHasFaded] = useState(false);
  const prevPlacementRef = useRef(placement);

  useEffect(() => {
    // 只有 placement 真正变化时才触发动画
    if (placement === prevPlacementRef.current) return;

    // 开始淡出
    setIsFading(true);

    // 等待淡出完成后切换位置并淡入
    const timer = setTimeout(() => {
      setDisplayPlacement(placement);
      setIsFading(false);
      setHasFaded(true); // 标记已经经历过位置切换
    }, fadeDuration);

    prevPlacementRef.current = placement;
    return () => clearTimeout(timer);
  }, [placement, fadeDuration]);

  return { displayPlacement, isFading, hasFaded };
}
