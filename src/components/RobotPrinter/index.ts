/**
 * RobotPrinter 组件库
 *
 * 一个可交互的机器人打印机 UI 组件，支持动画、拖拽、主题切换等功能。
 *
 * @packageDocumentation
 *
 * @example 基本用法
 * ```tsx
 * import { RobotPrinter } from '@/components/RobotPrinter';
 *
 * function App() {
 *   return (
 *     <RobotPrinter
 *       placeholder="请输入内容"
 *       onSubmit={(value) => console.log(value)}
 *     />
 *   );
 * }
 * ```
 *
 * @example 复合组件模式
 * ```tsx
 * import { RobotPrinter } from '@/components/RobotPrinter';
 *
 * function App() {
 *   return (
 *     <RobotPrinter.Root styleMode="glass">
 *       <RobotPrinter.Head />
 *       <RobotPrinter.Paper />
 *       <RobotPrinter.Actions />
 *     </RobotPrinter.Root>
 *   );
 * }
 * ```
 */

// ============ 主组件导出 ============
import { RobotPrinter as RobotPrinterMain } from './RobotPrinter';
import { RobotPrinterRoot } from './RobotPrinterRoot';
import { RobotHead } from './robot';
import { Paper } from './Paper';
import { ResultPanel } from './ResultPanel';
import { ActionMenu } from './menus';
import { InfoBar } from './InfoBar';

// ============ 复合组件对象 ============
export const RobotPrinter = Object.assign(RobotPrinterMain, {
  // 复合组件子组件
  Root: RobotPrinterRoot,
  Head: RobotHead,
  Paper: Paper,
  ResultPanel: ResultPanel,
  Actions: ActionMenu,
  InfoBar: InfoBar,
});

// ============ 保持原有独立导出（向后兼容）============
export { RobotHead, Eyes, Antenna } from './robot';
export { Paper } from './Paper';
export { ResultPanel } from './ResultPanel';
export { ActionMenu, ActionButton } from './menus';
export { InfoBar } from './InfoBar';
export { RobotPrinterRoot } from './RobotPrinterRoot';

// ============ Context Hook 导出（高级用法）============
export { RobotPrinterProvider } from './context/RobotPrinterContext';
export { useRobotPrinter, useRobotPrinterOptional } from './context/useRobotPrinter';

// ============ 类型导出 ============
export type {
  RobotPrinterProps,
  Position,
  EyeMode,
  StyleMode,
  Placement,
  Direction,
  ActionConfig,
  BuiltinActionType,
  ResultPanelConfig,
  ResultPanelSource,
  AnimationPhase,
} from './types';

export type { ActionConfig as ActionConfigType } from './menus';
export type { ResultPanelConfig as ResultPanelConfigType } from './ResultPanel';

// ============ Hooks 导出 ============
export {
  useDrag,
  useAnimationPhase,
  useAnimationMachine,
  useIdleDetection,
  useTilt,
} from './hooks';
export type {
  AnimationEvent,
  UseAnimationMachineOptions,
  UseAnimationMachineReturn,
} from './hooks';

// ============ 工具函数导出 ============
export {
  calculateTilt,
  calculateShadow,
  calculateInnerLighting,
  getPaperDirection,
  getRotateDirection,
} from './utils';

// ============ 常量导出 ============
export { ANIMATION, LAYOUT, COLORS, DEFAULTS } from './constants';

// ============ 默认值导出 ============
export {
  robotPrinterDefaults,
  paperDefaults,
  resultPanelDefaults,
  robotHeadDefaults,
  DEFAULT_EYE_MODE,
  mergeWithDefaults,
} from './defaults';

// ============ 预设导出 ============
export {
  compactPreset,
  widePreset,
  chatPreset,
  darkPreset,
  demoPreset,
  minimalPreset,
  floatingPreset,
  loadingPreset,
  allPresets,
  type PresetName,
} from './presets';

// ============ 错误边界导出 ============
export { RobotPrinterErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary';
