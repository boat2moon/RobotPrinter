import React from 'react';

/** 拓展功能按钮配置 */
export interface ActionConfig {
  /** 按钮文本 */
  label: string;
  /** 点击回调，参数为当前输入值（可选，留空则只显示按钮不执行操作） */
  onClick?: (value: string) => void;
  /** 是否禁用（可选） */
  disabled?: boolean;
}

interface ActionMenuProps {
  /** 按钮配置列表 */
  actions: ActionConfig[];
  /** 当前输入值 */
  inputValue: string;
  /** 是否可见 */
  isVisible: boolean;
  /** 吐纸方向 */
  direction: 'left' | 'right';
  /** 位置偏移 */
  offset: number;
  /** 纸条宽度 */
  paperWidth: number;
}

/**
 * 拓展功能菜单组件
 * 显示在纸条上方居中位置
 */
export function ActionMenu({
  actions,
  inputValue,
  isVisible,
  direction,
  offset,
  paperWidth,
}: ActionMenuProps) {
  if (!isVisible || actions.length === 0) {
    return null;
  }

  // 菜单与纸条同宽，从偏移位置开始
  const positionStyle: React.CSSProperties = {
    [direction === 'left' ? 'right' : 'left']: `${offset}px`,
    width: `${paperWidth}px`,
  };

  return (
    <div 
      className={`action-menu direction-${direction}`}
      style={positionStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          className="action-btn"
          onClick={(e) => {
            e.stopPropagation();
            action.onClick?.(inputValue);
          }}
          disabled={action.disabled}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
