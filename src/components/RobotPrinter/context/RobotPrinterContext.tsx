/* eslint-disable react-refresh/only-export-components -- Context 需要和 Provider 一起导出 */
import { createContext, useState, useCallback, useMemo, type ReactNode } from 'react';

import type { Position, EyeMode, StyleMode, ActionConfig, ResultPanelConfig } from '../types';
import { DEFAULTS, ANIMATION, LAYOUT } from '../constants';

// ============ Context 值类型定义 ============

export interface RobotPrinterContextValue {
  // 状态
  expanded: boolean;
  loading: boolean;
  inputValue: string;
  position: Position;
  isDark: boolean;
  styleMode: StyleMode;
  eyeMode: EyeMode;
  delay: number;
  isSleeping: boolean;

  // 配置
  paperWidth: number;
  placeholder: string;
  actions: ActionConfig[];
  resultPanel: ResultPanelConfig | undefined;

  // 动画参数
  rotateDuration: number;
  paperDuration: number;

  // 操作方法
  setExpanded: (expanded: boolean) => void;
  setInputValue: (value: string) => void;
  setPosition: (pos: Position) => void;
  submit: () => void;
  abort: () => void;
}

// ============ 创建 Context ============

export const RobotPrinterContext = createContext<RobotPrinterContextValue | null>(null);

// ============ Provider Props ============

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
