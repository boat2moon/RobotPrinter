import { useState, useRef, useCallback, useEffect } from 'react';

import type { Position } from '../types';
import { LAYOUT } from '../constants';

interface UseDragOptions {
  /** 初始位置 */
  initialPosition: Position;
  /** 是否启用拖拽 */
  enabled?: boolean;
  /** 位置变化回调 */
  onPositionChange?: (pos: Position) => void;
  /** 点击回调（拖拽距离小于阈值时触发） */
  onClick?: () => void;
  /** 拖拽阈值 */
  dragThreshold?: number;
}

interface UseDragReturn {
  /** 当前位置 */
  position: Position;
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 手动设置位置 */
  setPosition: (pos: Position) => void;
  /** 鼠标按下事件处理器 */
  handleMouseDown: (e: React.MouseEvent) => void;
}

/**
 * 拖拽逻辑 Hook
 * 支持区分点击和拖拽操作
 */
export function useDrag({
  initialPosition,
  enabled = true,
  onPositionChange,
  onClick,
  dragThreshold = LAYOUT.DRAG_THRESHOLD,
}: UseDragOptions): UseDragReturn {
  const [position, setPositionState] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    posX: number;
    posY: number;
  } | null>(null);

  // 设置位置（同时调用回调）
  const setPosition = useCallback(
    (pos: Position) => {
      setPositionState(pos);
      onPositionChange?.(pos);
    },
    [onPositionChange]
  );

  // 鼠标按下
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;

      // 如果点击的是纸条、菜单、结果面板或信息栏区域，不触发拖拽
      const target = e.target as HTMLElement;
      if (
        target.closest('.paper') ||
        target.closest('.action-menu') ||
        target.closest('.result-panel') ||
        target.closest('.info-bar')
      ) {
        return;
      }

      e.preventDefault();
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y,
      };
      setIsDragging(true);
    },
    [enabled, position]
  );

  // 拖拽移动和结束
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const newPos = {
        x: dragStartRef.current.posX + deltaX,
        y: dragStartRef.current.posY + deltaY,
      };

      setPosition(newPos);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 如果移动距离小于阈值，视为点击
      if (distance < dragThreshold) {
        dragStartRef.current = null;
        setIsDragging(false);
        onClick?.();
        return;
      }

      // 延迟清除拖拽状态，防止触发 onClick
      setTimeout(() => {
        dragStartRef.current = null;
      }, 10);
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onClick, dragThreshold, setPosition]);

  return {
    position,
    isDragging,
    setPosition,
    handleMouseDown,
  };
}
