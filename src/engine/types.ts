export type CellState = 'EMPTY' | 'FILLED' | 'MARKED';

export type Tool = 'FILL' | 'MARK';

export interface Puzzle {
  id: string;
  name: string;
  width: number;
  height: number;
  solution: number[][];
  rowHints: number[][];
  colHints: number[][];
}

export interface GameState {
  puzzle: Puzzle;
  board: CellState[][];
  currentTool: Tool;
  isComplete: boolean;
  startTime: number;
  mistakes: number;
}

export interface GameConfig {
  cellSize: number;
  hintAreaWidth: number;
  hintAreaHeight: number;
  gridColor: string;
  fillColor: string;
  markColor: string;
  hintColor: string;
}

export type GameEventMap = {
  cellChanged: { x: number; y: number; state: CellState };
  gameComplete: { time: number; mistakes: number };
  toolChanged: { tool: Tool };
  boardReset: void;
  mistakeMade: { x: number; y: number };
};

//TODO 1. 타입 가드 함수들
export const isCellState = (value: string): value is CellState => {
  return ['EMPTY', 'FILLED', 'MARKED'].includes(value);
};

export const isTool = (value: string): value is Tool => {
  return ['FILL', 'MARK'].includes(value);
};

export const CELL_STATE = {
  EMPTY: 'EMPTY' as const,
  FILLED: 'FILLED' as const,
  MARKED: 'MARKED' as const,
} as const;

export const TOOL = {
  FILL: 'FILL' as const,
  MARK: 'MARK' as const,
} as const;
