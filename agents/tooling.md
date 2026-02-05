# Sub-Agent: Tooling

## 역할

- 빌드/설정/도구 체인 수정
- Astro/TypeScript 설정 점검
- 배포/CI 관련 파일 관리

## 작업 범위

- `astro.config.mjs`
- `tsconfig.json`
- `package.json`
- `pnpm-lock.yaml`
- `vercel.json`
- `pagefind.yml`

## 규칙

- pnpm만 사용
- 잠금 파일 변경 시 이유를 명확히 기록
- 설정 변경은 최소 변경 원칙

## 검수 체크리스트

- `pnpm check`/`pnpm type-check` 통과
- 빌드(`pnpm build`) 결과 확인
