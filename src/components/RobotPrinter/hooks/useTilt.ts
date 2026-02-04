import { useMemo } from 'react';

import type { Position } from '../types';
import { calculateTilt, calculateShadow, calculateInnerLighting } from '../utils';
import { DEFAULTS } from '../constants';

interface UseTiltOptions {
  /** 当前位置 */
  position: Position;
  /** 倾斜强度 (0-1 或更大) */
  tiltStrength?: number;
  /** 阴影强度 (0-1 或更大) */
  shadowStrength?: number;
}

interface UseTiltReturn {
  /** X轴倾斜角度 */
  tiltX: number;
  /** Y轴倾斜角度 */
  tiltY: number;
  /** X轴阴影偏移 */
  shadowX: number;
  /** Y轴阴影偏移 */
  shadowY: number;
  /** 渐变角度 */
  gradAngle: number;
  /** 高光X偏移 */
  highlightX: number;
  /** 高光Y偏移 */
  highlightY: number;
  /** 内阴影X偏移 */
  shadowInsetX: number;
  /** 内阴影Y偏移 */
  shadowInsetY: number;
}

/**
 * 倾斜计算 Hook
 * 计算基于位置的倾斜、阴影和光照效果
 */
export function useTilt({
  position,
  tiltStrength = DEFAULTS.TILT_STRENGTH,
  shadowStrength = DEFAULTS.SHADOW_STRENGTH,
}: UseTiltOptions): UseTiltReturn {
  return useMemo(() => {
    const { tiltX, tiltY } = calculateTilt(position, tiltStrength);
    const { shadowX, shadowY } = calculateShadow(tiltX, tiltY, shadowStrength);
    const { gradAngle, highlightX, highlightY, shadowInsetX, shadowInsetY } =
      calculateInnerLighting(position, DEFAULTS.INSET_STRENGTH);

    return {
      tiltX,
      tiltY,
      shadowX,
      shadowY,
      gradAngle,
      highlightX,
      highlightY,
      shadowInsetX,
      shadowInsetY,
    };
  }, [position, tiltStrength, shadowStrength]);
}
