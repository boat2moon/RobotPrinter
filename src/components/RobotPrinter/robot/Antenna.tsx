interface AntennaProps {
  /** 小球颜色，单色或渐变色数组 */
  ballColor?: string | string[];
  /** 是否处于加载状态（呼吸灯效果） */
  loading?: boolean;
  /** 点击小球回调（用于终止请求） */
  onBallClick?: () => void;
}

/**
 * 天线组件（包含小球）
 * 加载状态时小球放大显示停止图标，可点击终止
 * 注意：天线区域的点击始终被拦截，不会触发机器人转动
 */
export function Antenna({ 
  ballColor = ['#ff6b6b', '#e74c3c', '#c0392b'],
  loading = false,
  onBallClick,
}: AntennaProps) {
  const ballBackground = Array.isArray(ballColor)
    ? `radial-gradient(circle at 30% 30%, ${ballColor.join(', ')})`
    : ballColor;

  // 天线区域始终阻止事件冒泡（包括点击和按下），避免触发机器人转动
  const handleAntennaEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 点击小球触发终止（仅加载状态有效）
  const handleBallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) {
      onBallClick?.();
    }
  };

  return (
    <div 
      className="antenna" 
      onClick={handleAntennaEvent} 
      onMouseDown={handleAntennaEvent}
    >
      <div className="antenna-stem" />
      <div 
        className={`antenna-ball ${loading ? 'loading' : ''}`}
        style={{ background: ballBackground }}
        onClick={handleBallClick}
        onMouseDown={handleAntennaEvent}
      >
        {/* 加载状态时显示停止图标（小正方形） */}
        {loading && <div className="stop-icon" />}
      </div>
    </div>
  );
}
