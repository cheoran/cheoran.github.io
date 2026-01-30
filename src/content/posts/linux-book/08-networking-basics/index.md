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

## 한줄 요약

IP/라우팅/DNS 확인으로 네트워크를 1차 진단한다.

## 핵심 개념

**`ip` 명령이 표준**
과거에는 ifconfig/route를 썼지만 지금은 `ip`가 표준이다.

**DNS 해석 경로**
도메인을 IP로 바꿔주는 과정이며, `/etc/resolv.conf` 또는 systemd-resolved가 담당한다.

**기본 게이트웨이**
`ip route`의 `default` 항목이 “외부로 나가는 길”이다.

---

## 필수 명령어

- `ip addr`, `ip link`, `ip route`
- `ss -antup`, `lsof -i`
- `dig`, `nslookup`, `ping`, `traceroute`

---

## 실습 1: IP/라우팅 확인

```bash
lin> ip addr show
```

이 명령을 사용하는 이유
- 내 서버의 IP 주소와 인터페이스 상태를 확인한다.

예상 결과(예시):
```text
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 10.0.0.10/24 brd 10.0.0.255 scope global eth0
```

```bash
lin> ip route
```

이 명령을 사용하는 이유
- 트래픽이 어디로 나가는지(라우팅 테이블)를 확인한다.

예상 결과(예시):
```text
default via 10.0.0.1 dev eth0
10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.10
```

---

## 실습 2: 포트 확인

```bash
lin> ss -lntup
```

이 명령을 사용하는 이유
- 현재 열려 있는 포트와 해당 프로세스를 확인한다.

예상 결과(예시):
```text
LISTEN 0 128 0.0.0.0:22 0.0.0.0:* users:("sshd",pid=1234,fd=3)
```

---

## 실습 3: DNS 확인

```bash
lin> resolvectl status
lin> dig example.com
```

이 명령을 사용하는 이유
- DNS 서버가 어디인지, 도메인 해석이 되는지 확인한다.

예상 결과(예시):
```text
example.com.  300 IN A 93.184.216.34
```

---

## 체크포인트

- 기본 게이트웨이를 `ip route`에서 찾을 수 있는가?
- 리슨 포트를 보고 어떤 프로세스인지 매칭할 수 있는가?

---

## 트러블슈팅

- DNS 실패: `resolvectl` 상태 확인, `/etc/resolv.conf` 점검
- 라우팅 문제: 기본 경로(`default`) 확인

---

## 08.4 클라우드 네트워킹 필수

아래 내용은 클라우드/운영 환경에서 자주 만나는 네트워크 설정들이다. 당장 외우기보다 “어떤 경우에 쓰는지”를 이해하는 게 중요하다.

- cloud-init: `/etc/netplan/50-cloud-init.yaml` 생성·관리 → 수동 수정 시 `netplan generate && netplan apply`
  - 클라우드 부팅 시 자동으로 네트워크 설정을 만들어준다.
- systemd-networkd: `/etc/systemd/network/*.network` 파일로 인터페이스 정의, `networkctl status`
  - netplan 대신 systemd가 직접 네트워크를 관리하는 방식이다.
- MTU/MSS: 터널/VPN 환경에서 `ip link set dev eth0 mtu 1400`, iptables `-j TCPMSS --set-mss 1360`
  - 패킷이 잘릴 때 MTU를 낮춰 문제를 해결한다.
- VRF 기본: `ip link add vrf-blue type vrf table 100; ip link set vrf-blue up; ip link set eth1 master vrf-blue; ip route add table 100 default via 10.0.0.1`
  - 같은 서버 안에 “가상 라우터”를 여러 개 만드는 개념이다.
- 다중 라우팅 테이블: `ip rule add from 10.0.1.0/24 table 100`, `ip route add table 100 default via 10.0.1.1`
  - 트래픽 출발지에 따라 다른 경로로 보내는 정책 라우팅이다.
- DNS split: systemd-resolved DNS 우선순위 `resolvectl dns eth0 1.1.1.1` + `resolvectl domain eth0 '~corp.local'`
  - 특정 도메인은 회사 DNS로만 해석하는 방식이다.
- 클라우드 메타데이터: IMDSv2 예시 `curl -H "X-aws-ec2-metadata-token: $(curl -X PUT \"http://169.254.169.254/latest/api/token\" -H \"X-aws-ec2-metadata-token-ttl-seconds: 21600\")" http://169.254.169.254/latest/meta-data/instance-id`
  - 인스턴스 ID 같은 정보를 메타데이터 서버에서 조회한다.
- IPv6 기본: `sysctl net.ipv6.conf.all.disable_ipv6=0`, SLAAC/RA 확인 `rdisc6`, NAT64 환경에서 MTU 1280 고려
  - IPv6 환경에서는 MTU와 자동 주소 설정 이슈를 자주 본다.

