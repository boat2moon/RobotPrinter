import { useReducer, useEffect, useCallback } from 'react';

import type { AnimationPhase } from '../types';
import { ANIMATION } from '../constants';

// ============ 事件类型 ============

type AnimationEvent =
  | { type: 'EXPAND' }
  | { type: 'COLLAPSE' }
  | { type: 'ROTATE_COMPLETE' }
  | { type: 'MOUTH_OPEN_COMPLETE' }
  | { type: 'PAPER_OUT_COMPLETE' }
  | { type: 'PAPER_IN_COMPLETE' }
  | { type: 'MOUTH_CLOSE_COMPLETE' }
  | { type: 'ROTATE_BACK_COMPLETE' }
  | { type: 'RESET' };

// ============ 状态机 Reducer ============

/**
 * 动画状态机 Reducer
 * 定义明确的状态流转规则，使动画逻辑可预测、可测试
 */
function animationReducer(phase: AnimationPhase, event: AnimationEvent): AnimationPhase {
  switch (phase) {
    case 'idle':
      if (event.type === 'EXPAND') return 'rotating';
      if (event.type === 'RESET') return 'idle';
      break;

    case 'rotating':
      if (event.type === 'ROTATE_COMPLETE') return 'mouth-opening';
      if (event.type === 'RESET') return 'idle';
      break;

    case 'mouth-opening':
      if (event.type === 'MOUTH_OPEN_COMPLETE') return 'paper-out';
      if (event.type === 'RESET') return 'idle';
      break;

    case 'paper-out':
      if (event.type === 'PAPER_OUT_COMPLETE') return 'expanded';
      if (event.type === 'RESET') return 'idle';
      break;

    case 'expanded':
      if (event.type === 'COLLAPSE') return 'paper-in';
      if (event.type === 'RESET') return 'idle';
      break;

    case 'paper-in':
      if (event.type === 'PAPER_IN_COMPLETE') return 'mouth-closing';
      if (event.type === 'RESET') return 'idle';
      break;

    case 'mouth-closing':
      if (event.type === 'MOUTH_CLOSE_COMPLETE') return 'rotating-back';
      if (event.type === 'RESET') return 'idle';
      break;

    case 'rotating-back':
      if (event.type === 'ROTATE_BACK_COMPLETE') return 'idle';
      if (event.type === 'RESET') return 'idle';
      break;
  }

  // 无效事件，保持原状态
  return phase;
}

// ============ 阶段配置映射 ============

interface PhaseConfig {
  duration: (rotateDuration: number, paperDuration: number) => number;
  completeEvent: AnimationEvent['type'];
}

const PHASE_CONFIG: Partial<Record<AnimationPhase, PhaseConfig>> = {
  rotating: {
    duration: rotate => rotate,
    completeEvent: 'ROTATE_COMPLETE',
  },
  'mouth-opening': {
    duration: () => ANIMATION.MOUTH_OPEN_DURATION,
    completeEvent: 'MOUTH_OPEN_COMPLETE',
  },
  'paper-out': {
    duration: (_, paper) => paper,
    completeEvent: 'PAPER_OUT_COMPLETE',
  },
  'paper-in': {
    duration: (_, paper) => paper * 0.8,
    completeEvent: 'PAPER_IN_COMPLETE',
  },
  'mouth-closing': {
    duration: () => ANIMATION.MOUTH_CLOSE_DURATION,
    completeEvent: 'MOUTH_CLOSE_COMPLETE',
  },
  'rotating-back': {
    duration: rotate => rotate,
    completeEvent: 'ROTATE_BACK_COMPLETE',
  },
};

// ============ Hook 接口 ============

interface UseAnimationMachineOptions {
  /** 旋转动画时长 (ms) */
  rotateDuration?: number;
  /** 纸条展开动画时长 (ms) */
  paperDuration?: number;
  /** 展开状态变化回调 */
  onExpandedChange?: (expanded: boolean) => void;
}

interface UseAnimationMachineReturn {
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
  /** 展开动画 */
  expand: () => void;
  /** 收起动画 */
  collapse: () => void;
  /** 切换展开/收起 */
  toggle: () => void;
  /** 重置到初始状态 */
  reset: () => void;
}

/**
 * 动画状态机 Hook
 *
 * 使用 useReducer 实现的有限状态机，替代 setTimeout 链式调用。
 *
 * @description
 * 状态流转图：
 * ```
 * idle → rotating → mouth-opening → paper-out → expanded
 *                                                   ↓
 * idle ← rotating-back ← mouth-closing ← paper-in ←┘
 * ```
 *
 * @example
 * ```tsx
 * const { phase, isExpanded, expand, collapse } = useAnimationMachine({
 *   rotateDuration: 400,
 *   paperDuration: 600,
 *   onExpandedChange: (expanded) => console.log('Expanded:', expanded),
 * });
 * ```
 */
export function useAnimationMachine({
  rotateDuration = ANIMATION.ROTATE_DURATION,
  paperDuration = ANIMATION.PAPER_DURATION,
  onExpandedChange,
}: UseAnimationMachineOptions = {}): UseAnimationMachineReturn {
  const [phase, dispatch] = useReducer(animationReducer, 'idle');

  // 自动定时过渡
  useEffect(() => {
    const config = PHASE_CONFIG[phase];
    if (!config) return;

    const duration = config.duration(rotateDuration, paperDuration);
    const timer = setTimeout(() => {
      dispatch({ type: config.completeEvent });
    }, duration);

    return () => clearTimeout(timer);
  }, [phase, rotateDuration, paperDuration]);

  // 通知展开状态变化
  useEffect(() => {
    if (phase === 'expanded') {
      onExpandedChange?.(true);
    } else if (phase === 'idle') {
      // 只有从动画状态回到 idle 时才通知 false
      // 初始渲染时不通知
    }
  }, [phase, onExpandedChange]);

  // 从 rotating-back 到 idle 时通知关闭
  useEffect(() => {
    let prevPhase: AnimationPhase | null = null;

    return () => {
      if (prevPhase === 'rotating-back' && phase === 'idle') {
        onExpandedChange?.(false);
      }
      prevPhase = phase;
    };
  }, [phase, onExpandedChange]);

  // 操作方法
  const expand = useCallback(() => {
    dispatch({ type: 'EXPAND' });
  }, []);

  const collapse = useCallback(() => {
    dispatch({ type: 'COLLAPSE' });
  }, []);

  const toggle = useCallback(() => {
    if (phase === 'idle') {
      dispatch({ type: 'EXPAND' });
    } else if (phase === 'expanded') {
      dispatch({ type: 'COLLAPSE' });
    }
  }, [phase]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // 计算派生状态
  const isRotated = !['idle', 'rotating-back'].includes(phase);

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
    reset,
  };
}

// 导出 reducer 供测试使用
export { animationReducer };
export type { AnimationEvent, UseAnimationMachineOptions, UseAnimationMachineReturn };
