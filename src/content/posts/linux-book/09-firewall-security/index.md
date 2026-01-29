---
title: "09 Firewall & Security"
published: 2026-02-09
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 기본 방화벽 정책을 설계하고 적용한다.
- SSH 보안을 강화하고 감사 가능한 설정을 만든다.
  :::

## 한줄 요약

기본 차단 정책과 SSH 보안을 설정·점검한다.

## 핵심 개념

**기본 정책**
보안의 기본은 “기본 차단(deny) + 필요한 것만 허용(allow)”이다. 이 원칙을 지키면 실수로 열린 포트를 줄일 수 있다.

**UFW**
iptables/nftables를 쉽게 쓰게 해주는 도구다. 초보자는 UFW로 시작하는 게 안전하다.

**보안은 설정 + 운영 습관**
설정만 해두고 끝나는 게 아니라, 로그 확인/업데이트/접근제어 같은 운영 습관이 중요하다.

**포트와 규칙 매칭**
열린 포트 목록과 방화벽 규칙이 항상 일치해야 한다. “포트는 열려 있는데 규칙이 없다” 같은 상태는 사고로 이어질 수 있다.

---

## 필수 명령어

- `ufw status`, `ufw allow`, `ufw deny`, `ufw enable`
- `ss -lntup`, `lsof -i`
- `journalctl -u ssh`, `ssh -v`

---

## 실습 1: UFW 기본 정책

```bash
lin> sudo ufw default deny incoming
lin> sudo ufw default allow outgoing
lin> sudo ufw allow 22/tcp
lin> sudo ufw enable
lin> sudo ufw status verbose
```

---

## 실습 2: 서비스 포트 열기

```bash
lin> sudo ufw allow 80/tcp
lin> sudo ufw allow 443/tcp
lin> sudo ufw status numbered
```

---

## 실습 3: SSH 보안 강화

```bash
lin> sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
# PasswordAuthentication no
lin> sudo systemctl reload ssh
lin> sudo journalctl -u ssh --since "10 min ago"
```

---

## 체크포인트

- 기본 차단 + 예외 허용 원칙을 설명할 수 있는가?
- 리슨 포트와 방화벽 규칙을 비교해 이상을 찾을 수 있는가?

---

## 트러블슈팅

- SSH 접속 실패: 방화벽 규칙, 포트, sshd 상태 확인
- 규칙 충돌: `ufw status numbered`로 정리

---

## 09.4 SSH 하드닝 실전

SSH는 서버의 문이므로 최소한의 강화는 필수다. 아래 항목은 “왜 쓰는지”를 알고 적용해야 한다.

- `/etc/ssh/sshd_config` 핵심 옵션
  - `Port 22` → 필요 시 변경 (무차별 스캔을 줄이지만 보안의 핵심은 아님)
  - `PasswordAuthentication no` (키 기반 강제)
  - `PermitRootLogin no` (루트 직접 로그인 금지)
  - `MaxAuthTries 3`, `LoginGraceTime 20`, `ClientAliveInterval 300`, `ClientAliveCountMax 2` (브루트포스 완화)
  - `AllowUsers alice devops@10.0.0.*` (허용 사용자/대역 제한)
- 2FA(MFA): `libpam-google-authenticator` 설치 후 PAM에 `pam_google_authenticator.so` 추가
- 무차별 대입 완화: `fail2ban` 설치, `sshd` jail 활성화, ban time/tries 조정
- 재시작 없이 반영: `sudo systemctl reload ssh`

---

## 09.5 계정·권한 정책

계정 정책은 침해 사고의 1차 방어선이다.

- `sudo` 최소 권한: `/etc/sudoers.d/<team>`에 명시, `NOPASSWD`는 자동화 계정에만 제한적으로
- PAM 기본 원칙: `/etc/pam.d/common-password`에서 최소 길이, 복잡도, 재사용 금지 설정
- 계정 잠금: `pam_faillock` 또는 `pam_tally2`로 실패 시도 제한
- 쉘 제한 계정: 서비스 계정은 `/usr/sbin/nologin` 사용, 홈/권한 최소화

---

## 09.6 감사(auditd)와 로깅

중요 파일 변경이나 실행 기록을 남기려면 auditd가 필요하다.

- 패키지: `sudo apt install auditd audispd-plugins`
- 규칙 예시 `/etc/audit/rules.d/hardening.rules`
  - SSH 설정 변경 추적: `-w /etc/ssh/sshd_config -p wa -k sshd_conf`
  - sudo 로그: `-w /var/log/auth.log -p wa -k authlog`
  - 바이너리 실행 추적: `-a always,exit -F arch=b64 -S execve -k exec_log`
- 상태 확인: `sudo auditctl -l`, 보고: `ausearch -k sshd_conf`, `aureport -x --summary`
- 중앙집중: `audisp-remote`로 SIEM/CloudWatch/Loki에 전송

---

## 09.7 CIS Benchmark 체크리스트(요약)

CIS는 보안 기준의 “체크리스트”다. 전부 적용하기 어렵다면 중요한 것부터 점검한다.

- 패키지/서비스: 불필요 서비스 제거, 자동 업데이트 활성/점검
- 인증: root 패스워드 잠금, 패스워드 수명/복잡도 정책, sudo 기록
- 네트워크: IPv6 필요 없으면 비활성화, 소스 라우팅/ICMP 리다이렉트 금지, rp_filter=1
- 로깅: rsyslog/journald 원격 전송, 로그 권한 600 유지
- 부팅: GRUB 비밀번호, 단일 사용자 모드 보호
- 스캔: `lynis audit system` 또는 `cis-cat`으로 정기 점검

---

## 09.8 TLS/PKI 기본 운영

TLS/PKI는 “통신 암호화”의 핵심이다. 운영 중에는 인증서 만료가 가장 흔한 장애 원인이다.

- 내부 CA: `step-ca` 또는 `openssl`로 루트/중간 CA 구성, CRL/OCSP 제공
- 서버 인증서 배포: system trust store에 CA 추가 (`/usr/local/share/ca-certificates/*.crt` + `update-ca-certificates`)
- 자동 갱신: `systemd.timer` + 스크립트로 재발급 후 서비스 재로드 (예: `nginx -s reload`)
- 검증 실습: `openssl s_client -connect host:443 -servername host -showcerts`, SAN/유효기간/체인 확인

