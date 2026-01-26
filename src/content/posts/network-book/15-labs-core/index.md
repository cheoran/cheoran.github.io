---
title: "15 핵심 실습 (상세)"
published: 2026-01-15
description: "- VM1 ↔ VM2 ping 성공"
image: "assets/cover.svg"
showCover: false
tags: ["network", "학습"]
category: "네트워크"
draft: false
---

---

:::note[섹션 개요]

- Lab 1: 같은 서브넷에서 ping 성공
- Lab 2: 라우터(VM3)로 서로 다른 서브넷 통신
- Lab 3: dnsmasq로 로컬 DNS 이름 해석
- Lab 4: HTTP 서버 접속
- Lab 5: 방화벽으로 포트 차단/복구
- Lab 6: tcpdump로 TCP 핸드셰이크 관찰
  :::

---

## 15.1 Lab 1: 동일 서브넷 통신

### 단계

1) VM1/VM2를 같은 Internal Network(intnet1)로 설정

2) VM1 IP 설정
```shellsession
vm1> sudo ip addr add 10.0.1.10/24 dev enp0s3
```

3) VM2 IP 설정
```shellsession
vm2> sudo ip addr add 10.0.1.20/24 dev enp0s3
```

4) ping 테스트
```shellsession
vm1> ping -c 3 10.0.1.20
```

### 예상 출력(요약)
```
3 packets transmitted, 3 received, 0% packet loss
```

---

## 15.2 Lab 2: 라우팅 구성

### 목표

- 서로 다른 네트워크 통신

### 단계

1) VM2를 Internal Network(intnet2)로 변경하고 IP 재설정
```shellsession
vm2> sudo ip addr add 10.0.2.20/24 dev enp0s3
```

2) VM3 라우터 설정
```shellsession
vm3> sudo sysctl -w net.ipv4.ip_forward=1
vm3> sudo ip addr add 10.0.1.1/24 dev enp0s3
vm3> sudo ip addr add 10.0.2.1/24 dev enp0s8
```

3) VM1 라우트 추가
```shellsession
vm1> sudo ip route add 10.0.2.0/24 via 10.0.1.1
```

4) VM2 라우트 추가
```shellsession
vm2> sudo ip route add 10.0.1.0/24 via 10.0.2.1
```

5) ping 테스트
```shellsession
vm1> ping -c 3 10.0.2.20
```

### 예상 출력(요약)
```
3 packets transmitted, 3 received, 0% packet loss
```

---

## 15.3 Lab 3: DNS 서버 구성 (dnsmasq)

### 목표

- 로컬 DNS 이름 해석

### 단계

1) VM2에 dnsmasq 설치
```shellsession
vm2> sudo apt install -y dnsmasq
```

2) 레코드 추가
```shellsession
vm2> echo "10.0.2.20 myapp.local" | sudo tee -a /etc/hosts
```

3) dnsmasq 재시작
```shellsession
vm2> sudo systemctl restart dnsmasq
```

4) VM1 DNS 서버 지정
```shellsession
vm1> echo "nameserver 10.0.2.20" | sudo tee /etc/resolv.conf
```

5) 확인
```shellsession
vm1> dig myapp.local
```

:::note[/etc/resolv.conf 주의]
systemd-resolved 환경에서는 /etc/resolv.conf가 자동으로 덮어써질 수 있다.
필요하면 `resolvectl dns`로 설정한다.
:::

### 예상 출력(요약)
```
myapp.local. 0 IN A 10.0.2.20
```

---

## 15.4 Lab 4: HTTP 서버 구축

### 목표

- VM2에서 웹서버 실행 후 VM1 접속

### 단계

```shellsession
vm2> python3 -m http.server 8080
```

다른 터미널에서:

```shellsession
vm1> curl http://10.0.2.20:8080
```

### 예상 출력(요약)
```html
<!DOCTYPE html>
<html>
  ...
</html>
```

---

## 15.5 Lab 5: 방화벽 규칙

### 목표

- 특정 포트 차단

### 단계

```shellsession
vm2> sudo iptables -A INPUT -p tcp --dport 8080 -j DROP
vm1> curl http://10.0.2.20:8080
```

### 예상 출력(요약)
```
curl: (7) Failed to connect to 10.0.2.20 port 8080: Connection timed out
```

### 복구

```shellsession
vm2> sudo iptables -F
```

---

## 15.6 Lab 6: 패킷 캡처

### 목표

- tcpdump로 핸드셰이크 확인

### 단계

```shellsession
vm1> sudo tcpdump -i enp0s3 tcp port 8080
```

### 예상 출력(요약)
```
Flags [S]
Flags [S.]
Flags [.]
```

---
## 15.7 트러블슈팅 가이드

- ping 실패 시: IP 설정 확인 → 인터페이스 이름 확인
- DNS 실패 시: /etc/resolv.conf 확인
- HTTP 실패 시: 방화벽/포트 리스닝 확인
