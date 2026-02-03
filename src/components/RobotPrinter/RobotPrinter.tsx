import { useState, useRef, useCallback, useEffect } from 'react';
import './RobotPrinter.css';
import { Paper } from './Paper';
import { RobotHead } from './robot';
import { ActionMenu, type ActionConfig } from './menus';
import { ResultPanel, type ResultPanelConfig } from './ResultPanel';
import { InfoBar } from './InfoBar';

/** 眼睛模式配置 */
export type EyeMode = 
  | { mode: 'normal'; blinkInterval?: [number, number] }
  | { mode: 'loading' }
  | { mode: 'countdown' }
  | { mode: 'sleeping' };

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
  /** 拓展功能按钮配置 */
  actions?: ActionConfig[];
  /** 是否显示提示文字，默认显示 */
  showHint?: boolean;
  /** 结果面板配置（用户控制） */
  resultPanel?: ResultPanelConfig;
  /** 加载状态 */
  loading?: boolean;
  /** 中止请求回调 */
  onAbort?: () => void;
  /** 频率限制倒计时（秒） */
  delay?: number;
  /** 底部提示内容 */
  infoContent?: React.ReactNode;
  /** 外部控制展开状态（可选，传入则为受控模式） */
  expanded?: boolean;
  /** 展开状态变化时的回调 */
  onExpandedChange?: (expanded: boolean) => void;
  /** 外部控制位置（可选，传入则为受控模式） */
  position?: Position;
  /** 位置变化时的回调 */
  onPositionChange?: (position: Position) => void;
  /** 是否深色模式（深色模式默认睡眠，浅色模式默认清醒） */
  isDark?: boolean;
  /** 样式模式：default（默认独立面板）或 glass（毛玻璃统一背景） */
  styleMode?: 'default' | 'glass';
  /** 触发高亮/抖动动画的信号（每次值变化时触发） */
  highlightTrigger?: number;
}

