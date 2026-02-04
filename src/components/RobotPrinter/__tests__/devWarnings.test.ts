import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  warnOnce,
  devAssert,
  warnDeprecated,
  warnControlledUncontrolled,
  clearWarnings,
} from '../utils/devWarnings';

describe('devWarnings', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    clearWarnings();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('warnOnce', () => {
    it('应该输出警告信息', () => {
      warnOnce('test-key', 'Test message');
      expect(consoleWarnSpy).toHaveBeenCalledWith('[RobotPrinter] Test message');
    });

    it('相同 key 只警告一次', () => {
      warnOnce('duplicate-key', 'First call');
      warnOnce('duplicate-key', 'Second call');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });

    it('不同 key 应该分别警告', () => {
      warnOnce('key-1', 'Message 1');
      warnOnce('key-2', 'Message 2');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('devAssert', () => {
    it('条件为 true 时不应输出警告', () => {
      devAssert(true, 'Should not warn');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('条件为 false 时应输出警告', () => {
      devAssert(false, 'Assertion message');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[RobotPrinter] Assertion failed: Assertion message'
      );
    });
  });

  describe('warnDeprecated', () => {
    it('应该输出废弃警告', () => {
      warnDeprecated('oldProp');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('"oldProp" is deprecated')
      );
    });

    it('应该包含替代建议', () => {
      warnDeprecated('oldProp', 'Use "newProp" instead.');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Use "newProp" instead.')
      );
    });

    it('相同 prop 只警告一次', () => {
      warnDeprecated('sameProp');
      warnDeprecated('sameProp');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('warnControlledUncontrolled', () => {
    it('有值但无回调时应警告', () => {
      warnControlledUncontrolled('expanded', true, false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('You provided "expanded" without')
      );
    });

    it('有值且有回调时不应警告', () => {
      warnControlledUncontrolled('expanded', true, true);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('无值时不应警告', () => {
      warnControlledUncontrolled('expanded', false, false);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('clearWarnings', () => {
    it('清除后应该能再次警告', () => {
      warnOnce('clear-test', 'First');
      clearWarnings();
      warnOnce('clear-test', 'Second');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
    });
  });
});
