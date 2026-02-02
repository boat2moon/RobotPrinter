import { useState, useRef, useEffect } from 'react';
import './ReferenceBox.css';

export interface Position {
  x: number;
  y: number;
}

export interface ReferenceBoxProps {
  /** 基准框宽度 */
  width: number;
  /** 宽度变更回调 */
  onWidthChange: (width: number) => void;
  /** 当前位置 */
  position: Position;
  /** 位置变更回调 (用于拖拽) */
  onPositionChange: (pos: Position) => void;
  /** 是否包含天线宽度 */
  includeAntenna: boolean;
  /** 天线包含/忽略切换回调 */
  onIncludeAntennaChange: (include: boolean) => void;
  /** 执行吸附动作 */
  onDock: () => void;
}

export const ReferenceBox = ({
  width,
  onWidthChange,
  position,
  onPositionChange,
  includeAntenna,
  onIncludeAntennaChange,
  onDock,
}: ReferenceBoxProps) => {
  // 本地临时状态，用于输入框编辑
  const [tempWidth, setTempWidth] = useState(String(width));
  const dockRef = useRef<HTMLDivElement>(null);
  
  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  // 当外部宽度 update 时同步本地状态
  useEffect(() => {
    setTempWidth(String(width));
  }, [width]);

  // 拖拽处理
  const handleMouseDown = (e: React.MouseEvent) => {
    // 忽略 input 和 checkbox 点击
    if (['input', 'button', 'label'].includes((e.target as HTMLElement).tagName.toLowerCase())) return;
    
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      onPositionChange({
        x: dragStartRef.current.startX + deltaX,
        y: dragStartRef.current.startY + deltaY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onPositionChange]);

  // 输入框事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newWidth = parseInt(tempWidth) || 800;
      onWidthChange(newWidth); // 提交变更给父组件 (父组件应负责调用 onDock 或其他副作用)
    }
  };

  const handleDockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDock();
  };

  return (
    <div 
      ref={dockRef}
      className="reference-box"
      style={{ 
        left: position.x, 
        top: position.y,
        width: width,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="box-content">
        <div className="box-header">
          <span>基准框 (拖拽移动)</span>
          <button className="dock-btn" onClick={handleDockClick}>点击吸附</button>
        </div>
        
        <div className="control-item width-input">
          <label>宽度:</label>
          <input 
            type="number" 
            value={tempWidth} 
            onChange={(e) => setTempWidth(e.target.value)}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
            placeholder="按回车生效"
          />
          <span>px</span>
        </div>

        <div className="control-item checkbox-row">
          <label title="开启时：基准框包含机器人的天线宽度；关闭时：机器人头皮与基准框对齐，天线突出在外">
            <input 
              type="checkbox" 
              checked={includeAntenna} 
              onChange={(e) => onIncludeAntennaChange(e.target.checked)}
              onMouseDown={(e) => e.stopPropagation()}
            />
            包含天线宽度
          </label>
        </div>
      </div>
    </div>
  );
};
