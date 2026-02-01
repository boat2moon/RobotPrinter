import { useState, useRef, useCallback, useEffect } from 'react';
import './RobotPrinter.css';
import { Paper } from './Paper';
import { RobotHead } from './RobotHead';

/** 眼睛模式配置 */
export type EyeMode = 
  | { mode: 'normal'; blinkInterval?: [number, number] }
  | { mode: 'loading' };

/** 位置类型 */
export interface Position {
  x: number;
  y: number;
}

export interface RobotPrinterProps {
  /** 输入框占位符文本 */
  placeholder?: string;
  /** 输入值变化时的回调 */
  onValueChange?: (value: string) => void;
  /** 按下回车键时的回调 */
  onSubmit?: (value: string) => void;
  /** 初始值 */
  defaultValue?: string;
  /** 纸条宽度(px) */
  paperWidth?: number;
  /** 天线小球颜色，单色或渐变色数组 */
  antennaBallColor?: string | string[];
  /** 眼睛模式配置 */
  eyeMode?: EyeMode;
  /** 机器人旋转动画时间(毫秒) */
  rotateDuration?: number;
  /** 纸条展开动画时间(毫秒) */
  paperDuration?: number;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 默认位置（相对于视口），不传时默认右下角 */
  defaultPosition?: Position;
  /** 倾斜强度 (0-1 或更大)，0=不倾斜，1=最大倾斜(12deg) */
  tiltStrength?: number;
  /** 阴影强度 (0-1 或更大)，控制动态阴影的偏移程度 */
  shadowStrength?: number;
}

// 动画阶段枚举
type AnimationPhase = 
  | 'idle'
  | 'rotating'
  | 'mouth-opening'
  | 'paper-out'
  | 'expanded'
  | 'paper-in'
  | 'mouth-closing'
  | 'rotating-back';

// 最大倾斜角度
const MAX_TILT_DEG = 12;
// 拖拽判定阈值（移动距离小于此值视为点击）
const DRAG_THRESHOLD = 5;

/**
 * 计算指向页面中心的倾斜角度
 * @param position 当前位置
 * @param tiltStrength 倾斜强度 (0-1 或更大)
 * @returns { tiltX, tiltY } 倾斜角度
 */
function calculateTilt(position: Position, tiltStrength: number): { tiltX: number; tiltY: number } {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // 机器人相对于页面中心的偏移
  const offsetX = position.x - centerX; // 正值=机器人在右侧
  const offsetY = position.y - centerY; // 正值=机器人在下方
  
  // 计算最大可能距离（用于归一化）
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
  
  // 归一化距离因子（0-1）
  const dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
  const factor = Math.min(1, dist / maxDist);
  
  /**
   * 倾斜逻辑：
   * - 机器人在右侧(offsetX > 0) → 右侧应凸出 → rotateY 负值
   * - 机器人在下方(offsetY > 0) → 底部应凸出 → rotateX 正值
   */
  const tiltX = (offsetY / maxDist) * MAX_TILT_DEG * tiltStrength * factor;
  const tiltY = -(offsetX / maxDist) * MAX_TILT_DEG * tiltStrength * factor;
  
  return { tiltX, tiltY };
}

/**
 * 机器人吐纸动画组件
 * 支持可选拖拽、位置自适应倾斜和吐纸方向
 */
