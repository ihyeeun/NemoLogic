import { NemoLogicGame } from '@/engine/game';
import type { Puzzle } from '@/engine/types';
import { useEffect, useRef } from 'preact/hooks';

interface GameBoardProps {
  puzzle: Puzzle;
  onGameReady: (game: NemoLogicGame) => void;
}

export function GameBoard({ puzzle, onGameReady }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const game = new NemoLogicGame(canvasRef.current, puzzle);
      onGameReady(game);
    }
  }, [puzzle, onGameReady]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
