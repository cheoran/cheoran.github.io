---
title: "08 Networking Basics (Linux)"
published: 2026-02-08
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 인터페이스, IP, 라우팅, DNS를 설정하고 확인한다.
- 네트워크 장애를 1차 진단한다.
  :::

## 핵심 개념

- `ip` 명령이 표준 (ifconfig/route는 구형)
- DNS 해석 경로: `/etc/resolv.conf` 또는 systemd-resolved

---

## 필수 명령어

- `ip addr`, `ip link`, `ip route`
- `ss -antup`, `lsof -i`
- `dig`, `nslookup`, `ping`, `traceroute`

---

## 실습 1: IP/라우팅 확인

```bash
lin> ip addr show
lin> ip route
```

---

## 실습 2: 포트 확인

```bash
lin> ss -lntup
```

---

## 실습 3: DNS 확인

```bash
lin> resolvectl status
lin> dig example.com
```

---

## 체크포인트

- 기본 게이트웨이를 찾을 수 있는가?
- 리슨 포트를 확인하고 프로세스와 매칭할 수 있는가?

---

## 트러블슈팅

- DNS 실패: `resolvectl` 상태 확인, `/etc/resolv.conf` 점검
- 라우팅 문제: 기본 경로(`default`) 확인

---

## 08.4 클라우드 네트워킹 필수

- cloud-init: `/etc/netplan/50-cloud-init.yaml` 생성·관리 → 수동 수정 시 `netplan generate && netplan apply`
- systemd-networkd: `/etc/systemd/network/*.network` 파일로 인터페이스 정의, `networkctl status`
- MTU/MSS: 터널/VPN 환경에서 `ip link set dev eth0 mtu 1400`, iptables `-j TCPMSS --set-mss 1360`
- VRF 기본: `ip link add vrf-blue type vrf table 100; ip link set vrf-blue up; ip link set eth1 master vrf-blue; ip route add table 100 default via 10.0.0.1`
- 다중 라우팅 테이블: `ip rule add from 10.0.1.0/24 table 100`, `ip route add table 100 default via 10.0.1.1`
- DNS split: systemd-resolved DNS 우선순위 `resolvectl dns eth0 1.1.1.1` + `resolvectl domain eth0 '~corp.local'`
- 클라우드 메타데이터: IMDSv2 예시 `curl -H "X-aws-ec2-metadata-token: $(curl -X PUT \"http://169.254.169.254/latest/api/token\" -H \"X-aws-ec2-metadata-token-ttl-seconds: 21600\")" http://169.254.169.254/latest/meta-data/instance-id`
- IPv6 기본: `sysctl net.ipv6.conf.all.disable_ipv6=0`, SLAAC/RA 확인 `rdisc6`, NAT64 환경에서 MTU 1280 고려
