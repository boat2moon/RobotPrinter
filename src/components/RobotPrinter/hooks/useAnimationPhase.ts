import { useState, useCallback, useEffect, useRef } from 'react';

import type { AnimationPhase } from '../types';
import { ANIMATION } from '../constants';

interface UseAnimationPhaseOptions {
  /** 旋转动画时长 */
  rotateDuration?: number;
  /** 纸条展开时长 */
  paperDuration?: number;
  /** 展开状态变化回调 */
  onExpandedChange?: (expanded: boolean) => void;
}

interface UseAnimationPhaseReturn {
  /** 当前动画阶段 */
  phase: AnimationPhase;
  /** 是否已旋转 */
  isRotated: boolean;
  /** 嘴巴是否打开 */
  isMouthOpen: boolean;
  /** 纸条是否可见 */
  isPaperVisible: boolean;
  /** 是否完全展开 */
  isExpanded: boolean;
  /** 是否正在动画中 */
  isAnimating: boolean;
  /** 展开动画序列 */
  expand: () => void;
  /** 收起动画序列 */
  collapse: () => void;
  /** 切换展开/收起 */
  toggle: () => void;
}

/**
 * 动画阶段管理 Hook
 * 使用状态机模式管理复杂的动画序列
 */
export function useAnimationPhase({
  rotateDuration = ANIMATION.ROTATE_DURATION,
  paperDuration = ANIMATION.PAPER_DURATION,
  onExpandedChange,
}: UseAnimationPhaseOptions = {}): UseAnimationPhaseReturn {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 清除所有定时器
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  // 展开动画序列
  const expand = useCallback(() => {
    clearTimers();
    setPhase('rotating');

    const timer1 = setTimeout(() => {
      setPhase('mouth-opening');

      const timer2 = setTimeout(() => {
        setPhase('paper-out');

        const timer3 = setTimeout(() => {
          setPhase('expanded');
          onExpandedChange?.(true);
        }, paperDuration);
        timersRef.current.push(timer3);
      }, ANIMATION.MOUTH_OPEN_DURATION);
      timersRef.current.push(timer2);
    }, rotateDuration);
    timersRef.current.push(timer1);
  }, [rotateDuration, paperDuration, onExpandedChange, clearTimers]);

  // 收起动画序列
  const collapse = useCallback(() => {
    clearTimers();
    setPhase('paper-in');

    const timer1 = setTimeout(() => {
      setPhase('mouth-closing');

      const timer2 = setTimeout(() => {
        setPhase('rotating-back');

        const timer3 = setTimeout(() => {
          setPhase('idle');
          onExpandedChange?.(false);
        }, rotateDuration);
        timersRef.current.push(timer3);
      }, ANIMATION.MOUTH_CLOSE_DURATION);
      timersRef.current.push(timer2);
    }, paperDuration * 0.8);
    timersRef.current.push(timer1);
  }, [rotateDuration, paperDuration, onExpandedChange, clearTimers]);

  // 切换展开/收起
  const toggle = useCallback(() => {
    if (phase === 'idle') {
      expand();
    } else if (phase === 'expanded') {
      collapse();
    }
  }, [phase, expand, collapse]);

  // 清理
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // 计算派生状态
  const isRotated = [
    'rotating',
    'mouth-opening',
    'paper-out',
    'expanded',
    'paper-in',
    'mouth-closing',
  ].includes(phase);
  const isMouthOpen = ['mouth-opening', 'paper-out', 'expanded', 'paper-in'].includes(phase);
  const isPaperVisible = ['paper-out', 'expanded'].includes(phase);
  const isExpanded = phase === 'expanded';
  const isAnimating = phase !== 'idle' && phase !== 'expanded';

  return {
    phase,
    isRotated,
    isMouthOpen,
    isPaperVisible,
    isExpanded,
    isAnimating,
    expand,
    collapse,
    toggle,
  };
}
