import { describe, it, expect } from 'vitest';

import {
  calculateTilt,
  calculateShadow,
  calculateInnerLighting,
  getPaperDirection,
  getRotateDirection,
} from '../utils/geometry';

describe('geometry utils', () => {
  describe('calculateTilt', () => {
    it('应该返回 tiltX 和 tiltY', () => {
      const result = calculateTilt({ x: 100, y: 100 }, 1);
      expect(result).toHaveProperty('tiltX');
      expect(result).toHaveProperty('tiltY');
      expect(typeof result.tiltX).toBe('number');
      expect(typeof result.tiltY).toBe('number');
    });

    it('中心位置应该返回接近零的倾斜', () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const result = calculateTilt({ x: centerX, y: centerY }, 1);

      expect(Math.abs(result.tiltX)).toBeLessThan(1);
      expect(Math.abs(result.tiltY)).toBeLessThan(1);
    });

    it('强度为零时应该返回零倾斜', () => {
      const result = calculateTilt({ x: 0, y: 0 }, 0);
      expect(result.tiltX).toBeCloseTo(0);
      expect(result.tiltY).toBeCloseTo(0);
    });

    it('强度应该影响结果', () => {
      const position = { x: 100, y: 100 };
      const lowStrength = calculateTilt(position, 0.5);
      const highStrength = calculateTilt(position, 2);

      expect(Math.abs(highStrength.tiltX)).toBeGreaterThan(Math.abs(lowStrength.tiltX));
    });
  });

  describe('calculateShadow', () => {
    it('应该返回 shadowX 和 shadowY', () => {
      const result = calculateShadow(10, -10, 1);
      expect(result).toHaveProperty('shadowX');
      expect(result).toHaveProperty('shadowY');
      expect(typeof result.shadowX).toBe('number');
      expect(typeof result.shadowY).toBe('number');
    });

    it('当传入有效倾斜值时应该计算阴影', () => {
      const result = calculateShadow(10, -10, 1);
      // 验证阴影值是数字且不是NaN
      expect(Number.isNaN(result.shadowX)).toBe(false);
      expect(Number.isNaN(result.shadowY)).toBe(false);
    });

    it('阴影强度应该影响结果', () => {
      const lowStrength = calculateShadow(10, -10, 0.5);
      const highStrength = calculateShadow(10, -10, 2);

      // 高强度应该产生更大的偏移
      expect(Math.abs(highStrength.shadowX)).toBeGreaterThan(Math.abs(lowStrength.shadowX));
    });
  });

  describe('calculateInnerLighting', () => {
    it('应该返回所有光照属性', () => {
      const result = calculateInnerLighting({ x: 100, y: 100 }, 4);

      expect(result).toHaveProperty('gradAngle');
      expect(result).toHaveProperty('highlightX');
      expect(result).toHaveProperty('highlightY');
      expect(result).toHaveProperty('shadowInsetX');
      expect(result).toHaveProperty('shadowInsetY');
    });

    it('应该返回有效的数值', () => {
      const result = calculateInnerLighting({ x: 100, y: 100 }, 4);

      expect(Number.isNaN(result.gradAngle)).toBe(false);
      expect(Number.isNaN(result.highlightX)).toBe(false);
      expect(Number.isNaN(result.highlightY)).toBe(false);
      expect(Number.isNaN(result.shadowInsetX)).toBe(false);
      expect(Number.isNaN(result.shadowInsetY)).toBe(false);
    });

    it('高光和阴影偏移强度应该受参数影响', () => {
      const low = calculateInnerLighting({ x: 100, y: 100 }, 2);
      const high = calculateInnerLighting({ x: 100, y: 100 }, 8);

      expect(Math.abs(high.highlightX)).toBeGreaterThan(Math.abs(low.highlightX));
    });
  });

  describe('getPaperDirection', () => {
    it('右侧位置应该返回 left', () => {
      const result = getPaperDirection(window.innerWidth * 0.75);
      expect(result).toBe('left');
    });

    it('左侧位置应该返回 right', () => {
      const result = getPaperDirection(window.innerWidth * 0.25);
      expect(result).toBe('right');
    });
  });

  describe('getRotateDirection', () => {
    it('left 应该返回 90', () => {
      expect(getRotateDirection('left')).toBe(90);
    });

    it('right 应该返回 -90', () => {
      expect(getRotateDirection('right')).toBe(-90);
    });
  });
});
