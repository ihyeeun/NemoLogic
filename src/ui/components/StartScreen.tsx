import type { Puzzle } from '@/engine/types';

type Props = {
  onStart: (puzzle?: Puzzle) => void;
};

export function StartScreen({ onStart }: Props) {
  // TODO : 난이도 선택 퍼즐 여기에 두기
  return (
    <section>
      <h2>네모로직 게임에 어서오세요 !</h2>
      <button onClick={() => onStart()}>게임 시작</button>
    </section>
  );
}
