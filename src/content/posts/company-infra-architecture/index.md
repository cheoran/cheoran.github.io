---
title: "사내 인프라 구축기: 서버 2대로 HA 환경 만들기"
published: 2026-03-19
description: "서버 2대 위에 Cloudflare Tunnel, Docker Compose, Nginx로 사내 서비스 인프라를 구축한 과정을 정리합니다."
tags: [infrastructure, docker, cloudflare, nginx, devops]
category: "Infrastructure"
draft: false
lang: "ko"
---

회사에서 사내 서비스 인프라를 처음부터 구축할 기회가 생겼다. ARM64 Ubuntu 서버 2대 위에 여러 서비스를 올리고, 외부에서 접근 가능하게 만들고, 배포와 모니터링까지 갖춰야 했다. DB 서버와 파일 서버(NFS)는 다른 분이 담당했고, 그 외 나머지를 내가 맡았다.

## 전체 구조

```
Cloudflare Edge (SSL 종단)
    ↓
Cloudflare Tunnel (HA 로드밸런싱)
    ↓
    ├→ Server A (192.168.0.31)
    └→ Server B (192.168.0.32)
       ↓
    Nginx (리버스 프록시)
       ↓
    ├→ 서비스 A Prod  (Backend + Frontend)
    ├→ 서비스 A Dev   (Backend + Frontend)
    └→ 서비스 B Dev   (Backend)
       ↓
    PostgreSQL (외부) + NFS (외부)
```

서버 2대에 같은 구성을 올리고, Cloudflare Tunnel이 트래픽을 자동 분산하는 Active-Active 구조다. 한쪽 서버가 죽어도 나머지가 받아준다.

## Cloudflare Tunnel로 외부 접근 열기

사내 서버를 외부에 노출하는 방법으로 Cloudflare Tunnel을 선택했다. 보통은 포트 포워딩을 떠올리겠지만, 이 환경에서는 맞지 않았다.

포트 포워딩은 서버 IP가 외부에 노출되고, 라우터 설정에 의존하게 된다. 서버가 2대라 HA를 걸려면 앞단에 로드밸런서를 따로 둬야 하는데, 그러면 그게 또 SPOF가 된다. Cloudflare Tunnel은 서버가 먼저 Cloudflare에 아웃바운드 연결을 맺는 방식이라 인바운드 포트를 열 필요가 없다. 서버 IP를 완전히 숨길 수 있다.

결정적으로 좋았던 건 HA가 거저 따라온다는 점이다. 서버 A와 B에 같은 터널 토큰으로 `cloudflared`를 띄우면 Cloudflare가 알아서 분산하고, 한쪽이 죽으면 3분 내에 페일오버한다.

```yaml
cloudflared:
  image: cloudflare/cloudflared:latest
  command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN}
  restart: unless-stopped
```

SSL 인증서도 Cloudflare 엣지에서 자동 발급/갱신해주니 서버에서 따로 관리할 게 없다.

## 리버스 프록시는 Nginx

SSL을 Cloudflare가 처리해주니까 리버스 프록시에서는 인증서 관리가 필요 없다. 이 시점에서 Traefik이나 Caddy의 자동 HTTPS라는 큰 장점이 의미가 없어진다. 그래서 가장 가볍고 검증된 Nginx를 골랐다.

Alpine 이미지 기반으로 128MB만 잡아도 충분하다. 서비스가 5개 안팎이라 Docker 라벨로 자동 감지하는 Traefik의 편의 기능이 딱히 필요하지도 않았고, 오히려 설정 파일이 눈에 보이는 게 디버깅할 때 편하다.

호스트 이름으로 라우팅하고, Docker 내부 DNS로 컨테이너 이름을 바로 쓴다:

```nginx
server {
    listen 80;
    server_name service-a.example.com;

    location /api/ {
        proxy_pass http://service-a-backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # WebSocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://service-a-frontend:3000;
    }
}
```

보안 헤더(X-Content-Type-Options, X-Frame-Options 등)는 글로벌 설정으로 한 번에 넣었다.

## Docker Compose로 충분한 규모

서버 2대에 서비스 5개 — 이 규모에 Kubernetes를 올리면 컨트롤 플레인(etcd, API 서버, 스케줄러)이 잡아먹는 리소스가 실제 서비스보다 클 수 있다. 16GB ARM64 서버에서 그건 좀 아깝다.

Docker Compose면 YAML 하나로 서비스 정의, 리소스 제한, 헬스체크, 로그 로테이션까지 다 된다. 롤링 업데이트를 자체 지원하지 않는 건 사실인데, 배포 스크립트로 충분히 커버된다.

