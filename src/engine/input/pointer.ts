import type { CellState } from '@/engine/types';

export function bindPointer(
  canvas: HTMLCanvasElement,
  pickCell: (x: number, y: number) => { r: number; c: number } | null,
  get: (r: number, c: number) => CellState,
  set: (r: number, c: number, s: CellState) => void,
  decideFirst: (cur: CellState) => CellState,
) {
  let drawing: CellState | null = null;
  let last = -1;

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    const cell = pickCell(e.clientX, e.clientY);
    if (!cell) return;
    const cur = get(cell.r, cell.c);
    drawing = decideFirst(cur);
    set(cell.r, cell.c, drawing);
    last = cell.r * 10 + cell.c; // cols=10 기준(엔진에서 정확히 덮어씀)
  });

  canvas.addEventListener('pointermove', (e) => {
    if (drawing === null) return;
    const cell = pickCell(e.clientX, e.clientY);
    if (!cell) return;
    const k = cell.r * 10 + cell.c; // cols=10 기본(엔진이 재정의 가능)
    if (k === last) return;
    set(cell.r, cell.c, drawing);
    last = k;
  });

  function end(e: PointerEvent) {
    if (drawing !== null) canvas.releasePointerCapture(e.pointerId);
    drawing = null;
    last = -1;
  }
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
}
