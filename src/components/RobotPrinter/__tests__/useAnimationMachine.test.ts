import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useAnimationMachine, animationReducer } from '../hooks/useAnimationMachine';
import type { AnimationPhase } from '../types';

describe('animationReducer', () => {
  describe('状态流转 - 展开序列', () => {
    it('idle + EXPAND → rotating', () => {
      expect(animationReducer('idle', { type: 'EXPAND' })).toBe('rotating');
    });

    it('rotating + ROTATE_COMPLETE → mouth-opening', () => {
      expect(animationReducer('rotating', { type: 'ROTATE_COMPLETE' })).toBe('mouth-opening');
    });

    it('mouth-opening + MOUTH_OPEN_COMPLETE → paper-out', () => {
      expect(animationReducer('mouth-opening', { type: 'MOUTH_OPEN_COMPLETE' })).toBe('paper-out');
    });

    it('paper-out + PAPER_OUT_COMPLETE → expanded', () => {
      expect(animationReducer('paper-out', { type: 'PAPER_OUT_COMPLETE' })).toBe('expanded');
    });
  });

  describe('状态流转 - 收起序列', () => {
    it('expanded + COLLAPSE → paper-in', () => {
      expect(animationReducer('expanded', { type: 'COLLAPSE' })).toBe('paper-in');
    });

    it('paper-in + PAPER_IN_COMPLETE → mouth-closing', () => {
      expect(animationReducer('paper-in', { type: 'PAPER_IN_COMPLETE' })).toBe('mouth-closing');
    });

    it('mouth-closing + MOUTH_CLOSE_COMPLETE → rotating-back', () => {
      expect(animationReducer('mouth-closing', { type: 'MOUTH_CLOSE_COMPLETE' })).toBe(
        'rotating-back'
      );
    });

    it('rotating-back + ROTATE_BACK_COMPLETE → idle', () => {
      expect(animationReducer('rotating-back', { type: 'ROTATE_BACK_COMPLETE' })).toBe('idle');
    });
  });

  describe('无效事件处理', () => {
    it('idle 状态忽略 COLLAPSE', () => {
      expect(animationReducer('idle', { type: 'COLLAPSE' })).toBe('idle');
    });

    it('expanded 状态忽略 EXPAND', () => {
      expect(animationReducer('expanded', { type: 'EXPAND' })).toBe('expanded');
    });

    it('动画中忽略 EXPAND/COLLAPSE', () => {
      expect(animationReducer('rotating', { type: 'EXPAND' })).toBe('rotating');
      expect(animationReducer('paper-out', { type: 'COLLAPSE' })).toBe('paper-out');
    });
  });

  describe('RESET 事件', () => {
    const allPhases: AnimationPhase[] = [
      'idle',
      'rotating',
      'mouth-opening',
      'paper-out',
      'expanded',
      'paper-in',
      'mouth-closing',
      'rotating-back',
    ];

    it.each(allPhases)('从 %s 状态 RESET 应返回 idle', phase => {
      expect(animationReducer(phase, { type: 'RESET' })).toBe('idle');
    });
  });
});

