import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

import {
  RobotPrinterProvider,
  type RobotPrinterProviderProps,
} from '../context/RobotPrinterContext';
import { useRobotPrinter, useRobotPrinterOptional } from '../context/useRobotPrinter';
import { DEFAULTS, ANIMATION, LAYOUT } from '../constants';

// 测试用的消费组件
function TestConsumer() {
  const ctx = useRobotPrinter();
  return (
    <div>
      <span data-testid="expanded">{String(ctx.expanded)}</span>
      <span data-testid="inputValue">{ctx.inputValue}</span>
      <span data-testid="loading">{String(ctx.loading)}</span>
      <span data-testid="isDark">{String(ctx.isDark)}</span>
      <span data-testid="styleMode">{ctx.styleMode}</span>
      <span data-testid="placeholder">{ctx.placeholder}</span>
      <span data-testid="paperWidth">{ctx.paperWidth}</span>
      <button data-testid="toggleExpand" onClick={() => ctx.setExpanded(!ctx.expanded)}>
        Toggle
      </button>
      <button data-testid="setInput" onClick={() => ctx.setInputValue('test input')}>
        Set Input
      </button>
      <button data-testid="submit" onClick={() => ctx.submit()}>
        Submit
      </button>
      <button data-testid="abort" onClick={() => ctx.abort()}>
        Abort
      </button>
    </div>
  );
}

// 包装器辅助函数
function renderWithProvider(
  props: Partial<RobotPrinterProviderProps> = {},
  consumer: React.ReactNode = <TestConsumer />
) {
  return render(<RobotPrinterProvider {...props}>{consumer}</RobotPrinterProvider>);
}

