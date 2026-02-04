import type { RobotPrinterProps } from './types';

/**
 * 紧凑模式预设
 *
 * 适用于空间有限的场景，减小尺寸和动画时间
 *
 * @example
 * ```tsx
 * import { RobotPrinter, compactPreset } from '@/components/RobotPrinter';
 *
 * <RobotPrinter {...compactPreset} onSubmit={handleSubmit} />
 * ```
 */
export const compactPreset: Partial<RobotPrinterProps> = {
  paperWidth: 350,
  rotateDuration: 300,
  paperDuration: 400,
  showHint: false,
  tiltStrength: 0.5,
  shadowStrength: 0.5,
};

/**
 * 宽屏模式预设
 *
 * 适用于大屏幕场景，更大的纸条宽度和更流畅的动画
 *
 * @example
 * ```tsx
 * import { RobotPrinter, widePreset } from '@/components/RobotPrinter';
 *
 * <RobotPrinter {...widePreset} onSubmit={handleSubmit} />
 * ```
 */
export const widePreset: Partial<RobotPrinterProps> = {
  paperWidth: 700,
  rotateDuration: 500,
  paperDuration: 700,
  tiltStrength: 1.2,
};

/**
 * AI 聊天预设
 *
 * 适用于 AI 对话场景，玻璃态风格配合聊天占位符
 *
 * @example
 * ```tsx
 * import { RobotPrinter, chatPreset } from '@/components/RobotPrinter';
 *
 * <RobotPrinter
 *   {...chatPreset}
 *   onSubmit={(value) => sendToAI(value)}
 *   resultPanel={aiResponse}
 * />
 * ```
 */
export const chatPreset: Partial<RobotPrinterProps> = {
  styleMode: 'glass',
  placeholder: '向 AI 提问...',
  showHint: true,
  paperWidth: 500,
  eyeMode: { mode: 'normal', blinkInterval: [3000, 6000] },
};

/**
 * 深色主题预设
 *
 * 适用于深色背景的页面，自动启用深色模式和玻璃态
 *
 * @example
 * ```tsx
 * import { RobotPrinter, darkPreset } from '@/components/RobotPrinter';
 *
 * <div style={{ background: '#1a1a2e' }}>
 *   <RobotPrinter {...darkPreset} onSubmit={handleSubmit} />
 * </div>
 * ```
 */
export const darkPreset: Partial<RobotPrinterProps> = {
  isDark: true,
  styleMode: 'glass',
  antennaBallColor: ['#6366f1', '#8b5cf6', '#a855f7'],
  tiltStrength: 1,
  shadowStrength: 0.8,
};

/**
 * 演示/展示预设
 *
 * 适用于产品演示场景，动画更慢更明显，方便观察效果
 *
 * @example
 * ```tsx
 * import { RobotPrinter, demoPreset } from '@/components/RobotPrinter';
 *
 * <RobotPrinter {...demoPreset} />
 * ```
 */
export const demoPreset: Partial<RobotPrinterProps> = {
  paperWidth: 550,
  rotateDuration: 800,
  paperDuration: 1000,
  tiltStrength: 1.5,
  shadowStrength: 1.5,
  styleMode: 'glass',
  showHint: true,
  placeholder: '试试输入点什么...',
};

/**
 * 极简模式预设
 *
 * 禁用大部分视觉效果，适用于需要简洁外观的场景
 *
 * @example
 * ```tsx
 * import { RobotPrinter, minimalPreset } from '@/components/RobotPrinter';
 *
 * <RobotPrinter {...minimalPreset} onSubmit={handleSubmit} />
 * ```
 */
export const minimalPreset: Partial<RobotPrinterProps> = {
  tiltStrength: 0,
  shadowStrength: 0,
  showHint: false,
  rotateDuration: 300,
  paperDuration: 400,
  antennaBallColor: '#888888',
};

/**
 * 可拖拽悬浮预设
 *
 * 适用于需要在页面上自由拖动的悬浮组件场景
 *
 * @example
 * ```tsx
 * import { RobotPrinter, floatingPreset } from '@/components/RobotPrinter';
 *
 * <RobotPrinter
 *   {...floatingPreset}
 *   defaultPosition={{ x: window.innerWidth - 100, y: 100 }}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export const floatingPreset: Partial<RobotPrinterProps> = {
  draggable: true,
  styleMode: 'glass',
  tiltStrength: 1,
  shadowStrength: 1,
  paperWidth: 450,
};

/**
 * 加载中状态预设
 *
 * 内置加载态配置，适用于等待响应的场景
 *
 * @example
 * ```tsx
 * import { RobotPrinter, loadingPreset } from '@/components/RobotPrinter';
 *
 * <RobotPrinter
 *   {...loadingPreset}
 *   loading={isWaitingResponse}
 *   expanded
 * />
 * ```
 */
export const loadingPreset: Partial<RobotPrinterProps> = {
  loading: true,
  eyeMode: { mode: 'loading' },
  antennaBallColor: '#4ade80',
  styleMode: 'glass',
};

/**
 * 所有预设的集合，方便遍历或动态选择
 */
export const allPresets = {
  compact: compactPreset,
  wide: widePreset,
  chat: chatPreset,
  dark: darkPreset,
  demo: demoPreset,
  minimal: minimalPreset,
  floating: floatingPreset,
  loading: loadingPreset,
} as const;

export type PresetName = keyof typeof allPresets;