export function RobotPrinter({
  placeholder = '输入记录...',
  onValueChange,
  onSubmit,
  defaultValue = '',
  paperWidth = 500,
  antennaBallColor = ['#ff6b6b', '#e74c3c', '#c0392b'],
  eyeMode = { mode: 'normal', blinkInterval: [2000, 5000] },
  rotateDuration = 400,
  paperDuration = 600,
  draggable = false,
  defaultPosition,
  tiltStrength = 1,
  shadowStrength = 1,
}: RobotPrinterProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [inputValue, setInputValue] = useState(defaultValue);
  const [paperOffset, setPaperOffset] = useState(85);
  
  // 位置状态（仅拖拽模式使用）
  const [position, setPosition] = useState<Position>(() => 
    defaultPosition || { x: window.innerWidth - 100, y: window.innerHeight - 100 }
  );
  
  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  // 计算吐纸方向（基于位置）
  const paperDirection: 'left' | 'right' = position.x > window.innerWidth / 2 ? 'left' : 'right';
  
  // 计算倾斜角度
  const { tiltX, tiltY } = calculateTilt(position, tiltStrength);

  // 嘴巴位置变化时动态计算纸条偏移
  const handleMouthPositionChange = useCallback((mouthCenterX: number) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    if (paperDirection === 'left') {
      // 向左吐：纸条右侧对齐嘴巴
      const rightOffset = containerRect.right - mouthCenterX;
      setPaperOffset(rightOffset);
    } else {
      // 向右吐：纸条左侧对齐嘴巴
      const leftOffset = mouthCenterX - containerRect.left;
      setPaperOffset(leftOffset);
    }
  }, [paperDirection]);

  // 展开动画序列
  const expandSequence = useCallback(() => {
    setPhase('rotating');
    
    setTimeout(() => {
      setPhase('mouth-opening');
      
      setTimeout(() => {
        setPhase('paper-out');
        
        setTimeout(() => {
          setPhase('expanded');
          inputRef.current?.focus();
        }, paperDuration);
      }, 300);
    }, rotateDuration);
  }, [rotateDuration, paperDuration]);

  // 收起动画序列
  const collapseSequence = useCallback(() => {
    setPhase('paper-in');
    
    setTimeout(() => {
      setPhase('mouth-closing');
      
      setTimeout(() => {
        setPhase('rotating-back');
        
        setTimeout(() => {
          setPhase('idle');
        }, rotateDuration);
      }, 200);
    }, paperDuration * 0.8);
  }, [rotateDuration, paperDuration]);

  // 切换展开/收起
  const toggle = useCallback(() => {
    if (phase !== 'idle' && phase !== 'expanded') return;
    
    if (phase === 'idle') {
      expandSequence();
    } else {
      collapseSequence();
    }
  }, [phase, expandSequence, collapseSequence]);

  // 处理点击（区分拖拽和点击）
  const handleClick = useCallback(() => {
    // 如果刚刚拖拽过，不触发点击
    if (dragStartRef.current) return;
    toggle();
  }, [toggle]);

  // 拖拽开始（只在机器人头部区域，排除纸条）
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable) return;
    
    // 如果点击的是纸条区域，不触发拖拽
    const target = e.target as HTMLElement;
    if (target.closest('.paper')) return;
    
    e.preventDefault();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    setIsDragging(true);
  }, [draggable, position]);

  // 拖拽移动
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      setPosition({
        x: dragStartRef.current.posX + deltaX,
        y: dragStartRef.current.posY + deltaY,
      });
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // 如果移动距离小于阈值，视为点击
      if (distance < DRAG_THRESHOLD) {
        dragStartRef.current = null;
        setIsDragging(false);
        toggle();
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
  }, [isDragging, toggle]);

  // 处理输入变化
  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      onValueChange?.(value);
    },
    [onValueChange]
  );

  // 处理提交
  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      onSubmit?.(inputValue);
    }
  }, [inputValue, onSubmit]);

  // 计算各部分状态
  const isRotated = ['rotating', 'mouth-opening', 'paper-out', 'expanded', 'paper-in', 'mouth-closing'].includes(phase);
  const isMouthOpen = ['mouth-opening', 'paper-out', 'expanded', 'paper-in'].includes(phase);
  const isPaperVisible = ['paper-out', 'expanded'].includes(phase);

  // 转动方向（向左吐=顺时针90°，向右吐=逆时针90°）
  const rotateDirection = paperDirection === 'left' ? 90 : -90;

  // 动态阴影偏移（基于页面中心光源，完全对称）
  // 阴影方向完全由位置决定，无基础偏移
  const shadowOffsetX = -tiltY * 0.5 * shadowStrength;  // tiltY负=右侧凸出，阴影往右
  const shadowOffsetY = tiltX * 0.5 * shadowStrength;   // tiltX正=底部凸出，阴影往下
  
  // 添加最小阴影距离保证可见性（取绝对值方向上的基础偏移）
  const minShadow = 4;
  const shadowX = shadowOffsetX + Math.sign(shadowOffsetX || 1) * minShadow;
  const shadowY = shadowOffsetY + Math.sign(shadowOffsetY || 1) * minShadow;

  // 容器样式
  const containerStyle: React.CSSProperties = {
    '--rotate-duration': `${rotateDuration}ms`,
    '--paper-duration': `${paperDuration}ms`,
    '--tilt-x': `${tiltX}deg`,
    '--tilt-y': `${tiltY}deg`,
    '--rotate-direction': `${rotateDirection}deg`,
    '--shadow-x': `${shadowX}px`,
    '--shadow-y': `${shadowY}px`,
    ...(draggable ? {
      position: 'fixed',
      left: position.x,
      top: position.y,
      transform: 'translate(-50%, -50%)',
      cursor: isDragging ? 'grabbing' : 'grab',
    } : {}),
  } as React.CSSProperties;

  return (
    <div 
      className={`robot-printer ${draggable ? 'draggable' : ''}`}
      ref={containerRef}
      style={containerStyle}
      onMouseDown={handleMouseDown}
    >
      {/* 纸条 */}
      <Paper
        ref={inputRef}
        isExpanded={isPaperVisible}
        width={paperWidth}
        offset={paperOffset}
        direction={paperDirection}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {/* 机器人头部 */}
      <RobotHead
        ref={headRef}
        isRotated={isRotated}
        isMouthOpen={isMouthOpen}
        onClick={handleClick}
        eyeMode={eyeMode.mode}
        blinkInterval={eyeMode.mode === 'normal' ? eyeMode.blinkInterval : undefined}
        eyeLookDirection={isPaperVisible ? (paperDirection === 'left' ? 'down' : 'down') : null}
        antennaBallColor={antennaBallColor}
        onMouthPositionChange={handleMouthPositionChange}
        rotateDirection={rotateDirection}
      />

      {/* 提示文字 */}
      <div className="hint">
        {draggable ? '拖拽移动 / 点击展开' : '点击机器人收纳/展开'}
      </div>
    </div>
  );
}