describe('useAnimationMachine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初始状态应为 idle', () => {
    const { result } = renderHook(() => useAnimationMachine());
    expect(result.current.phase).toBe('idle');
    expect(result.current.isExpanded).toBe(false);
    expect(result.current.isAnimating).toBe(false);
  });

  it('调用 expand 应开始展开动画', () => {
    const { result } = renderHook(() =>
      useAnimationMachine({
        rotateDuration: 100,
        paperDuration: 100,
      })
    );

    act(() => {
      result.current.expand();
    });

    expect(result.current.phase).toBe('rotating');
    expect(result.current.isAnimating).toBe(true);
  });

  it('动画应自动进行到下一阶段', () => {
    const { result } = renderHook(() =>
      useAnimationMachine({
        rotateDuration: 100,
        paperDuration: 100,
      })
    );

    act(() => {
      result.current.expand();
    });
    expect(result.current.phase).toBe('rotating');

    // 推进旋转时间
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.phase).toBe('mouth-opening');
  });

  it('完整展开序列应到达 expanded 状态', () => {
    const onExpandedChange = vi.fn();
    const { result } = renderHook(() =>
      useAnimationMachine({
        rotateDuration: 100,
        paperDuration: 100,
        onExpandedChange,
      })
    );

    act(() => {
      result.current.expand();
    });

    // 推进所有动画时间: rotating(100) + mouth-opening(300) + paper-out(100)
    act(() => {
      vi.advanceTimersByTime(100); // rotating → mouth-opening
    });
    act(() => {
      vi.advanceTimersByTime(300); // mouth-opening → paper-out
    });
    act(() => {
      vi.advanceTimersByTime(100); // paper-out → expanded
    });

    expect(result.current.phase).toBe('expanded');
    expect(result.current.isExpanded).toBe(true);
    expect(result.current.isAnimating).toBe(false);
    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it('toggle 在 idle 时应展开', () => {
    const { result } = renderHook(() => useAnimationMachine());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.phase).toBe('rotating');
  });

  it('toggle 在 expanded 时应收起', () => {
    const { result } = renderHook(() =>
      useAnimationMachine({
        rotateDuration: 10,
        paperDuration: 10,
      })
    );

    // 先展开
    act(() => {
      result.current.expand();
    });

    // 推进所有动画时间到 expanded
    act(() => {
      vi.advanceTimersByTime(10); // rotating → mouth-opening
    });
    act(() => {
      vi.advanceTimersByTime(300); // mouth-opening → paper-out (MOUTH_OPEN_DURATION)
    });
    act(() => {
      vi.advanceTimersByTime(10); // paper-out → expanded
    });

    expect(result.current.phase).toBe('expanded');

    // 再收起
    act(() => {
      result.current.toggle();
    });

    expect(result.current.phase).toBe('paper-in');
  });

  it('toggle 在动画中应被忽略', () => {
    const { result } = renderHook(() => useAnimationMachine());

    act(() => {
      result.current.expand();
    });
    expect(result.current.phase).toBe('rotating');

    act(() => {
      result.current.toggle(); // 应被忽略
    });
    expect(result.current.phase).toBe('rotating');
  });

  it('reset 应立即回到 idle', () => {
    const { result } = renderHook(() => useAnimationMachine());

    act(() => {
      result.current.expand();
    });
    expect(result.current.phase).toBe('rotating');

    act(() => {
      result.current.reset();
    });
    expect(result.current.phase).toBe('idle');
  });

  describe('派生状态计算', () => {
    it('isRotated 在旋转后应为 true', () => {
      const { result } = renderHook(() => useAnimationMachine());

      expect(result.current.isRotated).toBe(false);

      act(() => {
        result.current.expand();
      });

      // rotating 状态 isRotated 应为 true
      expect(result.current.isRotated).toBe(true);
    });

    it('isMouthOpen 在嘴巴打开阶段应为 true', () => {
      const { result } = renderHook(() =>
        useAnimationMachine({
          rotateDuration: 10,
        })
      );

      act(() => {
        result.current.expand();
      });
      expect(result.current.isMouthOpen).toBe(false);

      act(() => {
        vi.advanceTimersByTime(10); // → mouth-opening
      });
      expect(result.current.isMouthOpen).toBe(true);
    });

    it('isPaperVisible 在纸条可见阶段应为 true', () => {
      const { result } = renderHook(() =>
        useAnimationMachine({
          rotateDuration: 10,
          paperDuration: 10,
        })
      );

      act(() => {
        result.current.expand();
      });

      act(() => {
        vi.advanceTimersByTime(10); // rotating → mouth-opening
      });
      expect(result.current.isPaperVisible).toBe(false);

      act(() => {
        vi.advanceTimersByTime(300); // mouth-opening → paper-out (MOUTH_OPEN_DURATION=300)
      });
      expect(result.current.isPaperVisible).toBe(true);
    });
  });
});
