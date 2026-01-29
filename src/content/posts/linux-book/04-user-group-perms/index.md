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

사용자/권한 체계를 이해하고 최소 권한을 적용한다.

## 핵심 개념

- 소유자/그룹/기타 (u/g/o)
- r/w/x 권한(숫자= r4 + w2 + x1 조합)
- `sudo` vs `su`(sudo는 허용된 명령만, su는 계정 전환)
- `umask`, ACL(기본 권한/세밀한 권한)
- 제한된 sudo도 위험: 허용된 명령으로 권한 상승 가능, 항상 최소 권한과 명령 경로 고정

---

## 필수 명령어

- `id`, `groups`, `who`
- `useradd`, `usermod`, `passwd`
- `chmod`, `chown`, `getfacl`, `setfacl`

---

## 실습 1: 사용자 생성

```bash
lin> sudo useradd -m netops
lin> sudo passwd netops
lin> id netops
```

---

## 실습 2: 권한 변경

```bash
lin> mkdir ~/lab_perm
lin> chmod 750 ~/lab_perm
lin> ls -ld ~/lab_perm
```

---

## 실습 3: sudo 권한 확인

```bash
lin> sudo -l
```

---

## 체크포인트

- 750 권한이 누구에게 어떤 권한인지 말할 수 있는가?
- sudo 권한을 넓게 주면 왜 위험한지 말할 수 있는가?

---

## 트러블슈팅

- `Permission denied`: 소유자/권한/ACL 확인
- sudo 권한 부여: `/etc/sudoers.d/`에 파일 추가
