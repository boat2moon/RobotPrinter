import { useEffect, useState, useRef, useLayoutEffect } from 'react';

interface EyesProps {
  /** 眼睛模式：normal=普通模式(会眨眼), loading=加载中(脉冲动画,无瞳孔), countdown=倒计时显示 */
  mode?: 'normal' | 'loading' | 'countdown';
  /** 眨眼间隔范围 [最小ms, 最大ms]，仅 normal 模式有效 */
  blinkInterval?: [number, number];
  /** 是否启用鼠标跟随（仅 normal 模式生效） */
  followMouse?: boolean;
  /** 固定注视方向（设置后优先于鼠标跟随） */
  lookDirection?: 'left' | 'right' | 'up' | 'down' | null;
  /** 倒计时数字（仅 countdown 模式生效） */
  countdownValue?: number;
  /** 头部旋转角度（用于倒计时数字反向旋转保持正向显示） */
  headRotation?: number;
}

/**
 * 眼睛组件（独立管理眨眼动画）
 * 支持：普通模式眨眼、加载中脉冲（无瞳孔）、倒计时显示（跨两眼居中）、鼠标跟随
 * 注：所有模式下眼睛都保持渲染以维持布局
 */
export function Eyes({ 
  mode = 'normal',
  blinkInterval = [2000, 5000],
  followMouse = true,
  lookDirection = null,
  countdownValue = 0,
  headRotation = 0,
}: EyesProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [maxOffset, setMaxOffset] = useState({ x: 3, y: 3.5 });
  
  const eyesRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);
  
  // 眨眼动画（仅 normal 模式）
  useEffect(() => {
    if (mode !== 'normal') return;
    
    let timerId: ReturnType<typeof setTimeout>;
    
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };
    
    const scheduleNextBlink = (): ReturnType<typeof setTimeout> => {
      const [min, max] = blinkInterval;
      const delay = Math.random() * (max - min) + min;
      return setTimeout(() => {
        blink();
        timerId = scheduleNextBlink();
      }, delay);
    };
    
    timerId = scheduleNextBlink();
    return () => clearTimeout(timerId);
  }, [mode, blinkInterval]);
  
  // 动态计算最大偏移量
  useLayoutEffect(() => {
    const calculateMaxOffset = () => {
      if (!eyeRef.current || !pupilRef.current) return;
      
      const eyeRect = eyeRef.current.getBoundingClientRect();
      const pupilRect = pupilRef.current.getBoundingClientRect();
      
      const maxX = (eyeRect.width - pupilRect.width) / 2 - 1;
      const maxY = (eyeRect.height - pupilRect.height) / 2 - 1;
      
      setMaxOffset({ x: Math.max(0, maxX), y: Math.max(0, maxY) });
    };

    calculateMaxOffset();
    window.addEventListener('resize', calculateMaxOffset);
    return () => window.removeEventListener('resize', calculateMaxOffset);
  }, []);
  
  // 鼠标跟随效果
  useEffect(() => {
    // 固定注视方向时使用最大偏移
    if (lookDirection) {
      const offsets = {
        left: { x: -maxOffset.x, y: 0 },
        right: { x: maxOffset.x, y: 0 },
        up: { x: 0, y: -maxOffset.y },
        down: { x: 0, y: maxOffset.y },
      };
      setPupilOffset(offsets[lookDirection]);
      return;
    }
    
    // loading/countdown 模式或禁用跟随时居中
    if (mode !== 'normal' || !followMouse) {
      setPupilOffset({ x: 0, y: 0 });
      return;
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyesRef.current) return;
      
      const rect = eyesRef.current.getBoundingClientRect();
      const eyesCenterX = rect.left + rect.width / 2;
      const eyesCenterY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - eyesCenterX;
      const deltaY = e.clientY - eyesCenterY;
      
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const factor = Math.min(1, Math.log(distance / 20 + 1) / 2);
      
      const offsetX = Math.cos(angle) * maxOffset.x * factor;
      const offsetY = Math.sin(angle) * maxOffset.y * factor;
      
      setPupilOffset({ x: offsetX, y: offsetY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mode, followMouse, lookDirection, maxOffset]);
  
  const isLoading = mode === 'loading';
  const isCountdown = mode === 'countdown';
  const eyeClassName = `eye ${isBlinking ? 'blink' : ''} ${isLoading ? 'loading' : ''}`;
  
  const pupilStyle = !isLoading ? {
    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
  } : {};
  
  return (
    <div className={`eyes-container ${isCountdown ? 'countdown-mode' : ''}`} ref={eyesRef}>
      {/* 倒计时模式：覆盖显示数字 */}
      {isCountdown && (
        <span 
          className="countdown-digit" 
          style={{ 
            transform: `translate(-50%, -50%) rotate(${-headRotation}deg)` 
          }}
        >
          {countdownValue}
        </span>
      )}
      
      {/* 眼睛始终渲染以保持布局，倒计时模式下通过 CSS 隐藏 */}
      <div 
        className={`${eyeClassName} eye-left ${isCountdown ? 'hidden-eye' : ''}`} 
        ref={eyeRef}
      >
        {!isLoading && (
          <div className="pupil" style={pupilStyle} ref={pupilRef} />
        )}
      </div>
      <div className={`${eyeClassName} eye-right ${isCountdown ? 'hidden-eye' : ''}`}>
        {!isLoading && (
          <div className="pupil" style={pupilStyle} />
        )}
      </div>
    </div>
  );
}
