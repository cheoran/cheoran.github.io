---
title: "10 Storage"
published: 2026-02-10
description: "핵심 개념, 실습, 점검"
image: "assets/cover.svg"
tags: ["linux", "학습"]
category: "리눅스"
draft: false
showCover: false
---

---

:::note[섹션 개요]

- 디스크/파티션/파일시스템을 이해하고 기본 작업을 수행한다.
- 마운트/스왑을 설정하고 점검한다.
  :::

## 한줄 요약

디스크/마운트/fstab 기본과 스왑을 다룬다.

## 핵심 개념

**디바이스 파일**
디스크는 `/dev/sdX`, `/dev/nvme0n1` 같은 파일로 표현된다. 리눅스는 장치를 파일처럼 다룬다.

**마운트**
디스크를 특정 폴더에 “붙여서” 쓰는 과정이다. 마운트를 해야만 디스크가 보인다.

**/etc/fstab**
부팅 시 어떤 디스크를 어디에 마운트할지 적어 놓는 설정 파일이다. 한 줄이 하나의 규칙이다.

**fstab 6필드**
디바이스/UUID, 마운트 지점, 타입, 옵션, dump, fsck 순서로 구성된다. 옵션이 잘못되면 부팅이 느려질 수 있다.

---

## 필수 명령어

- `lsblk`, `blkid`, `df -h`, `du -sh`
- `mount`, `umount`, `swapon`, `swapoff`

---

## 실습 1: 디스크 정보 확인

```bash
lin> lsblk
lin> blkid
lin> df -h
```

---

## 실습 2: 임시 마운트

```bash
lin> sudo mkdir -p /mnt/data
lin> sudo mount /dev/sdb1 /mnt/data
lin> df -h | grep /mnt/data
lin> sudo umount /mnt/data
```

---

## 실습 3: 스왑 확인

```bash
lin> swapon --show
lin> free -h
```

---

## 체크포인트

- 특정 디렉터리의 디스크 사용량을 계산할 수 있는가?
- fstab 한 줄이 무엇을 의미하는지 말할 수 있는가?

---

## 트러블슈팅

- 마운트 실패: 디바이스 경로/파일시스템 타입 확인
- 부팅 지연: fstab 옵션 `nofail` 고려

---

## 10.4 LVM 필수 작업

LVM은 “디스크를 유연하게 나누고 늘리는 방식”이다. 운영 환경에서 자주 쓰인다.

- PV/VG/LV 생성
  ```bash
  sudo pvcreate /dev/sdb
  sudo vgcreate vgdata /dev/sdb
  sudo lvcreate -L 50G -n lvdata vgdata
  sudo mkfs.ext4 /dev/vgdata/lvdata
  sudo mount /dev/vgdata/lvdata /data
  ```
- 온라인 확장: `sudo lvextend -r -L +10G /dev/vgdata/lvdata` (`-r`로 파일시스템 동시 확장)
- 스냅숏 백업: `lvcreate -s -L 5G -n snap_lvdata /dev/vgdata/lvdata` → 마운트 후 백업 → 삭제
- 축소는 위험: ext4는 오프라인 축소 필요, 가능하면 새 LV로 마이그레이션 후 교체

---

## 10.5 소프트웨어 RAID(mdadm)

RAID는 디스크 장애에 대비하는 기술이다. 소프트웨어 RAID는 리눅스가 직접 관리한다.

- RAID1 생성: `sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc`
- 상태: `cat /proc/mdstat`, `mdadm --detail /dev/md0`
- 장애 디스크 교체: 실패 디스크 `--fail --remove`, 새 디스크 `--add`
- 구성 저장: `sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf`

---

## 10.6 파일시스템 선택 가이드

파일시스템마다 특성이 다르다. 목적에 맞춰 선택한다.

- ext4: 기본값, 안정/낮은 오버헤드
- xfs: 대용량/병렬 I/O에 강함(온라인 확장만 가능)
- btrfs: 스냅숏/압축/RAID 내장(운영에서 신중)
- zfs: 풀 스냅숏/검증, 메모리 요구 높음
- 마운트 옵션 예: `noatime`, `discard`(SSD), `data=ordered`(ext4 기본), `pquota`(xfs 프로젝트 쿼터)

