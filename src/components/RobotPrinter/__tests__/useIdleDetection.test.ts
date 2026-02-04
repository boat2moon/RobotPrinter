import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useIdleDetection } from '../hooks/useIdleDetection';

describe('useIdleDetection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('应该初始化为非睡眠状态', () => {
    const { result } = renderHook(() => useIdleDetection());
    expect(result.current.isSleeping).toBe(false);
  });

  it('应该支持初始睡眠状态配置', () => {
    const { result } = renderHook(() => useIdleDetection({ initialSleeping: true }));
    expect(result.current.isSleeping).toBe(true);
  });

  it('应该在超时后进入睡眠状态', () => {
    const { result } = renderHook(() => useIdleDetection({ timeout: 1000 }));

    // 触发重置计时器
    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.isSleeping).toBe(false);

    // 快进到超时前
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current.isSleeping).toBe(false);

    // 快进到超时后
    act(() => {
      vi.advanceTimersByTime(2);
    });
    expect(result.current.isSleeping).toBe(true);
  });

  it('resetTimer 应该唤醒并重置计时器', () => {
    const { result } = renderHook(() => useIdleDetection({ timeout: 1000 }));

    // 启动计时器
    act(() => {
      result.current.resetTimer();
    });

    // 等待 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 重置计时器
    act(() => {
      result.current.resetTimer();
    });

    // 再等 500ms（总共只过了 500ms 从上次重置）
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.isSleeping).toBe(false);

    // 再等 501ms，现在应该睡眠
    act(() => {
      vi.advanceTimersByTime(501);
    });
    expect(result.current.isSleeping).toBe(true);
  });

  it('forceSleep 应该立即进入睡眠', () => {
    const { result } = renderHook(() => useIdleDetection());

    act(() => {
      result.current.forceSleep();
    });

    expect(result.current.isSleeping).toBe(true);
  });

  it('forceWake 应该立即唤醒', () => {
    const { result } = renderHook(() => useIdleDetection({ initialSleeping: true }));

    expect(result.current.isSleeping).toBe(true);

    act(() => {
      result.current.forceWake();
    });

    expect(result.current.isSleeping).toBe(false);
  });

  it('禁用时不应触发睡眠', () => {
    const { result } = renderHook(() => useIdleDetection({ timeout: 100, disabled: true }));

    act(() => {
      result.current.resetTimer();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // 禁用状态下 resetTimer 不会启动计时器
    expect(result.current.isSleeping).toBe(false);
  });
});
