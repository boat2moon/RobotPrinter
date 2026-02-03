# 🤖 RobotPrinter

[English](#english) | **中文**

一个有趣的 React 组件 —— **机器人吐纸条**！

可用于 AI 对话、快捷指令、数据处理中间件等场景，自带独特的动画效果和交互体验。

展示页：[www.boat2moon.com/robot-printer](https://ai-island.boat2moon.com)

一个在Tiatap智能文档项目中的应用：[www.rumuai.top](https://www.rumuai.top)

## ✨ 特性

- 🎨 **独特视觉风格** - 3D 机器人头部 + 可展开的复古纸条
- 🖱️ **可拖拽** - 支持在页面任意位置拖动
- 📝 **智能交互** - 输入框支持 Enter 提交，**右侧附带回车图标**，加载时自动锁定
- 🛑 **直观状态** - 眼睛显示加载脉冲/倒计时，**天线变身绿色中止按钮**
- 😴 **智能睡眠** - 深色模式或长时间无交互自动闭眼休息
- 🔗 **外部控制** - 支持通过 `expanded` prop 外部控制展开/收起
- 🎯 **功能按钮** - 可配置的操作按钮，支持悬停展开子菜单
- 📋 **结果面板** - 显示处理结果，支持替换/插入等操作
- 💬 **底部提示** - 可自定义的提示信息区域
- 🔧 **高度可配置** - 所有功能通过 props 注入，无业务逻辑耦合
- 💎 **Glass Mode** - 提供毛玻璃 (Glassmorphism) 风格选项，现代感十足
- 📐 **自适应布局** - 结果面板自动避让遮挡，位置参数完全可配

### 🔧 进阶配置

在 `src/components/RobotPrinter/ResultPanel.tsx` 文件顶部，你可以根据需要调整布局常量：

```typescript
// --- Glass 模式参数 ---
const GLASS_GAP_TOP = 35;
const GLASS_GAP_BOTTOM = 45;
const GLASS_OFFSET_LEFT = 30;
const GLASS_OFFSET_RIGHT = 30;

// --- Default 模式参数 ---
const DEFAULT_GAP_TOP = 65;
const DEFAULT_GAP_BOTTOM = 65;
// ...
```

## �️ 技术栈

- **React** 19+ (Hooks)
- **TypeScript** 5.9+
- **Vite** 7.x (开发/构建)
- **CSS Variables** (主题化)
- **sonner** (Toast 通知，Demo 使用)

## �📦 安装

```bash
# 将组件文件夹复制到你的项目中
cp -r src/components/RobotPrinter your-project/src/components/
```

### 开发 Demo

```bash
# 克隆仓库
git clone https://github.com/boat2moon/RobotPrinter.git
cd RobotPrinter

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

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

### 基础配置

| 属性             | 类型      | 默认值          | 说明                   |
| ---------------- | --------- | --------------- | ---------------------- |
| `placeholder`    | `string`  | `'输入记录...'` | 输入框占位符文本       |
| `defaultValue`   | `string`  | `''`            | 输入框初始值           |
| `paperWidth`     | `number`  | `500`           | 纸条宽度 (px)          |
| `showHint`       | `boolean` | `true`          | 是否显示底部操作提示   |
| `rotateDuration` | `number`  | `400`           | 机器人旋转动画时间(ms) |
| `paperDuration`  | `number`  | `600`           | 纸条展开动画时间(ms)   |

### 外观配置

| 属性               | 类型                   | 默认值                              | 说明                               |
| ------------------ | ---------------------- | ----------------------------------- | ---------------------------------- |
| `antennaBallColor` | `string \| string[]`   | `['#ff6b6b', '#e74c3c', '#c0392b']` | 天线小球颜色（加载时自动变为绿色） |
| `tiltStrength`     | `number`               | `1`                                 | 倾斜强度 (0-2)                     |
| `shadowStrength`   | `number`               | `1`                                 | 阴影强度 (0-2)                     |
| `styleMode`        | `'default' \| 'glass'` | `'default'`                         | 视觉风格 (新!)                     |
| `eyeMode`          | `EyeMode`              | `{ mode: 'normal' }`                | 眼睛模式配置，见下方类型定义       |

### 状态控制

| 属性               | 类型                          | 默认值  | 说明                                     |
| ------------------ | ----------------------------- | ------- | ---------------------------------------- |
| `loading`          | `boolean`                     | `false` | 加载状态，禁用输入并显示脉冲动画         |
| `delay`            | `number`                      | `0`     | 频率限制倒计时 (秒)，>0 时显示           |
| `expanded`         | `boolean`                     | -       | 外部控制展开状态（可选，不传则内部控制） |
| `onExpandedChange` | `(expanded: boolean) => void` | -       | 展开状态变化回调                         |
| `isDark`           | `boolean`                     | `false` | 是否深色模式 (影响眼睛空闲睡眠状态)      |
| `highlightTrigger` | `number`                      | `0`     | 值变化时触发抖动高亮动画                 |
| `position`         | `{ x: number; y: number }`    | -       | 外部控制位置（可选，受控模式）           |
| `onPositionChange` | `(pos: Position) => void`     | -       | 位置变化回调                             |

### 高级配置

| 属性          | 类型                | 说明                                |
| ------------- | ------------------- | ----------------------------------- |
| `actions`     | `ActionConfig[]`    | 纸条上方的操作菜单配置              |
| `resultPanel` | `ResultPanelConfig` | 结果显示面板的配置与状态            |
| `infoContent` | `ReactNode`         | 底部信息栏的自定义内容 (例如 token) |

#### 类型定义

```typescript
// 眼睛模式配置
type EyeMode =
  | { mode: "normal"; blinkInterval?: [number, number] }
  | { mode: "loading" }
  | { mode: "countdown" }
  | { mode: "sleeping" };

// 菜单动作配置
interface ActionConfig {
  label: string;
  onClick?: (value: string) => void;
  disabled?: boolean;
  subActions?: ActionConfig[]; // 递归子菜单
}

// 结果面板配置
interface ResultPanelConfig {
  visible: boolean;
  content: string;
  loading: boolean;
  onClose: () => void;
  actions?: ActionConfig[];
  onPlacementChange?: (placement: "top" | "bottom") => void;
}
```

### 用户回调

| 属性            | 类型                      | 说明                           |
| --------------- | ------------------------- | ------------------------------ |
| `onValueChange` | `(value: string) => void` | 输入内容变化时触发             |
| `onSubmit`      | `(value: string) => void` | 用户提交内容时触发 (Enter 键)  |
| `onAbort`       | `() => void`              | 用户点击绿色天线中止按钮时触发 |

### 拖拽配置

| 属性              | 类型                       | 默认值  | 说明                     |
| ----------------- | -------------------------- | ------- | ------------------------ |
| `draggable`       | `boolean`                  | `false` | 是否可拖拽               |
| `defaultPosition` | `{ x: number; y: number }` | 右下角  | 初始位置 (viewport 坐标) |

---

## 🎯 外部控制示例

```tsx
const [expanded, setExpanded] = useState(false);

// 外部按钮控制展开/收起
<button onClick={() => setExpanded(true)}>聚焦展开</button>
<button onClick={() => setExpanded(false)}>失焦收起</button>

<RobotPrinter
  expanded={expanded}
  onExpandedChange={setExpanded}
/>
```

---

## 📁 目录结构

```
RobotPrinter/
├── index.ts              # 主入口，导出所有公共 API
├── RobotPrinter.tsx      # 主组件
├── RobotPrinter.css      # 样式（CSS Variables 主题化）
├── Paper.tsx             # 纸条输入框组件
├── ResultPanel.tsx       # 结果面板组件
├── InfoBar.tsx           # 底部提示栏组件
├── menus/                # 菜单模块
│   ├── index.ts          # 菜单模块入口
│   ├── types.ts          # 菜单类型定义
│   ├── ActionMenu.tsx    # 菜单容器组件
│   └── ActionButton.tsx  # 菜单按钮组件
└── robot/                # 机器人头部模块
    ├── index.ts          # 头部模块入口
    ├── RobotHead.tsx     # 头部主组件
    ├── Eyes.tsx          # 眼睛组件（支持多种模式）
    └── Antenna.tsx       # 天线组件（加载时变绿色可中止）
```

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 许可证

MIT License

---

<a id="english"></a>

# 🤖 RobotPrinter

**English** | [中文](#)

A fun React component — **Robot Spitting Notes**!

Perfect for AI conversations, quick commands, data processing middleware, and more. Features unique animations and interactive experiences.

Demo: [www.boat2moon.com/robot-printer](https://www.boat2moon.com/robot-printer)

## ✨ Features

- 🎨 **Unique Visual Style** - 3D robot head + expandable vintage paper slip
- 🖱️ **Draggable** - Drag anywhere on the page
- 📝 **Smart Interaction** - Enter to submit, **visual Enter icon**, auto-locks during loading
- 🛑 **Intuitive States** - Eyes show loading pulse/countdown, **antenna turns green as abort button**
- 😴 **Smart Sleep** - Automatically sleeps in dark mode or when idle
- 🔗 **External Control** - Control expand/collapse via `expanded` prop
- 🎯 **Action Buttons** - Configurable buttons with hover submenus
- 📋 **Result Panel** - Display AI results with replace/insert actions
- 💬 **Info Bar** - Customizable hint area at bottom
- 🔧 **Highly Configurable** - All features via props, no business logic coupling
- 💎 **Glass Mode** - Provides Glassmorphism style option, modern look
- 📐 **Adaptive Layout** - Result panel automatically avoids obstructions, position is fully configurable

### 🔧 Advanced Configuration

You can adjust layout constants at the top of `src/components/RobotPrinter/ResultPanel.tsx` as needed:

```typescript
// --- Glass Mode Parameters ---
const GLASS_GAP_TOP = 35;
const GLASS_GAP_BOTTOM = 45;
const GLASS_OFFSET_LEFT = 30;
const GLASS_OFFSET_RIGHT = 30;

// --- Default Mode Parameters ---
const DEFAULT_GAP_TOP = 65;
const DEFAULT_GAP_BOTTOM = 65;
// ...
```

## 🛠️ Tech Stack

- **React** 19+ (Hooks)
- **TypeScript** 5.9+
- **Vite** 7.x (Development/Build)
- **CSS Variables** (Theming)
- **sonner** (Toast notifications, used in Demo)

## 📦 Installation

```bash
# Copy component folder to your project
cp -r src/components/RobotPrinter your-project/src/components/
```

### Development Demo

```bash
# Clone repository
git clone https://github.com/boat2moon/RobotPrinter.git
cd RobotPrinter

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🚀 Quick Start

```tsx
import { RobotPrinter } from "./components/RobotPrinter";

function App() {
  const handleSubmit = (value: string) => {
    console.log("User input:", value);
    // Call your AI API...
  };

  return (
    <RobotPrinter placeholder="Enter command..." onSubmit={handleSubmit} />
  );
}
```

## 📖 API Reference

### Basic Props

| Prop             | Type      | Default         | Description                   |
| ---------------- | --------- | --------------- | ----------------------------- |
| `placeholder`    | `string`  | `'输入记录...'` | Input placeholder text        |
| `defaultValue`   | `string`  | `''`            | Initial input value           |
| `paperWidth`     | `number`  | `500`           | Paper width (px)              |
| `showHint`       | `boolean` | `true`          | Show bottom hint              |
| `rotateDuration` | `number`  | `400`           | Robot rotation animation (ms) |
| `paperDuration`  | `number`  | `600`           | Paper expand animation (ms)   |

### Appearance

| Prop               | Type                   | Default                             | Description                                   |
| ------------------ | ---------------------- | ----------------------------------- | --------------------------------------------- |
| `antennaBallColor` | `string \| string[]`   | `['#ff6b6b', '#e74c3c', '#c0392b']` | Antenna ball color (turns green when loading) |
| `tiltStrength`     | `number`               | `1`                                 | Tilt intensity (0-2)                          |
| `shadowStrength`   | `number`               | `1`                                 | Shadow intensity (0-2)                        |
| `styleMode`        | `'default' \| 'glass'` | `'default'`                         | Visual style (New!)                           |
| `eyeMode`          | `EyeMode`              | `{ mode: 'normal' }`                | Eye mode config, see type defs below          |

### State Control

| Prop               | Type                          | Default | Description                                  |
| ------------------ | ----------------------------- | ------- | -------------------------------------------- |
| `loading`          | `boolean`                     | `false` | Loading state, disables input                |
| `delay`            | `number`                      | `0`     | Rate limit countdown (seconds)               |
| `expanded`         | `boolean`                     | -       | External control for expand state (optional) |
| `onExpandedChange` | `(expanded: boolean) => void` | -       | Callback when expand state changes           |
| `isDark`           | `boolean`                     | `false` | Dark mode flag (affects idle sleep state)    |
| `highlightTrigger` | `number`                      | `0`     | Changing this value triggers shake animation |
| `position`         | `{ x: number; y: number }`    | -       | External control for position (controlled)   |
| `onPositionChange` | `(pos: Position) => void`     | -       | Callback when position changes               |

### Advanced Configuration

| Prop          | Type                | Description                                |
| ------------- | ------------------- | ------------------------------------------ |
| `actions`     | `ActionConfig[]`    | Configuration for the action menu          |
| `resultPanel` | `ResultPanelConfig` | Configuration for the result display panel |
| `infoContent` | `ReactNode`         | Custom content for bottom info bar         |

#### Type Definitions

```typescript
// Eye Mode Configuration
type EyeMode =
  | { mode: "normal"; blinkInterval?: [number, number] }
  | { mode: "loading" }
  | { mode: "countdown" }
  | { mode: "sleeping" };

// Action Menu Configuration
interface ActionConfig {
  label: string;
  onClick?: (value: string) => void;
  disabled?: boolean;
  subActions?: ActionConfig[]; // Recursive submenu
}

// Result Panel Configuration
interface ResultPanelConfig {
  visible: boolean;
  content: string;
  loading: boolean;
  onClose: () => void;
  actions?: ActionConfig[];
  onPlacementChange?: (placement: "top" | "bottom") => void;
}
```

### User Callbacks

| Prop            | Type                      | Description                      |
| --------------- | ------------------------- | -------------------------------- |
| `onValueChange` | `(value: string) => void` | Triggered on input change        |
| `onSubmit`      | `(value: string) => void` | Triggered on Enter key           |
| `onAbort`       | `() => void`              | Triggered on green antenna click |

### Drag Configuration

| Prop              | Type                       | Default      | Description      |
| ----------------- | -------------------------- | ------------ | ---------------- |
| `draggable`       | `boolean`                  | `false`      | Enable dragging  |
| `defaultPosition` | `{ x: number; y: number }` | Bottom-right | Initial position |

---

## 🎯 External Control Example

```tsx
const [expanded, setExpanded] = useState(false);

// External buttons to control expand/collapse
<button onClick={() => setExpanded(true)}>Focus & Expand</button>
<button onClick={() => setExpanded(false)}>Blur & Collapse</button>

<RobotPrinter
  expanded={expanded}
  onExpandedChange={setExpanded}
/>
```

---

## 📁 Directory Structure

```
RobotPrinter/
├── index.ts              # Entry point, exports all public APIs
├── RobotPrinter.tsx      # Main component
├── RobotPrinter.css      # Styles (CSS Variables theming)
├── Paper.tsx             # Paper input component
├── ResultPanel.tsx       # Result panel component
├── InfoBar.tsx           # Info bar component
├── menus/                # Menu module
│   ├── index.ts          # Menu module entry
│   ├── types.ts          # Menu type definitions
│   ├── ActionMenu.tsx    # Menu container component
│   └── ActionButton.tsx  # Menu button component
└── robot/                # Robot head module
    ├── index.ts          # Head module entry
    ├── RobotHead.tsx     # Head main component
    ├── Eyes.tsx          # Eyes component (supports multiple modes)
    └── Antenna.tsx       # Antenna (turns green when loading, clickable to abort)
```

---

## 🤝 Contributing

Issues and PRs welcome!

## 📄 License

MIT License
