import { Component, type ReactNode, type ErrorInfo } from 'react';

/**
 * 错误边界组件属性
 */
export interface ErrorBoundaryProps {
  /** 子组件 */
  children: ReactNode;
  /** 错误时显示的降级 UI */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** 错误发生时的回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * RobotPrinter 错误边界组件
 *
 * 捕获子组件渲染错误，显示友好的降级 UI，防止整个应用崩溃。
 *
 * @example 基本用法
 * ```tsx
 * import { RobotPrinterErrorBoundary, RobotPrinter } from '@/components/RobotPrinter';
 *
 * <RobotPrinterErrorBoundary>
 *   <RobotPrinter />
 * </RobotPrinterErrorBoundary>
 * ```
 *
 * @example 自定义降级 UI
 * ```tsx
 * <RobotPrinterErrorBoundary
 *   fallback={<div>组件加载失败</div>}
 *   onError={(error) => console.error(error)}
 * >
 *   <RobotPrinter />
 * </RobotPrinterErrorBoundary>
 * ```
 *
 * @example 使用 reset 函数重试
 * ```tsx
 * <RobotPrinterErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>出错了: {error.message}</p>
 *       <button onClick={reset}>重试</button>
 *     </div>
 *   )}
 * >
 *   <RobotPrinter />
 * </RobotPrinterErrorBoundary>
 * ```
 */
export class RobotPrinterErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 开发环境打印错误信息
    if (import.meta.env.DEV) {
      console.error('[RobotPrinter ErrorBoundary] Caught error:', error);
      console.error('[RobotPrinter ErrorBoundary] Component stack:', errorInfo.componentStack);
    }

    // 调用用户提供的错误处理回调
    this.props.onError?.(error, errorInfo);
  }

  /**
   * 重置错误状态，允许重新渲染子组件
   */
  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // 如果 fallback 是函数，传入 error 和 reset
      if (typeof fallback === 'function') {
        return fallback(error, this.reset);
      }

      // 如果提供了静态 fallback，直接渲染
      if (fallback !== undefined) {
        return fallback;
      }

      // 默认降级 UI
      return (
        <div
          style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            borderRadius: '12px',
            border: '1px solid #f87171',
            color: '#991b1b',
            fontFamily: 'system-ui, sans-serif',
            maxWidth: '400px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <strong style={{ fontSize: '14px' }}>RobotPrinter 组件出错了</strong>
          </div>
          <p style={{ fontSize: '13px', margin: '0 0 12px 0', opacity: 0.9 }}>
            {error.message || '未知错误'}
          </p>
          <button
            onClick={this.reset}
            style={{
              padding: '6px 16px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#b91c1c')}
            onMouseOut={e => (e.currentTarget.style.background = '#dc2626')}
          >
            重试
          </button>
        </div>
      );
    }

    return children;
  }
}
