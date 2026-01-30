---
title: "15 Cloud Ops Basics"
published: 2026-02-15
description: "클라우드 운영 실무 보강"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 클라우드 엔지니어가 자주 쓰는 리눅스 운영 포인트를 보강한다.
- systemd, 배포판 차이, 호스트 보안, 스토리지/백업, 관측/성능을 빠르게 정리한다.
  :::

## 한줄 요약

클라우드 운영에 필요한 리눅스 점검 포인트를 정리한다.

## 핵심 개념

**systemd는 서비스뿐 아니라 스케줄링(timer)도 담당**
cron 대신 systemd timer를 쓰는 경우가 많다.

**배포판 차이**
패키지 도구나 보안 모델(SELinux 등)이 다르므로, 서버를 옮길 때 주의해야 한다.

**SG/NACL vs 호스트 방화벽**
SG/NACL은 클라우드 네트워크 경계, 호스트 방화벽은 OS 내부다. 둘 다 맞춰야 안전하다.

**스토리지 옵션 중요성**
암호화/마운트 옵션이 성능과 안정성에 영향을 준다.

**성능 진단 기본**
load/CPU steal/IO wait 같은 지표를 함께 본다.

---

## 필수 명령어

- systemd: `systemctl`, `systemctl edit`, `systemd-analyze`, `journalctl -u`
- 배포판: `cat /etc/os-release`, `apt`, `dnf`, `rpm -q`, `getenforce`, `sestatus`
- 네트워크/보안: `ss -lntup`, `ufw status`, `nft list ruleset`
- 스토리지/백업: `lsblk`, `blkid`, `mount`, `cryptsetup`, `rsync`, `tar`
- 관측/성능: `uptime`, `top`, `vmstat`, `iostat`, `sar`

---

## 실습 1: systemd override + timer

```bash
lin> sudo systemctl edit ssh
# drop-in 예시
[Service]
Restart=on-failure
RestartSec=3
lin> sudo systemctl daemon-reload
lin> sudo systemctl restart ssh
lin> systemctl status ssh
```

이 명령을 사용하는 이유
- 서비스 재시작 정책을 덧붙이는 연습이다. 장애 시 자동 복구를 돕는다.

```bash
lin> cat <<'EOF2' | sudo tee /etc/systemd/system/backup.timer
[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true
[Install]
WantedBy=timers.target
EOF2
lin> sudo systemctl daemon-reload
lin> sudo systemctl enable --now backup.timer
lin> systemctl list-timers | grep backup
```

이 명령을 사용하는 이유
- cron 대신 systemd timer를 사용하는 방법을 익힌다.

---

## 실습 2: 배포판/SELinux 상태 확인

```bash
lin> cat /etc/os-release
lin> if command -v dnf; then dnf --version; else apt --version; fi
lin> getenforce || sestatus
```

이 명령을 사용하는 이유
- 배포판과 보안 정책이 무엇인지 먼저 확인해야 운영 방식이 달라진다.

---

## 실습 3: 호스트 방화벽 점검

```bash
lin> sudo ss -lntup
lin> sudo ufw status verbose || sudo nft list ruleset
```

이 명령을 사용하는 이유
- 호스트 내부에서 실제로 열려 있는 포트와 방화벽 규칙을 확인한다.

---

## 실습 4: 스토리지/백업 기본 (테스트 환경)

```bash
lin> lsblk
lin> sudo cryptsetup luksFormat /dev/sdb
lin> sudo cryptsetup open /dev/sdb data_crypt
lin> sudo mkfs.ext4 /dev/mapper/data_crypt
lin> sudo mount /dev/mapper/data_crypt /mnt/data
lin> sudo rsync -a --delete /etc/ /mnt/data/etc/
```

이 명령을 사용하는 이유
- 암호화 스토리지와 백업의 기본 흐름을 이해한다.

---

## 실습 5: 관측/성능 1차 진단

```bash
lin> uptime
lin> vmstat 1 5
lin> iostat -x 1 3
lin> sar -u 1 3
```

이 명령을 사용하는 이유
- CPU/메모리/디스크의 병목을 빠르게 판단한다.

---

## 체크포인트

- systemd로 서비스 재시작 정책을 설정할 수 있는가?
- 배포판/SELinux 상태를 빠르게 확인할 수 있는가?
- SG/NACL과 호스트 방화벽 경계를 말할 수 있는가?
- 암호화 스토리지와 백업 흐름을 설명할 수 있는가?
- CPU/IO 병목을 1차 진단할 수 있는가?

---

## 트러블슈팅

- systemd 변경 반영 안 됨: `systemctl daemon-reload` 확인
- SELinux 차단: `/var/log/audit/audit.log`와 `ausearch -m avc`로 원인 확인
- 성능 저하: load, iowait, CPU steal을 함께 확인

