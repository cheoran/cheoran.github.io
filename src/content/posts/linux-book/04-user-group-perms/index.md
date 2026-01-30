---
title: "04 Users, Groups, Permissions"
published: 2026-02-04
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 사용자/그룹/권한 구조를 이해한다.
- sudo와 최소 권한 원칙을 적용한다.
- ACL과 umask를 이해한다.
  :::

## 한줄 요약

리눅스는 “누가 무엇을 할 수 있는지”를 권한으로 관리한다.

## 핵심 개념

**소유자/그룹/기타(u/g/o)**
파일에는 소유자(owner)와 그룹(group)이 있고, 나머지는 기타(other)로 분류된다. 권한은 이 세 범주에 각각 적용된다.

**r/w/x 권한(숫자 표현)**
읽기(r=4), 쓰기(w=2), 실행(x=1)의 합으로 표현한다. 예: 7은 4+2+1, 5는 4+1이다. 숫자를 외우기보다 의미를 이해하는 게 중요하다.

**sudo vs su**
sudo는 “허용된 명령만” 관리자 권한으로 실행한다. su는 아예 계정을 바꾼다. 보안 측면에서는 sudo가 더 안전하다.

**umask / ACL**
umask는 “새 파일의 기본 권한”을 결정한다. ACL은 기본 권한보다 더 세밀한 권한을 추가로 설정할 때 사용한다.

**최소 권한 원칙**
필요한 권한만 주어야 한다. 권한을 넓게 주면 편해 보이지만, 사고가 나면 피해도 커진다.

---

## 필수 명령어

- `id`, `groups`, `who` : 사용자/그룹 확인
- `useradd`, `usermod`, `passwd` : 사용자 관리
- `chmod`, `chown`, `getfacl`, `setfacl` : 권한 관리

---

## 실습 1: 사용자 생성

```bash
lin> sudo useradd -m netops
lin> sudo passwd netops
lin> id netops
```

이 명령을 사용하는 이유
- 새 계정을 만들고, 비밀번호를 설정하고, 그룹을 확인한다. 실제 운영 환경에서 계정 관리는 기본이다.

예상 결과(예시):
```text
uid=1001(netops) gid=1001(netops) groups=1001(netops)
```

---

## 실습 2: 권한 변경

```bash
lin> mkdir ~/lab_perm
lin> chmod 750 ~/lab_perm
lin> ls -ld ~/lab_perm
```

이 명령을 사용하는 이유
- 숫자 권한이 실제로 어떻게 적용되는지 확인한다.

예상 결과(예시):
```text
drwxr-x--- 2 ubuntu ubuntu 4096 Feb  4 12:00 /home/ubuntu/lab_perm
```

해석:
- 소유자: `rwx`
- 그룹: `r-x`
- 기타: `---`

---

## 실습 3: sudo 권한 확인

```bash
lin> sudo -l
```

이 명령을 사용하는 이유
- 현재 계정이 어떤 명령을 sudo로 실행할 수 있는지 확인한다.

예상 결과(예시):
```text
User ubuntu may run the following commands on this host:
    (ALL : ALL) ALL
```

---

## 체크포인트

- 750 권한이 누구에게 어떤 권한인지 말할 수 있는가?
- sudo 권한을 넓게 주면 왜 위험한지 말할 수 있는가?

---

## 트러블슈팅

- `Permission denied`: 소유자/권한/ACL 확인
- sudo 권한 부여: `/etc/sudoers.d/`에 파일 추가

