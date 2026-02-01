import { RobotPrinter } from './components/RobotPrinter';
import './App.css';

function App() {
  const handleSubmit = (value: string) => {
    console.log('提交内容:', value);
    alert(`已记录: ${value}`);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>ROBOT NOTES</h1>
        <p>Drag the robot around. Click to spit out a note.</p>
      </header>

      {/* 可拖拽机器人 - 测试位置自适应 */}
      <RobotPrinter
        draggable={true}
        defaultPosition={{ x: window.innerWidth - 100, y: window.innerHeight - 100 }}
        tiltStrength={2}
        shadowStrength={1.5}
        placeholder="输入记录..."
        onSubmit={handleSubmit}
        paperWidth={600}
        actions={[
          { label: '翻译' },
          { label: '总结' },
          { label: '优化' },
        ]}
      />
    </div>
  );
}

export default App;
