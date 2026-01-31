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
        <p>Click the robot to spit out a note.</p>
      </header>

      {/* 底部停靠的机器人 */}
      <div className="bottom-dock">
        <RobotPrinter
          placeholder="输入记录..."
          onSubmit={handleSubmit}
          paperWidth={500}
        />
      </div>
    </div>
  );
}

export default App;