```yaml
service-a-backend:
  image: service-a-backend:latest
  restart: unless-stopped
  deploy:
    resources:
      limits:
        cpus: "1.0"
        memory: 1G
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
    interval: 30s
    timeout: 10s
    retries: 3
  logging:
    driver: json-file
    options:
      max-size: "10m"
      max-file: "3"
```

Compose 파일은 프로젝트별로 분리했다. 공유 인프라(Tunnel + Nginx), 서비스 A, 서비스 B — 세 스택이 독립적으로 관리된다. 서비스 A를 재배포해도 서비스 B에 영향이 없고, Nginx 설정을 바꿔도 앱 컨테이너를 재시작할 필요가 없다. `infra-network`라는 공유 Docker 네트워크로 연결만 해두면 서로 통신은 되지만 라이프사이클은 완전히 분리된다.

```
/opt/
├── shared/       # Tunnel + Nginx
├── service-a/    # 서비스 A (Backend + Frontend) × 2환경
└── service-b/    # 서비스 B (Backend)
```

## 배포: Self-hosted Runner + 순차 롤링

GitHub Actions Self-hosted Runner를 서버 A, B 각각에 systemd 서비스로 설치했다. GitHub으로 코드를 관리하고 있으니 CI/CD도 GitHub Actions가 자연스러운데, Private 레포에서 GitHub-hosted runner를 쓰면 분당 과금이 발생한다. 그리고 ARM64 네이티브 빌드가 안 된다 — GitHub-hosted runner는 x86이라 QEMU 에뮬레이션을 써야 하는데, 빌드 시간이 몇 배로 느려진다.

Self-hosted runner는 서버에 바로 설치하니 추가 비용이 0이고, ARM64 네이티브로 빌드하니 Docker 레이어 캐시도 완벽히 활용된다.

배포 전략은 단순하다:

```
Server A 배포 → 헬스체크 → 통과하면 Server B 배포
                            실패하면 A만 롤백, B는 안 건드림
```

배포 전에 현재 이미지를 `:rollback` 태그로 보존해두고, 헬스체크가 3회 연속 실패하면 자동 롤백한다. 서버 A가 실패하면 B는 배포 자체를 안 하기 때문에 최소 한 대는 항상 살아있다.

## 모니터링은 쉘 스크립트로

Prometheus + Grafana가 정석이긴 한데, 그것 자체가 하나의 인프라다.

대신 watchdog.sh라는 100줄짜리 쉘 스크립트를 만들어서 cron으로 5분마다 돌린다. 하는 일은 간단하다:

- 컨테이너 죽었으면 **자동 재시작**
- Tunnel 연결 끊겼으면 Slack 알림
- 디스크 90%, 메모리 85% 넘으면 알림
- 쌓인 댕글링 이미지 자동 정리

핵심은 **알려주기만 하는 게 아니라 직접 복구한다**는 점이다. 새벽에 컨테이너가 죽었을 때 Prometheus는 "죽었습니다"라고 알려주지만, watchdog.sh는 알아서 재시작하고 "재시작했습니다"라고 알려준다. 이 차이가 운영 부담에서 크다.

알림은 문제가 있을 때만 보낸다. 정상 동작 중에 Slack이 울리면 그냥 노이즈다.

## 보안

별도 보안 제품 없이 레이어별로 기본기를 챙겼다.

**네트워크**: Cloudflare가 서버 IP를 가리고, UFW로 80/443 외에는 전부 닫고, fail2ban으로 SSH 무차별 대입을 막는다.

**컨테이너**: 전부 non-root(node/appuser)로 실행하고, 루트 파일시스템은 read-only로 마운트한다. 업로드 경로만 tmpfs로 쓰기를 허용했다. CPU/메모리 상한을 걸어서 하나가 폭주해도 서버 전체를 잡아먹지 못하게 한다.

## 마치며

돌이켜보면 모든 선택의 기준은 하나였다 — **지금 규모에 맞는가?**

서버 2대, 서비스 5개인 환경에 K8s를 올리면 인프라 관리가 본업이 된다. 대신 Docker Compose + Cloudflare Tunnel + 쉘 스크립트 조합으로 HA, 자동 배포, 모니터링, 자동 복구를 다 갖췄다. 서비스가 10개 넘어가고 서버가 5대 이상이 되면 그때 K8s랑 Prometheus를 고민해도 늦지 않다.
