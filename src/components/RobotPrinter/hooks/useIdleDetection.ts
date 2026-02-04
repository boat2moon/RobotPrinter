import { useState, useCallback, useEffect, useRef } from 'react';

import { ANIMATION } from '../constants';

interface UseIdleDetectionOptions {
  /** 空闲超时时间 (ms) */
  timeout?: number;
  /** 初始睡眠状态 */
  initialSleeping?: boolean;
  /** 是否禁用空闲检测 */
  disabled?: boolean;
}

interface UseIdleDetectionReturn {
  /** 是否处于睡眠状态 */
  isSleeping: boolean;
  /** 唤醒并重置计时器 */
  resetTimer: () => void;
  /** 强制进入睡眠 */
  forceSleep: () => void;
  /** 强制唤醒 */
  forceWake: () => void;
}

/**
 * 空闲检测 Hook
 * 一段时间无操作后进入睡眠状态
 */
export function useIdleDetection({
  timeout = ANIMATION.IDLE_TIMEOUT,
  initialSleeping = false,
  disabled = false,
}: UseIdleDetectionOptions = {}): UseIdleDetectionReturn {
  const [isSleeping, setIsSleeping] = useState(initialSleeping);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 清除计时器
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 重置计时器（唤醒并重新开始计时）
  const resetTimer = useCallback(() => {
    if (disabled) return;

    // 唤醒
    setIsSleeping(false);

    // 清除旧计时器
    clearTimer();

    // 设置新计时器
    timerRef.current = setTimeout(() => {
      setIsSleeping(true);
    }, timeout);
  }, [timeout, disabled, clearTimer]);

  // 强制进入睡眠
  const forceSleep = useCallback(() => {
    clearTimer();
    setIsSleeping(true);
  }, [clearTimer]);

  // 强制唤醒
  const forceWake = useCallback(() => {
    setIsSleeping(false);
    if (!disabled) {
      resetTimer();
    }
  }, [disabled, resetTimer]);

  // 清理
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    isSleeping,
    resetTimer,
    forceSleep,
    forceWake,
  };
}
