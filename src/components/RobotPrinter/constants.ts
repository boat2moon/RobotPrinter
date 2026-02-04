// ============ 动画相关常量 ============

export const ANIMATION = {
  /** 默认旋转动画时间 (ms) */
  ROTATE_DURATION: 400,
  /** 默认纸条展开动画时间 (ms) */
  PAPER_DURATION: 600,
  /** 嘴巴打开动画时间 (ms) */
  MOUTH_OPEN_DURATION: 300,
  /** 嘴巴关闭动画时间 (ms) */
  MOUTH_CLOSE_DURATION: 200,
  /** 空闲超时进入睡眠 (ms) */
  IDLE_TIMEOUT: 10_000,
  /** 抖动动画时间 (ms) */
  SHAKE_DURATION: 400,
} as const;

// ============ 布局相关常量 ============

export const LAYOUT = {
  /** 最大倾斜角度 (deg) */
  MAX_TILT_DEG: 12,
  /** 拖拽判定阈值 (px) */
  DRAG_THRESHOLD: 5,
  /** 默认纸条宽度 (px) */
  DEFAULT_PAPER_WIDTH: 500,
  /** 默认纸条偏移 (px) */
  DEFAULT_PAPER_OFFSET: 85,
  /** 最小阴影偏移 (px) */
  MIN_SHADOW_OFFSET: 4,
} as const;

// ============ 颜色相关常量 ============

export const COLORS = {
  /** 默认天线小球颜色 */
  ANTENNA_DEFAULT: ['#ff6b6b', '#e74c3c', '#c0392b'] as const,
  /** 加载态天线颜色 */
  ANTENNA_LOADING: '#4ade80',
} as const;

// ============ 默认值 ============

export const DEFAULTS = {
  /** 默认占位符 */
  PLACEHOLDER: '输入记录...',
  /** 默认倾斜强度 */
  TILT_STRENGTH: 1,
  /** 默认阴影强度 */
  SHADOW_STRENGTH: 1,
  /** 内阴影强度系数 */
  INSET_STRENGTH: 2,
} as const;
