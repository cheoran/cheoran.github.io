---
title: "L2 스위칭"
published: 2025-12-22T19:00:00+09:00
description: "MAC 주소, 스위치 동작 원리, ARP 프로토콜을 정리합니다"
tags: ["network"]
category: "네트워크"
draft: false
---

---

## MAC(Media Access Control) 주소

- 48비트 고유 식별자
- 같은 네트워크 안에서 장치를 구분

## 스위치 동작 원리

스위치는 **MAC 주소 테이블**을 만든다.

### 동작 흐름

1. 프레임 수신
2. 출발지 MAC을 테이블에 기록
3. 목적지 MAC이 테이블에 있으면 해당 포트로 전달
4. 없으면 플러딩

:::note[플러딩이란]

- 수신처 주소(MAC)를 모를 때, 스위치가 수신 포트를 제외한 모든 포트로 무조건 복사하여 전달.
  :::

```text
[PC A] --\
          [SWITCH] ---- [PC B]
[PC C] --/
```

---

## ARP(Address Resolution Protocol)

IP 주소만 알고 있을 때 MAC 주소를 얻는 프로토콜

### ARP는 왜 필요한가

- IP 주소로는 실제 장비를 찾을 수 없다.
- 같은 네트워크 안에서는 **MAC 주소**를 알아야 전송이 가능하다.

### 과정

1. ARP Request (브로드캐스트)
2. ARP Reply (유니캐스트)

```
A: "192.168.0.20 누구야?" (브로드캐스트)
B: "나야. MAC=aa:bb:cc:dd:ee:ff" (유니캐스트)
```

![assets/switch_arp.png](./assets/switch_arp.webp)

> 스위치와 ARP 브로드캐스트

---

## 실습 1: ARP 캐시 확인

### macOS

```shellsession
mac> arp -a
mac> ping -c 1 192.168.0.1
mac> arp -a | head -n 5
```

### Windows (PowerShell)

```shellsession
win> arp -a
win> ping 192.168.0.1
win> arp -a
```

### Linux

```shellsession
lin> ip neigh
lin> ping -c 1 192.168.0.1
lin> ip neigh
```

### 예상 출력

```
? (192.168.0.1) at xx:xx:xx:xx:xx:xx on en0
```

---

## 실습 2: VM 두 대로 동일 서브넷 통신

### 단계

1. VM1, VM2 생성
2. 둘 다 Internal Network (intnet1)
3. IP 지정

```shellsession
vm1> sudo ip addr add 10.0.1.10/24 dev enp0s3
vm2> sudo ip addr add 10.0.1.20/24 dev enp0s3
```

4. ping 테스트

```shellsession
vm1> ping -c 3 10.0.1.20
```

### 예상 출력

```
64 bytes from 10.0.1.20: icmp_seq=1 ttl=64 time=0.6 ms
```

---

## 브로드캐스트 도메인

- 스위치 내부는 **하나의 브로드캐스트 도메인**
- 라우터가 도메인을 분리

## 실전 시나리오

### 상황: ARP 폭주

- 증상: 네트워크 전체 느려짐
- 원인: 루프(Spanning Tree 미적용)

---

## OS별 추가 실습: MAC 확인

### macOS

```shellsession
mac> ifconfig en0 | grep ether
```

### Windows

```shellsession
win> getmac /v
```

### Linux

```shellsession
lin> ip link | grep ether
```

---

## 실전 사례

- 사례 1: ARP 테이블 오염 → 스푸핑 의심.
- 사례 2: 브로드캐스트 폭주 → 루프 발생.
- 사례 3: 특정 포트만 느림 → 스위치 포트 오류.
