import React, { useState, useRef, useCallback, useEffect, forwardRef } from 'react';
import clsx from 'clsx';

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
  /** 位置变更回调 */
  onPlacementChange?: (placement: 'top' | 'bottom') => void;
  /** 默认初始位置 */
  defaultPlacement?: 'top' | 'bottom';
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
  /** 样式模式 */
  styleMode?: 'default' | 'glass';
  /** 是否深色模式 */
  isDark?: boolean;
}

/**
 * 结果面板组件
 * 显示在纸条上方，用于展示 AI 处理结果
 */
// ==========================================
// 🔧 配置区域：在此调整 ResultPanel 布局参数
// ==========================================

// --- Glass 模式参数 ---
// 垂直间距 (距离中心线)
const GLASS_GAP_TOP = 35;
const GLASS_GAP_BOTTOM = 40;
// 水平偏移
const GLASS_OFFSET_LEFT = 30; // 机器人在右 (direction=left)
const GLASS_OFFSET_RIGHT = 30; // 机器人在左 (direction=right)

// --- Default 模式参数 ---
// 垂直间距 (距离中心线)
const DEFAULT_GAP_TOP = 65;
const DEFAULT_GAP_BOTTOM = 65;
// 水平偏移
const DEFAULT_OFFSET_LEFT = 0; // 机器人在右
const DEFAULT_OFFSET_RIGHT = 0; // 机器人在左

// ==========================================

