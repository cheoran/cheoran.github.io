---
title: "트러블슈팅 도구"
published: 2026-01-17T11:00:00+09:00
description: "ping, traceroute, tcpdump 등 네트워크 트러블슈팅 도구를 정리합니다"
tags: ["network"]
category: "네트워크"
draft: false
---

---

## 핵심 도구

- ping: 연결 확인
- traceroute: 경로 확인
- dig/nslookup: DNS 확인
- ss/netstat: 포트 확인
- tcpdump: 패킷 캡처

---

## 실습: 웹 접속 실패 진단

### 단계 1: IP 확인

```shellsession
mac> ifconfig | grep inet
```

### 단계 2: DNS 확인

```shellsession
mac> dig example.com
```

### 단계 3: 포트 확인

```shellsession
mac> nc -vz example.com 443
```

### 단계 4: 경로 확인

```shellsession
mac> traceroute example.com
```

---

## 예상 증상 해석

- DNS 실패: 이름 해석 불가
- 포트 실패: 방화벽/서버 문제
- traceroute 중간 끊김: 라우팅 문제

---

## 장애 분류 표

| 증상           | 의심 계층 | 도구          |
| -------------- | --------- | ------------- |
| IP 없음        | L2/L3     | ipconfig, ip  |
| DNS 실패       | L7        | dig, nslookup |
| 포트 연결 실패 | L4        | nc, telnet    |
| 경로 끊김      | L3        | traceroute    |

### 진단 순서 요약

1. IP 확인 (내가 네트워크에 있는가?)
2. DNS 확인 (이름을 IP로 바꿀 수 있는가?)
3. 포트 확인 (서비스 포트가 열려 있는가?)
4. 경로 확인 (중간에 끊기지 않는가?)

![assets/troubleshoot_flow.png](./assets/troubleshoot_flow.webp)

> 문제 진단 흐름

---

## OS별 도구 설치 팁

- macOS: `brew install iperf3 tcpdump`
- Windows: `choco install wireshark`
- Linux: `sudo apt install iperf3 tcpdump`

---

## 실전 사례

- 사례 1: DNS 실패 vs 포트 실패 구분.
- 사례 2: traceroute 중간 끊김 분석.
- 사례 3: tcpdump로 재전송 확인.

---

## 추가 장애 시나리오 (실제 로그 기반)

### 시나리오 1: DNS는 되는데 접속이 안 됨

```shellsession
mac> dig example.com
example.com. 86400 IN A 93.184.216.34
mac> nc -vz example.com 443
nc: connectx to example.com port 443 (tcp) failed: Operation timed out
```

**해석**: DNS 정상, 포트 차단 또는 서버 문제.

### 시나리오 2: 라우팅 문제

```shellsession
lin> ping -c 3 10.0.2.20
connect: Network is unreachable
lin> ip route
(default route 없음)
```

**해석**: 기본 게이트웨이 또는 라우팅 누락.

### 시나리오 3: 패킷 손실 증가

```shellsession
mac> ping -c 20 8.8.8.8
20 packets transmitted, 15 received, 25% packet loss
```

**해석**: 링크 품질 저하, 혼잡 가능성.
