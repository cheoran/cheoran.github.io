---
title: "12 VPN과 터널 "
published: 2026-01-12
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
showCover: false
tags: ["network", "학습"]
category: "네트워크"
draft: false
---

---

:::note[섹션 개요]

- VPN 터널 개념 설명 가능
- VPN과 터널링을 이해한다.
- WireGuard 기본 구성을 수행한다.

  :::

---

## 12.1 VPN 개념

VPN은 **암호화된 터널**을 통해 안전한 통신을 제공한다.

### VPN이 왜 필요한가

- 공용 인터넷에서도 회사 내부망처럼 안전하게 접속하기 위해서다.

### 터널이란

- 원래 데이터를 암호화된 껍질로 감싸서 전달하는 방식이다.

![assets/vpn_tunnel.png](./assets/vpn_tunnel.webp)

> 그림 12-1. VPN 터널 개념

### 사용 사례

- 회사 내부망 원격 접속
- 데이터 보호

---

## 12.2 WireGuard 개요

- 설정이 단순하고 성능이 좋음

---

## 12.3 실습: WireGuard 터널 구성

### 설치

```shellsession
vm1> sudo apt install -y wireguard
vm2> sudo apt install -y wireguard
```

### 키 생성

```shellsession
vm1> wg genkey | tee privatekey | wg pubkey > publickey
vm2> wg genkey | tee privatekey | wg pubkey > publickey
```

### 설정 파일

VM1 `/etc/wireguard/wg0.conf`

```
[Interface]
Address = 10.10.0.1/24
PrivateKey = <VM1_PRIVATE>

[Peer]
PublicKey = <VM2_PUBLIC>
AllowedIPs = 10.10.0.2/32
Endpoint = 10.0.2.20:51820
```

VM2 `/etc/wireguard/wg0.conf`

```
[Interface]
Address = 10.10.0.2/24
PrivateKey = <VM2_PRIVATE>

[Peer]
PublicKey = <VM1_PUBLIC>
AllowedIPs = 10.10.0.1/32
Endpoint = 10.0.1.10:51820
```

### 실행

```shellsession
vm1> sudo wg-quick up wg0
vm2> sudo wg-quick up wg0
```

### 테스트

```shellsession
vm1> ping -c 3 10.10.0.2
```

---

## 12.4 체크리스트

- VPN 터널 개념 설명 가능
- WireGuard 구성 성공

## 12.5 복습 문제

1. VPN이 필요한 이유는?
2. WireGuard에서 AllowedIPs의 역할은?

---

## 12.6 심화 이론: 터널링과 캡슐화

- 원래 패킷을 다른 패킷 안에 넣어 전송
- 외부에서는 내부 주소가 보이지 않음

## 12.7 실전 시나리오

### 상황: 집에서 회사 내부망 접근

- VPN 연결로 내부망 IP 접근 가능

---

## 12.8 OS별 WireGuard 상태 확인

### Linux

```shellsession
lin> sudo wg show
```

### Windows/macOS

- WireGuard GUI에서 상태 확인

---

## 12.9 문제 + 모범답안

1. **문제**: VPN 터널이 필요한 이유는?
   **답**: 공용 인터넷에서 안전한 통신.
2. **문제**: 터널링의 핵심은?
   **답**: 패킷 캡슐화.

---

## 12.10 실전 사례

- 사례 1: VPN 연결되지만 특정 대역 안 됨 → AllowedIPs 누락.
- 사례 2: 연결이 자주 끊김 → MTU 조정 필요.
- 사례 3: 성능 저하 → 암호화 오버헤드 확인.
