import type { Puzzle } from '@/engine/types';
import { GameScreen } from '@/ui/components/GameScreen';
import { Header } from '@/ui/components/Header';
import { StartScreen } from '@/ui/components/StartScreen';
import '@/ui/styles/global.css';
import { TEST_PUZZLE } from '@/utils/constants';
import { useState } from 'preact/hooks';

const STEPS = {
  START: 'START',
  PLAY: 'PLAY',
  COMPLETE: 'COMPLETE',
} as const;
type Step = keyof typeof STEPS;

export function App() {
  const [step, setStep] = useState<Step>(STEPS.START);
  const [puzzle, setPuzzle] = useState<Puzzle>(TEST_PUZZLE);

  const handleStart = (selected?: Puzzle) => {
    setPuzzle(selected ?? TEST_PUZZLE);
    setStep(STEPS.PLAY);
  };

  const handleGameComplete = () => {
    setStep(STEPS.COMPLETE);
  };

  const handleBackToStart = () => {
    setPuzzle(TEST_PUZZLE);
    setStep(STEPS.START);
  };

  function renderMain() {
    switch (step) {
      case STEPS.START:
        return <StartScreen onStart={handleStart} />;

      case STEPS.PLAY:
        return (
          <div className="">
            <p>퍼즐 이름: {puzzle?.name}</p>
            <GameScreen
              puzzle={puzzle}
              onComplete={handleGameComplete}
              onExit={handleBackToStart}
            />
          </div>
        );

      case STEPS.COMPLETE:
        return (
          <section aria-live="polite">
            <h2>클리어! 🎉</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleBackToStart}>다른 퍼즐</button>
              <button onClick={() => setStep(STEPS.PLAY)}>다시하기</button>
            </div>
          </section>
        );

      default:
        return null;
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">{renderMain()}</main>
    </div>
  );
}
