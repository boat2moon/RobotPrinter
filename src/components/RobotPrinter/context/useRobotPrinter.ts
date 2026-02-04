import { useContext } from 'react';

import { RobotPrinterContext, type RobotPrinterContextValue } from './RobotPrinterContext';

/**
 * 获取 RobotPrinter 上下文
 * 必须在 RobotPrinter.Root 组件内使用
 */
export function useRobotPrinter(): RobotPrinterContextValue {
  const context = useContext(RobotPrinterContext);
  if (!context) {
    throw new Error(
      'useRobotPrinter must be used within a RobotPrinter.Root component. ' +
        'Did you forget to wrap your component tree?'
    );
  }
  return context;
}

/**
 * 可选地获取 RobotPrinter 上下文
 * 在 Context 外使用时返回 null，不抛错
 */
export function useRobotPrinterOptional(): RobotPrinterContextValue | null {
  return useContext(RobotPrinterContext);
}
