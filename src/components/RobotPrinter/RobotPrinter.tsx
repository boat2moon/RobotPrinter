import { useState, useRef, useCallback } from 'react';
import './RobotPrinter.css';
import { Paper } from './Paper';
import { RobotHead } from './RobotHead';

/** 眼睛模式配置 */
export type EyeMode = 
  | { mode: 'normal'; blinkInterval?: [number, number] }  // 普通模式：随机眨眼
  | { mode: 'loading' };  // 加载中模式：脉冲动画

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
}

// 动画阶段枚举
type AnimationPhase = 
  | 'idle'           // 初始状态（收起）
  | 'rotating'       // 正在旋转
  | 'mouth-opening'  // 正在张嘴
  | 'paper-out'      // 纸条展开中
  | 'expanded'       // 完全展开
  | 'paper-in'       // 纸条收回中
  | 'mouth-closing'  // 正在闭嘴
  | 'rotating-back'; // 正在旋转回去

/**
 * 机器人吐纸动画组件
 * 点击机器人头部会：旋转90° → 张嘴 → 吐出纸条
 * 收起时会：收回纸条 → 闭嘴 → 旋转回去
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
}: RobotPrinterProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [inputValue, setInputValue] = useState(defaultValue);
  const [paperRight, setPaperRight] = useState(85);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  // 嘴巴位置变化时动态计算纸条位置
  const handleMouthPositionChange = useCallback((mouthCenterX: number) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const rightOffset = containerRect.right - mouthCenterX;
    setPaperRight(rightOffset);
  }, []);

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

  return (
    <div 
      className="robot-printer" 
      ref={containerRef}
      style={{
        '--rotate-duration': `${rotateDuration}ms`,
        '--paper-duration': `${paperDuration}ms`,
      } as React.CSSProperties}
    >
      {/* 纸条 */}
      <Paper
        ref={inputRef}
        isExpanded={isPaperVisible}
        width={paperWidth}
        rightOffset={paperRight}
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
        onClick={toggle}
        eyeMode={eyeMode.mode}
        blinkInterval={eyeMode.mode === 'normal' ? eyeMode.blinkInterval : undefined}
        eyeLookDirection={isPaperVisible ? 'down' : null}
        antennaBallColor={antennaBallColor}
        onMouthPositionChange={handleMouthPositionChange}
      />

      {/* 提示文字 */}
      <div className="hint">点击机器人收纳/展开</div>
    </div>
  );
}
