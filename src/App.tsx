import { useState } from 'react';
import { RobotPrinter } from './components/RobotPrinter';
import './App.css';

function App() {
  // 模拟加载状态
  const [loading, setLoading] = useState(false);
  const [delay, setDelay] = useState(0);
  
  // 外部控制展开状态（演示受控模式）
  const [expanded, setExpanded] = useState(false);
  
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

  return (
    <div className="app">
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

      {/* 可拖拽机器人 - 完整功能演示 */}
      <RobotPrinter
        draggable={true}
        defaultPosition={{ x: window.innerWidth - 100, y: window.innerHeight - 100 }}
        tiltStrength={2}
        shadowStrength={1.5}
        placeholder="输入记录..."
        onSubmit={handleSubmit}
        paperWidth={600}
        loading={loading}
        onAbort={handleAbort}
        delay={delay}
        expanded={expanded}
        onExpandedChange={setExpanded}
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
    </div>
  );
}

export default App;
