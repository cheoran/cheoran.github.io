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

## 한줄 요약

텍스트 도구와 파이프라인으로 로그를 빠르게 필터링한다.

팁: `grep -E`는 확장 정규식(OR `|`, `+` 등)을 쉽게 쓸 때 사용한다.

## 핵심 개념

**파이프라인(`|`)**
앞 명령의 결과를 다음 명령으로 넘긴다. 로그에서 필요한 부분만 “점점 좁혀 가는 방식”이다.

**필터링**
로그는 양이 많아서 필요한 줄만 뽑는 게 중요하다. `grep`, `awk`는 필터링에 특화된 도구다.

---

## 필수 명령어

- `cat`, `head`, `tail -f`
- `grep`, `egrep`, `rg`
- `cut`, `awk`, `sed`, `sort`, `uniq`

---

## 실습 1: 로그 필터링

```bash
lin> sudo tail -f /var/log/syslog
```

실시간 로그를 보면서 어떤 패턴이 나오는지 감을 잡는다.

---

## 실습 2: 포트 로그 추출

```bash
lin> sudo ss -ant | awk '{print $1,$4,$5}' | head
```

`awk`는 “열(column) 단위로 뽑기”에 특화돼 있다.

## 실습 2.5: 파이프라인 3개 이상

```bash
lin> sudo journalctl -u ssh -n 200 | grep -E "Failed|Invalid" | awk '{print $1,$2,$3,$11}' | sort | uniq -c
```

여러 명령을 연결해서 “로그 → 필터 → 요약” 흐름을 만든다.

---

## 실습 3: 에러만 추출

```bash
lin> grep -E "error|fail" /var/log/syslog | tail -n 20
```

---

## 체크포인트

- 파이프라인을 3단 이상 연결해 로그를 필터링할 수 있는가?
- `grep -E`로 OR 조건을 쓸 수 있는가?

---

## 트러블슈팅

- `syslog`가 없으면 `journalctl` 사용
- 로그 권한 문제 시 `sudo` 사용

