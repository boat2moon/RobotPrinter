import { useState } from 'react';
import type { ActionConfig } from './types';

interface ActionButtonProps {
  /** 按钮配置 */
  action: ActionConfig;
  /** 当前输入值 */
  inputValue: string;
}

/**
 * 子菜单按钮组件
 * 独立出来以便管理每个按钮的提示状态
 */
function SubActionButton({ action, inputValue }: { action: ActionConfig, inputValue: string }) {
  const [showTip, setShowTip] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (action.onClick) {
      action.onClick(inputValue);
    } else {
      // 无功能时显示提示
      setShowTip(true);
      setTimeout(() => setShowTip(false), 1500);
    }
  };

  return (
    <button
      className="submenu-btn"
      onClick={handleClick}
      disabled={action.disabled}
    >
      {action.label}
      {showTip && <span className="action-tip">功能待实现</span>}
    </button>
  );
}

/**
 * 单个操作按钮组件
 * 支持悬停展开子菜单，以及无功能时的提示反馈
 */
export function ActionButton({
  action,
  inputValue,
}: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const hasSubActions = action.subActions && action.subActions.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 有子菜单时点击不触发，只悬停展开
    if (!hasSubActions) {
      if (action.onClick) {
        action.onClick(inputValue);
      } else {
        // 无功能时显示提示
        setShowTip(true);
        setTimeout(() => setShowTip(false), 1500);
      }
    }
  };

  return (
    <div 
      className="action-btn-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`action-btn ${hasSubActions ? 'has-submenu' : ''}`}
        onClick={handleClick}
        disabled={action.disabled}
      >
        {action.label}
        {hasSubActions && <span className="submenu-indicator">▾</span>}
      </button>
      
      {/* 主按钮的提示 */}
      {showTip && <span className="action-tip">功能待实现</span>}
      
      {/* 二级子菜单 */}
      {hasSubActions && isHovered && (
        <div className="submenu">
          {action.subActions!.map((subAction, subIndex) => (
            <SubActionButton
              key={subIndex}
              action={subAction}
              inputValue={inputValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}
