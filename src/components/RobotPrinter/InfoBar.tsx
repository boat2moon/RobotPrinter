import React from 'react';

interface InfoBarProps {
  /** 底部提示内容 */
  children: React.ReactNode;
  /** 吐纸方向 */
  direction: 'left' | 'right';
  /** 位置偏移 */
  offset: number;
  /** 纸条宽度 */
  paperWidth: number;
  /** 是否可见 */
  isVisible: boolean;
}

/**
 * 底部提示信息组件
 * 显示在纸条下方，用于显示 Token 剩余、免责声明等信息
 */
export function InfoBar({
  children,
  direction,
  offset,
  paperWidth,
  isVisible,
}: InfoBarProps) {
  if (!isVisible || !children) {
    return null;
  }

  // 与纸条同宽，从偏移位置开始
  const positionStyle: React.CSSProperties = {
    [direction === 'left' ? 'right' : 'left']: `${offset}px`,
    width: `${paperWidth}px`,
  };

  return (
    <div 
      className={`info-bar direction-${direction}`}
      style={positionStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
