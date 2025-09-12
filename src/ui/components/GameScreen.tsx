import type { Puzzle } from '@/engine/types';
import { GameBoard } from '@/ui/components/GameBoard';
import { GameHUD } from '@/ui/components/GameHUD';
import { useGameEngine } from '@/ui/hooks/useGameEngine';

type Props = {
  puzzle: Puzzle;
  onComplete: () => void;
  onExit: () => void;
};

export function GameScreen({ puzzle, onComplete, onExit }: Props) {
  const { currentTool, isComplete, puzzleName, handleGameReady, handleToolChange, handleReset } =
    useGameEngine();

  // 완료 감지 → 부모에 알림
  if (isComplete) {
    // 필요하면 effect로 바꿔도 OK
    onComplete();
  }

  return (
    <section>
      <GameHUD
        currentTool={currentTool}
        puzzleName={puzzleName}
        isComplete={isComplete}
        onToolChange={handleToolChange}
        onReset={handleReset}
      />
      <GameBoard puzzle={puzzle} onGameReady={handleGameReady} />
      <div style={{ marginTop: 12 }}>
        <button onClick={onExit}>나가기</button>
      </div>
    </section>
  );
}
