export type CellState = 0 | 1 | 2; // empty/fill/cross
export type Tool = 'fill' | 'cross' | 'erase';
export type EngineEvent = 'progress' | 'win' | 'mistake';
export type Stats = { fills: number; mistakes: number; time: number };
