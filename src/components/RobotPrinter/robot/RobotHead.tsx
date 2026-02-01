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
  /** 眼睛模式：normal=普通(会眨眼), loading=加载中(脉冲), countdown=倒计时 */
  eyeMode?: 'normal' | 'loading' | 'countdown';
  /** 眨眼间隔 [最小ms, 最大ms] */
  blinkInterval?: [number, number];
  /** 眼睛注视方向 */
  eyeLookDirection?: 'left' | 'right' | 'up' | 'down' | null;
  /** 倒计时数值（仅 countdown 模式生效） */
  countdownValue?: number;
  /** 天线小球颜色 */
  antennaBallColor?: string | string[];
  /** 是否处于加载状态（天线呼吸灯） */
  loading?: boolean;
  /** 点击天线小球终止回调 */
  onAbort?: () => void;
  /** 嘴巴位置变化回调（返回嘴巴中心的屏幕坐标） */
  onMouthPositionChange?: (centerX: number, centerY: number) => void;
  /** 旋转方向（度），正值=顺时针，负值=逆时针 */
  rotateDirection?: number;
  /** 子元素扩展 */
  children?: ReactNode;
}

/**
 * 机器人头部组件
 * 包含天线、耳朵、脸部屏幕（眼睛+嘴巴）
 * 使用 wrapper 分离阴影（不旋转）和头部（可旋转）
 */
export const RobotHead = forwardRef<HTMLDivElement, RobotHeadProps>(({
  isRotated,
  isMouthOpen,
  onClick,
  eyeMode = 'normal',
  blinkInterval = [2000, 5000],
  eyeLookDirection = null,
  countdownValue = 0,
  antennaBallColor,
  loading = false,
  onAbort,
  onMouthPositionChange,
  rotateDirection = 90,
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
  
  // 动态计算旋转变换（只应用于内部头部，不影响阴影）
  const headInnerStyle: React.CSSProperties = isRotated
    ? { transform: `rotateZ(${rotateDirection}deg)` }
    : {};
  
  return (
    // 外层 wrapper 不旋转，持有基于光源的阴影
    <div 
      ref={ref}
      className="robot-head-wrapper"
      onClick={onClick}
    >
      {/* 内层头部可旋转 */}
      <div 
        className={`robot-head ${isRotated ? 'rotated' : ''}`} 
        style={headInnerStyle}
      >
        {/* 天线 - 加载时呼吸灯，可点击终止 */}
        <Antenna 
          ballColor={antennaBallColor} 
          loading={loading}
          onBallClick={onAbort}
        />

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
              countdownValue={countdownValue}
              headRotation={isRotated ? rotateDirection : 0}
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
    </div>
  );
});

RobotHead.displayName = 'RobotHead';
