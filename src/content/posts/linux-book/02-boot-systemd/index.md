---
title: "02 Boot & systemd"
published: 2026-02-02
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 리눅스 부팅 단계를 이해한다.
- systemd 서비스 관리가 가능하다.
- 장애 시 복구 모드 진입과 최소 점검이 가능하다.
  :::

## 한줄 요약

부팅 흐름과 systemd 서비스 관리 기본을 익힌다.

## 핵심 개념

- **부트로더**: GRUB(커널을 로드하고 부팅 옵션을 고름)
- **init 시스템**: systemd(서비스/부팅 과정을 관리)
- **타겟(target)**: 부팅 모드 이름 (예: `rescue`=복구, `multi-user`=CLI, `graphical`=GUI)

---

## 필수 명령어

- `systemctl status|start|stop|restart|enable|disable`
- `journalctl -u 서비스명`
- `systemctl get-default` / `set-default`

---

## 실습 1: 서비스 상태 확인

```bash
lin> systemctl status ssh
lin> systemctl is-enabled ssh
```

---

## 실습 2: 서비스 등록/해제

```bash
lin> sudo systemctl disable apache2
lin> sudo systemctl enable apache2
```

---

## 실습 3: 부팅 타겟 변경

```bash
lin> systemctl get-default
lin> sudo systemctl set-default multi-user.target
```

---

## 체크포인트

- 서비스가 부팅 시 자동 시작인지 확인할 수 있는가?
- `journalctl`로 특정 서비스 로그를 볼 수 있는가?

---

## 트러블슈팅

- 부팅 실패 시 GRUB에서 `recovery`로 진입 후 최소 서비스만 활성화
- 서비스가 안 뜰 때: `systemctl status` + `journalctl -xe`
