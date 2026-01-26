---
title: "16 심화 실습 (상세)"
published: 2026-01-16
description: "심화 실습: 로드밸런싱, WireGuard, 장애 대응"
image: "assets/cover.svg"
showCover: false
tags: ["network", "학습"]
category: "네트워크"
draft: false
---

---

:::note[섹션 개요]

- Lab 1: 로드밸런싱 확장
- Lab 2: WireGuard 확장
- Lab 3: 장애 시나리오

:::

---

## 16.1 Lab 1: 로드밸런싱 확장

### 목표

- 백엔드 3개 구성
- 헬스체크 실패 시 우회 확인

### 단계

1. 백엔드 3개 실행
2. Nginx upstream 추가
3. 백엔드 하나 종료 후 응답 확인

### 검증 포인트

- 요청이 살아있는 백엔드로만 라우팅되는가
- 헬스체크 실패 시 자동 제외되는가

### 예상 출력(요약)

```
HTTP/1.1 200 OK
Server: SimpleHTTP/0.6 Python/3.x
```

---

## 16.2 Lab 2: WireGuard 확장

### 목표

- AllowedIPs에 서브넷 추가
- 라우팅 기반 터널 통신

### 단계

1. AllowedIPs에 대상 서브넷 추가
2. 라우팅 테이블 확인
3. 원격 서브넷 ping/trace 테스트

### 예상 출력(요약)

```
latest handshake: 1 minute, 2 seconds ago
```

---

## 16.3 Lab 3: 장애 시나리오

### 목표

- 라우팅 테이블 삭제 → 실패
- 원인 분석 후 복구

### 단계

1. 라우팅 삭제

```shellsession
vm1> sudo ip route del 10.0.2.0/24
```

2. 통신 실패 확인

3. 라우팅 복구

```shellsession
vm1> sudo ip route add 10.0.2.0/24 via 10.0.1.1
```

### 검증 포인트

- 실패 시 경로가 사라졌는지 확인
- 복구 후 정상 통신되는지 확인

### 예상 출력(요약)

```
connect: Network is unreachable
```

---

## 16.4 문제 + 모범답안

1. 문제: 로드밸런싱 중 한 백엔드만 응답한다. 원인은?

- 답: 업스트림 설정 오류 또는 백엔드 다운.

2. 문제: WireGuard 연결은 되는데 특정 서브넷만 안 된다. 원인은?

- 답: AllowedIPs 또는 라우팅 누락.

---

## 16.5 체크리스트

- 로드밸런서 헬스체크 동작 확인
- WireGuard 서브넷 라우팅 확인
- 장애 시나리오 복구 가능
