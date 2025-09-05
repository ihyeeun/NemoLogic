import type { Engine } from '@/engine/engine';
import { useEffect, useState } from 'preact/hooks';

export function App({ engine }: { engine: Engine }) {
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => engine.on('progress', (s) => setMistakes(s.mistakes)), [engine]);

  return (
    <div id="hud-root" style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
      <div class="hud-panel hud-top-left">
        <button class="btn" onClick={() => engine.setTool('fill')}>
          ■ 칠
        </button>
        <button class="btn" onClick={() => engine.setTool('cross')}>
          ✕ 엑스
        </button>
        <button class="btn" onClick={() => engine.setTool('erase')}>
          □ 지우기
        </button>
        <button class="btn" onClick={() => engine.reset()}>
          리셋
        </button>
        <span style="align-self:center">오류: {mistakes}</span>
      </div>
    </div>
  );
}
