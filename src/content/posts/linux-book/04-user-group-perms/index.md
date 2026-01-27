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

## 핵심 개념

- 소유자/그룹/기타 (u/g/o)
- r/w/x 권한
- `sudo` vs `su`
- `umask`, ACL

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

- 750 권한이 의미하는 바를 설명할 수 있는가?
- sudo 권한이 제한된 계정의 위험성을 이해하는가?

---

## 트러블슈팅

- `Permission denied`: 소유자/권한/ACL 확인
- sudo 권한 부여: `/etc/sudoers.d/`에 파일 추가