// 动画阶段枚举
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
  actions = [],
  showHint = true,
  resultPanel,
  loading = false,
  onAbort,
  delay = 0,
  infoContent,
  expanded,
  onExpandedChange,
  position: controlledPosition,
  onPositionChange,
  isDark = false,
  styleMode = 'default',
  highlightTrigger = 0,
}: RobotPrinterProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [inputValue, setInputValue] = useState(defaultValue);
  const [paperOffset, setPaperOffset] = useState(85);
  
  // 抖动动画状态
  const [isShaking, setIsShaking] = useState(false);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 监听 highlightTrigger 触发抖动
  useEffect(() => {
    if (highlightTrigger > 0) {
      setIsShaking(true);
      setIsSleeping(false); // 唤醒眼睛
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = setTimeout(() => {
        setIsShaking(false);
      }, 400); // 对应 CSS 动画时长
    }
    return () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    };
  }, [highlightTrigger]);
  
  // Glass mode: ResultPanel 高度追踪
  const resultPanelRef = useRef<HTMLDivElement>(null);
  const [resultPanelHeight, setResultPanelHeight] = useState(0);
  const [resultPlacement, setResultPlacement] = useState<'top' | 'bottom'>('top');
  
  // 位置状态（仅拖拽模式使用）
  const [internalPosition, setInternalPosition] = useState<Position>(() => 
    defaultPosition || { x: window.innerWidth - 100, y: window.innerHeight - 100 }
  );

  const position = controlledPosition ?? internalPosition;
  
  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  
  // 空闲睡眠状态（深色模式默认睡眠）
  const [isSleeping, setIsSleeping] = useState(isDark);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const IDLE_TIMEOUT = 10000; // 10秒无操作进入睡眠
  
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
          onExpandedChange?.(true); // 通知外部展开完成
        }, paperDuration);
      }, 300);
    }, rotateDuration);
  }, [rotateDuration, paperDuration, onExpandedChange]);

  // 收起动画序列
  const collapseSequence = useCallback(() => {
    setPhase('paper-in');
    
    setTimeout(() => {
      setPhase('mouth-closing');
      
      setTimeout(() => {
        setPhase('rotating-back');
        
        setTimeout(() => {
          setPhase('idle');
          onExpandedChange?.(false); // 通知外部收起完成
        }, rotateDuration);
      }, 200);
    }, paperDuration * 0.8);
  }, [rotateDuration, paperDuration, onExpandedChange]);

  // 响应外部 expanded prop 变化
  useEffect(() => {
    if (expanded === undefined) return; // 非受控模式，不处理
    
    if (expanded && phase === 'idle') {
      // 外部要求展开，当前是收起状态
      expandSequence();
    } else if (!expanded && phase === 'expanded') {
      // 外部要求收起，当前是展开状态
      collapseSequence();
    }
  }, [expanded, phase, expandSequence, collapseSequence]);

  // 切换展开/收起
  const toggle = useCallback(() => {
    // 加载中不可切换
    if (loading) return;
    if (phase !== 'idle' && phase !== 'expanded') return;
    
    if (phase === 'idle') {
      expandSequence();
    } else {
      collapseSequence();
    }
  }, [phase, loading, expandSequence, collapseSequence]);

  // 处理点击（区分拖拽和点击）
  const handleClick = useCallback(() => {
    // 如果刚刚拖拽过或正在加载，不触发点击
    if (dragStartRef.current || loading) return;
    toggle();
  }, [toggle, loading]);

  // 拖拽开始（只在机器人头部区域，排除纸条）
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable) return;
    
    // 如果点击的是纸条、菜单、结果面板或信息栏区域，不触发拖拽
    const target = e.target as HTMLElement;
    if (target.closest('.paper') || target.closest('.action-menu') || 
        target.closest('.result-panel') || target.closest('.info-bar')) return;
    
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
      
      const newPos = {
        x: dragStartRef.current.posX + deltaX,
        y: dragStartRef.current.posY + deltaY,
      };

      if (onPositionChange) {
        onPositionChange(newPos);
      } else {
        setInternalPosition(newPos);
      }
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
    // 加载中或倒计时中不可提交
    if (loading || delay > 0) return;
    
    // 只有在展开状态下才能提交
    if (phase !== 'expanded') return;

    if (inputValue.trim()) {
      onSubmit?.(inputValue);
    }
  }, [inputValue, onSubmit, loading, delay, phase]);

  // 空闲睡眠检测
  const resetIdleTimer = useCallback(() => {
    // 唤醒
    setIsSleeping(false);
    
    // 清除旧计时器
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    // 设置新计时器
    idleTimerRef.current = setTimeout(() => {
      setIsSleeping(true);
    }, IDLE_TIMEOUT);
  }, [IDLE_TIMEOUT]);

  // 监听容器上的交互事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleActivity = () => resetIdleTimer();

    // 监听各种交互事件
    container.addEventListener('mousemove', handleActivity);
    container.addEventListener('mouseenter', handleActivity);
    container.addEventListener('click', handleActivity);
    container.addEventListener('keydown', handleActivity);
    container.addEventListener('focus', handleActivity, true);

    // 初始启动计时器
    resetIdleTimer();

    return () => {
      container.removeEventListener('mousemove', handleActivity);
      container.removeEventListener('mouseenter', handleActivity);
      container.removeEventListener('click', handleActivity);
      container.removeEventListener('keydown', handleActivity);
      container.removeEventListener('focus', handleActivity, true);
      
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [resetIdleTimer]);

  // 主题切换时重置睡眠状态
  useEffect(() => {
    if (isDark) {
      // 深色模式：立即进入睡眠
      setIsSleeping(true);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    } else {
      // 浅色模式：唤醒并重启计时器
      setIsSleeping(false);
      resetIdleTimer();
    }
  }, [isDark, resetIdleTimer]);

  // 计算各部分状态
  const isRotated = ['rotating', 'mouth-opening', 'paper-out', 'expanded', 'paper-in', 'mouth-closing'].includes(phase);
  const isMouthOpen = ['mouth-opening', 'paper-out', 'expanded', 'paper-in'].includes(phase);
  const isPaperVisible = ['paper-out', 'expanded'].includes(phase);

  // Glass mode: 监听 ResultPanel 高度变化
  useEffect(() => {
    if (styleMode !== 'glass') return;
    const el = resultPanelRef.current;
    if (!el) {
      setResultPanelHeight(0);
      return;
    }

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setResultPanelHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    setResultPanelHeight(el.offsetHeight);

    return () => observer.disconnect();
  }, [styleMode, resultPanel, isPaperVisible]);

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

  // 动态内部光影（材质光照跟随）
  // 计算机器人中心相对于屏幕中心的向量
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const relX = position.x - centerX;
  const relY = position.y - centerY;
  
  // 计算梯度角度 (0deg = Up, 90deg = Right)
  // 光源在中心，所以梯度方向是 Robot -> Center? 不，Background gradient 是亮->暗
  // 所以方向应该是 Light -> Dark，即 Center -> Robot (Away from light)
  const angleRad = Math.atan2(relY, relX);
  const angleDeg = (angleRad * 180 / Math.PI) + 90; // +90 to match CSS gradient (0deg=Up)

  // 计算内阴影偏移
  // Light is at Center.
  // Highlight (White) should be on side FACING center.
  // Shadow (Dark) should be on side AWAY from center.
  // 'inset x y' moves shadow image right/down.
  // x>0 puts shadow on Left wall.
  // So if Light is Right (relX < 0), we want Highlight on Right wall -> inset -x -y.
  // Let's use normalized vector.
  const dist = Math.sqrt(relX * relX + relY * relY) || 1;
  const normX = relX / dist;
  const normY = relY / dist;
  
  // 强度系数
  const insetStrength = 2; 
  
  // 暗部内阴影 (出现在背光面)
  // 背光面是 Robot -> Away 向量方向的面。即 (normX, normY)
  // 想要暗部出现在右下(假设 robot 在左上)，向量是 (+, +)
  // inset +,+ puts shadow on Left/Top? No.
  // inset 10px 0: shadow shifted right. Left edge exposed? Or Left part of box covered?
  // inset shadow: "Everything outside the box casts a shadow inside".
  // Light from Left -> Shadow on Right inner wall? No, Shadow on Left inner wall?
  // Think of a hole. Light from Left. Left wall is lit. Right wall is dark.
  // So Highlight on Left (inset +?), Dark on Right (inset -?).
  // Let's stick to: Highlight Vector = -DirectionToLight. Dark Vector = DirectionToLight.
  // DirectionToLight = -RelPos.
  // Highlight Vector = RelPos (Away from light).
  // Dark Vector = -RelPos (Towards light).
  
  // Wait, visual test:
  // Robot at BR (rel +, +). Light at TL.
  // Lit surface: TL. Dark surface: BR.
  // Lit surface TL needs Highlight.
  // Dark surface BR needs Shadow.
  
  // If `inset 2px 2px white` -> Highlight on TL?
  // Let's assume standard behavior: `inset + +` = Highlight on TL (if white).
  // So if Light is TL (Robot BR), we want `inset + +`.
  // Robot BR has rel (+, +).
  // So Highlight Offset should be positive when rel is positive?
  // Yes.
  
  // Determine Shadow (Dark) Offset.
  // We want Shadow on BR.
  // `inset - - black` -> Shadow on BR?
  // If `inset -10 -10`, shadow shifted Left/Up.
  // The hole is revealed at Bottom/Right.
  // So `inset - -` puts "shadow paint" on TL? No.
  // `inset` is tricky.
  // Let's use the static values as reference.
  // Static: top-left light.
  // `inset 2px 2px 6px white` -> Highlight. Matches TL light.
  // `inset -2px -2px 6px black` -> Shadow. Matches BR dark.
  
  // So:
  // Highlight Offset should align with Light Direction?
  // Light is TL (-,- relative to robot frame? No, TL of screen).
  // If Light is TL, we use `+ +`.
  // Vector ToLight is TL (-1, -1).
  // So Highlight = -ToLight * k.
  // ToLight = (-relX, -relY).
  // Highlight = (relX, relY) * k.
  
  // Dark Offset should align with Away Direction?
  // Dark is BR (1, 1).
  // We used `- -` for Dark.
  // So Dark = -Away * k?
  // Away = (relX, relY).
  // Dark = (-relX, -relY) * k.
  
  const highlightX = normX * insetStrength;
  const highlightY = normY * insetStrength;
  const shadowInsetX = -normX * insetStrength;
  const shadowInsetY = -normY * insetStrength;

  // 容器样式
  const containerStyle: React.CSSProperties = {
    '--rotate-duration': `${rotateDuration}ms`,
    '--paper-duration': `${paperDuration}ms`,
    '--tilt-x': `${tiltX}deg`,
    '--tilt-y': `${tiltY}deg`,
    '--rotate-direction': `${rotateDirection}deg`,
    '--shadow-x': `${shadowX}px`,
    '--shadow-y': `${shadowY}px`,
    // 动态材质光照
    '--grad-angle': `${angleDeg}deg`,
    '--highlight-x': `${highlightX}px`,
    '--highlight-y': `${highlightY}px`,
    '--shadow-inset-x': `${shadowInsetX}px`,
    '--shadow-inset-y': `${shadowInsetY}px`,
    ...(draggable ? {
      position: 'fixed',
      left: position.x,
      top: position.y,
      transform: 'translate(-50%, -50%)',
      cursor: isDragging ? 'grabbing' : 'grab',
    } : {}),
  } as React.CSSProperties;

  // 计算有效的位置 placement：只有当 ResultPanel 显示且纸条展开时，才使用 resultPlacement
  // 否则强制为 'top' (即默认状态，Hint 在下方)
  const isResultPanelVisible = resultPanel?.visible && isPaperVisible;
  const effectivePlacement = isResultPanelVisible ? resultPlacement : 'top';

  return (
    <div 
      className={`robot-printer ${draggable ? 'draggable' : ''} ${styleMode === 'glass' ? 'glass-mode' : ''} ${isShaking ? 'shake-animation' : ''}`}
      ref={containerRef}
      style={containerStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Glass Mode Background */}
      {styleMode === 'glass' && (
        <div
          className={`ai-island-backdrop ${isPaperVisible ? 'expanded' : ''} ${isResultPanelVisible ? 'has-result' : ''} ${isDark ? 'dark' : ''} direction-${paperDirection} result-${effectivePlacement}`}
          style={{
            '--paper-width': `${paperWidth}px`,
            '--paper-offset': `${paperOffset}px`,
            '--result-height': `${resultPanel && isPaperVisible ? resultPanelHeight : 0}px`,
          } as React.CSSProperties}
        />
      )}
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
        loading={loading || delay > 0} // 加载或倒计时期间都视为加载状态（禁用输入）
      />

      {/* 拓展功能菜单 - 有结果面板时隐藏 */}
      <ActionMenu
        actions={actions}
        inputValue={inputValue}
        isVisible={isPaperVisible && !resultPanel}
        direction={paperDirection}
        offset={paperOffset}
        paperWidth={paperWidth}
      />

      {/* 结果面板 - 纸条收起时同时隐藏 */}
      {isResultPanelVisible && resultPanel && (
        <ResultPanel
          ref={resultPanelRef}
          {...resultPanel}
          visible={!!resultPanel.visible}
          inputValue={inputValue}
          direction={paperDirection}
          offset={paperOffset}
          paperWidth={paperWidth}
          styleMode={styleMode}
          isDark={isDark}
          onPlacementChange={setResultPlacement}
          defaultPlacement={resultPlacement}
        />
      )}

      {/* 底部提示信息 */}
      <InfoBar
        direction={paperDirection}
        offset={paperOffset}
        paperWidth={paperWidth}
        isVisible={isPaperVisible}
        resultPlacement={effectivePlacement}
      >
        {infoContent}
      </InfoBar>

      {/* 机器人头部 */}
      <RobotHead
        ref={headRef}
        isRotated={isRotated}
        isMouthOpen={isMouthOpen}
        onClick={handleClick}
        eyeMode={loading ? 'loading' : delay > 0 ? 'countdown' : isSleeping ? 'sleeping' : eyeMode.mode}
        blinkInterval={eyeMode.mode === 'normal' ? eyeMode.blinkInterval : undefined}
        eyeLookDirection={isPaperVisible ? (paperDirection === 'left' ? 'down' : 'down') : null}
        countdownValue={delay}
        antennaBallColor={antennaBallColor}
        loading={loading}
        onAbort={onAbort}
        onMouthPositionChange={handleMouthPositionChange}
        rotateDirection={rotateDirection}
      />

      {/* 提示文字 */}
      {showHint && (
        <div className={`hint placement-${effectivePlacement}`}>
          {draggable ? '拖拽移动 / 点击展开' : '点击机器人收纳/展开'}
        </div>
      )}
    </div>
  );
}
