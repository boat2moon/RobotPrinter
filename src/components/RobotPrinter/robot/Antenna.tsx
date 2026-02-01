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
 */
export function Antenna({ 
  ballColor = ['#ff6b6b', '#e74c3c', '#c0392b'],
  loading = false,
  onBallClick,
}: AntennaProps) {
  const ballBackground = Array.isArray(ballColor)
    ? `radial-gradient(circle at 30% 30%, ${ballColor.join(', ')})`
    : ballColor;

  const handleClick = (e: React.MouseEvent) => {
    // 加载状态下阻止冒泡，避免触发机器人转动
    if (loading) {
      e.stopPropagation();
      onBallClick?.();
    }
  };

  return (
    <div className="antenna">
      <div className="antenna-stem" />
      <div 
        className={`antenna-ball ${loading ? 'loading' : ''}`}
        style={{ background: ballBackground }}
        onClick={handleClick}
        title={loading ? '点击停止' : undefined}
      />
    </div>
  );
}
