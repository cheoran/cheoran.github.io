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

- systemd는 서비스뿐 아니라 스케줄링(timer)도 담당한다.
- 배포판마다 패키지 도구와 보안 모델(SELinux 등)이 다르다.
- SG/NACL은 클라우드 네트워크 경계, 호스트 방화벽은 OS 내부다.
- 스토리지는 암호화와 마운트 옵션이 안정성에 큰 영향을 준다.
- 성능 진단은 load/CPU steal/IO wait를 함께 본다.

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

```bash
lin> cat <<'EOF' | sudo tee /etc/systemd/system/backup.timer
[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true
[Install]
WantedBy=timers.target
EOF
lin> sudo systemctl daemon-reload
lin> sudo systemctl enable --now backup.timer
lin> systemctl list-timers | grep backup
```

---

## 실습 2: 배포판/SELinux 상태 확인

```bash
lin> cat /etc/os-release
lin> if command -v dnf; then dnf --version; else apt --version; fi
lin> getenforce || sestatus
```

---

## 실습 3: 호스트 방화벽 점검

```bash
lin> sudo ss -lntup
lin> sudo ufw status verbose || sudo nft list ruleset
```

- SG/NACL은 클라우드 콘솔에서 별도로 확인한다.

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

---

## 실습 5: 관측/성능 1차 진단

```bash
lin> uptime
lin> vmstat 1 5
lin> iostat -x 1 3
lin> sar -u 1 3
```

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
