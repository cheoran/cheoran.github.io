---
title: "13 Automation"
published: 2026-02-13
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 쉘 스크립트를 작성하고 자동화의 기본을 이해한다.
- cron으로 정기 작업을 설정한다.
  :::

## 한줄 요약

반복 작업을 스크립트와 cron으로 자동화한다.

## 핵심 개념

**자동화는 재현성**
사람이 매번 수동으로 하면 실수가 생긴다. 스크립트로 고정하면 재현성과 안정성이 높아진다.

**실패 처리와 로그**
자동화는 “실패했을 때 멈추고 기록”하는 게 핵심이다. 그래서 `set -euo pipefail`이 중요하다.

---

## 필수 명령어

- `bash`, `chmod +x`, `env`, `set -e`
- `crontab -e`, `crontab -l`

---

## 실습 1: 간단한 백업 스크립트

```bash
lin> cat <<'EOF2' > /tmp/backup.sh
#!/usr/bin/env bash
set -euo pipefail
src=/etc
dst=/tmp/backup-$(date +%F)
mkdir -p "$dst"
cp -a "$src" "$dst/"
echo "backup done: $dst"
EOF2
lin> chmod +x /tmp/backup.sh
lin> /tmp/backup.sh
```

이 명령을 사용하는 이유
- 반복 작업을 스크립트로 만든다. 실패 시 즉시 종료되도록 설정한다.

예상 결과(예시):
```text
backup done: /tmp/backup-2026-02-13
```

---

## 실습 2: cron 설정

```bash
lin> crontab -e
# 매일 02:00에 실행
0 2 * * * /tmp/backup.sh >> /tmp/backup.log 2>&1
lin> crontab -l
```

이 명령을 사용하는 이유
- 매일 정해진 시간에 자동으로 백업하도록 설정한다.

---

## 체크포인트

- 스크립트 실패 시 즉시 중단하게 만들 수 있는가?
- 자동화 작업 로그를 남길 수 있는가?

---

## 트러블슈팅

- cron 미실행: PATH/권한/절대경로 확인

---

## 13.3 Ansible 필수 패턴

Ansible은 여러 서버를 동시에 관리할 때 쓰인다. “반복 작업을 코드로” 옮기는 대표 도구다.

- 인벤토리: `inventory.ini`에 그룹/호스트 변수 정의, 클라우드면 동적 인벤토리(aws_ec2, azure_rm) 사용
- 플레이북 뼈대
  ```yaml
  - hosts: web
    become: true
    handlers:
      - name: restart nginx
        service: name=nginx state=restarted
    tasks:
      - name: install pkgs
        apt: name={{ item }} state=present update_cache=yes
        loop: [nginx, curl]
      - name: deploy config
        template: src=nginx.conf.j2 dest=/etc/nginx/nginx.conf
        notify: restart nginx
  ```
- 원칙: idempotent, 핸들러로 재시작, 변수·템플릿으로 환경별 분리

---

## 13.4 이미지 빌드: Packer + cloud-init

이미지를 자동으로 만들면 서버 초기화가 표준화된다.

- 베이스 이미지 자동화: Packer로 AMI/QCOW2 생성, Ansible/Shell 프로비저너 적용
- cloud-init userdata 예: 패키지 설치 + 사용자 추가
  ```yaml
  #cloud-config
  packages: [htop, jq]
  users:
    - name: devops
      groups: sudo
      ssh-authorized-keys:
        - ssh-rsa AAAA...
  runcmd:
    - systemctl enable --now fail2ban
  ```
- 빌드 → 스캔(CIS/lynis) → 서명 → 배포 파이프라인을 자동화하면 재현성↑

---

## 13.5 SSM/원격 실행 대안

SSH 대신 중앙 관리형 도구를 쓰면 보안과 운영이 쉬워진다.

- 에이전트 기반: AWS SSM Agent, GCP OSConfig, Azure Arc → 방화벽/키 관리 부담 감소
- 에이전트리스: Ansible + SSH 키 로테이션 자동화

---

## 13.6 GitOps 흐름(베이직)

인프라/배포를 Git으로 관리하는 방식이다.

- 선언적 상태: IaC + 애플리케이션 매니페스트를 git에 저장
- 파이프라인: PR → 테스트 → 이미지 빌드/서명 → 매니페스트 업데이트 → Argo CD/Flux가 동기화
- 이점: 변경 이력/롤백 용이, 수동 변경 금지 원칙 확립

