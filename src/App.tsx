import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { RobotPrinter, type Position } from './components/RobotPrinter';
import { ReferenceBox } from './components/ReferenceBox';
import './App.css';

function App() {
  // 模拟加载状态
  const [loading, setLoading] = useState(false);
  const [delay, setDelay] = useState(0);
  
  // 外部控制展开状态（演示受控模式）
  const [expanded, setExpanded] = useState(false);

  // 外部控制位置和宽度（基准框吸附功能）
  // 外部控制位置和宽度（基准框吸附功能）
  const [currentPosition, setCurrentPosition] = useState<Position | undefined>(undefined);
  const [paperWidth, setPaperWidth] = useState(600);
  
  // 基准框状态
  // 基准框状态
  const [boxWidth, setBoxWidth] = useState(800);
  const [boxPosition, setBoxPosition] = useState({ x: window.innerWidth / 2 - 400, y: 225 }); // y: 280 避开顶部 Header
  // 是否包含天线宽度 (对齐偏好)
  const [includeAntenna, setIncludeAntenna] = useState(true);
  
  // 主题切换（默认浅色）
  const [isDark, setIsDark] = useState(false);
  
  // 根据主题切换 body 类名
  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);
  
  // 模拟结果面板
  const [result, setResult] = useState({
    visible: false,
    content: '',
    loading: false,
  });

  const handleSubmit = (value: string) => {
    console.log('提交内容:', value);
    
    // 模拟请求
    setLoading(true);
    setResult({ visible: true, content: '', loading: true });
    
    // 模拟流式输出
    let content = '';
    const text = `您输入了: "${value}"\n\n这是一个模拟的 AI 响应内容。\n机器人正在处理您的请求...`;
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < text.length) {
        content += text[i];
        setResult(prev => ({ ...prev, content }));
        i++;
      } else {
        clearInterval(interval);
        setLoading(false);
        setResult(prev => ({ ...prev, loading: false }));
        
        // 模拟频率限制
        setDelay(5);
        const countdown = setInterval(() => {
          setDelay(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }, 50);
  };

  const handleAbort = () => {
    console.log('中止请求');
    setLoading(false);
    setResult(prev => ({ ...prev, loading: false }));
  };

  // 执行吸附逻辑（纯函数式，基于传入宽度）
  const executeDock = (targetBoxWidth: number, shouldIncludeAntenna: boolean = includeAntenna) => {
    const screenCenter = window.innerWidth / 2;
    // 基准框中心
    const boxCenter = boxPosition.x + targetBoxWidth / 2;
    
    // 判断基准框在屏幕左侧还是右侧
    const isDockLeft = boxCenter < screenCenter;

    let targetX: number;
    
    // 修正对齐 (Based on Mathematical Derivation - Zero Gap):
    // Mode A (Include Antenna): Offset = 77px (Antenna Tip)
    // Mode B (Ignore Antenna): Offset = 43px (Head Scalp, 42.5 rounded up)
    const offset = shouldIncludeAntenna ? 77 : 43;

    if (isDockLeft) {
      // Robot Dock at Left Edge of Box
      targetX = boxPosition.x + offset;
    } else {
      // Robot Dock at Right Edge of Box (Default)
      targetX = boxPosition.x + targetBoxWidth - offset;
    }

    // 计算目标纸条宽度 (Derived Formula - Zero Gap):
    // Mode A (Include Antenna): BoxWidth - 92.
    // Mode B (Ignore Antenna):
    //   Robot moves RIGHT by (77 - 43) = 34px.
    //   To keep Paper Left Edge stationary (at Box Left), Paper Width must INCREASE by 34px.
    //   Width = (BoxWidth - 92) + 34 = BoxWidth - 58.
    const targetPaperWidth = shouldIncludeAntenna 
      ? targetBoxWidth - 92 
      : targetBoxWidth - 58;
    
    // 3. 目标Y坐标 (基准框下方)
    const targetY = boxPosition.y + 120 + 80; // 120 is fixed height
    
    // 执行变更
    setPaperWidth(targetPaperWidth);
    setCurrentPosition({ x: targetX, y: targetY });
    setExpanded(true); // 自动展开
  };

  // 切换天线包含模式
  const handleToggleAntenna = (checked: boolean) => {
    setIncludeAntenna(checked);
    // 立即以新模式重新吸附
    executeDock(boxWidth, checked);
  };
  
  // 宽度变更处理 (Enter 触发)
  const handleWidthChange = (newWidth: number) => {
    setBoxWidth(newWidth);
    executeDock(newWidth);
  };




  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      {/* 主题切换按钮 */}
      <button 
        className="theme-toggle"
        onClick={() => setIsDark(prev => !prev)}
        title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      
      <header className="header">
        <h1>ROBOT NOTES</h1>
        <p>Drag the robot around. Click to spit out a note.</p>
        <button 
          onClick={() => setExpanded(prev => !prev)} 
          style={{ marginTop: 10, padding: '8px 16px', cursor: 'pointer' }}
        >
          外部控制：{expanded ? '收起' : '展开'}
        </button>
      </header>

      {/* 基准框 - 可拖拽可调整宽度 */}
      <ReferenceBox 
        width={boxWidth}
        onWidthChange={handleWidthChange}
        position={boxPosition}
        onPositionChange={setBoxPosition}
        includeAntenna={includeAntenna}
        onIncludeAntennaChange={handleToggleAntenna}
        onDock={() => executeDock(boxWidth)}
      />

      {/* 可拖拽机器人 - 完整功能演示 */}
      <RobotPrinter
        draggable={true}
        defaultPosition={{ x: window.innerWidth - 100, y: window.innerHeight - 100 }}
        position={currentPosition}
        onPositionChange={setCurrentPosition}
        tiltStrength={2}
        shadowStrength={1.5}
        placeholder="输入记录..."
        onSubmit={handleSubmit}
        paperWidth={paperWidth}
        loading={loading}
        onAbort={handleAbort}
        delay={delay}
        expanded={expanded}
        onExpandedChange={setExpanded}
        isDark={isDark}
        actions={[
          { 
            label: '翻译', 
            subActions: [
              { label: '翻译为英文', onClick: (v) => console.log('翻译为英文:', v) },
              { label: '翻译为日文', onClick: (v) => console.log('翻译为日文:', v) },
              { label: '翻译为中文', onClick: (v) => console.log('翻译为中文:', v) },
            ]
          },
          { 
            label: '语气',
            subActions: [
              { label: '专业', onClick: (v) => console.log('专业语气:', v) },
              { label: '友好', onClick: (v) => console.log('友好语气:', v) },
              { label: '幽默', onClick: (v) => console.log('幽默语气:', v) },
            ]
          },
          { label: '总结', onClick: (v) => console.log('总结:', v) },
          { label: '优化', onClick: (v) => console.log('优化:', v) },
          { label: '待开发' }, // 没有 onClick，点击会显示"功能待实现"提示
        ]}
        resultPanel={result.visible ? {
          visible: result.visible,
          content: result.content,
          loading: result.loading,
          onClose: () => setResult({ visible: false, content: '', loading: false }),
          actions: [
            { label: '替换', onClick: () => console.log('替换') },
            { label: '插入', onClick: () => console.log('插入') },
            { label: '重新生成', onClick: () => handleSubmit('重新生成') },
          ],
        } : undefined}
        infoContent={
          <span>
            剩余 Token: <b>987,929</b> · 注意，AI 可能会生成错误信息，请自行检查判断
          </span>
        }
      />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
