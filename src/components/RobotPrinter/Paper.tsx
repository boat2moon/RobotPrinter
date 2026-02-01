import React, { forwardRef } from 'react';

interface PaperProps {
  /** 是否展开 */
  isExpanded: boolean;
  /** 纸条宽度(px) */
  width?: number;
  /** 偏移量(px) - 根据方向决定是 left 还是 right */
  offset?: number;
  /** 吐纸方向 */
  direction?: 'left' | 'right';
  /** 输入框占位符 */
  placeholder?: string;
  /** 输入值 */
  value: string;
  /** 输入变化回调 */
  onChange: (value: string) => void;
  /** 回车键回调 */
  onSubmit?: () => void;
}

/**
 * 纸条组件
 * 支持向左或向右展开
 */
export const Paper = forwardRef<HTMLInputElement, PaperProps>(({
  isExpanded,
  width = 500,
  offset = 85,
  direction = 'left',
  placeholder = '输入记录...',
  value,
  onChange,
  onSubmit,
}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit?.();
    }
  };

  // 根据方向设置位置样式
  const positionStyle: React.CSSProperties = direction === 'left'
    ? { right: `${offset}px` }
    : { left: `${offset}px` };

  return (
    <div
      className={`paper ${isExpanded ? 'expanded' : 'collapsed'} direction-${direction}`}
      style={{ 
        '--paper-width': `${width}px`,
        ...positionStyle,
      } as React.CSSProperties}
    >
      <div className="paper-content">
        <input
          ref={ref}
          type="text"
          className="paper-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {/* 纸条装饰线 */}
      <div className="paper-lines">
        <div className="paper-line" />
        <div className="paper-line" />
      </div>
    </div>
  );
});

Paper.displayName = 'Paper';
