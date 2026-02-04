/* eslint-disable react-refresh/only-export-components -- Context 需要和 Provider 一起导出 */
/**
 * RobotPrinter Context
 *
 * 提供组件间状态共享的 Context，用于复合组件模式。
 *
 * @example
 * ```tsx
 * import { RobotPrinterProvider, useRobotPrinter } from './context';
 *
 * function Child() {
 *   const { expanded, setExpanded } = useRobotPrinter();
 *   return <button onClick={() => setExpanded(!expanded)}>Toggle</button>;
 * }
 *
 * function App() {
 *   return (
 *     <RobotPrinterProvider>
 *       <Child />
 *     </RobotPrinterProvider>
 *   );
 * }
 * ```
 */
import { createContext, useState, useCallback, useMemo, type ReactNode } from 'react';

import type { Position, EyeMode, StyleMode, ActionConfig, ResultPanelConfig } from '../types';
import { DEFAULTS, ANIMATION, LAYOUT } from '../constants';

// ============ Context 值类型定义 ============

/**
 * RobotPrinter Context 值类型
 * 包含所有共享状态、配置和操作方法
 */
export interface RobotPrinterContextValue {
  // 状态
  /** 是否展开 */
  expanded: boolean;
  /** 是否加载中 */
  loading: boolean;
  /** 输入框的值 */
  inputValue: string;
  /** 当前位置 */
  position: Position;
  /** 是否深色模式 */
  isDark: boolean;
  /** 样式模式 */
  styleMode: StyleMode;
  /** 眼睛模式 */
  eyeMode: EyeMode;
  /** 频率限制延迟 */
  delay: number;
  /** 是否睡眠 */
  isSleeping: boolean;

  // 配置
  /** 纸条宽度 */
  paperWidth: number;
  /** 占位符文本 */
  placeholder: string;
  /** 操作按钮配置 */
  actions: ActionConfig[];
  /** 结果面板配置 */
  resultPanel: ResultPanelConfig | undefined;

  // 动画参数
  /** 旋转动画时长 */
  rotateDuration: number;
  /** 纸条动画时长 */
  paperDuration: number;

  // 操作方法
  /** 设置展开状态 */
  setExpanded: (expanded: boolean) => void;
  /** 设置输入值 */
  setInputValue: (value: string) => void;
  /** 设置位置 */
  setPosition: (pos: Position) => void;
  /** 提交 */
  submit: () => void;
  /** 中止 */
  abort: () => void;
}

// ============ 创建 Context ============

export const RobotPrinterContext = createContext<RobotPrinterContextValue | null>(null);

// ============ Provider Props ============

/**
 * RobotPrinterProvider Props
 */
export interface RobotPrinterProviderProps {
  children: ReactNode;
  // 初始值 props
  defaultExpanded?: boolean;
  defaultValue?: string;
  defaultPosition?: Position;
  // 配置 props
  paperWidth?: number;
  placeholder?: string;
  styleMode?: StyleMode;
  isDark?: boolean;
  loading?: boolean;
  delay?: number;
  eyeMode?: EyeMode;
  actions?: ActionConfig[];
  resultPanel?: ResultPanelConfig;
  rotateDuration?: number;
  paperDuration?: number;
  // 回调 props
  onExpandedChange?: (expanded: boolean) => void;
  onValueChange?: (value: string) => void;
  onPositionChange?: (pos: Position) => void;
  onSubmit?: (value: string) => void;
  onAbort?: () => void;
}

// ============ Provider 组件 ============

export function RobotPrinterProvider({
  children,
  defaultExpanded = false,
  defaultValue = '',
  defaultPosition,
  paperWidth = LAYOUT.DEFAULT_PAPER_WIDTH,
  placeholder = DEFAULTS.PLACEHOLDER,
  styleMode = 'default',
  isDark = false,
  loading = false,
  delay = 0,
  eyeMode = { mode: 'normal', blinkInterval: [2000, 5000] },
  actions = [],
  resultPanel,
  rotateDuration = ANIMATION.ROTATE_DURATION,
  paperDuration = ANIMATION.PAPER_DURATION,
  onExpandedChange,
  onValueChange,
  onPositionChange,
  onSubmit,
  onAbort,
}: RobotPrinterProviderProps) {
  // 内部状态
  const [expanded, setExpandedState] = useState(defaultExpanded);
  const [inputValue, setInputValueState] = useState(defaultValue);
  const [position, setPositionState] = useState<Position>(
    defaultPosition ?? { x: window.innerWidth - 100, y: window.innerHeight - 100 }
  );
  const [isSleeping] = useState(isDark);

  // 状态更新（同时调用回调）
  const setExpanded = useCallback(
    (value: boolean) => {
      setExpandedState(value);
      onExpandedChange?.(value);
    },
    [onExpandedChange]
  );

  const setInputValue = useCallback(
    (value: string) => {
      setInputValueState(value);
      onValueChange?.(value);
    },
    [onValueChange]
  );

  const setPosition = useCallback(
    (pos: Position) => {
      setPositionState(pos);
      onPositionChange?.(pos);
    },
    [onPositionChange]
  );

  const submit = useCallback(() => {
    if (inputValue.trim()) {
      onSubmit?.(inputValue);
    }
  }, [inputValue, onSubmit]);

  const abort = useCallback(() => {
    onAbort?.();
  }, [onAbort]);

  // Memoize context value
  const contextValue = useMemo<RobotPrinterContextValue>(
    () => ({
      // 状态
      expanded,
      loading,
      inputValue,
      position,
      isDark,
      styleMode,
      eyeMode,
      delay,
      isSleeping,
      // 配置
      paperWidth,
      placeholder,
      actions,
      resultPanel,
      rotateDuration,
      paperDuration,
      // 方法
      setExpanded,
      setInputValue,
      setPosition,
      submit,
      abort,
    }),
    [
      expanded,
      loading,
      inputValue,
      position,
      isDark,
      styleMode,
      eyeMode,
      delay,
      isSleeping,
      paperWidth,
      placeholder,
      actions,
      resultPanel,
      rotateDuration,
      paperDuration,
      setExpanded,
      setInputValue,
      setPosition,
      submit,
      abort,
    ]
  );

  return (
    <RobotPrinterContext.Provider value={contextValue}>{children}</RobotPrinterContext.Provider>
  );
}
