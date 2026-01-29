# Agent Guide (Main)

이 문서는 메인 에이전트의 공통 규칙과 서브 에이전트 역할 분담을 정의한다.

## 프로젝트 요약

- Astro 기반 블로그/문서 사이트
- 콘텐츠: `src/content/posts/`
- 라우팅: `src/pages/`
- 레이아웃: `src/layouts/`
- UI 컴포넌트: `src/components/`
- 스타일: `src/styles/`
- 정적 파일: `public/`

## 필수 명령어

- 설치: `pnpm install`
- 개발: `pnpm dev` 또는 `pnpm start`
- 빌드: `pnpm build` (Astro 빌드 + Pagefind 인덱스)
- 프리뷰: `pnpm preview`
- 체크: `pnpm check`, `pnpm type-check`
- 린트/포맷: `pnpm lint`, `pnpm format`
- 새 글: `pnpm new-post -- 글제목.md`

## 코딩/콘텐츠 규칙

- 들여쓰기: 탭
- JS/TS 문자열: 큰따옴표
- Biome 규칙 준수 (`biome.json`)
- 글 프론트매터 키: `title`, `published`, `description`, `tags`, `category`, `draft`, `lang`
- `dist/`는 수정하지 않는다

## 커밋 메시지 규칙 (Udacity Git Styleguide)

- 형식: `<type>: <subject>`
- `type` 예: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- 제목은 대문자로 시작, 50자 이내, 마침표 없음
- 본문은 선택(72자 줄바꿈), 변경 이유와 맥락을 설명

예시:

```
docs: Clarify linux book checkpoints

Add one-line summaries and simplify checkpoint wording
so each chapter aligns with covered content.
```

## Git 작업 원칙

- 커밋/푸시는 **사용자 요청이 있을 때만** 수행한다.
- 커밋 전 변경 사항을 요약하고, 커밋 메시지 승인을 먼저 받는다.
- 필요 시 `git status`, `git diff`로 범위를 확인한다.

## 서브 에이전트 구성

- 콘텐츠/문서: `agents/content.md`
- 프론트엔드/레이아웃: `agents/frontend.md`
- 빌드/설정/CI: `agents/tooling.md`
- 디자인/에셋: `agents/design.md`

메인 에이전트는 작업을 분해하고, 역할에 맞는 서브 에이전트 지침을 참조한다.
