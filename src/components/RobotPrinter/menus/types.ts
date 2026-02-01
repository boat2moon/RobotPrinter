/** 拓展功能按钮配置 */
export interface ActionConfig {
  /** 按钮文本 */
  label: string;
  /** 点击回调，参数为当前输入值（可选，留空则只显示按钮不执行操作） */
  onClick?: (value: string) => void;
  /** 是否禁用（可选） */
  disabled?: boolean;
  /** 二级子菜单配置（可选，悬停展开） */
  subActions?: ActionConfig[];
}
