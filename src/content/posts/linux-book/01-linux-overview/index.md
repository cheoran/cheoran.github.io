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

- 리눅스가 무엇인지 큰 그림을 잡는다.
- 커널/쉘/유틸리티를 구분해서 설명할 수 있다.
- 배포판의 차이가 왜 생기는지 이해한다.
  :::

## 한줄 요약

리눅스는 “커널 + 쉘 + 유틸리티 + 배포판 정책”의 조합이며, 이를 큰 그림으로 이해한다.

## 핵심 개념

**커널(kernel)**
하드웨어(CPU, 메모리, 디스크, 네트워크)와 프로그램 사이에서 실제 일을 처리하는 핵심이다. 예를 들어 파일을 열거나 네트워크에 접속하는 동작은 모두 커널이 처리한다. 리눅스를 이해한다는 건 “커널이 어떤 역할을 하는지”를 이해하는 것이다.

**쉘(shell)**
사용자가 명령을 입력하는 인터페이스다. 우리가 터미널에 입력한 명령을 해석해서 커널/프로그램에 전달한다. `bash`, `zsh` 같은 종류가 있지만, 공통점은 “명령을 실행하게 해주는 창”이라는 점이다.

**유틸리티(utilities)**
`ls`, `cp`, `ip` 같은 기본 명령 도구들이다. 리눅스는 작은 명령을 조합해 문제를 해결하는 철학이 있어서 유틸리티가 매우 중요하다.

**배포판(distribution)**
같은 리눅스 커널 위에 “패키지 구성 + 기본 설정”을 묶은 제품군이다. Ubuntu, Debian, Rocky, Fedora 등이 있다. 커널은 비슷하지만 패키지 관리 방식, 기본 설정, 지원 주기 등이 다르다.

**배포판 계열 구분(패키지 명령으로 구분)**
Ubuntu/Debian은 `apt`, RHEL/Rocky는 `dnf`(또는 `yum`), SUSE는 `zypper`를 쓴다. 배포판을 구분할 때 가장 쉬운 방법이 패키지 명령을 보는 것이다.

---

## 필수 명령어

- `uname -a` : 커널 정보 확인
- `cat /etc/os-release` : 배포판 정보 확인
- `whoami` / `id` : 현재 사용자 확인
- `hostname` : 호스트 이름 확인
- `man` / `--help` / `tldr` : 도움말 확인 습관

---

## 실습 1: 시스템 정보 확인

```bash
lin> uname -a
```

이 명령을 사용하는 이유
- 커널 버전/아키텍처를 확인한다. “내 리눅스가 무엇인지”를 가장 먼저 파악하는 명령이다.

예상 결과(예시):
```text
Linux ip-10-0-0-10 6.5.0-17-generic #17-Ubuntu SMP x86_64 GNU/Linux
```

해석:
- `6.5.0-17-generic`는 커널 버전
- `x86_64`는 CPU 아키텍처

```bash
lin> cat /etc/os-release
```

이 명령을 사용하는 이유
- 배포판 이름과 버전을 확인한다. 패키지 관리 방식도 여기서 유추할 수 있다.

예상 결과(예시):
```text
NAME="Ubuntu"
VERSION="24.04 LTS"
ID=ubuntu
```

해석:
- Ubuntu 24.04 LTS임을 알 수 있다.

```bash
lin> whoami
lin> id
lin> hostname
```

이 명령을 사용하는 이유
- 내가 누구 계정인지, 권한이 무엇인지, 호스트 이름이 무엇인지 확인한다.

예상 결과(예시):
```text
ubuntu
uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu),27(sudo)
ip-10-0-0-10
```

해석:
- `groups`에 `sudo`가 있으면 관리자 권한을 쓸 수 있다.

---

## 실습 2: 도움말 보는 습관

```bash
lin> man ip
lin> ip --help
```

이 명령을 사용하는 이유
- 리눅스는 명령어가 많아서 외우기보다 “도움말을 읽는 습관”이 중요하다.

예상 결과(예시):
- `man ip`는 길게 문서가 나온다.
- `ip --help`는 짧은 요약이 나온다.

---

## 체크포인트

- 커널/쉘/유틸리티의 역할을 한 문장으로 설명할 수 있는가?
- 배포판을 패키지 명령으로 구분할 수 있는가?

---

## 트러블슈팅

- `man`이 안 열리면: `sudo apt install man-db`
- `tldr`가 없다면: `sudo apt install tldr`

