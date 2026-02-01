# 🤖 RobotPrinter

一个有趣的 React 组件 —— **机器人吐纸条**！

可用于 AI 对话、快捷指令、数据处理中间件等场景，自带独特的动画效果和交互体验。

展示页：[www.boat2moon.com/robot-printer](https://www.boat2moon.com/robot-printer)

## ✨ 特性

- 🎨 **独特视觉风格** - 3D 机器人头部 + 可展开的复古纸条
- 🖱️ **可拖拽** - 支持在页面任意位置拖动
- 📝 **智能交互** - 输入框支持 Enter 提交，**加载时自动锁定**，防止重复提交
- 🛑 **直观状态** - 眼睛显示加载脉冲/倒计时，**天线变身中止按钮**
- 🎯 **功能按钮** - 可配置的操作按钮，支持悬停展开子菜单
- 📋 **结果面板** - 显示处理结果，支持替换/插入等操作
- 💬 **底部提示** - 可自定义的提示信息区域
- 🔧 **高度可配置** - 所有功能通过 props 注入，无业务逻辑耦合

## 📦 安装

```bash
# 将组件文件夹复制到你的项目中
cp -r src/components/RobotPrinter your-project/src/components/
```

## 📁 目录结构

```
RobotPrinter/
├── index.ts              # 主入口，导出所有组件和类型
├── RobotPrinter.tsx      # 主组件（状态管理、动画控制）
├── RobotPrinter.css      # 所有样式（含动画关键帧）
├── Paper.tsx             # 纸条输入框（含加载状态、中止按钮）
├── ResultPanel.tsx       # 结果面板（AI 响应展示）
├── InfoBar.tsx           # 底部提示栏（Token、免责声明）
├── menus/                # 菜单模块
│   ├── index.ts          # 模块入口
│   ├── types.ts          # ActionConfig 类型定义
│   ├── ActionMenu.tsx    # 功能菜单容器
│   └── ActionButton.tsx  # 单个按钮（含悬停子菜单）
├── robot/                # 机器人头部模块
│   ├── index.ts          # 模块入口
│   ├── RobotHead.tsx     # 头部主组件（旋转、嘴巴动画）
│   ├── Eyes.tsx          # 眼睛（眨眼、跟随、脉冲动画）
│   └── Antenna.tsx       # 天线（渐变小球）
└── README.md             # 本文档
```

### 模块说明

| 模块              | 用途               | 是否可独立使用        |
| ----------------- | ------------------ | --------------------- |
| `menus/`          | 功能按钮和子菜单   | ✅ 可复用于其他场景   |
| `robot/`          | 机器人头部视觉效果 | ✅ 可独立作为装饰组件 |
| `Paper.tsx`       | 输入框核心         | ⚠️ 依赖 CSS 样式      |
| `ResultPanel.tsx` | AI 结果展示        | ⚠️ 依赖 CSS 样式      |

## 🚀 快速开始

```tsx
import { RobotPrinter } from "./components/RobotPrinter";

function App() {
  const handleSubmit = (value: string) => {
    console.log("用户输入:", value);
    // 调用你的 AI API...
  };

  return <RobotPrinter placeholder="输入指令..." onSubmit={handleSubmit} />;
}
```

## 📖 API 文档

### RobotPrinterProps

#### 基础配置

| 属性           | 类型      | 默认值          | 说明                 |
| -------------- | --------- | --------------- | -------------------- |
| `placeholder`  | `string`  | `'输入记录...'` | 输入框占位符文本     |
| `defaultValue` | `string`  | `''`            | 输入框初始值         |
| `paperWidth`   | `number`  | `500`           | 纸条宽度 (px)        |
| `showHint`     | `boolean` | `true`          | 是否显示底部操作提示 |

#### 外观配置

| 属性               | 类型                 | 默认值                              | 说明                                 |
| ------------------ | -------------------- | ----------------------------------- | ------------------------------------ |
| `antennaBallColor` | `string \| string[]` | `['#ff6b6b', '#e74c3c', '#c0392b']` | 天线小球颜色，支持单色或渐变数组     |
| `tiltStrength`     | `number`             | `1`                                 | 倾斜强度 (0-2)，控制展开时的倾斜角度 |
| `shadowStrength`   | `number`             | `1`                                 | 阴影强度 (0-2)，控制动态阴影偏移     |

#### 动画配置

| 属性             | 类型      | 默认值               | 说明                    |
| ---------------- | --------- | -------------------- | ----------------------- |
| `rotateDuration` | `number`  | `400`                | 机器人旋转动画时间 (ms) |
| `paperDuration`  | `number`  | `600`                | 纸条展开动画时间 (ms)   |
| `eyeMode`        | `EyeMode` | `{ mode: 'normal' }` | 眼睛模式配置            |

#### 拖拽配置

| 属性              | 类型                       | 默认值  | 说明                     |
| ----------------- | -------------------------- | ------- | ------------------------ |
| `draggable`       | `boolean`                  | `false` | 是否可拖拽               |
| `defaultPosition` | `{ x: number; y: number }` | 右下角  | 初始位置 (viewport 坐标) |

---

### 用户回调函数

> ⚠️ 这些函数需要你自己实现业务逻辑

| 属性            | 类型                      | 说明                          |
| --------------- | ------------------------- | ----------------------------- |
| `onValueChange` | `(value: string) => void` | 输入内容变化时触发            |
| `onSubmit`      | `(value: string) => void` | 用户提交内容时触发 (Enter 键) |
| `onAbort`       | `() => void`              | 用户点击中止按钮时触发        |

---

### 状态控制

> 这些状态由你的业务逻辑控制，传递给组件用于 UI 展示

| 属性      | 类型      | 默认值  | 说明                             |
| --------- | --------- | ------- | -------------------------------- |
| `loading` | `boolean` | `false` | 加载状态，禁用输入并显示 spinner |
| `delay`   | `number`  | `0`     | 频率限制倒计时 (秒)，>0 时显示   |

---

### 功能按钮配置 (actions)

```tsx
interface ActionConfig {
  /** 按钮文本 */
  label: string;
  /** 点击回调，参数为当前输入值 */
  onClick?: (value: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 二级子菜单（鼠标悬停展开） */
  subActions?: ActionConfig[];
}
```

**示例：**

```tsx
<RobotPrinter
  actions={[
    {
      label: "翻译",
      subActions: [
        { label: "翻译为英文", onClick: (v) => translateTo("en", v) },
        { label: "翻译为中文", onClick: (v) => translateTo("zh", v) },
      ],
    },
    { label: "总结", onClick: (v) => summarize(v) },
    { label: "优化", onClick: (v) => optimize(v), disabled: !hasContent },
  ]}
/>
```

---

### 结果面板 (resultPanel)

用于显示 AI 处理结果，支持流式内容更新。

```tsx
interface ResultPanelConfig {
  /** 是否显示面板 */
  visible: boolean;
  /** 面板内容（支持流式更新） */
  content: string;
  /** 是否加载中 */
  loading: boolean;
  /** 关闭面板回调 */
  onClose: () => void;
  /** 操作按钮 */
  actions?: ActionConfig[];
}
```

**示例：**

```tsx
const [result, setResult] = useState({
  visible: false,
  content: "",
  loading: false,
});

// AI 响应时更新 content
// 流式输出：逐字追加到 content

<RobotPrinter
  resultPanel={
    result.visible
      ? {
          visible: result.visible,
          content: result.content,
          loading: result.loading,
          onClose: () =>
            setResult({ visible: false, content: "", loading: false }),
          actions: [
            { label: "替换", onClick: () => replaceSelection(result.content) },
            { label: "插入", onClick: () => insertContent(result.content) },
            { label: "重新生成", onClick: () => reGenerate() },
          ],
        }
      : undefined
  }
/>;
```

---

### 底部提示 (infoContent)

显示在纸条下方，适合展示 Token 剩余、免责声明等信息。

```tsx
<RobotPrinter
  infoContent={
    <span>
      剩余 Token: <b>{tokenRemaining}</b> · 注意，AI
      可能会生成错误信息，请自行检查判断
    </span>
  }
/>
```

---

## 🎯 完整示例

```tsx
import { useState } from "react";
import { RobotPrinter } from "./components/RobotPrinter";

function AIAssistant() {
  const [loading, setLoading] = useState(false);
  const [delay, setDelay] = useState(0);
  const [result, setResult] = useState({
    visible: false,
    content: "",
    loading: false,
  });

  // 调用 AI API
  const handleSubmit = async (value: string) => {
    setLoading(true);
    setResult({ visible: true, content: "", loading: true });

    try {
      // 流式请求示例
      const response = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ prompt: value }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setResult((prev) => ({
          ...prev,
          content: prev.content + chunk,
        }));
      }

      setResult((prev) => ({ ...prev, loading: false }));

      // 频率限制
      setDelay(5);
      const countdown = setInterval(() => {
        setDelay((prev) =>
          prev <= 1 ? (clearInterval(countdown), 0) : prev - 1,
        );
      }, 1000);
    } catch (error) {
      console.error("AI 请求失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbort = () => {
    // 中止逻辑...
    setLoading(false);
    setResult((prev) => ({ ...prev, loading: false }));
  };

  return (
    <RobotPrinter
      draggable
      placeholder="输入 AI 指令..."
      onSubmit={handleSubmit}
      onAbort={handleAbort}
      loading={loading}
      delay={delay}
      paperWidth={600}
      actions={[
        {
          label: "翻译",
          subActions: [
            {
              label: "翻译为英文",
              onClick: (v) => handleSubmit(`翻译为英文: ${v}`),
            },
            {
              label: "翻译为中文",
              onClick: (v) => handleSubmit(`翻译为中文: ${v}`),
            },
          ],
        },
        { label: "总结", onClick: (v) => handleSubmit(`总结: ${v}`) },
      ]}
      resultPanel={
        result.visible
          ? {
              ...result,
              onClose: () =>
                setResult({ visible: false, content: "", loading: false }),
              actions: [
                {
                  label: "复制",
                  onClick: () => navigator.clipboard.writeText(result.content),
                },
                {
                  label: "关闭",
                  onClick: () =>
                    setResult({ visible: false, content: "", loading: false }),
                },
              ],
            }
          : undefined
      }
      infoContent={<span>剩余 Token: 987,929</span>}
    />
  );
}
```

---

## 🎨 自定义样式

组件样式位于 `RobotPrinter.css`，可以通过修改 CSS 变量自定义：

```css
.robot-printer {
  /* 动画时长 */
  --paper-duration: 600ms;

  /* 纸条颜色 */
  --paper-bg: linear-gradient(135deg, #fefefe 0%, #f5f0e6 100%);

  /* 按钮样式 */
  --action-btn-bg: linear-gradient(145deg, #f8f6f0 0%, #ebe8e0 100%);
}
```

### 主要 CSS 类名

| 类名                  | 说明     | 自定义建议                 |
| --------------------- | -------- | -------------------------- |
| `.robot-printer`      | 容器     | 调整 `z-index`、`position` |
| `.robot-head-wrapper` | 头部容器 | 修改阴影、尺寸             |
| `.face-screen`        | 脸部屏幕 | 调整背景色、圆角           |
| `.eye`                | 眼睛     | 修改颜色、尺寸             |
| `.paper`              | 纸条     | 调整背景、边框、阴影       |
| `.action-btn`         | 功能按钮 | 修改配色、hover 效果       |
| `.result-panel`       | 结果面板 | 调整尺寸、背景             |

---

## 📝 类型导出

```tsx
import {
  RobotPrinter,
  type RobotPrinterProps,
  type ActionConfig,
  type ResultPanelConfig,
  type EyeMode,
  type Position,
} from "./components/RobotPrinter";
```

---

## 🔧 二次开发指南

### 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    RobotPrinter                         │
│  ┌─────────────┐  ┌──────────────────────────────────┐  │
│  │  RobotHead  │  │             Paper                │  │
│  │  ┌───────┐  │  │  ┌─────────────────────────────┐ │  │
│  │  │ Eyes  │  │  │  │        <textarea>           │ │  │
│  │  └───────┘  │  │  └─────────────────────────────┘ │  │
│  │  ┌───────┐  │  └──────────────────────────────────┘  │
│  │  │Antenna│  │                                        │
│  │  └───────┘  │  ┌──────────────────────────────────┐  │
│  └─────────────┘  │          ActionMenu              │  │
│                   └──────────────────────────────────┘  │
│                   ┌──────────────────────────────────┐  │
│                   │         ResultPanel              │  │
│                   └──────────────────────────────────┘  │
│                   ┌──────────────────────────────────┐  │
│                   │           InfoBar                │  │
│                   └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 扩展菜单按钮

在 `menus/` 目录下创建新的按钮类型：

```tsx
// menus/IconButton.tsx
import type { ActionConfig } from "./types";

interface IconButtonProps extends ActionConfig {
  icon: React.ReactNode;
}

export function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button className="action-btn" onClick={() => onClick?.("")}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
```

### 扩展机器人外观

在 `robot/` 目录下创建新的装饰组件：

```tsx
// robot/Badge.tsx
interface BadgeProps {
  count: number;
}

export function Badge({ count }: BadgeProps) {
  if (count <= 0) return null;

  return <div className="robot-badge">{count > 99 ? "99+" : count}</div>;
}
```

然后在 `RobotHead.tsx` 中使用：

```tsx
<div className="head-body">
  {/* ... 其他内容 */}
  <Badge count={unreadCount} />
</div>
```

### 回调函数实现模式

#### 流式 AI 响应

```tsx
const handleSubmit = async (value: string) => {
  setLoading(true);
  setResult({ visible: true, content: "", loading: true });

  const response = await fetch("/api/ai/stream", {
    method: "POST",
    body: JSON.stringify({ prompt: value }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    // 逐块追加内容
    const chunk = decoder.decode(value);
    setResult((prev) => ({
      ...prev,
      content: prev.content + chunk,
    }));
  }

  setResult((prev) => ({ ...prev, loading: false }));
  setLoading(false);
};
```

#### 中止请求

```tsx
const abortControllerRef = useRef<AbortController | null>(null);

const handleSubmit = async (value: string) => {
  // 创建新的 AbortController
  abortControllerRef.current = new AbortController();

  try {
    const response = await fetch("/api/ai", {
      signal: abortControllerRef.current.signal,
      // ...
    });
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("请求已中止");
    }
  }
};

const handleAbort = () => {
  abortControllerRef.current?.abort();
  setLoading(false);
};
```

#### 频率限制

```tsx
const [delay, setDelay] = useState(0);

// 请求完成后启动倒计时
const startCooldown = (seconds: number) => {
  setDelay(seconds);
  const timer = setInterval(() => {
    setDelay((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};
```

---

## 🐛 常见问题

### Q: 纸条展开方向如何控制？

通过 `defaultPosition` 控制机器人位置，组件会自动计算纸条应该向左还是向右展开。

### Q: 如何禁用拖拽功能？

不设置 `draggable` 属性，或设置为 `false`：

```tsx
<RobotPrinter draggable={false} />
```

### Q: 如何完全隐藏机器人头部？

可以通过 CSS 隐藏：

```css
.robot-head-wrapper {
  display: none;
}
```

但不建议这样做，因为点击头部是展开/收起的交互方式。

### Q: 如何修改眼睛颜色？

修改 CSS 中 `.pupil` 的 `background` 属性：

```css
.pupil {
  background: radial-gradient(circle at 30% 30%, #00ff00, #008800);
}
```

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 许可证

MIT License
