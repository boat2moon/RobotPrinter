import React from 'react';
import type { ActionConfig } from './menus';

/** 结果面板配置 */
export interface ResultPanelConfig {
  /** 是否显示面板 */
  visible: boolean;
  /** 面板内容（支持流式更新） */
  content: string;
  /** 是否加载中 */
  loading: boolean;
  /** 关闭面板回调 */
  onClose: () => void;
  /** 面板操作按钮 */
  actions?: ActionConfig[];
}

interface ResultPanelProps extends ResultPanelConfig {
  /** 当前输入值 */
  inputValue: string;
  /** 吐纸方向 */
  direction: 'left' | 'right';
  /** 位置偏移 */
  offset: number;
  /** 纸条宽度 */
  paperWidth: number;
}

/**
 * 结果面板组件
 * 显示在纸条上方，用于展示 AI 处理结果
 */
export function ResultPanel({
  visible,
  content,
  loading,
  onClose,
  actions = [],
  inputValue,
  direction,
  offset,
  paperWidth,
}: ResultPanelProps) {
  if (!visible) {
    return null;
  }

  // 面板与纸条同宽，从偏移位置开始
  const positionStyle: React.CSSProperties = {
    [direction === 'left' ? 'right' : 'left']: `${offset}px`,
    width: `${paperWidth}px`,
  };

  // 按换行符拆分内容，用于分段显示
  const contentLines = content.split('\n').filter(line => line.trim() !== '');

  return (
    <div 
      className={`result-panel direction-${direction}`}
      style={positionStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 关闭按钮 */}
      <button 
        className="result-panel-close"
        onClick={onClose}
        title="关闭"
      >
        ✕
      </button>

      {/* 内容区域 */}
      <div className="result-panel-content">
        {/* 加载提示 */}
        {loading && !content && (
          <div className="result-panel-loading">
            <span className="loading-dots">AI 生成中</span>
          </div>
        )}

        {/* 分段显示内容 */}
        {contentLines.map((line, index) => (
          <p key={index} className="result-panel-line">
            {line}
          </p>
        ))}

        {/* 加载中的光标效果 */}
        {loading && content && (
          <span className="typing-cursor">▋</span>
        )}
      </div>

      {/* 操作按钮区域 */}
      {actions.length > 0 && !loading && (
        <div className="result-panel-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className="result-panel-btn"
              onClick={() => action.onClick?.(inputValue)}
              disabled={action.disabled}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
