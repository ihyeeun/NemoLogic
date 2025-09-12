import type { NemoLogicGame } from '@/engine/game';
import { TOOL, type Tool } from '@/engine/types';
import { useCallback, useState } from 'preact/hooks';

export function useGameEngine() {
  const [game, setGame] = useState<NemoLogicGame | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>(TOOL.FILL);
  const [isComplete, setIsComplete] = useState(false);
  const [puzzleName, setPuzzleName] = useState('');

  const handleGameReady = useCallback((gameInstance: NemoLogicGame) => {
    setGame(gameInstance);
    setCurrentTool(gameInstance.getCurrentTool());
    setIsComplete(gameInstance.isGameComplete());
    setPuzzleName(gameInstance.getPuzzleName());

    // 게임 이벤트 구독
    gameInstance.on('toolChanged', ({ tool }: { tool: Tool }) => {
      setCurrentTool(tool);
    });

    gameInstance.on('gameComplete', () => {
      setIsComplete(true);
      console.log('게임 완성!');
    });

    gameInstance.on('boardReset', () => {
      setIsComplete(false);
      console.log('게임 리셋');
    });

    gameInstance.on('cellChanged', ({ x, y, state }) => {
      console.log(`셀 변경: (${x}, ${y}) -> ${state}`);
    });
  }, []);

  const handleToolChange = useCallback(
    (tool: Tool) => {
      if (game) {
        game.setTool(tool);
      }
    },
    [game],
  );

  const handleReset = useCallback(() => {
    if (game) {
      game.reset();
    }
  }, [game]);

  return {
    game,
    currentTool,
    isComplete,
    puzzleName,
    handleGameReady,
    handleToolChange,
    handleReset,
  };
}
