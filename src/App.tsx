import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';

import { RobotPrinter, type Position } from './components/RobotPrinter';
import { ReferenceBox } from './components/ReferenceBox';
import './App.css';

function App() {
  // 模拟加载状态
  const [loading, setLoading] = useState(false);
  const [delay, setDelay] = useState(0);

  // 保存流式输出的定时器引用，用于终止时清除
  const streamingRef = useRef<{
    timeout?: ReturnType<typeof setTimeout>;
    interval?: ReturnType<typeof setInterval>;
  }>({});

  // 外部控制展开状态（演示受控模式）
  const [expanded, setExpanded] = useState(false);
  // 高亮/抖动触发器
  const [highlightTrigger, setHighlightTrigger] = useState(0);

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

  // 样式模式切换
  const [styleMode, setStyleMode] = useState<'default' | 'glass'>('default');

  // 根据主题切换 body 类名
  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  // 模拟结果面板
  const [result, setResult] = useState({
    visible: false,
    content: '',
    loading: false,
    source: 'submit' as 'submit' | 'summarize',
  });

  const handleSubmit = (value: string) => {
    // console.log('提交内容:', value);
    toast.success(`您输入了: "${value}"`);

    // 模拟请求
    setLoading(true);
    setResult({ visible: true, content: '', loading: true, source: 'submit' });

    // 模拟流式输出
    let content = '';
    const text = `您输入了: "${value}"\n\n这是一个模拟的 AI 响应内容。\n机器人正在处理您的请求...\n\nℹ️ “AI 生成中” 加载时长为模拟，实际由调用方控制。`;
    let i = 0;

    // 初始延迟，让 "AI 生成中......" 提示显示一段时间
    streamingRef.current.timeout = setTimeout(() => {
      streamingRef.current.interval = setInterval(() => {
        if (i < text.length) {
          content += text[i];
          setResult(prev => ({ ...prev, content }));
          i++;
        } else {
          clearInterval(streamingRef.current.interval);
          streamingRef.current = {};
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
    }, 1500); // 初始等待 1.5 秒
  };

  const handleAbort = () => {
    // 清除流式输出的定时器
    if (streamingRef.current.timeout) {
      clearTimeout(streamingRef.current.timeout);
    }
    if (streamingRef.current.interval) {
      clearInterval(streamingRef.current.interval);
    }
    streamingRef.current = {};

    // 只有在加载中时才显示终止提示
    if (loading) {
      toast.warning('请求已中止');
    }
    setLoading(false);
    setResult(prev => ({ ...prev, loading: false }));
  };

  // 模拟总结功能
  // 在实际使用中，这里可以返回 tiptap 编辑器的选中内容等
  const [summarizeContent] = useState(
    '这是一段模拟的需要总结的内容。\n在实际应用中，这里会是用户在 tiptap 编辑器中选中的文本，\n或者其他需要 AI 总结的内容。'
  );

  const handleSummarize = (inputValue: string): string | undefined => {
    // 这里模拟获取需要总结的内容
    // 实际场景中可以是：
    // - tiptap 编辑器的选中文本
    // - 某个文档的内容
    // - 其他需要总结的数据
    const contentToSummarize = summarizeContent;

    if (!contentToSummarize) {
      toast.warning('没有可总结的内容', {
        description: '请先选择需要总结的文本',
      });
      return undefined;
    }

    toast.info('正在总结...', {
      description: `内容长度: ${contentToSummarize.length} 字符`,
    });

    // 模拟请求
    setLoading(true);
    setResult({ visible: true, content: '', loading: true, source: 'summarize' });

    // 模拟流式输出总结结果
    let content = '';
    const text = `📝 总结结果\n\n原文要点：\n• 这是一段模拟内容\n• 用于演示总结功能\n• 实际使用时会连接 AI 服务\n\nℹ️ “AI 生成中” 加载时长为模拟，实际由调用方控制。${inputValue ? `\n\n💡 附加上下文: "${inputValue}"` : ''}`;
    let i = 0;

    // 初始延迟，让 "AI 生成中......" 提示显示一段时间
    streamingRef.current.timeout = setTimeout(() => {
      streamingRef.current.interval = setInterval(() => {
        if (i < text.length) {
          content += text[i];
          setResult(prev => ({ ...prev, content }));
          i++;
        } else {
          clearInterval(streamingRef.current.interval);
          streamingRef.current = {};
          setLoading(false);
          setResult(prev => ({ ...prev, loading: false }));

          // 模拟频率限制
          setDelay(3);
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
      }, 40);
    }, 1500); // 初始等待 1.5 秒

    return contentToSummarize;
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
    const targetPaperWidth = shouldIncludeAntenna ? targetBoxWidth - 92 : targetBoxWidth - 58;

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
        <div style={{ display: 'flex', gap: '10px', marginTop: 10, justifyContent: 'center' }}>
          <button
            onClick={() => (!expanded ? setExpanded(true) : setHighlightTrigger(h => h + 1))}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            外部控制：展开
          </button>
          <button
            onClick={() => (expanded ? setExpanded(false) : setHighlightTrigger(h => h + 1))}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            外部控制：收起
          </button>
          <button
            onClick={() => setStyleMode(prev => (prev === 'default' ? 'glass' : 'default'))}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            样式：{styleMode === 'default' ? '默认' : '毛玻璃'}
          </button>
        </div>
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
        onSummarize={handleSummarize}
        paperWidth={paperWidth}
        loading={loading}
        onAbort={handleAbort}
        delay={delay}
        expanded={expanded}
        onExpandedChange={setExpanded}
        highlightTrigger={highlightTrigger}
        isDark={isDark}
        styleMode={styleMode}
        actions={[
          {
            label: '翻译',
            subActions: [
              {
                label: '翻译为英文',
                onClick: v =>
                  toast.info(`已触发【翻译为英文】`, {
                    description: `这里收到了输入值 "${v}"。在实际代码中，请在此调用翻译接口并更新结果面板。`,
                  }),
              },
              {
                label: '翻译为日文',
                onClick: v =>
                  toast.info(`已触发【翻译为日文】`, {
                    description: `这里收到了输入值 "${v}"。回调函数类型为 (value: string) => void。`,
                  }),
              },
              {
                label: '翻译为中文',
                onClick: v =>
                  toast.info(`已触发【翻译为中文】`, {
                    description: `您可以根据输入值 "${v}" 进行流式请求或一次性请求。`,
                  }),
              },
            ],
          },
          {
            label: '改变语气',
            subActions: [
              {
                label: '专业',
                onClick: v =>
                  toast.info('选择了【专业】语气', {
                    description: `收到文本 "${v}"。您可以将 tone='professional' 参数传递给 AI。`,
                  }),
              },
              {
                label: '友好',
                onClick: v =>
                  toast.info('选择了【友好】语气', {
                    description: `收到文本 "${v}"。您可以将 tone='friendly' 参数传递给 AI。`,
                  }),
              },
              {
                label: '幽默',
                onClick: v =>
                  toast.info('选择了【幽默】语气', {
                    description: `收到文本 "${v}"。您可以将 tone='humorous' 参数传递给 AI。`,
                  }),
              },
            ],
          },
          {
            label: '总结',
            type: 'summarize', // 使用内置的总结功能类型
          },
          {
            label: '优化',
            onClick: v =>
              toast.info(`已触发【优化】`, { description: `针对文本 "${v}" 进行重写优化。` }),
          },
          { label: '待开发' }, // 没有 onClick，点击会显示"功能待实现"提示
        ]}
        resultPanel={
          result.visible
            ? {
                visible: result.visible,
                content: result.content,
                loading: result.loading,
                source: result.source,
                onClose: () => {
                  if (result.loading && result.content) {
                    // 加载中且有内容：仅终止请求，不关闭面板
                    handleAbort();
                  } else {
                    // 加载中但无内容，或非加载态：终止请求并关闭面板
                    handleAbort();
                    setResult({ visible: false, content: '', loading: false, source: 'submit' });
                  }
                },
                actions:
                  result.source === 'summarize'
                    ? [
                        // 总结场景下的操作按钮
                        {
                          label: '复制',
                          onClick: () =>
                            toast.success('已复制总结内容', {
                              description: '总结内容已复制到剪贴板',
                            }),
                        },
                        {
                          label: '插入',
                          onClick: () =>
                            toast.success('已点击【插入】按钮', {
                              description: '此处应实现将总结内容插入到编辑器的功能。',
                            }),
                        },
                        {
                          label: '重新总结',
                          onClick: () => {
                            // 重新触发总结，使用相同的内容
                            handleSummarize('');
                          },
                        },
                      ]
                    : [
                        // 提交场景下的操作按钮
                        {
                          label: '替换',
                          onClick: () =>
                            toast.success('已点击【替换】按钮', {
                              description:
                                'ResultPanel 的 actions 可用于对生成结果进行操作，例如替换编辑器选区。',
                            }),
                        },
                        {
                          label: '插入',
                          onClick: () =>
                            toast.success('已点击【插入】按钮', {
                              description: '此处应实现将 AI 生成的内容插入到编辑器光标处的功能。',
                            }),
                        },
                        { label: '重新生成', onClick: () => handleSubmit('重新生成') },
                      ],
              }
            : undefined
        }
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
