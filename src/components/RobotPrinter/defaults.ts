/**
 * RobotPrinter Props 默认值管理
 * 集中定义所有组件的默认配置，便于维护和覆盖
 */

import type { RobotPrinterProps, EyeMode } from './types';
import { ANIMATION, LAYOUT, DEFAULTS, COLORS } from './constants';

// ============ 默认眼睛模式 ============

export const DEFAULT_EYE_MODE: EyeMode = {
  mode: 'normal',
  blinkInterval: [2000, 5000],
};

// ============ RobotPrinter 默认 Props ============

/**
 * RobotPrinter 组件的默认属性值
 * 使用 satisfies 确保类型安全
 */
export const robotPrinterDefaults = {
  // 基础配置
  placeholder: DEFAULTS.PLACEHOLDER,
  defaultValue: '',
  paperWidth: LAYOUT.DEFAULT_PAPER_WIDTH,
  showHint: true,

  // 动画时间
  rotateDuration: ANIMATION.ROTATE_DURATION,
  paperDuration: ANIMATION.PAPER_DURATION,

  // 外观
  antennaBallColor: COLORS.ANTENNA_DEFAULT,
  tiltStrength: DEFAULTS.TILT_STRENGTH,
  shadowStrength: DEFAULTS.SHADOW_STRENGTH,
  styleMode: 'default' as const,
  eyeMode: DEFAULT_EYE_MODE,

  // 状态控制
  loading: false,
  delay: 0,
  isDark: false,
  highlightTrigger: 0,

  // 位置控制
  draggable: false,

  // 高级配置
  actions: [],
} satisfies Partial<RobotPrinterProps>;

// ============ 子组件默认值 ============

/** Paper 组件默认值 */
export const paperDefaults = {
  width: LAYOUT.DEFAULT_PAPER_WIDTH,
  offset: LAYOUT.DEFAULT_PAPER_OFFSET,
  direction: 'left' as const,
  placeholder: DEFAULTS.PLACEHOLDER,
  loading: false,
};

/** ResultPanel 组件默认值 */
export const resultPanelDefaults = {
  styleMode: 'default' as const,
  isDark: false,
  defaultPlacement: 'top' as const,
};

/** RobotHead 组件默认值 */
export const robotHeadDefaults = {
  eyeMode: 'normal' as const,
  blinkInterval: [2000, 5000] as [number, number],
  loading: false,
  rotateDirection: 90,
};

// ============ 工具函数 ============

/**
 * 合并 props 与默认值
 * @param props - 用户传入的 props
 * @param defaults - 默认值对象
 * @returns 合并后的 props
 */
export function mergeWithDefaults<T extends Record<string, unknown>>(
  props: Partial<T>,
  defaults: Partial<T>
): T {
  return { ...defaults, ...props } as T;
}
