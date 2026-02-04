import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { RobotPrinterRoot } from '../RobotPrinterRoot';
import { useRobotPrinter } from '../context/useRobotPrinter';

// 测试用消费组件
function TestChild() {
  const ctx = useRobotPrinter();
  return <span data-testid="context-available">{String(ctx.expanded)}</span>;
}

describe('RobotPrinterRoot', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('渲染', () => {
    it('应渲染子组件', () => {
      render(
        <RobotPrinterRoot>
          <div data-testid="child">Child Content</div>
        </RobotPrinterRoot>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child').textContent).toBe('Child Content');
    });

    it('应提供 Context 给子组件', () => {
      render(
        <RobotPrinterRoot>
          <TestChild />
        </RobotPrinterRoot>
      );

      expect(screen.getByTestId('context-available')).toBeInTheDocument();
      expect(screen.getByTestId('context-available').textContent).toBe('false');
    });

    it('应设置 displayName', () => {
      expect(RobotPrinterRoot.displayName).toBe('RobotPrinter.Root');
    });
  });

  describe('CSS 类名', () => {
    it('应始终包含 robot-printer 类', () => {
      const { container } = render(
        <RobotPrinterRoot>
          <div>Content</div>
        </RobotPrinterRoot>
      );

      expect(container.querySelector('.robot-printer')).toBeInTheDocument();
    });

    it('应在 draggable=true 时添加 draggable 类', () => {
      const { container } = render(
        <RobotPrinterRoot draggable>
          <div>Content</div>
        </RobotPrinterRoot>
      );

      expect(container.querySelector('.robot-printer.draggable')).toBeInTheDocument();
    });

    it('应在 styleMode="glass" 时添加 glass-mode 类', () => {
      const { container } = render(
        <RobotPrinterRoot styleMode="glass">
          <div>Content</div>
        </RobotPrinterRoot>
      );

      expect(container.querySelector('.robot-printer.glass-mode')).toBeInTheDocument();
    });

    it('应合并自定义 className', () => {
      const { container } = render(
        <RobotPrinterRoot className="custom-class">
          <div>Content</div>
        </RobotPrinterRoot>
      );

      expect(container.querySelector('.robot-printer.custom-class')).toBeInTheDocument();
    });

    it('应同时支持多个修饰类', () => {
      const { container } = render(
        <RobotPrinterRoot draggable styleMode="glass" className="my-class">
          <div>Content</div>
        </RobotPrinterRoot>
      );

      const root = container.querySelector('.robot-printer');
      expect(root).toHaveClass('draggable');
      expect(root).toHaveClass('glass-mode');
      expect(root).toHaveClass('my-class');
    });
  });

  describe('自定义样式', () => {
    it('应接受 style prop', () => {
      const { container } = render(
        <RobotPrinterRoot style={{ backgroundColor: 'red', padding: '10px' }}>
          <div>Content</div>
        </RobotPrinterRoot>
      );

      const root = container.querySelector('.robot-printer') as HTMLElement;
      expect(root.style.backgroundColor).toBe('red');
      expect(root.style.padding).toBe('10px');
    });
  });

  describe('Provider Props 透传', () => {
    it('应将 props 传递给 Provider', () => {
      function PropsConsumer() {
        const ctx = useRobotPrinter();
        return (
          <>
            <span data-testid="placeholder">{ctx.placeholder}</span>
            <span data-testid="paperWidth">{ctx.paperWidth}</span>
            <span data-testid="isDark">{String(ctx.isDark)}</span>
            <span data-testid="loading">{String(ctx.loading)}</span>
          </>
        );
      }

      render(
        <RobotPrinterRoot placeholder="自定义" paperWidth={400} isDark={true} loading={true}>
          <PropsConsumer />
        </RobotPrinterRoot>
      );

      expect(screen.getByTestId('placeholder').textContent).toBe('自定义');
      expect(screen.getByTestId('paperWidth').textContent).toBe('400');
      expect(screen.getByTestId('isDark').textContent).toBe('true');
      expect(screen.getByTestId('loading').textContent).toBe('true');
    });

    it('应将 defaultExpanded 传递给 Provider', () => {
      function ExpandedConsumer() {
        const ctx = useRobotPrinter();
        return <span data-testid="expanded">{String(ctx.expanded)}</span>;
      }

      render(
        <RobotPrinterRoot defaultExpanded={true}>
          <ExpandedConsumer />
        </RobotPrinterRoot>
      );

      expect(screen.getByTestId('expanded').textContent).toBe('true');
    });
  });
});