export const ResultPanel = forwardRef<HTMLDivElement, ResultPanelProps>(function ResultPanel(
  {
    visible,
    content,
    loading,
    onClose,
    actions = [],
    inputValue,
    direction,
    offset,
    paperWidth,
    styleMode = 'default',
    isDark = false,
    onPlacementChange,
    defaultPlacement = 'top',
  },
  ref
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const panelRef = (ref as React.RefObject<HTMLDivElement | null>) || internalRef;
  const [placement, setPlacement] = useState<'top' | 'bottom'>(defaultPlacement);

  // 检查位置和遮挡
  const checkPosition = useCallback(() => {
    if (!panelRef.current) return;

    // 1. 获取面板尺寸
    const panelRect = panelRef.current.getBoundingClientRect();
    const panelHeight = panelRect.height || 200; // 默认估算高度

    // 2. 获取基准点（RobotPrinter 也就是父容器的位置）
    // 注意：ResultPanel 是 absolute 定位，父容器是 relative/fixed (RobotPrinter)
    // 我们可以直接获取父级元素的位置
    const parentElement = panelRef.current.parentElement;
    if (!parentElement) return;

    const parentRect = parentElement.getBoundingClientRect();
    // 纸条中心在父容器垂直中心
    const centerY = parentRect.top + parentRect.height / 2;

    // 3. 定义候选位置区域 (ViewPort Coordinates)
    // Top: 纸条中心上方 75px 起 (margin-bottom)
    const topCandidate = {
      top: centerY - 75 - panelHeight,
      bottom: centerY - 75,
      left: panelRect.left,
      right: panelRect.right,
    };

    // Bottom: 纸条中心下方 75px 起 (margin-top)
    const bottomCandidate = {
      top: centerY + 75,
      bottom: centerY + 75 + panelHeight,
      left: panelRect.left,
      right: panelRect.right,
    };

    // 4. 获取干扰物 (ReferenceBox)
    const referenceBox = document.querySelector('.reference-box');
    let obstacleRect: DOMRect | null = null;
    if (referenceBox) {
      obstacleRect = referenceBox.getBoundingClientRect();
    }

    // 5. 碰撞检测函数
    const hasCollision = (rect: typeof topCandidate) => {
      // 视口边界检测
      if (rect.top < 0) return true; // 超出顶部
      if (rect.bottom > window.innerHeight) return true; // 超出底部

      // 障碍物遮挡检测
      if (obstacleRect) {
        const intersectX = Math.max(
          0,
          Math.min(rect.right, obstacleRect.right) - Math.max(rect.left, obstacleRect.left)
        );
        const intersectY = Math.max(
          0,
          Math.min(rect.bottom, obstacleRect.bottom) - Math.max(rect.top, obstacleRect.top)
        );
        if (intersectX > 0 && intersectY > 0) return true; // 有重叠
      }

      return false;
    };

    // 6. 决策逻辑
    let newPlacement: 'top' | 'bottom' = 'top';

    // 优先尝试 Top (默认)
    // 如果 Top 没遮挡 或者 (Top有遮挡 且 Bottom也有遮挡 且 Top空间更大)
    // 则保持 Top
    const topSafe = !hasCollision(topCandidate);
    const bottomSafe = !hasCollision(bottomCandidate);

    if (topSafe) {
      newPlacement = 'top';
    } else if (bottomSafe) {
      newPlacement = 'bottom';
    } else {
      // 都有遮挡，谁空间大选谁
      // 简单判断视口空间：上方空间 vs 下方空间
      const topSpace = centerY;
      const bottomSpace = window.innerHeight - centerY;
      newPlacement = topSpace >= bottomSpace ? 'top' : 'bottom';
    }

    if (newPlacement !== placement) {
      setPlacement(newPlacement);
      onPlacementChange?.(newPlacement);
    }
  }, [panelRef, placement, onPlacementChange]);

  // 监听 update 和 轮询检测
  useEffect(() => {
    if (!visible) return;

    // 立即检测一次
    checkPosition();

    // 轮询检测 (应对 ReferenceBox 拖拽)
    const timer = setInterval(checkPosition, 300);

    // 窗口 Resize 也要检测
    window.addEventListener('resize', checkPosition);
    window.addEventListener('scroll', checkPosition);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkPosition);
      window.removeEventListener('scroll', checkPosition);
    };
  }, [visible, checkPosition, content]); // content 变化会导致高度变化，需重新计算

  if (!visible) {
    return null;
  }

  const effectivePlacement = placement;

  // 根据模式选择对应的配置参数
  const isGlass = styleMode === 'glass';
  const currentGapTop = isGlass ? GLASS_GAP_TOP : DEFAULT_GAP_TOP;
  const currentGapBottom = isGlass ? GLASS_GAP_BOTTOM : DEFAULT_GAP_BOTTOM;
  const currentOffsetLeft = isGlass ? GLASS_OFFSET_LEFT : DEFAULT_OFFSET_LEFT;
  const currentOffsetRight = isGlass ? GLASS_OFFSET_RIGHT : DEFAULT_OFFSET_RIGHT;

  // 计算当前的水平偏移
  const extraOffset = direction === 'left' ? currentOffsetLeft : currentOffsetRight;

  // 面板位置样式
  const positionStyle: React.CSSProperties = {
    // 基础偏移 + 这里的额外微调
    [direction === 'left' ? 'right' : 'left']: `${offset + extraOffset}px`,
    width: `${paperWidth - extraOffset}px`,

    // 动态决定垂直位置
    ...(effectivePlacement === 'top'
      ? { bottom: `calc(50% + ${currentGapTop}px)` }
      : { top: `calc(50% + ${currentGapBottom}px)` }),
  };

  // 按换行符拆分内容，用于分段显示
  const contentLines = content.split('\n').filter(line => line.trim() !== '');

  return (
    <div
      ref={panelRef}
      className={clsx(
        'result-panel',
        `direction-${direction}`,
        effectivePlacement,
        { 'glass-mode': styleMode === 'glass' },
        { dark: isDark }
      )}
      style={positionStyle}
      onClick={e => e.stopPropagation()}
    >
      {/* 关闭按钮 */}
      <button className="result-panel-close" onClick={onClose} title="关闭">
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
        {loading && content && <span className="typing-cursor">▋</span>}
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
});
