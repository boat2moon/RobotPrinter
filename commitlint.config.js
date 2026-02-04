export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复 bug
        'docs',     // 文档变更
        'style',    // 代码格式（不影响功能）
        'refactor', // 重构（不是新功能也不是修复 bug）
        'perf',     // 性能优化
        'test',     // 添加/修改测试
        'build',    // 构建系统或外部依赖变更
        'ci',       // CI 配置变更
        'chore',    // 其他变更（不修改 src 或 test）
        'revert',   // 回滚提交
      ],
    ],
    // 主题不能为空
    'subject-empty': [2, 'never'],
    // 主题不以句号结尾
    'subject-full-stop': [2, 'never', '.'],
    // 类型必须小写
    'type-case': [2, 'always', 'lower-case'],
    // 类型不能为空
    'type-empty': [2, 'never'],
    // 主题最大长度
    'subject-max-length': [1, 'always', 72],
  },
};
