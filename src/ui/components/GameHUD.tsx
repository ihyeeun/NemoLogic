import { TOOL, type Tool } from '@/engine/types';
import styles from '@/ui/styles/GameHUD.module.css';

interface GameHUDProps {
  currentTool: Tool;
  puzzleName: string;
  isComplete: boolean;
  onToolChange: (tool: Tool) => void;
  onReset: () => void;
}

export function GameHUD({
  currentTool,
  puzzleName,
  isComplete,
  onToolChange,
  onReset,
}: GameHUDProps) {
  return (
    <div className={styles.hud}>
      <div className={styles.header}>
        <h2 className={styles.title}>{puzzleName}</h2>
        {isComplete && <div className={styles.complete}>✨ 완성!</div>}
      </div>

      <div className={styles.controls}>
        <div className={styles.tools}>
          <button
            className={`${styles.toolButton} ${currentTool === TOOL.FILL ? styles.active : ''}`}
            onClick={() => onToolChange(TOOL.FILL)}
            disabled={isComplete}
          >
            ⬛ 채우기
          </button>
          <button
            className={`${styles.toolButton} ${currentTool === TOOL.MARK ? styles.active : ''}`}
            onClick={() => onToolChange(TOOL.MARK)}
            disabled={isComplete}
          >
            ❌ 표시
          </button>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={onReset}>
            🔄 다시 시작
          </button>
        </div>
      </div>
    </div>
  );
}
