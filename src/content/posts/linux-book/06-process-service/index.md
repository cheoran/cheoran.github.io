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

프로세스와 서비스를 구분하고 기본 관리 흐름을 익힌다.

## 핵심 개념

**PID, PPID**
PID는 프로세스 번호다. PPID는 “부모 프로세스 번호”로, 어떤 프로세스가 누구에 의해 생성됐는지 보여준다.

**foreground / background**
터미널을 차지하는 것이 foreground, 뒤에서 돌아가는 것이 background다. 서버에서는 대부분 백그라운드로 돈다.

**nice / renice**
CPU 우선순위를 조정하는 값이다. 갑자기 리소스를 많이 먹는 프로세스가 있을 때 완화할 수 있다.

**SIGTERM vs SIGKILL**
SIGTERM은 “정상 종료 요청”, SIGKILL은 “즉시 강제 종료”다. 가능한 SIGTERM을 먼저 쓰고, 안 될 때만 SIGKILL을 쓴다.

**서비스 단위 파일 위치**
기본 단위 파일은 `/usr/lib/systemd/system`, 로컬 오버라이드는 `/etc/systemd/system`에 위치한다. 수정은 가능한 `/etc` 쪽에서 한다.

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

이 영역은 운영 환경에서 성능을 미세 조정할 때 쓰인다. 지금 당장 외우기보다 “필요할 때 찾아서 적용”하는 개념으로 이해하면 된다.

- systemd slice 활용: `systemctl set-property mysvc.service CPUQuota=50% MemoryMax=1G`
  - 특정 서비스의 CPU/메모리를 제한하는 방법이다.
- cgroups v2 확인: `ls /sys/fs/cgroup`; `systemd.unified_cgroup_hierarchy=1`
  - 리소스를 그룹별로 관리하는 커널 기능이다.
- ulimit: `/etc/security/limits.d/app.conf`에 `nofile`, `nproc` 설정
  - 열린 파일 수나 프로세스 수 제한을 조정할 때 사용한다.
- 커널 파라미터(sysctl) 주요 항목
  - 메모리: `vm.swappiness=10`, `vm.dirty_ratio=15`, `vm.max_map_count` (ElasticSearch류)
  - 네트워크 큐: `net.core.somaxconn=1024`, `net.core.netdev_max_backlog=4096`
  - 포트 고갈 방지: `net.ipv4.ip_local_port_range = 1024 65000`, `net.ipv4.tcp_tw_reuse=1`
- 측정 → 조정 → 재측정: `pidstat`, `iostat -x`, `perf stat`, `systemd-cgtop`으로 영향 확인

