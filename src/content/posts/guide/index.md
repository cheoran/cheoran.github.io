---
title: Fuwari 블로그 빠른 시작
published: 2024-08-14
description: 이 템플릿으로 글을 쓰는 가장 빠른 방법.
tags: ["Fuwari", "Guide", "Setup"]
category: Guide
draft: false
---

이 템플릿은 Astro 기반으로 동작합니다.  
기본 글 구조만 이해하면 바로 시작할 수 있어요.

## 글 파일 위치

`src/content/posts/` 폴더에 Markdown 파일을 넣으면 됩니다.

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## Frontmatter 예시

```yaml
---
title: 첫 글
published: 2024-08-01
description: 블로그 첫 글입니다.
image: ./cover.jpg
tags: [Notes, Blog]
category: 라이프
draft: false
---
```
