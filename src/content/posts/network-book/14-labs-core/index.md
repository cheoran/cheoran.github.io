---
title: "14 핵심 실습 (상세)"
published: 2026-01-14
description: "- VM1 ↔ VM2 ping 성공"
image: "assets/cover.svg"
tags: ["network", "학습"]
category: "네트워크"
draft: false
---
# 14 핵심 실습 (상세)

## 14.1 Lab 1: 동일 서브넷 통신

### 목표
- VM1 ↔ VM2 ping 성공

### 단계
Step 1: VM1 IP 설정
```shellsession
vm1> sudo ip addr add 10.0.1.10/24 dev enp0s3
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```
Step 2: VM2 IP 설정
```shellsession
vm2> sudo ip addr add 10.0.1.20/24 dev enp0s3
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```
Step 3: ping 테스트
```shellsession
vm1> ping -c 3 10.0.1.20
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```

### 예상 출력
### 예상 출력 전체 예시

```
64 bytes from 10.0.1.20: icmp_seq=1 ttl=64 time=0.6 ms
64 bytes from 10.0.1.20: icmp_seq=2 ttl=64 time=0.7 ms
64 bytes from 10.0.1.20: icmp_seq=3 ttl=64 time=0.6 ms

--- 10.0.1.20 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
```

(요약)

```
64 bytes from 10.0.1.20: icmp_seq=1 ttl=64 time=0.6 ms
```

---

## 14.2 Lab 2: 라우팅 구성

### 목표
- 서로 다른 네트워크 통신

### 단계
Step 1: VM3 라우터 설정
```shellsession
vm3> sudo sysctl -w net.ipv4.ip_forward=1
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
vm3> sudo ip addr add 10.0.1.1/24 dev enp0s3
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
vm3> sudo ip addr add 10.0.2.1/24 dev enp0s8
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```
Step 2: VM1 라우트 추가
```shellsession
vm1> sudo ip route add 10.0.2.0/24 via 10.0.1.1
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```
Step 3: VM2 라우트 추가
```shellsession
vm2> sudo ip route add 10.0.1.0/24 via 10.0.2.1
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```
Step 4: ping 테스트
```shellsession
vm1> ping -c 3 10.0.2.20
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```

### 예상 출력
### 예상 출력 전체 예시

```
64 bytes from 10.0.2.20: icmp_seq=1 ttl=63 time=0.9 ms
64 bytes from 10.0.2.20: icmp_seq=2 ttl=63 time=1.0 ms
64 bytes from 10.0.2.20: icmp_seq=3 ttl=63 time=0.9 ms
```

(요약)

(요약)

```
64 bytes from 10.0.2.20: icmp_seq=1 ttl=63 time=0.9 ms
```

---

## 14.3 Lab 3: DNS 서버 구성 (dnsmasq)

### 목표
- 로컬 DNS 이름 해석

### 단계
Step 1: VM2에 dnsmasq 설치
```shellsession
vm2> sudo apt install -y dnsmasq
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```
Step 2: 레코드 추가
```shellsession
vm2> echo "10.0.2.20 myapp.local" | sudo tee -a /etc/hosts
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```
Step 3: VM1 DNS 서버 지정
```shellsession
vm1> echo "nameserver 10.0.2.20" | sudo tee /etc/resolv.conf
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```
Step 4: 확인
```shellsession
vm1> dig myapp.local
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```

### 예상 출력
### 예상 출력 전체 예시

```
; <<>> DiG 9.x <<>> myapp.local
;; ANSWER SECTION:
myapp.local. 0 IN A 10.0.2.20
```

(요약)

(요약)

(요약)

```
myapp.local. 0 IN A 10.0.2.20
```

---

## 14.4 Lab 4: HTTP 서버 구축

### 목표
- VM2에서 웹서버 실행 후 VM1 접속

### 단계
```shellsession
vm2> python3 -m http.server 8080
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
vm1> curl http://10.0.2.20:8080
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```

### 예상 출력
### 예상 출력 전체 예시

```html
<!DOCTYPE HTML>
<html>
<head><title>Directory listing for /</title></head>
<body>...
```

(요약)

(요약)

(요약)

(요약)

```html
<!DOCTYPE HTML>
<html>...
```

---

## 14.5 Lab 5: 방화벽 규칙

### 목표
- 특정 포트 차단

### 단계
```shellsession
vm2> sudo iptables -A INPUT -p tcp --dport 8080 -j DROP
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
vm1> curl http://10.0.2.20:8080
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```

### 예상 출력
### 예상 출력 전체 예시

```
curl: (7) Failed to connect to 10.0.2.20 port 8080: Connection timed out
```

(요약)

(요약)

(요약)

(요약)

(요약)

- timeout 또는 connection failed

### 복구
```shellsession
vm2> sudo iptables -F
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```

---

## 14.6 Lab 6: 패킷 캡처

### 목표
- tcpdump로 핸드셰이크 확인

### 단계
```shellsession
vm1> sudo tcpdump -i enp0s3 tcp port 8080
> 왜 이 명령? 네트워크 연결을 만들거나 상태를 확인하기 위해 실행한다.
```

### 예상 출력
### 예상 출력 전체 예시

```
IP 10.0.1.10.54321 > 10.0.2.20.8080: Flags [S]
IP 10.0.2.20.8080 > 10.0.1.10.54321: Flags [S.]
IP 10.0.1.10.54321 > 10.0.2.20.8080: Flags [.]
```

(요약)

(요약)

(요약)

(요약)

(요약)

(요약)

```
SYN
SYN, ACK
ACK
```

---

## 14.7 트러블슈팅 가이드
- ping 실패 시: IP 설정 확인 → 인터페이스 이름 확인
- DNS 실패 시: /etc/resolv.conf 확인
- HTTP 실패 시: 방화벽/포트 리스닝 확인

---

## 14.8 실습 결과 기록 템플릿
- 날짜:
- 환경:
- 수행 단계:
- 실제 출력:
- 문제 및 해결:

---
## 14.9 실습 스크린샷 자리표시자
- [스크린샷] 실행 화면
- [스크린샷] 예상 출력
- [스크린샷] 문제 발생 시 화면

---
## 실습 검증 체크리스트
- 실행 결과가 예상 출력과 일치함
- 오류 없이 완료됨
- 동일 환경에서 재현 가능함

