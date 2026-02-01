interface AntennaProps {
  /** 小球颜色，单色或渐变色数组 */
  ballColor?: string | string[];
}

/**
 * 天线组件（包含小球）
 */
export function Antenna({ 
  ballColor = ['#ff6b6b', '#e74c3c', '#c0392b'] 
}: AntennaProps) {
  const ballBackground = Array.isArray(ballColor)
    ? `radial-gradient(circle at 30% 30%, ${ballColor.join(', ')})`
    : ballColor;

  return (
    <div className="antenna">
      <div className="antenna-stem" />
      <div 
        className="antenna-ball" 
        style={{ background: ballBackground }}
      />
    </div>
  );
}
