import React, { forwardRef, useState } from 'react';

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
  /** 加载状态（禁用输入） */
  loading?: boolean;
}

/**
 * 纸条组件
 * 支持向左或向右展开
 * 注：加载状态、中止按钮、倒计时已移至机器人头部（眼睛/天线）
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
  loading = false,
}, ref) => {
  /**
   * 中文输入法 composition 状态
   * 解决拼音输入法回车误触发请求的问题
   */
  const [composition, setComposition] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      // 如果正在输入法组合中（如拼音输入），不触发请求
      if (composition) return;
      // 加载中不重复提交
      if (loading) return;
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
      // 阻止点击冒泡，避免触发机器人收拢
      onClick={(e) => e.stopPropagation()}
    >
      {/* 打孔装饰 */}
      <div className={`paper-holes ${direction === 'right' ? 'right' : 'left'}`}>
        <div className="paper-hole" />
        <div className="paper-hole" />
        <div className="paper-hole" />
      </div>
      
      <div className="paper-content">
        <input
          ref={ref}
          type="text"
          className="paper-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setComposition(true)}
          onCompositionEnd={() => setComposition(false)}
          disabled={loading}
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
