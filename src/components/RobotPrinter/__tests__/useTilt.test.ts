import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useTilt } from '../hooks/useTilt';

describe('useTilt', () => {
  it('应该返回正确的属性结构', () => {
    const { result } = renderHook(() => useTilt({ position: { x: 100, y: 100 } }));

    expect(result.current).toHaveProperty('tiltX');
    expect(result.current).toHaveProperty('tiltY');
    expect(result.current).toHaveProperty('shadowX');
    expect(result.current).toHaveProperty('shadowY');
    expect(result.current).toHaveProperty('gradAngle');
    expect(result.current).toHaveProperty('highlightX');
    expect(result.current).toHaveProperty('highlightY');
    expect(result.current).toHaveProperty('shadowInsetX');
    expect(result.current).toHaveProperty('shadowInsetY');
  });

  it('位置在屏幕中心时应该返回零倾斜', () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const { result } = renderHook(() => useTilt({ position: { x: centerX, y: centerY } }));

    // 中心位置应该倾斜接近于零
    expect(Math.abs(result.current.tiltX)).toBeLessThan(1);
    expect(Math.abs(result.current.tiltY)).toBeLessThan(1);
  });

  it('位置在屏幕边缘时应该有明显倾斜', () => {
    const { result } = renderHook(() => useTilt({ position: { x: 0, y: 0 } }));

    // 边缘位置应该有明显的倾斜（正或负都可以）
    const hasTilt = Math.abs(result.current.tiltX) > 1 || Math.abs(result.current.tiltY) > 1;
    expect(hasTilt).toBe(true);
  });

  it('应该根据 tiltStrength 调整倾斜强度', () => {
    const position = { x: 0, y: 0 };

    const { result: result1 } = renderHook(() => useTilt({ position, tiltStrength: 1 }));

    const { result: result2 } = renderHook(() => useTilt({ position, tiltStrength: 2 }));

    // 强度 2 应该大约是强度 1 的两倍
    expect(Math.abs(result2.current.tiltX)).toBeGreaterThan(Math.abs(result1.current.tiltX));
    expect(Math.abs(result2.current.tiltY)).toBeGreaterThan(Math.abs(result1.current.tiltY));
  });

  it('位置变化时应该更新结果', () => {
    const { result, rerender } = renderHook(({ position }) => useTilt({ position }), {
      initialProps: { position: { x: 0, y: 0 } },
    });

    const initialTiltX = result.current.tiltX;

    rerender({ position: { x: window.innerWidth, y: window.innerHeight } });

    // 倾斜应该有变化
    expect(result.current.tiltX).not.toBe(initialTiltX);
  });

  it('所有返回值应该是有效数字', () => {
    const { result } = renderHook(() => useTilt({ position: { x: 100, y: 100 } }));

    expect(Number.isNaN(result.current.tiltX)).toBe(false);
    expect(Number.isNaN(result.current.tiltY)).toBe(false);
    expect(Number.isNaN(result.current.shadowX)).toBe(false);
    expect(Number.isNaN(result.current.shadowY)).toBe(false);
    expect(Number.isNaN(result.current.gradAngle)).toBe(false);
    expect(Number.isNaN(result.current.highlightX)).toBe(false);
    expect(Number.isNaN(result.current.highlightY)).toBe(false);
  });
});
