import { useState, memo, useCallback } from 'react';
import { toast } from 'sonner';

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
const SubActionButton = memo(function SubActionButton({
  action,
  inputValue,
}: {
  action: ActionConfig;
  inputValue: string;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (action.onClick) {
        action.onClick(inputValue);
      } else {
        // 无功能时显示 toast 提示
        toast.info('请实现此功能', {
          description: `给 "${action.label}" 按钮添加 onClick 回调即可`,
          duration: 3000,
        });
      }
    },
    [action, inputValue]
  );

  return (
    <button className="submenu-btn" onClick={handleClick} disabled={action.disabled}>
      {action.label}
    </button>
  );
});

/**
 * 单个操作按钮组件
 * 支持悬停展开子菜单，以及无功能时的 toast 提示
 */
export const ActionButton = memo(function ActionButton({ action, inputValue }: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasSubActions = action.subActions && action.subActions.length > 0;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // 有子菜单时点击不触发，只悬停展开
      if (!hasSubActions) {
        if (action.onClick) {
          action.onClick(inputValue);
        } else {
          // 无功能时显示 toast 提示
          toast.info('请实现此功能', {
            description: `给 "${action.label}" 按钮添加 onClick 回调即可`,
            duration: 3000,
          });
        }
      }
    },
    [hasSubActions, action, inputValue]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      className="action-btn-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`action-btn ${hasSubActions ? 'has-submenu' : ''}`}
        onClick={handleClick}
        disabled={action.disabled}
      >
        {action.label}
        {hasSubActions && (
          <span className="submenu-indicator">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </button>

      {/* 二级子菜单 */}
      {hasSubActions && isHovered && (
        <div className="submenu">
          {action.subActions!.map((subAction, subIndex) => (
            <SubActionButton key={subIndex} action={subAction} inputValue={inputValue} />
          ))}
        </div>
      )}
    </div>
  );
});
