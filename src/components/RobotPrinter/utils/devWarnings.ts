/**
 * 开发环境警告工具
 * 用于在开发环境中提示配置问题和潜在错误
 */

const warned = new Set<string>();

/**
 * 检查是否为开发环境
 */
const isDev = (): boolean => {
  // Vite 环境
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.DEV;
  }
  // 测试环境 (vitest 设置 NODE_ENV)
  try {
    // @ts-expect-error - 避免 TS 报错，运行时检查
    return globalThis.process?.env?.NODE_ENV !== 'production';
  } catch {
    return false;
  }
};

/**
 * 仅警告一次（避免重复刷屏）
 * @param key - 警告唯一标识
 * @param message - 警告信息
 */
export function warnOnce(key: string, message: string): void {
  if (isDev() && !warned.has(key)) {
    warned.add(key);
    console.warn(`[RobotPrinter] ${message}`);
  }
}

/**
 * 开发环境断言
 * @param condition - 断言条件
 * @param message - 断言失败时的警告信息
 */
export function devAssert(condition: boolean, message: string): void {
  if (isDev() && !condition) {
    console.warn(`[RobotPrinter] Assertion failed: ${message}`);
  }
}

/**
 * 检测废弃的 prop 使用
 * @param propName - 废弃的 prop 名称
 * @param suggestion - 替代方案建议
 */
export function warnDeprecated(propName: string, suggestion?: string): void {
  const message = suggestion
    ? `"${propName}" is deprecated. ${suggestion}`
    : `"${propName}" is deprecated and will be removed in a future version.`;
  warnOnce(`deprecated-${propName}`, message);
}

/**
 * 检测受控/非受控模式冲突
 * @param propName - prop 名称
 * @param hasValue - 是否传入了受控值
 * @param hasOnChange - 是否传入了变更回调
 */
export function warnControlledUncontrolled(
  propName: string,
  hasValue: boolean,
  hasOnChange: boolean
): void {
  if (hasValue && !hasOnChange) {
    warnOnce(
      `controlled-${propName}`,
      `You provided "${propName}" without "on${propName.charAt(0).toUpperCase() + propName.slice(1)}Change". ` +
        `This will make the component uncontrollable. ` +
        `Consider providing the change handler or remove "${propName}" to use uncontrolled mode.`
    );
  }
}

/**
 * 清除警告缓存（用于测试）
 */
export function clearWarnings(): void {
  warned.clear();
}
