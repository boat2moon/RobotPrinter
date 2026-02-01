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
 * 加载状态时小球显示呼吸灯效果，可点击终止
 * 注意：加载状态下整个天线区域的点击都会被拦截
 */
export function Antenna({ 
  ballColor = ['#ff6b6b', '#e74c3c', '#c0392b'],
  loading = false,
  onBallClick,
}: AntennaProps) {
  const ballBackground = Array.isArray(ballColor)
    ? `radial-gradient(circle at 30% 30%, ${ballColor.join(', ')})`
    : ballColor;

  // 加载状态下阻止整个天线区域的点击冒泡
  const handleAntennaClick = (e: React.MouseEvent) => {
    if (loading) {
      e.stopPropagation();
    }
  };

  // 点击小球触发终止
  const handleBallClick = (e: React.MouseEvent) => {
    if (loading) {
      e.stopPropagation();
      onBallClick?.();
    }
  };

  return (
    <div className="antenna" onClick={handleAntennaClick}>
      <div className="antenna-stem" />
      <div 
        className={`antenna-ball ${loading ? 'loading' : ''}`}
        style={{ background: ballBackground }}
        onClick={handleBallClick}
        title={loading ? '点击停止' : undefined}
      />
    </div>
  );
}
