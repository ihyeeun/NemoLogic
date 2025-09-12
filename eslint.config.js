// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  // 1) 코어 JS 추천
  js.configs.recommended,

  // 2) TS 추천 (타입체크 없음: 빠름)
  ...tseslint.configs.recommended,

  // 3) Prettier와 충돌나는 포맷팅 룰 끄기
  prettier,

  // 4) 공통 옵션(무시 경로 등) — 선택
  {
    ignores: ['dist', 'build', 'node_modules'],
  },

  // 5) 프로젝트 맞춤 룰
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];
