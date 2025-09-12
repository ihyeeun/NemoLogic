import type { Puzzle } from '@/engine/types';

export const TEST_PUZZLE: Puzzle = {
  id: 'test_heart_5x5',
  name: '하트 ♥',
  width: 5,
  height: 5,
  solution: [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  rowHints: [[1, 1], [5], [5], [3], [1]],
  colHints: [[2], [4], [4], [4], [2]],
};
