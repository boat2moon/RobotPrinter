/**
 * @module RobotPrinter/utils
 * @description 工具函数集合
 * 提供几何计算、倾斜、阴影和方向判断功能
 */

export {
  calculateTilt,
  calculateShadow,
  calculateInnerLighting,
  getPaperDirection,
  getRotateDirection,
} from './geometry';

export {
  warnOnce,
  devAssert,
  warnDeprecated,
  warnControlledUncontrolled,
  clearWarnings,
} from './devWarnings';
