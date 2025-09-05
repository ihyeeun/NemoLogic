import type { CellState } from './types';

export interface Board {
  rows: number;
  cols: number;
  cells: Uint8Array; // length = rows * cols (값: CellState)
}
export const idx = (r: number, c: number, cols: number) => r * cols + c;

export function createBoard(rows: number, cols: number): Board {
  return { rows, cols, cells: new Uint8Array(rows * cols) };
}

export function setCell(board: Board, r: number, c: number, s: CellState) {
  board.cells[idx(r, c, board.cols)] = s;
}
export function getCell(board: Board, r: number, c: number): CellState {
  return board.cells[idx(r, c, board.cols)] as CellState;
}
export function clearBoard(board: Board) {
  board.cells.fill(0);
}
