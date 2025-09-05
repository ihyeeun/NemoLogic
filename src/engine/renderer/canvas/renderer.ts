import type { Board } from '@/engine/board';
import type { CellState } from '@/engine/types';

export function createRenderer(canvas: HTMLCanvasElement, board: Board) {
  const ctx = canvas.getContext('2d')!;
  const gridCache = document.createElement('canvas');
  const gctx = gridCache.getContext('2d')!;

  let dpr = 1,
    cssW = 0,
    cssH = 0;
  let originX = 0,
    originY = 0;
  let cell = 24;
  let leftHint = 0,
    topHint = 0; // MVP: 0

  function resize() {
    cssW = canvas.clientWidth;
    cssH = canvas.clientHeight;
    dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const maxW = Math.floor(cssW * 0.9);
    const maxH = Math.floor(cssH * 0.9);
    cell = Math.max(
      12,
      Math.floor(Math.min((maxW - leftHint) / board.cols, (maxH - topHint) / board.rows)),
    );
    const bw = leftHint + board.cols * cell;
    const bh = topHint + board.rows * cell;
    originX = Math.floor((cssW - bw) / 2);
    originY = Math.floor((cssH - bh) / 2);

    buildGridCache();
    repaintAll();
  }

  function buildGridCache() {
    gridCache.width = Math.max(1, Math.floor(cssW * dpr));
    gridCache.height = Math.max(1, Math.floor(cssH * dpr));
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gctx.clearRect(0, 0, cssW, cssH);

    // 배경 & 보드 바탕
    gctx.fillStyle = '#ffffff';
    gctx.fillRect(0, 0, cssW, cssH);
    gctx.fillStyle = '#fafafa';
    gctx.fillRect(originX + leftHint, originY + topHint, board.cols * cell, board.rows * cell);

    // 얇은 격자
    gctx.lineWidth = 1;
    gctx.strokeStyle = '#ddd';
    gctx.beginPath();
    for (let r = 0; r <= board.rows; r++) {
      const y = originY + topHint + r * cell + 0.5;
      gctx.moveTo(originX + leftHint + 0.5, y);
      gctx.lineTo(originX + leftHint + board.cols * cell - 0.5, y);
    }
    for (let c = 0; c <= board.cols; c++) {
      const x = originX + leftHint + c * cell + 0.5;
      gctx.moveTo(x, originY + topHint + 0.5);
      gctx.lineTo(x, originY + topHint + board.rows * cell - 0.5);
    }
    gctx.stroke();

    // 굵은 라인(5칸)
    gctx.lineWidth = 2;
    gctx.strokeStyle = '#bbb';
    gctx.beginPath();
    for (let r = 0; r <= board.rows; r += 5) {
      const y = originY + topHint + r * cell + 1;
      gctx.moveTo(originX + leftHint + 1, y);
      gctx.lineTo(originX + leftHint + board.cols * cell - 1, y);
    }
    for (let c = 0; c <= board.cols; c += 5) {
      const x = originX + leftHint + c * cell + 1;
      gctx.moveTo(x, originY + topHint + 1);
      gctx.lineTo(x, originY + topHint + board.rows * cell - 1);
    }
    gctx.stroke();
  }

  function drawCellFull(r: number, c: number, s: CellState) {
    const x = originX + leftHint + c * cell;
    const y = originY + topHint + r * cell;
    if (s === 0) return;
    if (s === 1) {
      ctx.fillStyle = '#111';
      ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
      return;
    }
    ctx.strokeStyle = '#c33';
    ctx.lineWidth = Math.max(2, Math.floor(cell * 0.12));
    ctx.beginPath();
    ctx.moveTo(x + cell * 0.2, y + cell * 0.2);
    ctx.lineTo(x + cell * 0.8, y + cell * 0.8);
    ctx.moveTo(x + cell * 0.8, y + cell * 0.2);
    ctx.lineTo(x + cell * 0.2, y + cell * 0.8);
    ctx.stroke();
  }

  function drawCell(r: number, c: number, s: CellState) {
    const x = originX + leftHint + c * cell;
    const y = originY + topHint + r * cell;
    ctx.clearRect(x, y, cell, cell);
    // 셀 배경을 캐시에서 가져와 복원
    ctx.drawImage(gridCache, x, y, cell, cell, x, y, cell, cell);
    drawCellFull(r, c, s);
  }

  function repaintAll() {
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.drawImage(gridCache, 0, 0, gridCache.width, gridCache.height, 0, 0, cssW, cssH);
    for (let r = 0; r < board.rows; r++)
      for (let c = 0; c < board.cols; c++)
        drawCellFull(r, c, board.cells[r * board.cols + c] as CellState);
  }

  function pickCell(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const gx = x - (originX + leftHint);
    const gy = y - (originY + topHint);
    if (gx < 0 || gy < 0) return null;
    const c = Math.floor(gx / cell);
    const r = Math.floor(gy / cell);
    if (r < 0 || c < 0 || r >= board.rows || c >= board.cols) return null;
    return { r, c };
  }

  return {
    resize,
    drawBoard: () => {
      buildGridCache();
      repaintAll();
    },
    drawCell,
    pickCell,
  };
}
