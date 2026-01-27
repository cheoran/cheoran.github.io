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

## 핵심 개념

- 자동화는 재현성과 안정성의 핵심
- 실패 처리와 로그가 중요

---

## 필수 명령어

- `bash`, `chmod +x`, `env`, `set -e`
- `crontab -e`, `crontab -l`

---

## 실습 1: 간단한 백업 스크립트

```bash
lin> cat <<'EOF' > /tmp/backup.sh
#!/usr/bin/env bash
set -euo pipefail
src=/etc
dst=/tmp/backup-$(date +%F)
mkdir -p "$dst"
cp -a "$src" "$dst/"
echo "backup done: $dst"
EOF
lin> chmod +x /tmp/backup.sh
lin> /tmp/backup.sh
```

---

## 실습 2: cron 설정

```bash
lin> crontab -e
# 매일 02:00에 실행
0 2 * * * /tmp/backup.sh >> /tmp/backup.log 2>&1
lin> crontab -l
```

---

## 체크포인트

- 스크립트 실패 시 종료되도록 설정했는가?
- 자동 작업 로그를 남기는가?

---

## 트러블슈팅

- cron 미실행: PATH/권한/절대경로 확인

---

## 13.3 Ansible 필수 패턴

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

- 에이전트 기반: AWS SSM Agent, GCP OSConfig, Azure Arc → 방화벽/키 관리 부담 감소
- 에이전트리스: Ansible + SSH 키 로테이션 자동화

---

## 13.6 GitOps 흐름(베이직)

- 선언적 상태: 인프라(IaC) + 애플리케이션 매니페스트를 git에 저장
- 파이프라인: PR → 테스트 → 이미지 빌드/서명 → 매니페스트 업데이트 → Argo CD/Flux가 동기화
- 이점: 변경 이력/롤백 용이, 수동 변경 금지 원칙 확립
