import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import './RobotPrinter.css';

/** 眼睛模式配置 */
type EyeMode = 
  | { mode: 'normal'; blinkInterval?: [number, number] }  // 普通模式：随机眨眼
  | { mode: 'loading' };  // 加载中模式：脉冲动画

interface RobotPrinterProps {
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
  antennaBallColor = ['#ff6b6b', '#e74c3c', '#c0392b'], // 默认红色渐变
  eyeMode = { mode: 'normal', blinkInterval: [2000, 5000] }, // 默认普通模式
  rotateDuration = 400, // 默认旋转时间 400ms
  paperDuration = 600, // 默认纸条展开时间 600ms
}: RobotPrinterProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isBlinking, setIsBlinking] = useState(false);
  const [paperRight, setPaperRight] = useState(85); // 默认值，会被动态计算覆盖
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  // 动态计算纸条位置，使其与机器人头部中心对齐（旋转后嘴巴在中心）
  useLayoutEffect(() => {
    const calculatePaperPosition = () => {
      if (!containerRef.current || !headRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const headRect = headRef.current.getBoundingClientRect();
      
      // 计算机器人头部中心到容器右边缘的距离
      // 旋转90°后，嘴巴会出现在头部中心偏左的位置（原来的bottom变成了left）
      // 需要加偏移量补偿嘴巴位置
      const headCenterX = headRect.left + headRect.width / 2;
      const mouthOffset = 20; // 嘴巴相对于头部中心的偏移（调整后位置）
      const rightOffset = containerRect.right - headCenterX + mouthOffset;
      
      setPaperRight(rightOffset);
    };

    calculatePaperPosition();
    
    // 监听窗口变化重新计算
    window.addEventListener('resize', calculatePaperPosition);
    return () => window.removeEventListener('resize', calculatePaperPosition);
  }, []);

  // 眨眼动画（仅在 normal 模式生效）
  useEffect(() => {
    if (eyeMode.mode !== 'normal') return;
    
    const blinkInterval = eyeMode.blinkInterval || [2000, 5000];
    
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };

    const scheduleNextBlink = () => {
      const [min, max] = blinkInterval;
      const delay = Math.random() * (max - min) + min;
      return setTimeout(() => {
        blink();
        scheduleNextBlink();
      }, delay);
    };

    const timerId = scheduleNextBlink();
    return () => clearTimeout(timerId);
  }, [eyeMode]);

  // 展开动画序列
  const expandSequence = useCallback(() => {
    // 阶段1: 旋转机器人
    setPhase('rotating');
    
    setTimeout(() => {
      // 阶段2: 张嘴
      setPhase('mouth-opening');
      
      setTimeout(() => {
        // 阶段3: 吐纸
        setPhase('paper-out');
        
        setTimeout(() => {
          // 完成
          setPhase('expanded');
          inputRef.current?.focus();
        }, paperDuration);
      }, 300); // 张嘴时间
    }, rotateDuration);
  }, [rotateDuration, paperDuration]);

  // 收起动画序列
  const collapseSequence = useCallback(() => {
    // 阶段1: 收回纸条
    setPhase('paper-in');
    
    setTimeout(() => {
      // 阶段2: 闭嘴 + 旋转回去（同时进行）
      setPhase('mouth-closing');
      
      setTimeout(() => {
        setPhase('rotating-back');
        
        setTimeout(() => {
          // 完成
          setPhase('idle');
        }, rotateDuration);
      }, 200); // 闭嘴时间
    }, paperDuration * 0.8); // 收回稍快一点
  }, [rotateDuration, paperDuration]);

  // 切换展开/收起
  const toggle = useCallback(() => {
    if (phase !== 'idle' && phase !== 'expanded') return; // 动画进行中不响应
    
    if (phase === 'idle') {
      expandSequence();
    } else {
      collapseSequence();
    }
  }, [phase, expandSequence, collapseSequence]);

  // 处理输入变化
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      onValueChange?.(value);
    },
    [onValueChange]
  );

  // 处理回车键
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        onSubmit?.(inputValue);
      }
    },
    [inputValue, onSubmit]
  );

  // 计算各部分的样式类名
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
      {/* 纸条 - 位置动态计算与嘴巴对齐 */}
      <div
        className={`paper ${isPaperVisible ? 'expanded' : 'collapsed'}`}
        style={{ 
          '--paper-width': `${paperWidth}px`,
          right: `${paperRight}px`
        } as React.CSSProperties}
      >
        <div className="paper-content">
          <input
            ref={inputRef}
            type="text"
            className="paper-input"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        {/* 纸条装饰线 */}
        <div className="paper-lines">
          <div className="paper-line" />
          <div className="paper-line" />
        </div>
      </div>

      {/* 机器人头部 */}
      <div 
        ref={headRef}
        className={`robot-head ${isRotated ? 'rotated' : ''}`} 
        onClick={toggle}
      >
        {/* 天线 */}
        <div className="antenna">
          <div className="antenna-stem" />
          <div 
            className="antenna-ball" 
            style={{
              background: Array.isArray(antennaBallColor)
                ? `radial-gradient(circle at 30% 30%, ${antennaBallColor.join(', ')})`
                : antennaBallColor
            }}
          />
        </div>

        {/* 头壳 */}
        <div className="head-body">
          {/* 左耳 */}
          <div className="ear ear-left" />
          {/* 右耳 */}
          <div className="ear ear-right" />

          {/* 脸部屏幕 */}
          <div className="face-screen">
            {/* 眼睛 */}
            <div className={`eye eye-left ${isBlinking ? 'blink' : ''} ${eyeMode.mode === 'loading' ? 'loading' : ''}`} />
            <div className={`eye eye-right ${isBlinking ? 'blink' : ''} ${eyeMode.mode === 'loading' ? 'loading' : ''}`} />
            {/* 嘴巴 */}
            <div className={`mouth ${isMouthOpen ? 'open' : ''}`} />
          </div>
        </div>
      </div>

      {/* 提示文字 */}
      <div className="hint">点击机器人收纳/展开</div>
    </div>
  );
}
