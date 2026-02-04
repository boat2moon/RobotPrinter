import { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // 入口文件
      entry: resolve(__dirname, 'src/components/RobotPrinter/index.ts'),
      // 库名称
      name: 'RobotPrinter',
      // 输出文件名
      fileName: format => `robot-printer.${format}.js`,
      // 输出格式
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // 外部依赖不打包
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        // 保留 CSS 文件
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'style.css') {
            return 'robot-printer.css';
          }
          return assetInfo.name ?? 'assets/[name][extname]';
        },
      },
    },
    // 输出目录
    outDir: 'dist/lib',
    // 生成 sourcemap
    sourcemap: true,
    // 不清空输出目录
    emptyOutDir: true,
  },
});
