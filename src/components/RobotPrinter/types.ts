import type { ReactNode, CSSProperties } from 'react';

// ============ 基础类型 ============

/** 位置类型 */
export interface Position {
  x: number;
  y: number;
}

/** 纸条吐出方向 */
export type Direction = 'left' | 'right';

/** 样式模式 */
export type StyleMode = 'default' | 'glass';

/** ResultPanel 放置位置 */
export type Placement = 'top' | 'bottom';

// ============ 眼睛模式联合类型 ============

/** 眼睛模式配置 */
export type EyeMode =
  | { mode: 'normal'; blinkInterval?: [min: number, max: number] }
  | { mode: 'loading' }
  | { mode: 'countdown' }
  | { mode: 'sleeping' };

// ============ 动画阶段 ============

/** 动画阶段枚举 */
export type AnimationPhase =
  | 'idle'
  | 'rotating'
  | 'mouth-opening'
  | 'paper-out'
  | 'expanded'
  | 'paper-in'
  | 'mouth-closing'
  | 'rotating-back';

// ============ 动作配置 ============

/** 动作按钮配置 */
export interface ActionConfig {
  /** 按钮显示文本 */
  label: string;
  /** 点击回调，参数为当前输入值 */
  onClick?: (value: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子菜单项 */
  subActions?: ActionConfig[];
  /** 图标 (可选) */
  icon?: ReactNode;
}

// ============ 结果面板配置 ============

/** 结果面板配置 */
export interface ResultPanelConfig {
  /** 是否可见 */
  visible: boolean;
  /** 内容 */
  content: string;
  /** 是否加载中 */
  loading: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 操作按钮 */
  actions?: ActionConfig[];
  /** 位置变化回调 */
  onPlacementChange?: (placement: Placement) => void;
  /** 默认位置 */
  defaultPlacement?: Placement;
}

// ============ 主组件 Props ============

/** RobotPrinter 主组件属性 */
export interface RobotPrinterProps {
  // 基础配置
  /** 输入框占位符文本 */
  placeholder?: string;
  /** 初始值 */
  defaultValue?: string;
  /** 纸条宽度(px) */
  paperWidth?: number;
  /** 是否显示提示文字，默认显示 */
  showHint?: boolean;

  // 动画时间
  /** 机器人旋转动画时间(毫秒) */
  rotateDuration?: number;
  /** 纸条展开动画时间(毫秒) */
  paperDuration?: number;

  // 外观
  /** 天线小球颜色，单色或渐变色数组 */
  antennaBallColor?: string | readonly string[];
  /** 倾斜强度 (0-1 或更大)，0=不倾斜，1=最大倾斜(12deg) */
  tiltStrength?: number;
  /** 阴影强度 (0-1 或更大)，控制动态阴影的偏移程度 */
  shadowStrength?: number;
  /** 样式模式 */
  styleMode?: StyleMode;
  /** 眼睛模式配置 */
  eyeMode?: EyeMode;

  // 状态控制
  /** 加载状态 */
  loading?: boolean;
  /** 频率限制倒计时（秒） */
  delay?: number;
  /** 外部控制展开状态（可选，传入则为受控模式） */
  expanded?: boolean;
  /** 是否深色模式 */
  isDark?: boolean;
  /** 触发高亮/抖动动画的信号 */
  highlightTrigger?: number;

  // 位置控制
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 默认位置 */
  defaultPosition?: Position;
  /** 外部控制位置（受控模式） */
  position?: Position;

  // 高级配置
  /** 拓展功能按钮配置 */
  actions?: ActionConfig[];
  /** 结果面板配置 */
  resultPanel?: ResultPanelConfig;
  /** 底部提示内容 */
  infoContent?: ReactNode;

  // 回调
  /** 输入值变化时的回调 */
  onValueChange?: (value: string) => void;
  /** 按下回车键时的回调 */
  onSubmit?: (value: string) => void;
  /** 中止请求回调 */
  onAbort?: () => void;
  /** 展开状态变化时的回调 */
  onExpandedChange?: (expanded: boolean) => void;
  /** 位置变化时的回调 */
  onPositionChange?: (position: Position) => void;
}

// ============ 样式相关类型 ============

/** 容器样式变量 */
export interface ContainerCSSVariables extends CSSProperties {
  '--rotate-duration': string;
  '--paper-duration': string;
  '--tilt-x': string;
  '--tilt-y': string;
  '--rotate-direction': string;
  '--shadow-x': string;
  '--shadow-y': string;
  '--grad-angle': string;
  '--highlight-x': string;
  '--highlight-y': string;
  '--shadow-inset-x': string;
  '--shadow-inset-y': string;
}
