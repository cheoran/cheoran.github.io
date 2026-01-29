---
title: "03 Filesystem Layout"
published: 2026-02-03
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- FHS(파일시스템 표준)를 이해한다.
- 마운트/언마운트 개념을 잡는다.
- 네트워크 엔지니어가 자주 보는 경로를 숙지한다.
  :::

## 한줄 요약

자주 쓰는 디렉터리 위치와 마운트 기본을 익힌다.

## 핵심 경로

- `/etc`: 설정 파일
- `/var/log`: 로그 파일
- `/var/lib`: 서비스가 쓰는 상태/데이터(예: DB, 캐시)
- `/usr/bin`: 일반 사용자 명령
- `/bin`, `/sbin`: 기본/관리자 명령(시스템 필수)
- `/home`: 사용자 홈 디렉터리

---

## 필수 명령어

- `ls -al`, `pwd`, `cd`
- `df -h`, `du -sh`, `lsblk`
- `mount`, `umount`

---

## 실습 1: 디렉터리 구조 탐색

```bash
lin> ls -al /
lin> ls -al /etc
lin> ls -al /var/log
```

---

## 실습 2: 디스크 사용량 확인

```bash
lin> df -h
lin> du -sh /var/log
lin> lsblk
```

---

## 체크포인트

- 설정 파일이 보통 `/etc`에 있다는 걸 알고 있는가?
- 로그는 보통 `/var/log`에 있다는 걸 알고 있는가?

---

## 트러블슈팅

- 디스크 부족 시: `du -sh /var/* | sort -h`로 큰 디렉터리 확인
