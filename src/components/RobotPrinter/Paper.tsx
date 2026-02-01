import React, { forwardRef } from 'react';

interface PaperProps {
  /** 是否展开 */
  isExpanded: boolean;
  /** 纸条宽度(px) */
  width?: number;
  /** 右侧偏移量(px) */
  rightOffset?: number;
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
 * 包含输入框和装饰线
 */
export const Paper = forwardRef<HTMLInputElement, PaperProps>(({
  isExpanded,
  width = 500,
  rightOffset = 85,
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

  return (
    <div
      className={`paper ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{ 
        '--paper-width': `${width}px`,
        right: `${rightOffset}px`
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