describe('RobotPrinterContext', () => {
  beforeEach(() => {
    // Mock window dimensions
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('默认值', () => {
    it('应提供正确的默认状态', () => {
      renderWithProvider();

      expect(screen.getByTestId('expanded').textContent).toBe('false');
      expect(screen.getByTestId('inputValue').textContent).toBe('');
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('isDark').textContent).toBe('false');
      expect(screen.getByTestId('styleMode').textContent).toBe('default');
    });

    it('应使用常量中的默认配置', () => {
      renderWithProvider();

      expect(screen.getByTestId('placeholder').textContent).toBe(DEFAULTS.PLACEHOLDER);
      expect(screen.getByTestId('paperWidth').textContent).toBe(String(LAYOUT.DEFAULT_PAPER_WIDTH));
    });
  });

  describe('自定义初始值', () => {
    it('应接受 defaultExpanded', () => {
      renderWithProvider({ defaultExpanded: true });
      expect(screen.getByTestId('expanded').textContent).toBe('true');
    });

    it('应接受 defaultValue', () => {
      renderWithProvider({ defaultValue: 'initial text' });
      expect(screen.getByTestId('inputValue').textContent).toBe('initial text');
    });

    it('应接受自定义配置', () => {
      renderWithProvider({
        placeholder: '自定义占位符',
        paperWidth: 500,
        styleMode: 'glass',
        isDark: true,
        loading: true,
      });

      expect(screen.getByTestId('placeholder').textContent).toBe('自定义占位符');
      expect(screen.getByTestId('paperWidth').textContent).toBe('500');
      expect(screen.getByTestId('styleMode').textContent).toBe('glass');
      expect(screen.getByTestId('isDark').textContent).toBe('true');
      expect(screen.getByTestId('loading').textContent).toBe('true');
    });
  });

  describe('状态更新', () => {
    it('setExpanded 应更新 expanded 状态', () => {
      renderWithProvider();

      expect(screen.getByTestId('expanded').textContent).toBe('false');

      fireEvent.click(screen.getByTestId('toggleExpand'));

      expect(screen.getByTestId('expanded').textContent).toBe('true');
    });

    it('setInputValue 应更新输入值', () => {
      renderWithProvider();

      expect(screen.getByTestId('inputValue').textContent).toBe('');

      fireEvent.click(screen.getByTestId('setInput'));

      expect(screen.getByTestId('inputValue').textContent).toBe('test input');
    });
  });

  describe('回调触发', () => {
    it('onExpandedChange 应在 expanded 变化时触发', () => {
      const onExpandedChange = vi.fn();
      renderWithProvider({ onExpandedChange });

      fireEvent.click(screen.getByTestId('toggleExpand'));

      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    it('onValueChange 应在输入值变化时触发', () => {
      const onValueChange = vi.fn();
      renderWithProvider({ onValueChange });

      fireEvent.click(screen.getByTestId('setInput'));

      expect(onValueChange).toHaveBeenCalledWith('test input');
    });

    it('onSubmit 应在提交时触发（有内容时）', () => {
      const onSubmit = vi.fn();
      renderWithProvider({ defaultValue: 'hello', onSubmit });

      fireEvent.click(screen.getByTestId('submit'));

      expect(onSubmit).toHaveBeenCalledWith('hello');
    });

    it('onSubmit 不应在空内容时触发', () => {
      const onSubmit = vi.fn();
      renderWithProvider({ defaultValue: '   ', onSubmit });

      fireEvent.click(screen.getByTestId('submit'));

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('onAbort 应在中止时触发', () => {
      const onAbort = vi.fn();
      renderWithProvider({ onAbort });

      fireEvent.click(screen.getByTestId('abort'));

      expect(onAbort).toHaveBeenCalled();
    });
  });

  describe('位置管理', () => {
    it('应使用默认位置（基于窗口尺寸）', () => {
      function PositionConsumer() {
        const ctx = useRobotPrinter();
        return (
          <span data-testid="position">
            {ctx.position.x},{ctx.position.y}
          </span>
        );
      }

      renderWithProvider({}, <PositionConsumer />);

      // 默认位置是 window.innerWidth - 100, window.innerHeight - 100
      expect(screen.getByTestId('position').textContent).toBe('924,668');
    });

    it('应接受自定义 defaultPosition', () => {
      function PositionConsumer() {
        const ctx = useRobotPrinter();
        return (
          <span data-testid="position">
            {ctx.position.x},{ctx.position.y}
          </span>
        );
      }

      renderWithProvider({ defaultPosition: { x: 100, y: 200 } }, <PositionConsumer />);

      expect(screen.getByTestId('position').textContent).toBe('100,200');
    });

    it('setPosition 应更新位置并触发回调', () => {
      const onPositionChange = vi.fn();

      function PositionConsumer() {
        const ctx = useRobotPrinter();
        return (
          <>
            <span data-testid="position">
              {ctx.position.x},{ctx.position.y}
            </span>
            <button data-testid="move" onClick={() => ctx.setPosition({ x: 50, y: 60 })}>
              Move
            </button>
          </>
        );
      }

      renderWithProvider({ onPositionChange }, <PositionConsumer />);

      fireEvent.click(screen.getByTestId('move'));

      expect(screen.getByTestId('position').textContent).toBe('50,60');
      expect(onPositionChange).toHaveBeenCalledWith({ x: 50, y: 60 });
    });
  });

  describe('动画配置', () => {
    it('应使用默认动画时间', () => {
      function AnimationConsumer() {
        const ctx = useRobotPrinter();
        return (
          <>
            <span data-testid="rotateDuration">{ctx.rotateDuration}</span>
            <span data-testid="paperDuration">{ctx.paperDuration}</span>
          </>
        );
      }

      renderWithProvider({}, <AnimationConsumer />);

      expect(screen.getByTestId('rotateDuration').textContent).toBe(
        String(ANIMATION.ROTATE_DURATION)
      );
      expect(screen.getByTestId('paperDuration').textContent).toBe(
        String(ANIMATION.PAPER_DURATION)
      );
    });

    it('应接受自定义动画时间', () => {
      function AnimationConsumer() {
        const ctx = useRobotPrinter();
        return (
          <>
            <span data-testid="rotateDuration">{ctx.rotateDuration}</span>
            <span data-testid="paperDuration">{ctx.paperDuration}</span>
          </>
        );
      }

      renderWithProvider({ rotateDuration: 1000, paperDuration: 500 }, <AnimationConsumer />);

      expect(screen.getByTestId('rotateDuration').textContent).toBe('1000');
      expect(screen.getByTestId('paperDuration').textContent).toBe('500');
    });
  });
});

describe('useRobotPrinter', () => {
  it('在 Provider 外使用时应抛出错误', () => {
    // 使用 console.error 的 spy 来静默错误输出
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useRobotPrinter());
    }).toThrow('useRobotPrinter must be used within a RobotPrinter.Root component');

    consoleSpy.mockRestore();
  });

  it('在 Provider 内应返回 context 值', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RobotPrinterProvider>{children}</RobotPrinterProvider>
    );

    const { result } = renderHook(() => useRobotPrinter(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.expanded).toBe(false);
    expect(typeof result.current.setExpanded).toBe('function');
  });
});

describe('useRobotPrinterOptional', () => {
  it('在 Provider 外使用时应返回 null', () => {
    const { result } = renderHook(() => useRobotPrinterOptional());

    expect(result.current).toBeNull();
  });

  it('在 Provider 内应返回 context 值', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RobotPrinterProvider>{children}</RobotPrinterProvider>
    );

    const { result } = renderHook(() => useRobotPrinterOptional(), { wrapper });

    expect(result.current).not.toBeNull();
    expect(result.current?.expanded).toBe(false);
  });
});
