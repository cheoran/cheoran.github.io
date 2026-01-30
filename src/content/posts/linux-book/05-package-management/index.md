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

## 한줄 요약

패키지 관리 도구로 안전하게 설치/삭제/업데이트한다.

## 핵심 개념

**패키지 의존성**
프로그램이 동작하려면 다른 라이브러리가 필요할 수 있다. 패키지 관리 도구는 이 의존성을 함께 설치해 준다.

**리포지토리/키 관리**
패키지는 공식 저장소에서 내려받는다. 저장소의 신뢰성을 보장하기 위해 GPG 키를 사용한다.

**업데이트 vs 업그레이드**
`update`는 “목록 갱신”, `upgrade`는 “실제 버전 갱신”이다. 초보자가 가장 헷갈리기 쉬운 포인트다.

**remove vs purge**
`remove`는 프로그램만 삭제, `purge`는 설정 파일까지 삭제한다. 문제가 생겼을 때 완전 삭제가 필요하면 `purge`를 쓴다.

**버전 고정(pin/hold)**
특정 버전을 유지해야 할 때 사용한다. 예: 최신 버전으로 올리면 서비스가 깨지는 경우.

---

## 필수 명령어 (Ubuntu)

- `apt update`, `apt upgrade`
- `apt install`, `apt remove`, `apt purge`
- `apt-cache policy`, `dpkg -l`

---

## 실습 1: 패키지 설치

```bash
lin> sudo apt update
```

이 명령을 사용하는 이유
- 패키지 목록을 최신 상태로 갱신한다. 이걸 하지 않으면 오래된 정보로 설치가 진행된다.

예상 결과(예시):
```text
Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease
Reading package lists... Done
```

```bash
lin> sudo apt install -y curl net-tools
```

이 명령을 사용하는 이유
- `curl`과 `net-tools`를 설치한다. 네트워크 점검에서 자주 쓰는 도구다.

예상 결과(예시):
```text
Setting up curl ...
Setting up net-tools ...
```

---

## 실습 2: 설치 여부 확인

```bash
lin> dpkg -l | grep curl
```

이 명령을 사용하는 이유
- 설치된 패키지 목록에서 원하는 패키지를 확인한다.

예상 결과(예시):
```text
ii  curl  8.5.0-1  amd64  command line tool for transferring data
```

```bash
lin> apt-cache policy curl
```

이 명령을 사용하는 이유
- 설치된 버전과 리포지토리에서 제공하는 버전을 비교한다.

예상 결과(예시):
```text
Installed: 8.5.0-1
Candidate: 8.5.0-1
```

---

## 체크포인트

- `remove`와 `purge` 차이를 말할 수 있는가?
- 버전을 고정해야 하는 상황을 하나 설명할 수 있는가?

---

## 트러블슈팅

- `Could not get lock`: 다른 apt 프로세스 종료 후 재시도
- 키 오류: 리포지토리 GPG 키 재등록

