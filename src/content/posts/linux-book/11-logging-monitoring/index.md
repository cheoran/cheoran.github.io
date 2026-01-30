---
title: "11 Logging & Monitoring"
published: 2026-02-11
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 시스템 로그 경로와 journalctl을 활용한다.
- 기본 모니터링 명령어로 상태를 파악한다.
  :::

## 한줄 요약

로그 확인과 기본 모니터링으로 상태를 파악한다.

## 핵심 개념

**systemd-journald**
systemd가 관리하는 중앙 로그 저장소다. 서비스 로그를 한 곳에서 볼 수 있다.

**/var/log**
전통적인 로그 파일 경로다. journald가 있더라도 여전히 중요한 소스다.

**모니터링은 현재 + 추세**
순간의 상태만 보면 착시가 생긴다. load/CPU/메모리/IO를 함께 보며 추세를 확인해야 한다.

---

## 필수 명령어

- `journalctl`, `tail -f`, `grep`
- `top`, `htop`, `free -h`, `vmstat`, `iostat`

---

## 실습 1: journalctl 활용

```bash
lin> journalctl -u ssh -n 50
```

이 명령을 사용하는 이유
- 특정 서비스(ssh)의 최근 로그를 확인한다.

```bash
lin> journalctl --since "1 hour ago"
```

이 명령을 사용하는 이유
- 시간 범위를 좁혀서 최근 로그만 본다.

```bash
lin> journalctl -p err -b
```

이 명령을 사용하는 이유
- 이번 부팅에서 발생한 에러 레벨만 모아서 본다.

---

## 실습 2: 로그 파일 추적

```bash
lin> sudo tail -f /var/log/syslog
```

이 명령을 사용하는 이유
- 실시간 로그를 보고 문제 발생 시점을 찾는다.

---

## 실습 3: 리소스 모니터링

```bash
lin> top
lin> free -h
lin> vmstat 1 5
```

이 명령을 사용하는 이유
- CPU/메모리/디스크 상태를 빠르게 확인한다.

예상 결과(예시):
```text
Mem:  1.9Gi total,  1.2Gi used,  0.4Gi free
```

---

## 체크포인트

- 특정 서비스 에러 로그만 골라 볼 수 있는가?
- CPU/메모리 병목을 어떤 지표로 판단하는지 말할 수 있는가?

---

## 트러블슈팅

- 로그가 없을 때: journald 상태, 권한 확인
- 디스크 가득 참: `/var/log` 크기 점검

---

## 11.4 로그 수집 파이프라인

운영 환경에서는 로그를 한 서버에만 두지 않고 중앙으로 모은다.

- journald → rsyslog → 원격: `/etc/rsyslog.d/90-remote.conf`에 `*.* @@log.example.com:514`
- Loki/CloudWatch 전송: promtail/CloudWatch Agent에서 `/var/log/*` + `/var/log/journal` 수집
- 구조화 로그 권장: `logger -t app '{"msg":"started","env":"prod"}'`
- 회전: `logrotate` 주기/보관/압축 설정, 서비스 재시작(`postrotate`)

---

## 11.5 메트릭·알람 기본

경보는 “장애 전에 알려주는 장치”다. 기준선을 정해두는 게 중요하다.

- node_exporter 설치 후 9100 포트 확인, Prometheus에 스크레이프 설정
- 중요 메트릭: CPU steal, loadavg, disk IO await, filesystem 사용률, TCP ESTAB/CLOSE_WAIT
- 경보 예: `node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes < 0.1`
- 시스템 이벤트 알림: `journalctl -f | slackcat` 대신 Alertmanager/CloudWatch Alarm 사용

---

## 11.6 트레이싱/프로파일링 맛보기

성능 문제를 깊게 분석할 때 쓰는 도구들이다. 일단 이름과 역할만 알아두면 된다.

- eBPF/BCC: `execsnoop`, `opensnoop`, `tcpconnect`로 저부하 관측
- `perf top`, `perf record/report`로 커널/유저스페이스 핫스팟 파악

---

## 11.7 시간 동기화

시간이 어긋나면 로그 순서가 꼬이고 TLS 인증에도 문제가 생긴다.

- `chrony` 권장: `chronyc sources`, `chronyc tracking`으로 오프셋 확인
- 클라우드 NTP: AWS `169.254.169.123`, GCP `metadata.google.internal`
- 시간 드리프트 알람: 오프셋 > 200ms 시 경보

```booknav
[[10_Storage | prev]]
[[12_Troubleshooting | next]]
```

