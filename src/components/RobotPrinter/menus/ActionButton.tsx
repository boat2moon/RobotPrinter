import { useState } from 'react';
import type { ActionConfig } from './types';

interface ActionButtonProps {
  /** 按钮配置 */
  action: ActionConfig;
  /** 当前输入值 */
  inputValue: string;
}

/**
 * 单个操作按钮组件
 * 支持悬停展开子菜单
 */
export function ActionButton({
  action,
  inputValue,
}: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasSubActions = action.subActions && action.subActions.length > 0;

  return (
    <div 
      className="action-btn-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`action-btn ${hasSubActions ? 'has-submenu' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          // 有子菜单时点击不触发，只悬停展开
          if (!hasSubActions) {
            action.onClick?.(inputValue);
          }
        }}
        disabled={action.disabled}
      >
        {action.label}
        {hasSubActions && <span className="submenu-indicator">▾</span>}
      </button>
      
      {/* 二级子菜单 */}
      {hasSubActions && isHovered && (
        <div className="submenu">
          {action.subActions!.map((subAction, subIndex) => (
            <button
              key={subIndex}
              className="submenu-btn"
              onClick={(e) => {
                e.stopPropagation();
                subAction.onClick?.(inputValue);
              }}
              disabled={subAction.disabled}
            >
              {subAction.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
