import { forwardRef, useRef, useEffect, type ReactNode } from 'react';
import { Antenna } from './Antenna';
import { Eyes } from './Eyes';

interface RobotHeadProps {
  /** 是否已旋转 */
  isRotated: boolean;
  /** 嘴巴是否张开 */
  isMouthOpen: boolean;
  /** 点击回调 */
  onClick: () => void;
  /** 眼睛模式：normal=普通(会眨眼), loading=加载中(脉冲) */
  eyeMode?: 'normal' | 'loading';
  /** 眨眼间隔 [最小ms, 最大ms] */
  blinkInterval?: [number, number];
  /** 眼睛注视方向 */
  eyeLookDirection?: 'left' | 'right' | 'up' | 'down' | null;
  /** 天线小球颜色 */
  antennaBallColor?: string | string[];
  /** 嘴巴位置变化回调（返回嘴巴中心的屏幕坐标） */
  onMouthPositionChange?: (centerX: number, centerY: number) => void;
  /** 子元素扩展 */
  children?: ReactNode;
}

/**
 * 机器人头部组件
 * 包含天线、耳朵、脸部屏幕（眼睛+嘴巴）
 */
export const RobotHead = forwardRef<HTMLDivElement, RobotHeadProps>(({
  isRotated,
  isMouthOpen,
  onClick,
  eyeMode = 'normal',
  blinkInterval = [2000, 5000],
  eyeLookDirection = null,
  antennaBallColor,
  onMouthPositionChange,
  children,
}, ref) => {
  const mouthRef = useRef<HTMLDivElement>(null);
  
  // 当嘴巴张开状态变化时，通知父组件嘴巴的位置
  useEffect(() => {
    if (!mouthRef.current || !onMouthPositionChange) return;
    
    // 等待 CSS 过渡完成（嘴巴张开动画 0.2s）
    const timer = setTimeout(() => {
      if (!mouthRef.current) return;
      const rect = mouthRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      onMouthPositionChange(centerX, centerY);
    }, isMouthOpen ? 200 : 0);
    
    return () => clearTimeout(timer);
  }, [isMouthOpen, onMouthPositionChange, isRotated]);
  
  return (
    <div 
      ref={ref}
      className={`robot-head ${isRotated ? 'rotated' : ''}`} 
      onClick={onClick}
    >
      {/* 天线 */}
      <Antenna ballColor={antennaBallColor} />

      {/* 头壳 */}
      <div className="head-body">
        {/* 左耳 */}
        <div className="ear ear-left" />
        {/* 右耳 */}
        <div className="ear ear-right" />

        {/* 脸部屏幕 */}
        <div className="face-screen">
          {/* 眼睛 - 独立管理眨眼动画 */}
          <Eyes 
            mode={eyeMode}
            blinkInterval={blinkInterval}
            lookDirection={eyeLookDirection}
          />
          {/* 嘴巴 */}
          <div 
            ref={mouthRef}
            className={`mouth ${isMouthOpen ? 'open' : ''}`} 
          />
        </div>

        {children}
      </div>
    </div>
  );
});

RobotHead.displayName = 'RobotHead';
