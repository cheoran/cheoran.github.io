---
title: "02 Boot & systemd"
published: 2026-02-02
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 리눅스가 켜질 때 어떤 순서로 시작되는지 이해한다.
- systemd로 서비스를 켜고 끄는 기본 흐름을 익힌다.
- 장애가 나면 복구 모드로 들어가 최소한의 점검을 할 수 있다.
  :::

## 한줄 요약

부팅 흐름과 systemd 서비스 관리를 “왜 필요한지”부터 이해한다.

## 핵심 개념

**부트로더(GRUB)**
전원을 켠 직후 가장 먼저 동작하는 “선택 화면”이다. 어떤 커널/OS로 부팅할지 고르고, 필요하면 복구 모드 같은 옵션을 선택할 수 있다. 평소에는 그냥 지나가지만, 부팅 실패 시에는 여기서 복구 모드로 들어가야 한다.

**init 시스템(systemd)**
커널이 올라온 다음, 서비스들을 순서대로 켜고 관리하는 “현장 관리자”다. 네트워크, SSH, 데이터베이스 같은 서비스는 systemd가 시작한다. 서비스가 죽으면 재시작하게 만들 수도 있고, 부팅 시 자동 시작 여부도 systemd가 결정한다.

**타겟(target)**
부팅 모드를 뜻한다. `multi-user`는 화면 없는 서버 모드, `graphical`은 GUI까지 올리는 모드다. `rescue`/`emergency`는 최소 서비스만 켠 복구 모드다. 즉 “어디까지 시스템을 켤지”를 정하는 이름이다.

---

## 필수 명령어

- `systemctl status 서비스명` : 현재 상태 확인
- `systemctl start|stop|restart 서비스명` : 켜기/끄기/재시작
- `systemctl enable|disable 서비스명` : 부팅 시 자동 시작 설정
- `journalctl -u 서비스명` : 서비스 로그 확인
- `systemctl get-default` / `set-default` : 기본 부팅 모드 확인/변경

왜 필요한가?
서비스가 안 뜰 때는 “상태 → 로그 → 재시작” 순서로 확인해야 한다. 그리고 서버는 재부팅 후 자동으로 필요한 서비스가 올라와야 하므로 `enable/disable`이 중요하다.

---

## 실습 1: 서비스 상태 확인

```bash
lin> systemctl status ssh
```

이 명령을 사용하는 이유
- SSH 서비스가 지금 동작 중인지 확인한다. 원격 접속이 안 될 때 가장 먼저 확인해야 한다.

예상 결과(예시):
```text
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled)
     Active: active (running) since Mon 2026-02-02 09:10:12 KST; 2h ago
```

해석:
- `Loaded: ... enabled`이면 부팅 시 자동 시작
- `Active: active (running)`이면 현재 동작 중

```bash
lin> systemctl is-enabled ssh
```

이 명령을 사용하는 이유
- 부팅 시 자동 시작 여부만 빠르게 확인한다.

예상 결과(예시):
```text
enabled
```

---

## 실습 2: 서비스 등록/해제

```bash
lin> sudo systemctl disable apache2
lin> sudo systemctl enable apache2
```

이 명령을 사용하는 이유
- 서비스가 부팅 때 자동으로 올라오는지 설정한다. “필요한 서비스만 자동 실행”하는 게 운영 기본이다.

예상 결과(예시):
```text
Removed "/etc/systemd/system/multi-user.target.wants/apache2.service".
Created symlink /etc/systemd/system/multi-user.target.wants/apache2.service → /lib/systemd/system/apache2.service.
```

해석:
- `Removed`는 자동 시작 해제
- `Created symlink`는 자동 시작 활성화

---

## 실습 3: 부팅 타겟 확인/변경

```bash
lin> systemctl get-default
lin> sudo systemctl set-default multi-user.target
```

이 명령을 사용하는 이유
- 서버 환경에서는 GUI가 필요 없어서 `multi-user`로 설정하는 경우가 많다.

예상 결과(예시):
```text
graphical.target
Created symlink /etc/systemd/system/default.target → /lib/systemd/system/multi-user.target.
```

해석:
- 첫 줄은 현재 기본 타겟
- 두 번째 줄은 변경 적용 결과

---

## 체크포인트

- `status`는 “지금 상태”, `enable`은 “다음 부팅 자동 시작”임을 설명할 수 있는가?
- 특정 서비스 로그를 `journalctl -u`로 확인할 수 있는가?
- `multi-user`와 `graphical`의 차이를 설명할 수 있는가?

---

## 트러블슈팅

- 부팅 실패 시: GRUB에서 `recovery`로 진입한 뒤 최소 서비스만 확인한다.
- 서비스가 안 뜰 때: `systemctl status`로 상태 확인 → `journalctl -u 서비스명`으로 원인 확인.

