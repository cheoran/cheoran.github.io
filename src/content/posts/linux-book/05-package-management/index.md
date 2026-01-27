---
title: "05 Package Management"
published: 2026-02-05
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- apt 기반 패키지 관리 흐름을 이해한다.
- 리포지토리와 GPG 키 개념을 이해한다.
- 실무에서 자주 쓰는 패키지를 설치/삭제할 수 있다.
  :::

## 핵심 개념

- 패키지 의존성
- 레포지토리/키 관리
- 업데이트 vs 업그레이드

---

## 필수 명령어 (Ubuntu)

- `apt update`, `apt upgrade`
- `apt install`, `apt remove`, `apt purge`
- `apt-cache policy`, `dpkg -l`

---

## 실습 1: 패키지 설치

```bash
lin> sudo apt update
lin> sudo apt install -y curl net-tools
```

---

## 실습 2: 설치 여부 확인

```bash
lin> dpkg -l | grep curl
lin> apt-cache policy curl
```

---

## 체크포인트

- `remove`와 `purge`의 차이를 설명할 수 있는가?
- 패키지 버전 고정이 필요한 이유를 이해하는가?

---

## 트러블슈팅

- `Could not get lock`: 다른 apt 프로세스 종료 후 재시도
- 키 오류: 레포지토리 GPG 키 재등록
