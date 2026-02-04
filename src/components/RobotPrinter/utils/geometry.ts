import type { Position } from '../types';
import { LAYOUT } from '../constants';

/**
 * 计算指向页面中心的倾斜角度
 * @param position 当前位置
 * @param tiltStrength 倾斜强度 (0-1 或更大)
 * @returns { tiltX, tiltY } 倾斜角度
 */
export function calculateTilt(
  position: Position,
  tiltStrength: number
): { tiltX: number; tiltY: number } {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // 机器人相对于页面中心的偏移
  const offsetX = position.x - centerX; // 正值=机器人在右侧
  const offsetY = position.y - centerY; // 正值=机器人在下方

  // 计算最大可能距离（用于归一化）
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

  // 归一化距离因子（0-1）
  const dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
  const factor = Math.min(1, dist / maxDist);

  /**
   * 倾斜逻辑：
   * - 机器人在右侧(offsetX > 0) → 右侧应凸出 → rotateY 负值
   * - 机器人在下方(offsetY > 0) → 底部应凸出 → rotateX 正值
   */
  const tiltX = (offsetY / maxDist) * LAYOUT.MAX_TILT_DEG * tiltStrength * factor;
  const tiltY = -(offsetX / maxDist) * LAYOUT.MAX_TILT_DEG * tiltStrength * factor;

  return { tiltX, tiltY };
}

/**
 * 计算动态阴影偏移
 * @param tiltX X轴倾斜角度
 * @param tiltY Y轴倾斜角度
 * @param shadowStrength 阴影强度
 * @returns { shadowX, shadowY } 阴影偏移
 */
export function calculateShadow(
  tiltX: number,
  tiltY: number,
  shadowStrength: number
): { shadowX: number; shadowY: number } {
  // 动态阴影偏移（基于页面中心光源，完全对称）
  const shadowOffsetX = -tiltY * 0.5 * shadowStrength;
  const shadowOffsetY = tiltX * 0.5 * shadowStrength;

  // 添加最小阴影距离保证可见性
  const shadowX = shadowOffsetX + Math.sign(shadowOffsetX || 1) * LAYOUT.MIN_SHADOW_OFFSET;
  const shadowY = shadowOffsetY + Math.sign(shadowOffsetY || 1) * LAYOUT.MIN_SHADOW_OFFSET;

  return { shadowX, shadowY };
}

/**
 * 计算动态内部光影
 * @param position 当前位置
 * @param insetStrength 内阴影强度系数
 * @returns 光影参数
 */
export function calculateInnerLighting(
  position: Position,
  insetStrength: number
): {
  gradAngle: number;
  highlightX: number;
  highlightY: number;
  shadowInsetX: number;
  shadowInsetY: number;
} {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const relX = position.x - centerX;
  const relY = position.y - centerY;

  // 计算梯度角度 (0deg = Up, 90deg = Right)
  const angleRad = Math.atan2(relY, relX);
  const gradAngle = (angleRad * 180) / Math.PI + 90;

  // 计算归一化向量
  const dist = Math.sqrt(relX * relX + relY * relY) || 1;
  const normX = relX / dist;
  const normY = relY / dist;

  // 高光和内阴影偏移
  const highlightX = normX * insetStrength;
  const highlightY = normY * insetStrength;
  const shadowInsetX = -normX * insetStrength;
  const shadowInsetY = -normY * insetStrength;

  return { gradAngle, highlightX, highlightY, shadowInsetX, shadowInsetY };
}

/**
 * 判断纸条吐出方向
 * @param positionX 当前X坐标
 * @returns 'left' | 'right'
 */
export function getPaperDirection(positionX: number): 'left' | 'right' {
  return positionX > window.innerWidth / 2 ? 'left' : 'right';
}

/**
 * 计算纸条旋转方向
 * @param direction 纸条方向
 * @returns 旋转角度
 */
export function getRotateDirection(direction: 'left' | 'right'): number {
  return direction === 'left' ? 90 : -90;
}
