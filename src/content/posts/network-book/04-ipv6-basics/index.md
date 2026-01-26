---
title: "04 IPv6 기초"
published: 2026-01-04
description: "주소 구조, 듀얼스택, 라우팅"
image: "assets/cover.svg"
showCover: false
tags: ["network", "학습"]
category: "네트워크"
draft: false
---

---

:::note[섹션 개요]

- IPv6 주소 구조를 이해한다.
- 듀얼스택 환경을 이해한다.
- 기본 라우팅을 이해한다.
  :::

## 04.1 IPv6 주소 구조

![assets/ipv6_header.png](./assets/ipv6_header.webp)

> 그림 04-1. IPv6 헤더 구조

IPv6는 128비트 주소 체계이며 16비트씩 8블록으로 표현한다.

예시:

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

### 단축 표기 규칙

- 연속된 0 블록은 `::`로 축약 가능 (한 번만 사용 가능)
- 앞의 0은 생략 가능

예:

```
2001:db8:85a3::8a2e:370:7334
```

:::note[IPv6필요 이유]

- IPv4 주소는 한계
  :::

## 04.2 주소 유형

- **유니캐스트**: 하나의 대상
- **멀티캐스트**: 여러 대상
- **애니캐스트**: 가장 가까운 대상

## 04.3 듀얼스택

IPv4와 IPv6를 함께 사용하는 방식. 점진적 전환에 사용된다.

## 04.4 기본 실습

### macOS

```shellsession
mac> ifconfig | grep inet6
```

### Windows

```shellsession
win> ipconfig
```

### Linux

```shellsession
lin> ip -6 addr show
```

---

## 04.5 복습 문제

1. IPv6 주소는 몇 비트이며, 몇 블록으로 표현되는가?
2. IPv6 단축 표기 규칙 중 `::`는 몇 번까지 사용할 수 있는가?
3. 듀얼스택은 어떤 전환 방식인가?

---

## 04.6 체크리스트

- IPv6 주소 구조 설명 가능
- 듀얼스택 개념 이해
