import type { CSSProperties } from 'react';
import clsx from 'clsx';

import {
  RobotPrinterProvider,
  type RobotPrinterProviderProps,
} from './context/RobotPrinterContext';
import './styles/index.css';

export interface RobotPrinterRootProps extends RobotPrinterProviderProps {
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 自定义样式 */
  style?: CSSProperties;
}

/**
 * RobotPrinter 根容器组件
 * 用于复合组件模式，提供 Context Provider
 */
export function RobotPrinterRoot({
  children,
  className,
  draggable = false,
  style,
  ...providerProps
}: RobotPrinterRootProps) {
  const rootClassName = clsx(
    'robot-printer',
    {
      draggable: draggable,
      'glass-mode': providerProps.styleMode === 'glass',
    },
    className
  );

  return (
    <RobotPrinterProvider {...providerProps}>
      <div className={rootClassName} style={style}>
        {children}
      </div>
    </RobotPrinterProvider>
  );
}

RobotPrinterRoot.displayName = 'RobotPrinter.Root';
