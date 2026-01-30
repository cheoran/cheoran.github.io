---
title: "12 Troubleshooting"
published: 2026-02-12
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 증상을 분류하고 우선순위를 정한다.
- 기본 진단 루틴을 습관화한다.
  :::

## 한줄 요약

장애 대응은 “순서와 기록”이 핵심이다.

## 핵심 개념

**체크 순서**
네트워크 → 서비스 → 리소스 → 설정 순으로 점검하면 대부분의 문제를 놓치지 않는다.

**변경 이력과 로그**
문제의 원인은 대개 “최근 변경”과 “로그”에 있다. 감으로 추측하지 말고 기록을 확인한다.

---

## 필수 명령어

- `systemctl status`, `journalctl`
- `ip`, `ss`, `ping`, `curl`
- `df -h`, `free -h`, `top`

---

## 실습 1: 서비스 장애 진단

```bash
lin> systemctl status nginx
lin> journalctl -u nginx -n 50
lin> sudo ss -lntup | grep nginx
```

이 명령을 사용하는 이유
- 상태 → 로그 → 포트 확인으로 “서비스가 왜 안 뜨는지” 단계적으로 확인한다.

---

## 실습 2: 네트워크 장애 진단

```bash
lin> ip addr
lin> ip route
lin> ping -c 3 8.8.8.8
lin> curl -I https://example.com
```

이 명령을 사용하는 이유
- 내 IP/라우팅/외부 통신/HTTP 응답을 순서대로 확인한다.

---

## 체크포인트

- 장애 유형별로 기본 점검 순서를 말할 수 있는가?
- 로그 → 설정 → 재현 순서로 접근할 수 있는가?

---

## 트러블슈팅

- 증상만 보고 조치하지 말고 원인-증거-조치로 기록

---

## 12.4 부팅/접근 복구 시나리오

부팅이 안 되거나 SSH 접속이 막혔을 때를 위한 절차다. 실제 장애 시에는 이 순서를 알고 있으면 빠르게 복구할 수 있다.

- 단일 사용자 모드: GRUB에서 커널 라인 `linux ... single` 추가 → 루트 비번 재설정/설정 수정
- fstab 오류로 부팅 실패: GRUB에서 `systemd.unit=emergency.target` 부팅 → `mount -o remount,rw /` → fstab 수정 후 `reboot`
- init=/bin/bash: 모든 서비스 없이 루트 쉘, `mount -o remount,rw /` 필수
- GRUB 비밀번호: `/boot/grub/grub.cfg`에 `set superusers` + `password_pbkdf2` 설정
- SSH 잠김 복구: 클라우드 콘솔(Serial/EC2 Connect/SSM Session Manager)로 접속해 키 재배포 또는 `PasswordAuthentication yes` 임시 허용 후 즉시 롤백

---

## 12.5 장애 대응 체크리스트

- “최근 변경?” 패키지/설정/배포/트래픽 급증 여부 기록
- 최소 재현: 가장 짧은 재현 명령을 작성해 동료와 공유
- 영향 범위: 단일 호스트/존/리전 구분, RTO/RPO 의식
- 사후 분석: 타임라인+원인+재발 방지 액션을 남기고 자동화로 반영

