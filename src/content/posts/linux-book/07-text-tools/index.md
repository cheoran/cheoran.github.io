---
title: "07 Text Processing Tools"
published: 2026-02-07
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 로그 분석에 필요한 텍스트 처리 도구를 익힌다.
- 파이프라인을 활용해 문제를 빠르게 진단한다.
  :::

## 필수 명령어

- `cat`, `head`, `tail -f`
- `grep`, `egrep`, `rg`
- `cut`, `awk`, `sed`, `sort`, `uniq`

---

## 실습 1: 로그 필터링

```bash
lin> sudo tail -f /var/log/syslog
```

---

## 실습 2: 포트 로그 추출

```bash
lin> sudo ss -ant | awk '{print $1,$4,$5}' | head
```

---

## 실습 3: 에러만 추출

```bash
lin> grep -i "error" /var/log/syslog | tail -n 20
```

---

## 체크포인트

- 파이프라인을 3개 이상 연결할 수 있는가?
- `grep -E` 정규식 기초를 알고 있는가?

---

## 트러블슈팅

- `syslog`가 없으면 `journalctl` 사용
- 로그 권한 문제 시 `sudo` 사용
