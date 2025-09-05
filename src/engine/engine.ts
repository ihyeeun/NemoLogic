// src/engine/engine.ts
import { createBoard } from '@/engine/board';
import { bindPointer } from '@/engine/input/pointer';
import { createRenderer } from '@/engine/renderer/canvas/renderer';
import type { CellState, EngineEvent, Stats, Tool } from './types';

type Handler = (p?: any) => void;

export class Engine {
  private handlers: Record<EngineEvent, Set<Handler>> = {
    progress: new Set(),
    win: new Set(),
    mistake: new Set(),
  };
  private tool: Tool = 'fill';
  private stats: Stats = { fills: 0, mistakes: 0, time: 0 };

  private board = createBoard(1, 1);
  private R: ReturnType<typeof createRenderer> | null = null;

  // ⬇️ 파라미터 프로퍼티( private canvas ) 금지 → 일반 파라미터 사용
  constructor(canvas: HTMLCanvasElement, rows = 10, cols = 10) {
    this.board = createBoard(rows, cols);
    const R = createRenderer(canvas, this.board);
    this.R = R;

    R.resize();
    window.addEventListener('resize', R.resize, { passive: true });
    R.drawBoard();

    // rows/cols를 클래스 필드로 들고 있을 필요 없음 → 여기서만 사용
    bindPointer(
      canvas,
      R.pickCell,
      (r, c) => this.board.cells[r * cols + c] as CellState,
      (r, c, s) => {
        this.board.cells[r * cols + c] = s;
        R.drawCell(r, c, s);
        this.emit('progress', this.stats);
      },
      (cur) => this.decideFirst(cur),
    );
  }

  setTool(t: Tool) {
    this.tool = t;
  }

  reset() {
    this.board.cells.fill(0);
    this.R?.drawBoard();
    this.emit('progress', this.stats);
  }

  on(type: EngineEvent, h: Handler) {
    this.handlers[type].add(h);
    return () => this.handlers[type].delete(h);
  }

  getStats() {
    return this.stats;
  }

  private decideFirst(cur: CellState): CellState {
    if (this.tool === 'fill') return 1;
    if (this.tool === 'cross') return 2;
    if (this.tool === 'erase') return 0;
    return ((cur + 1) % 3) as CellState;
  }

  private emit(type: EngineEvent, payload?: any) {
    this.handlers[type].forEach((h) => h(payload));
  }
}
