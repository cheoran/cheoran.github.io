---
title: "14 Containers & VMs"
published: 2026-02-14
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 컨테이너와 VM의 차이를 이해한다.
- Docker 기본 명령으로 컨테이너를 실행한다.
  :::

## 한줄 요약

컨테이너 vs VM 차이를 이해하고 기본 실행을 해본다.

## 핵심 개념

**VM**
하이퍼바이저 위에서 “OS 전체”를 띄운다. 격리는 강하지만 무겁다.

**컨테이너**
호스트 커널을 공유하며 프로세스만 격리한다. 가볍고 빠르지만 커널을 공유한다.

**포트 매핑**
컨테이너 내부 포트를 호스트 포트에 연결해 외부에서 접근하게 한다. 예: `8080:80`.

---

## 필수 명령어

- `docker version`, `docker ps`, `docker run`, `docker logs`

---

## 실습 1: 컨테이너 실행

```bash
lin> sudo docker run --name web -d -p 8080:80 nginx
lin> curl -I http://127.0.0.1:8080
lin> sudo docker ps
```

이 명령을 사용하는 이유
- nginx 컨테이너를 실행하고, 실제로 접근 가능한지 확인한다.

예상 결과(예시):
```text
HTTP/1.1 200 OK
Server: nginx/1.25
```

---

## 실습 2: 로그 확인 및 종료

```bash
lin> sudo docker logs web
lin> sudo docker stop web
lin> sudo docker rm web
```

이 명령을 사용하는 이유
- 로그를 확인하고 컨테이너를 정상 종료/삭제한다.

---

## 체크포인트

- 컨테이너와 VM 차이를 쉽게 설명할 수 있는가?
- 포트 매핑이 무엇인지 말할 수 있는가?

---

## 트러블슈팅

- 컨테이너 미기동: 이미지/포트 충돌 확인

---

## 14.3 런타임 아키텍처

Docker는 실제 컨테이너 실행을 containerd가 담당한다. Kubernetes에서는 CRI-O 또는 containerd가 일반적이다.

- 핵심 격리 메커니즘: namespaces(net, pid, mnt, uts, ipc, user), cgroups v2(자원), seccomp/AppArmor(시스템콜/프로필)
- rootless 컨테이너: user namespace 사용, 호스트 권한 노출 최소화

---

## 14.4 보안 설정

컨테이너는 기본이 안전하지 않다. 최소 권한으로 운영해야 한다.

- seccomp: 기본 프로필 적용, 필요 syscall만 추가 허용
- AppArmor: `docker run --security-opt apparmor=profile` 로 제한
- capabilities 최소화: `--cap-drop ALL --cap-add NET_BIND_SERVICE` 등
- 이미지 서명/검증: cosign/notary 활용, private registry + pull secrets

---

## 14.5 컨테이너 네트워크/스토리지 필수

- 브리지 확인: `docker network ls`, `ip link show docker0`
- 호스트 네트워크: `--network host` 사용 시 포트 충돌 주의
- 볼륨: `-v /data:/data:ro`로 읽기전용 마운트, 퍼미션은 uid/gid 매핑 고려

---

## 14.6 VM 대비 선택 가이드

- 컨테이너: 무상태/수평 확장 서비스, 빌드·배포 주기가 짧을 때
- VM: 커널/드라이버 요구, 강한 격리 필요, 커스텀 커널 모듈 사용 시

