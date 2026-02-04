/**
 * @module RobotPrinter/hooks
 * @description 自定义 React Hooks 集合
 * 提供拖拽、动画状态、空闲检测和倾斜计算功能
 */

export { useDrag } from './useDrag';
export { useAnimationPhase } from './useAnimationPhase';
export { useAnimationMachine, animationReducer } from './useAnimationMachine';
export type {
  AnimationEvent,
  UseAnimationMachineOptions,
  UseAnimationMachineReturn,
} from './useAnimationMachine';
export { useIdleDetection } from './useIdleDetection';
export { useTilt } from './useTilt';
