# 🤖 RobotPrinter

[English](#english) | **中文**

一个有趣的 React 组件 —— **机器人吐纸条**！

可用于 AI 对话、快捷指令、数据处理中间件等场景，自带独特的动画效果和交互体验。

展示页：[ai-island.boat2moon.com](https://ai-island.boat2moon.com)

一个在Tiatap智能文档项目中的应用：[rumuai.top](https://www.rumuai.top)

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
  > ⚠️ **已知问题**: Glass Mode 在 Chrome/Edge 下录屏时可能出现闪烁（肉眼不可见，但录屏会显示）。这是 Chromium 渲染引擎的 [已知 Bug](https://crbug.com/483220231)，在 Firefox 和 Safari 上完全正常。详见[技术分析](https://juejin.cn/spost/7605041451327848491)。
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

## 🛠️ 技术栈

- **React** 19+ (Hooks)
- **TypeScript** 5.9+ (严格模式)
- **Vite** 7.x (开发/构建)
- **Vitest** (单元测试，114+ 测试用例)
- **CSS Variables** (主题化)
- **ESLint** + **Prettier** (代码规范)
- **Husky** + **Commitlint** (Git Hooks + 提交规范)
- **GitHub Actions** (CI/CD)
- **sonner** (Toast 通知，Demo 使用)

## 📦 安装

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

# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage

# 类型检查
npm run type-check

# 构建生产版本
npm run build

# 构建组件库 (用于 npm 发布)
npm run build:lib

# 构建并生成 Bundle 分析报告
npm run build:lib:analyze
```

## 🚀 快速开始

```tsx
import { RobotPrinter } from './components/RobotPrinter';

function App() {
  const handleSubmit = (value: string) => {
    console.log('用户输入:', value);
    // 调用你的 AI API...
  };

  return <RobotPrinter placeholder="输入指令..." onSubmit={handleSubmit} />;
}
```

### 使用预设配置

内置多种场景预设，开箱即用：

```tsx
import { RobotPrinter, chatPreset, darkPreset, compactPreset } from './components/RobotPrinter';

// AI 聊天场景
<RobotPrinter {...chatPreset} onSubmit={handleSubmit} />

// 深色主题
<RobotPrinter {...darkPreset} onSubmit={handleSubmit} />

// 紧凑模式
<RobotPrinter {...compactPreset} onSubmit={handleSubmit} />
```

**可用预设**：`compactPreset` | `widePreset` | `chatPreset` | `darkPreset` | `demoPreset` | `minimalPreset` | `floatingPreset` | `loadingPreset`

### 错误边界包装

推荐使用错误边界包装组件，防止渲染错误导致页面崩溃：

```tsx
import { RobotPrinterErrorBoundary, RobotPrinter } from './components/RobotPrinter';

<RobotPrinterErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>组件出错: {error.message}</p>
      <button onClick={reset}>重试</button>
    </div>
  )}
>
  <RobotPrinter />
</RobotPrinterErrorBoundary>;
```

````

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
  | { mode: 'normal'; blinkInterval?: [number, number] }
  | { mode: 'loading' }
  | { mode: 'countdown' }
  | { mode: 'sleeping' };

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
  onPlacementChange?: (placement: 'top' | 'bottom') => void;
}
````

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
├── index.ts                # 主入口，导出所有公共 API
├── RobotPrinter.tsx        # 主组件
├── RobotPrinterRoot.tsx    # 复合组件根容器
├── types.ts                # 统一类型定义
├── constants.ts            # 常量配置
├── defaults.ts             # Props 默认值管理
├── presets.ts              # 配置预设 (chat, dark, compact...)
├── ErrorBoundary.tsx       # 错误边界组件
├── Paper.tsx               # 纸条输入框组件
├── ResultPanel.tsx         # 结果面板组件
├── InfoBar.tsx             # 底部提示栏组件
├── context/                # Context 模块
│   ├── RobotPrinterContext.tsx  # Provider
│   └── useRobotPrinter.ts       # Context Hooks
├── hooks/                  # 自定义 Hooks
│   ├── index.ts
│   ├── useDrag.ts          # 拖拽逻辑
│   ├── useAnimationPhase.ts # 动画阶段管理
│   ├── useAnimationMachine.ts # 状态机动画 (useReducer)
│   ├── useIdleDetection.ts  # 空闲检测
│   └── useTilt.ts          # 倾斜/阴影计算
├── utils/                  # 工具函数
│   ├── index.ts
│   ├── geometry.ts         # 几何计算
│   └── devWarnings.ts      # 开发环境警告
├── styles/                 # 模块化 CSS
│   ├── index.css           # 样式入口
│   ├── tokens.css          # 设计标记/CSS 变量
│   ├── animations.css      # 动画关键帧
│   ├── base.css            # 基础容器样式
│   ├── robot-head.css      # 机器人头部
│   ├── paper.css           # 纸条样式
│   ├── result-panel.css    # 结果面板
│   ├── action-menu.css     # 操作菜单
│   └── glass-backdrop.css  # 毛玻璃效果
├── menus/                  # 菜单模块
│   ├── index.ts
│   ├── types.ts
│   ├── ActionMenu.tsx
│   └── ActionButton.tsx
├── robot/                  # 机器人头部模块
│   ├── index.ts
│   ├── RobotHead.tsx
│   ├── Eyes.tsx
│   └── Antenna.tsx
└── __tests__/              # 单元测试 (114+ tests)
    ├── geometry.test.ts
    ├── useIdleDetection.test.ts
    ├── useTilt.test.ts
    ├── useAnimationMachine.test.ts
    ├── devWarnings.test.ts
    ├── defaults.test.ts
    ├── RobotPrinterContext.test.tsx
    └── RobotPrinterRoot.test.tsx
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
  > ⚠️ **Known Issue**: Glass Mode may flicker when screen recording in Chrome/Edge (invisible to naked eye, but visible in recordings). This is a [known Chromium bug](https://crbug.com/483220231), works perfectly in Firefox and Safari. See [technical analysis](./docs/blog-chromium-backdrop-filter-bug.md) for details.
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
- **TypeScript** 5.9+ (Strict mode)
- **Vite** 7.x (Development/Build)
- **Vitest** (Unit testing, 114+ test cases)
- **CSS Variables** (Theming)
- **ESLint** + **Prettier** (Code style)
- **Husky** + **Commitlint** (Git Hooks + Commit conventions)
- **GitHub Actions** (CI/CD)
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

# Run tests
npm run test

# Test coverage
npm run test:coverage

# Type check
npm run type-check

# Build for production
npm run build

# Build component library (for npm publish)
npm run build:lib

# Build with bundle analysis report
npm run build:lib:analyze
```

## 🚀 Quick Start

```tsx
import { RobotPrinter } from './components/RobotPrinter';

function App() {
  const handleSubmit = (value: string) => {
    console.log('User input:', value);
    // Call your AI API...
  };

  return <RobotPrinter placeholder="Enter command..." onSubmit={handleSubmit} />;
}
```

### Using Presets

Built-in presets for common scenarios:

```tsx
import { RobotPrinter, chatPreset, darkPreset, compactPreset } from './components/RobotPrinter';

// AI Chat scenario
<RobotPrinter {...chatPreset} onSubmit={handleSubmit} />

// Dark theme
<RobotPrinter {...darkPreset} onSubmit={handleSubmit} />

// Compact mode
<RobotPrinter {...compactPreset} onSubmit={handleSubmit} />
```

**Available presets**: `compactPreset` | `widePreset` | `chatPreset` | `darkPreset` | `demoPreset` | `minimalPreset` | `floatingPreset` | `loadingPreset`

### Error Boundary Wrapper

Recommended to wrap with error boundary to prevent render errors from crashing the page:

```tsx
import { RobotPrinterErrorBoundary, RobotPrinter } from './components/RobotPrinter';

<RobotPrinterErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Component error: {error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
>
  <RobotPrinter />
</RobotPrinterErrorBoundary>;
```

````

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
  | { mode: 'normal'; blinkInterval?: [number, number] }
  | { mode: 'loading' }
  | { mode: 'countdown' }
  | { mode: 'sleeping' };

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
  onPlacementChange?: (placement: 'top' | 'bottom') => void;
}
````

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
├── index.ts                # Entry point, exports all public APIs
├── RobotPrinter.tsx        # Main component
├── RobotPrinterRoot.tsx    # Compound component root container
├── types.ts                # Unified type definitions
├── constants.ts            # Constants configuration
├── defaults.ts             # Props defaults management
├── presets.ts              # Configuration presets (chat, dark, compact...)
├── ErrorBoundary.tsx       # Error boundary component
├── Paper.tsx               # Paper input component
├── ResultPanel.tsx         # Result panel component
├── InfoBar.tsx             # Info bar component
├── context/                # Context module
│   ├── RobotPrinterContext.tsx  # Provider
│   └── useRobotPrinter.ts       # Context Hooks
├── hooks/                  # Custom Hooks
│   ├── index.ts
│   ├── useDrag.ts          # Drag logic
│   ├── useAnimationPhase.ts # Animation phase management
│   ├── useAnimationMachine.ts # State machine animation (useReducer)
│   ├── useIdleDetection.ts  # Idle detection
│   └── useTilt.ts          # Tilt/shadow calculation
├── utils/                  # Utility functions
│   ├── index.ts
│   ├── geometry.ts         # Geometry calculations
│   └── devWarnings.ts      # Development warnings
├── styles/                 # Modular CSS
│   ├── index.css           # Style entry
│   ├── tokens.css          # Design tokens/CSS variables
│   ├── animations.css      # Animation keyframes
│   ├── base.css            # Base container styles
│   ├── robot-head.css      # Robot head
│   ├── paper.css           # Paper styles
│   ├── result-panel.css    # Result panel
│   ├── action-menu.css     # Action menu
│   └── glass-backdrop.css  # Glassmorphism effect
├── menus/                  # Menu module
│   ├── index.ts
│   ├── types.ts
│   ├── ActionMenu.tsx
│   └── ActionButton.tsx
├── robot/                  # Robot head module
│   ├── index.ts
│   ├── RobotHead.tsx
│   ├── Eyes.tsx
│   └── Antenna.tsx
└── __tests__/              # Unit tests (114+ tests)
    ├── geometry.test.ts
    ├── useIdleDetection.test.ts
    ├── useTilt.test.ts
    ├── useAnimationMachine.test.ts
    ├── devWarnings.test.ts
    ├── defaults.test.ts
    ├── RobotPrinterContext.test.tsx
    └── RobotPrinterRoot.test.tsx
```

---

## 🤝 Contributing

Issues and PRs welcome!

## 📄 License

MIT License
