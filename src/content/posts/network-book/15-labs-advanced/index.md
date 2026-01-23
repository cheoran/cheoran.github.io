---
title: "15 심화 실습 (상세)"
published: 2026-01-15
description: "`` HTTP/1.1 200 OK Server: SimpleHTTP/0.6 Python/3.x ``"
image: "assets/cover.svg"
tags: ["network", "학습"]
category: "네트워크"
draft: false
---
# 15 심화 실습 (상세)

## 15.1 Lab 1: 로드밸런싱 확장

### 예상 출력 전체 예시

```
HTTP/1.1 200 OK
Server: SimpleHTTP/0.6 Python/3.x
```

### 목표
- 백엔드 3개 구성
- 헬스체크 실패 시 우회 확인

### 단계
Step 1: 백엔드 3개 실행
Step 2: Nginx upstream 추가
Step 3: 백엔드 하나 종료 후 응답 확인

---

## 15.2 Lab 2: WireGuard 확장

### 예상 출력 전체 예시

```
interface: wg0
  public key: <redacted>
  latest handshake: 1 minute, 2 seconds ago
  transfer: 12.3 KiB received, 10.8 KiB sent
```

### 목표
- AllowedIPs에 서브넷 추가
- 라우팅 기반 터널 통신

---

## 15.3 Lab 3: 장애 시나리오

### 예상 출력 전체 예시

```
connect: Network is unreachable
```

### 목표
- 라우팅 테이블 삭제 → 실패
- 원인 분석 후 복구

### 단계
Step 1: 라우팅 삭제
```shellsession
vm1> sudo ip route del 10.0.2.0/24
```
Step 2: 통신 실패 확인
Step 3: 라우팅 복구
```shellsession
vm1> sudo ip route add 10.0.2.0/24 via 10.0.1.1
```

---

## 15.4 문제 + 모범답안
Step 1: **문제**: 로드밸런싱 중 한 백엔드만 응답한다. 원인은?
   **답**: 업스트림 설정 오류 또는 백엔드 다운.
Step 2: **문제**: WireGuard 연결은 되는데 특정 서브넷만 안 된다. 원인은?
   **답**: AllowedIPs 또는 라우팅 누락.

---
## 15.5 실습 스크린샷 자리표시자
- [스크린샷] 실행 화면
- [스크린샷] 예상 출력
- [스크린샷] 문제 발생 시 화면

---
## 실습 검증 체크리스트
- 실행 결과가 예상 출력과 일치함
- 오류 없이 완료됨
- 동일 환경에서 재현 가능함

