import type { ActionConfig } from './types';
import { ActionButton } from './ActionButton';

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
        <ActionButton
          key={index}
          action={action}
          inputValue={inputValue}
        />
      ))}
    </div>
  );
}
