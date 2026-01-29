---
title: "06 Process & Service Management"
published: 2026-02-06
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 프로세스 상태를 확인하고 제어한다.
- systemd 서비스 단위 파일을 이해한다.
- 리소스 사용률을 측정한다.
  :::

## 한줄 요약

프로세스와 서비스 상태를 확인·제어하는 법을 익힌다.

## 핵심 개념

- PID, PPID
- foreground / background
- nice / renice(우선순위 조정)
- SIGTERM(정상 종료 요청) vs SIGKILL(강제 종료, 정리 불가)
- 서비스 단위 파일 위치: 기본 `/usr/lib/systemd/system`, 로컬/오버라이드 `/etc/systemd/system`

---

## 필수 명령어

- `ps aux`, `top`, `htop`
- `kill`, `pkill`, `nice`, `renice`
- `systemctl`, `journalctl`

---

## 실습 1: 프로세스 확인

```bash
lin> ps aux | head
lin> top
```

---

## 실습 2: 프로세스 종료

```bash
lin> sleep 1000 &
lin> ps aux | grep sleep
lin> kill <PID>
```

---

## 실습 3: 서비스 로그 확인

```bash
lin> systemctl status systemd-resolved
lin> journalctl -u systemd-resolved -n 50
```

---

## 체크포인트

- SIGTERM과 SIGKILL 차이를 말할 수 있는가?
- systemd 서비스 파일이 기본/오버라이드 어디에 있는지 말할 수 있는가?

---

## 트러블슈팅

- 프로세스가 죽지 않으면 `kill -9` 사용 전 원인 확인
- 서비스 반복 재시작: `journalctl -xe`로 원인 파악

---

## 06.6 리소스 튜닝 & QoS

- systemd slice 활용: `systemctl set-property mysvc.service CPUQuota=50% MemoryMax=1G`
- cgroups v2 확인: `ls /sys/fs/cgroup`; `systemd.unified_cgroup_hierarchy=1`(대부분 기본)
- ulimit: `/etc/security/limits.d/app.conf`에 `nofile`, `nproc` 설정
- 커널 파라미터(sysctl) 주요 항목
  - 메모리: `vm.swappiness=10`, `vm.dirty_ratio=15`, `vm.max_map_count` (ElasticSearch류)
  - 네트워크 큐: `net.core.somaxconn=1024`, `net.core.netdev_max_backlog=4096`
  - 포트 고갈 방지: `net.ipv4.ip_local_port_range = 1024 65000`, `net.ipv4.tcp_tw_reuse=1`
- 측정 → 조정 → 재측정: `pidstat`, `iostat -x`, `perf stat`, `systemd-cgtop`으로 영향 확인
