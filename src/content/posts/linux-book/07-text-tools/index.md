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

## 실습 1: 로그 필터링(실시간)

```bash
lin> sudo tail -f /var/log/syslog
```

이 명령을 사용하는 이유
- 로그가 어떻게 쌓이는지 실시간으로 본다. 문제 분석의 감을 잡는다.

예상 결과(예시):
```text
Feb  7 10:12:01 host CRON[1234]: (root) CMD (run-parts /etc/cron.hourly)
```

---

## 실습 2: 포트 로그 추출

```bash
lin> sudo ss -ant | awk '{print $1,$4,$5}' | head
```

이 명령을 사용하는 이유
- 네트워크 연결 상태를 “열 단위”로 빠르게 요약한다.

예상 결과(예시):
```text
State Local Address:Port Peer Address:Port
ESTAB 10.0.0.10:22 10.0.0.1:53214
```

---

## 실습 3: 파이프라인 3단 연결

```bash
lin> sudo journalctl -u ssh -n 200 | grep -E "Failed|Invalid" | awk '{print $1,$2,$3,$11}' | sort | uniq -c
```

이 명령을 사용하는 이유
- 로그에서 “실패 메시지”만 뽑고, 어떤 계정으로 실패했는지 요약한다.

예상 결과(예시):
```text
  5 Feb  7 10:20:21 invalid
 12 Feb  7 10:22:01 root
```

---

## 실습 4: 에러만 추출

```bash
lin> grep -E "error|fail" /var/log/syslog | tail -n 20
```

이 명령을 사용하는 이유
- 에러 관련 로그만 빠르게 확인한다.

---

## 체크포인트

- 파이프라인을 3단 이상 연결해 로그를 필터링할 수 있는가?
- `grep -E`로 OR 조건을 쓸 수 있는가?

---

## 트러블슈팅

- `syslog`가 없으면 `journalctl` 사용
- 로그 권한 문제 시 `sudo` 사용

