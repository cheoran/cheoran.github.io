---
title: "cgroup CPU 제한 실습 (stress)"
published: 2026-02-04
description: "CPU 제한을 걸고 stress로 확인하는 간단 실습"
tags: ["linux"]
category: "리눅스"
lang: "ko"
draft: false
showCover: false
---

:::note[섹션 개요]

- cgroup이 무엇인지와 기본 구조를 이해한다.
- cgroup 내부 파일의 의미를 정리한다.
- stress로 부하를 걸고 top으로 확인한다.
  :::

## cgroup

cgroup은 프로세스를 묶어서 CPU/메모리 같은 자원을 제한하거나 측정하는 커널 기능이다.
`/sys/fs/cgroup` 아래의 **디렉터리 하나가 곧 하나의 cgroup**이고, 여기에 파일로 설정을 넣는다.

### cgroup 내부 파일 구성(핵심)

파일은 크게 **공통 메타 파일**과 **컨트롤러별 파일**로 나뉜다. 읽으면 상태/통계를 보고, 쓰면 제한/정책을 설정한다.

공통 메타 파일:

- `cgroup.controllers`: 상위 cgroup에서 자식으로 내려줄 수 있는 컨트롤러 목록
- `cgroup.subtree_control`: 자식 cgroup에서 활성화할 컨트롤러 선택(+/-)
- `cgroup.procs`: 이 cgroup에 포함된 PID 목록(여기에 PID를 쓰면 이동)
- `cgroup.events`: OOM/Freeze 등 이벤트 상태 요약
- `cgroup.stat`: cgroup 내부 기본 통계(자식 수 등)
- `cgroup.type`: 도메인/스레드 모드 구분(환경에 따라 값이 다름)

컨트롤러별 파일(대표 예시):

- CPU: `cpu.max`, `cpu.weight`, `cpu.stat`
- Memory: `memory.max`, `memory.high`, `memory.current`, `memory.stat`
- I/O: `io.max`, `io.stat`
- PID: `pids.max`, `pids.current`

이 글의 실습만 보면 `cgroup.controllers`, `cgroup.subtree_control`, `cgroup.procs`, `cpu.max` 네 개면 충분하다.
하지만 운영/디버깅까지 생각하면 위의 통계/상태 파일들도 같이 보는 게 좋다.

## 실습

### 1) stress 설치

```bash
lin> sudo apt update
lin> sudo apt install -y stress
```

### 2) cgroup 생성 및 프로세스 이동

```bash
lin> sudo su
lin> cd /sys/fs/cgroup
lin> cat cgroup.controllers
lin> cat cgroup.subtree_control
# cpu가 보이지 않으면 활성화
lin> echo +cpu > cgroup.subtree_control
lin> mkdir utils
lin> cd utils
lin> echo $$ > cgroup.procs
```

### 3) CPU 제한 설정

```bash
lin> cat cpu.max
lin> echo "10000 100000" > cpu.max
```

`cpu.max`는 `quota period` 형식이다.
`10000 100000`이면 100ms 중 10ms만 CPU를 사용하게 되어 약 10% 제한이다.

### 4) 부하 테스트 및 확인

```bash
lin> stress -c 1
```

다른 터미널에서 확인:

```bash
lin> top
```

예시 출력:

```text
top - 06:19:21 up 4:19,  2 users,  load average: 0.10, 0.06, 0.01
Tasks: 124 total,   2 running, 122 sleeping,   0 stopped,   0 zombie
%Cpu(s): 10.0 us,  0.0 sy,  0.0 ni, 90.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  914.1 total,   76.0 free,  559.0 used,  279.1 buff/cache
MiB Swap:    0.0 total,    0.0 free,    0.0 used.  190.9 avail Mem

  PID USER   %CPU %MEM COMMAND
 9625 root   10.0  0.0 stress
 1505 ubuntu  0.7  5.0 node
 2896 ubuntu  0.3  0.6 cursor
 9657 ubuntu  0.3  0.4 top
```
