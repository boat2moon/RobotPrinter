import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 导入规范
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'import/no-cycle': 'error', // 禁止循环依赖
      'import/no-self-import': 'error', // 禁止自引用
      'import/no-useless-path-segments': 'warn', // 避免无用路径片段
      // React Hooks 规则调整
      'react-hooks/set-state-in-effect': 'off', // 允许在 effect 中 setState（有效用例如响应 prop 变化）
      'react-hooks/exhaustive-deps': 'warn', // 降级为警告
      // React 最佳实践
      'react/jsx-no-useless-fragment': 'off',
      // TypeScript 命名规范
      '@typescript-eslint/naming-convention': [
        'warn',
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
      ],
    },
  },
]);
