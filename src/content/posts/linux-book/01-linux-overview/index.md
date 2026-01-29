---
title: "01 Linux Overview"
published: 2026-02-01
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 리눅스의 구성 요소(커널, 쉘, 유틸리티)를 설명한다.
- 배포판 종류와 차이를 이해한다.
- 기본적인 쉘 사용 습관을 잡는다.
  :::

## 한줄 요약

리눅스를 구성요소와 배포판 차이로 큰 그림을 잡는다.

## 핵심 개념

- **커널**: 하드웨어와 사용자 프로그램을 이어주는 핵심 부분
- **쉘**: 명령을 입력하는 창(예: bash, zsh)
- **유틸리티**: 기본 명령 도구(예: `ls`, `cp`, `ip`)
- **배포판**: 같은 리눅스 커널 위에 패키지/설정을 묶어 제공하는 제품군
- **배포판 계열 구분**: 쓰는 패키지 명령으로 대략 구분한다. 예: Ubuntu/Debian은 `apt`, RHEL/Rocky는 `dnf`(또는 `yum`), SUSE는 `zypper`

---

## 필수 명령어

- `uname -a`, `cat /etc/os-release`
- `whoami`, `id`, `hostname`
- `man`, `--help`, `tldr`

---

## 실습 1: 기본 정보 확인

```bash
lin> uname -a
lin> cat /etc/os-release
lin> whoami
lin> hostname
```

---

## 실습 2: 도움말 탐색

```bash
lin> man ip
lin> ip --help
```

---

## 체크포인트

- 커널/쉘/유틸리티 차이를 한 문장으로 말할 수 있는가?
- apt vs dnf로 배포판 계열을 대략 구분할 수 있는가?

---

## 트러블슈팅

- `man`이 안 열리면: `sudo apt install man-db`
- `tldr`가 없다면: `sudo apt install tldr`
