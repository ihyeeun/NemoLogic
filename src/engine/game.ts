import {
  CELL_STATE,
  TOOL,
  type CellState,
  type GameConfig,
  type GameEventMap,
  type GameState,
  type Puzzle,
  type Tool,
} from '@/engine/types';

export class NemoLogicGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private config: GameConfig;
  private listeners: { [K in keyof GameEventMap]?: Array<(data: GameEventMap[K]) => void> } = {};

  constructor(canvas: HTMLCanvasElement, puzzle: Puzzle) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = {
      cellSize: 30,
      hintAreaWidth: 150,
      hintAreaHeight: 100,
      gridColor: '#333',
      fillColor: '#000000ff',
      markColor: '#dc2626',
      hintColor: '#666',
    };
    this.state = {
      puzzle,
      board: this.createEmptyBoard(puzzle.width, puzzle.height),
      currentTool: TOOL.FILL, // 상수 사용
      isComplete: false,
      startTime: Date.now(),
      mistakes: 0,
    };
    this.setupCanvas();
    this.setupEventListeners();
    this.render();
  }

  private createEmptyBoard(width: number, height: number): CellState[][] {
    return Array(height)
      .fill(null)
      .map(
        () => Array(width).fill(CELL_STATE.EMPTY), // 상수 사용
      );
  }

  private setupCanvas(): void {
    const totalWidth = this.config.hintAreaWidth + this.state.puzzle.width * this.config.cellSize;
    const totalHeight =
      this.config.hintAreaHeight + this.state.puzzle.height * this.config.cellSize;

    this.canvas.width = totalWidth;
    this.canvas.height = totalHeight;
    this.canvas.style.border = '2px solid #ccc';
    this.canvas.style.background = '#fff';
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleClick(x, y);
    });

    // 드래그 방지
    this.canvas.addEventListener('dragstart', (e) => e.preventDefault());
  }

  public handleClick(x: number, y: number): void {
    const gameX = x - this.config.hintAreaWidth;
    const gameY = y - this.config.hintAreaHeight;

    if (gameX < 0 || gameY < 0) return;

    const cellX = Math.floor(gameX / this.config.cellSize);
    const cellY = Math.floor(gameY / this.config.cellSize);

    if (this.isValidCell(cellX, cellY) && !this.state.isComplete) {
      const currentState = this.state.board[cellY][cellX];
      let newState: CellState = CELL_STATE.EMPTY;

      // switch문에서 union type 사용
      switch (this.state.currentTool) {
        case TOOL.FILL:
          newState = currentState === CELL_STATE.FILLED ? CELL_STATE.EMPTY : CELL_STATE.FILLED;
          break;
        case TOOL.MARK:
          newState = currentState === CELL_STATE.MARKED ? CELL_STATE.EMPTY : CELL_STATE.MARKED;
          break;
      }

      // 실수 체크 (옵션)
      const isCorrectMove = this.checkMoveCorrectness(cellX, cellY, newState);
      if (!isCorrectMove && newState !== CELL_STATE.EMPTY) {
        this.state.mistakes++;
        this.emit('mistakeMade', { x: cellX, y: cellY });
      }

      this.state.board[cellY][cellX] = newState;
      this.render();
      this.checkWinCondition();
      this.emit('cellChanged', { x: cellX, y: cellY, state: newState });
    }
  }

  private isValidCell(x: number, y: number): boolean {
    return x >= 0 && x < this.state.puzzle.width && y >= 0 && y < this.state.puzzle.height;
  }

  private checkMoveCorrectness(x: number, y: number, newState: CellState): boolean {
    const solution = this.state.puzzle.solution[y][x];

    if (newState === CELL_STATE.FILLED) {
      return solution === 1;
    }
    if (newState === CELL_STATE.MARKED) {
      return solution === 0;
    }
    return true; // EMPTY는 항상 허용
  }

  public setTool(tool: Tool): void {
    this.state.currentTool = tool;
    this.emit('toolChanged', { tool });
  }

  public reset(): void {
    this.state.board = this.createEmptyBoard(this.state.puzzle.width, this.state.puzzle.height);
    this.state.isComplete = false;
    this.state.startTime = Date.now();
    this.state.mistakes = 0;
    this.render();
    this.emit('boardReset', undefined); // void 타입이므로 undefined
  }

  private checkWinCondition(): void {
    const solution = this.state.puzzle.solution;
    let isWin = true;

    for (let y = 0; y < this.state.puzzle.height; y++) {
      for (let x = 0; x < this.state.puzzle.width; x++) {
        const shouldBeFilled = solution[y][x] === 1;
        const isFilled = this.state.board[y][x] === CELL_STATE.FILLED;

        if (shouldBeFilled !== isFilled) {
          isWin = false;
          break;
        }
      }
      if (!isWin) break;
    }

    if (isWin && !this.state.isComplete) {
      this.state.isComplete = true;
      const completionTime = Date.now() - this.state.startTime;
      this.emit('gameComplete', { time: completionTime, mistakes: this.state.mistakes });
    }
  }

  private render(): void {
    this.clearCanvas();
    this.drawHints();
    this.drawGrid();
    this.drawCells();

    if (this.state.isComplete) {
      this.drawWinMessage();
    }
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = this.config.gridColor;
    this.ctx.lineWidth = 1;

    const startX = this.config.hintAreaWidth;
    const startY = this.config.hintAreaHeight;
    const endX = startX + this.state.puzzle.width * this.config.cellSize;
    const endY = startY + this.state.puzzle.height * this.config.cellSize;

    // 세로 선
    for (let i = 0; i <= this.state.puzzle.width; i++) {
      const x = startX + i * this.config.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
      this.ctx.stroke();
    }

    // 가로 선
    for (let i = 0; i <= this.state.puzzle.height; i++) {
      const y = startY + i * this.config.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
      this.ctx.stroke();
    }
  }

  private drawCells(): void {
    for (let y = 0; y < this.state.puzzle.height; y++) {
      for (let x = 0; x < this.state.puzzle.width; x++) {
        const cellState = this.state.board[y][x];
        const cellX = this.config.hintAreaWidth + x * this.config.cellSize;
        const cellY = this.config.hintAreaHeight + y * this.config.cellSize;

        // switch문으로 더 명확하게
        switch (cellState) {
          case CELL_STATE.FILLED:
            this.ctx.fillStyle = this.config.fillColor;
            this.ctx.fillRect(
              cellX + 1,
              cellY + 1,
              this.config.cellSize - 2,
              this.config.cellSize - 2,
            );
            break;

          case CELL_STATE.MARKED:
            this.ctx.strokeStyle = this.config.markColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(cellX + 5, cellY + 5);
            this.ctx.lineTo(cellX + this.config.cellSize - 5, cellY + this.config.cellSize - 5);
            this.ctx.moveTo(cellX + this.config.cellSize - 5, cellY + 5);
            this.ctx.lineTo(cellX + 5, cellY + this.config.cellSize - 5);
            this.ctx.stroke();
            break;

          case CELL_STATE.EMPTY:
            // 아무것도 그리지 않음
            break;
        }
      }
    }
  }

  private drawHints(): void {
    this.ctx.fillStyle = this.config.hintColor;
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';

    // 행 힌트 (왼쪽)
    for (let y = 0; y < this.state.puzzle.height; y++) {
      const hints = this.state.puzzle.rowHints[y];
      const hintText = hints.join(' ');
      const textY =
        this.config.hintAreaHeight + y * this.config.cellSize + this.config.cellSize / 2 + 5;

      this.ctx.fillText(hintText, this.config.hintAreaWidth - 10, textY);
    }

    // 열 힌트 (위쪽)
    for (let x = 0; x < this.state.puzzle.width; x++) {
      const hints = this.state.puzzle.colHints[x];
      const textX = this.config.hintAreaWidth + x * this.config.cellSize + this.config.cellSize / 2;

      for (let i = 0; i < hints.length; i++) {
        const textY = this.config.hintAreaHeight - 20 + i * 20;
        this.ctx.fillText(hints[i].toString(), textX, textY);
      }
    }
  }

  private drawWinMessage(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('축하합니다! 완성!', this.canvas.width / 2, this.canvas.height / 2);
  }

  // 타입 안전한 이벤트 시스템
  public on<K extends keyof GameEventMap>(
    event: K,
    callback: (data: GameEventMap[K]) => void,
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  private emit<K extends keyof GameEventMap>(event: K, data: GameEventMap[K]): void {
    if (this.listeners[event]) {
      this.listeners[event]!.forEach((callback) => callback(data));
    }
  }

  // 게터들
  public getCurrentTool(): Tool {
    return this.state.currentTool;
  }

  public isGameComplete(): boolean {
    return this.state.isComplete;
  }

  public getPuzzleName(): string {
    return this.state.puzzle.name;
  }

  public getMistakes(): number {
    return this.state.mistakes;
  }
}
