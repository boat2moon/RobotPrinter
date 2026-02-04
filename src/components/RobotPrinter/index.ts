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
  ResultPanelConfig,
  AnimationPhase,
} from './types';

export type { ActionConfig as ActionConfigType } from './menus';
export type { ResultPanelConfig as ResultPanelConfigType } from './ResultPanel';

// ============ Hooks 导出 ============
export { useDrag, useAnimationPhase, useIdleDetection, useTilt } from './hooks';

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
