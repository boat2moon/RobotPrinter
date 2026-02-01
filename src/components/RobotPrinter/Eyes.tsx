import { useEffect, useState, useRef, useLayoutEffect } from 'react';

interface EyesProps {
  /** 是否正在眨眼 */
  isBlinking?: boolean;
  /** 是否为加载中模式 */
  isLoading?: boolean;
  /** 是否启用鼠标跟随（仅普通模式生效） */
  followMouse?: boolean;
  /** 固定注视方向（设置后优先于鼠标跟随） */
  lookDirection?: 'left' | 'right' | 'up' | 'down' | null;
}

/**
 * 眼睛组件
 * 支持眨眼、加载中动画、鼠标跟随、固定注视方向
 * 最大偏移量根据眼睛和瞳孔的实际尺寸动态计算
 */
export function Eyes({ 
  isBlinking = false, 
  isLoading = false,
  followMouse = true,
  lookDirection = null,
}: EyesProps) {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [maxOffset, setMaxOffset] = useState({ x: 3, y: 3.5 }); // 默认值，会被动态计算覆盖
  const eyesRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);
  
  // 动态计算最大偏移量（基于眼睛和瞳孔的实际尺寸）
  useLayoutEffect(() => {
    const calculateMaxOffset = () => {
      if (!eyeRef.current || !pupilRef.current) return;
      
      const eyeRect = eyeRef.current.getBoundingClientRect();
      const pupilRect = pupilRef.current.getBoundingClientRect();
      
      // 最大偏移 = (眼睛尺寸 - 瞳孔尺寸) / 2，留1px边距
      const maxX = (eyeRect.width - pupilRect.width) / 2 - 1;
      const maxY = (eyeRect.height - pupilRect.height) / 2 - 1;
      
      setMaxOffset({ x: Math.max(0, maxX), y: Math.max(0, maxY) });
    };

    calculateMaxOffset();
    window.addEventListener('resize', calculateMaxOffset);
    return () => window.removeEventListener('resize', calculateMaxOffset);
  }, []);
  
  // 鼠标跟随效果（仅在没有固定注视方向时生效）
  useEffect(() => {
    // 如果有固定注视方向，使用动态计算的最大偏移
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
    
    if (isLoading || !followMouse) {
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
      
      // 使用 atan2 获取角度，确保所有方向一致
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // 距离越远，偏移越接近最大值（使用对数衰减）
      const factor = Math.min(1, Math.log(distance / 20 + 1) / 2);
      
      const offsetX = Math.cos(angle) * maxOffset.x * factor;
      const offsetY = Math.sin(angle) * maxOffset.y * factor;
      
      setPupilOffset({ x: offsetX, y: offsetY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLoading, followMouse, lookDirection, maxOffset]);
  
  const eyeClassName = `eye ${isBlinking ? 'blink' : ''} ${isLoading ? 'loading' : ''}`;
  
  const pupilStyle = !isLoading ? {
    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
  } : {};
  
  return (
    <div className="eyes-container" ref={eyesRef}>
      <div className={`${eyeClassName} eye-left`} ref={eyeRef}>
        <div className="pupil" style={pupilStyle} ref={pupilRef} />
      </div>
      <div className={`${eyeClassName} eye-right`}>
        <div className="pupil" style={pupilStyle} />
      </div>
    </div>
  );
}
