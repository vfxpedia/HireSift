# HireSift PPT 디자인 가이드

> **Document Type:** Presentation Design Guide  
> **Project:** HireSift — AI-powered Remote Hiring Trust Layer  
> **Aligned with:** HireSift_Design.md (Trust SaaS Palette A) + 실제 배포 MVP (hire-sift.vercel.app)  
> **Version:** v1.0 / 2026.05.22

---

## 1. 디자인 원칙

PPT 디자인은 웹 MVP와 동일한 인상을 유지합니다.

```
Clean. Trustworthy. Calm. Structured. Human-reviewed.
```

- **AI 탐지기처럼 보이지 않습니다.** 신뢰 레이어처럼 보여야 합니다.
- 컬러는 최대한 절제합니다. 배경에 그라디언트를 사용하지 않습니다.
- 모든 슬라이드는 여백이 충분하고 계층이 명확해야 합니다.
- 후보자를 위협하거나 단정하는 언어와 비주얼을 사용하지 않습니다.

---

## 2. 색상 시스템

### 핵심 팔레트 (MVP와 동일)

| 역할 | 이름 | HEX | RGB |
|------|------|-----|-----|
| 브랜드 기본 | Primary Navy | `#172033` | 23, 32, 51 |
| 완료/검증 | Muted Teal | `#2F7D7E` | 47, 125, 126 |
| 검토 필요 | Soft Amber | `#C6923A` | 198, 146, 58 |
| 슬라이드 배경 | Neutral Background | `#F7F8FA` | 247, 248, 250 |
| 본문 텍스트 | Main Text | `#111827` | 17, 24, 39 |
| 카드 표면 | White Surface | `#FFFFFF` | 255, 255, 255 |
| 구분선 | Border | `#E5E7EB` | 229, 231, 235 |
| 보조 텍스트 | Muted | `#6B7280` | 107, 114, 128 |

### 슬라이드별 배경 규칙

| 슬라이드 유형 | 배경 | 제목 색상 |
|--------------|------|-----------|
| 커버 / 섹션 구분 | Primary Navy `#172033` | White `#FFFFFF` |
| 콘텐츠 슬라이드 | Neutral `#F7F8FA` 또는 White | Navy `#172033` |
| 데이터/차트 슬라이드 | White | Navy `#172033` |
| 인용/가이드라인 슬라이드 | Teal `#2F7D7E` (10% opacity) | Navy `#172033` |

**금지**: 빨간색, 형광 네온, AI 그라디언트 배경, 다크 그레이 배경

---

## 3. 타이포그래피

### 폰트 설정

| 환경 | 폰트 |
|------|------|
| 한국어 PPT | Pretendard 또는 Noto Sans KR |
| 영어 PPT | Inter 또는 IBM Plex Sans |
| 메타데이터/코드 | JetBrains Mono |

> PowerPoint/Keynote에 Pretendard가 없으면 **Noto Sans KR** 또는 **Apple SD Gothic Neo** 사용.

### 타입 스케일

| 용도 | 크기 | 굵기 | 색상 |
|------|------|------|------|
| 커버 헤드라인 | 44–52pt | Bold (700) | White |
| 섹션 타이틀 | 32–40pt | Bold (700) | Navy |
| 슬라이드 타이틀 | 24–28pt | SemiBold (600) | Navy |
| 카드 헤딩 | 18–22pt | SemiBold (600) | Navy |
| 본문 | 14–16pt | Regular (400) | `#374151` |
| 캡션/메타 | 11–13pt | Regular (400) | `#6B7280` |
| 배지/태그 | 11–12pt | SemiBold (600) | 각 배지 색상 |

---

## 4. 레이아웃 시스템

### 슬라이드 여백

- 상하 여백: **40–48pt**
- 좌우 여백: **64–80pt** (와이드 슬라이드 기준)
- 요소 간 내부 간격: **16–24pt**
- 섹션 구분 간격: **32–48pt**

### 그리드

- **2분할**: 제목(좌) + 설명(우), 또는 텍스트(좌) + 비주얼(우)
- **3분할**: 3가지 특징 나열, 3단계 프로세스
- **카드 그리드**: 2×2 또는 3×2 (각 카드에 1개 개념)
- **풀 블리드**: 커버, 섹션 구분 슬라이드

---

## 5. 컴포넌트 스타일

### 5.1 카드 (Card)

웹 MVP의 Card 컴포넌트를 PPT에서 재현:

```
배경: White (#FFFFFF)
테두리: 1pt, #E5E7EB
모서리: 12–16pt rounded
패딩: 내부 20–24pt
그림자: 0, 2pt, 8pt, rgba(0,0,0,0.06) — 아주 은은하게
```

카드 제목은 짧고 기능적으로:
- `Identity Consistency`
- `Portfolio Provenance`
- `Interview Session Integrity`
- `Recommended Action`

### 5.2 배지 (Badge)

| 배지 유형 | 배경 | 텍스트 | 테두리 |
|-----------|------|--------|--------|
| Low Attention | `#2F7D7E` at 10% | `#2F7D7E` | `#2F7D7E` at 30% |
| Review Recommended | `#C6923A` at 10% | `#8A6422` | `#C6923A` at 30% |
| High Attention | `#C6923A` at 15% | `#172033` | `#C6923A` |
| Manual Review | White | `#172033` | `#C6923A` |
| Submitted | `#2F7D7E` at 10% | `#2F7D7E` | none |
| Report Ready | `#172033` at 8% | `#172033` | none |

모서리: 6pt (Badge는 작게)  
패딩: 4×12pt

**금지 배지 텍스트**: `Fraud`, `Fake`, `Suspicious`, `Rejected`, `AI Detected`

### 5.3 버튼 (CTA)

| 유형 | 배경 | 텍스트 | 테두리 | 모서리 |
|------|------|--------|--------|--------|
| Primary | Navy `#172033` | White | none | 10pt |
| Secondary | White | Navy | 1pt Navy | 10pt |
| Attention | White | Navy | 1pt Amber | 10pt |

### 5.4 구분선

- 색상: `#E5E7EB`
- 두께: 0.75–1pt
- 섹션 구분 에 사용

---

## 6. 슬라이드 템플릿

### Slide 01 — 커버 (Cover)

```
[ 배경: Primary Navy #172033 ]

  HireSift                          ← 로고 또는 브랜드명 (White, 20pt)

  Remote hiring needs               ← 헤드라인 (White, 48pt, Bold)
  a trust layer.

  AI organizes signals.             ← 서브헤드 (White 70%, 18pt)
  Human reviewers confirm the report.

  [화이트 배지: 발표자 이름 / 날짜]  ← 우하단
```

### Slide 02 — 문제 정의 (Problem)

```
[ 배경: #F7F8FA ]

  [타이틀] 원격 채용의 신뢰 공백

  [3분할 카드]
  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │ 📄 신원 확인 불가 │  │ 🔗 포트폴리오 출처 │  │ 🎙 면접 일관성 │
  │                │  │ 검증 어려움      │  │ 파악 어려움     │
  │ 원격 환경에서    │  │                │  │                │
  │ 신분증 대면 확인 │  │ GitHub/LinkedIn │  │ 면접과 제출물의 │
  │ 불가능          │  │ 실제 기여 불명확 │  │ 불일치 파악 불가│
  └─────────────────┘  └─────────────────┘  └─────────────────┘

  [하단 강조문]
  채용팀은 더 많은 정보를 원하지만, 검토 도구가 없다.
```

### Slide 03 — 솔루션 (Solution)

```
[ 배경: White ]

  [타이틀] HireSift — Human-in-the-loop Trust Layer

  [2분할]
  [좌: 텍스트]                        [우: 워크플로우 다이어그램]
  HireSift는 후보자가 제출한            HR → 검증 링크 발급
  신원·포트폴리오·미디어 샘플을                ↓
  수집하고, 리뷰어가 신호를             후보자 → 8단계 제출
  검토할 수 있는 Candidate                     ↓
  Trust Report를 생성합니다.           리뷰어 → 신호 검토
                                               ↓
  ✦ 자동 탈락 없음                     Trust Report 생성
  ✦ 거짓말 탐지 없음                            ↓
  ✦ 모든 판단은 사람이                  최종 결정 (사람)
```

### Slide 04 — 핵심 워크플로우 (Workflow)

```
[ 배경: #F7F8FA ]

  [타이틀] 3-Party Workflow

  [가로 스텝 다이어그램]
  ①HR팀          ②후보자               ③리뷰어          ④HR팀
  ──────         ──────────           ─────────         ──────
  검증 요청 생성  → Consent +          신호 매트릭스 →   Trust Report
  링크 발급      기본정보 +            검토 +            열람 +
                포트폴리오 +          Reviewer Note +   최종 결정
                문서 업로드 +         추천 조치 선택
                셀피 + 음성

  [하단 가이드라인 카드 — Teal 배경 10%]
  "AI organizes signals. Human reviewer confirms the report."
```

### Slide 05 — 제품 스크린샷 (Dashboard)

```
[ 배경: White ]

  [타이틀] Admin Dashboard

  [좌: 설명 3줄]               [우: 대시보드 스크린샷 — 실제 MVP]
  • 실시간 후보자 상태 통계
  • Teal / Amber Attention 배지
  • Candidate Trust Report 바로 접근

  [하단 URL 캡션]
  hire-sift.vercel.app/app/dashboard
```

### Slide 06 — 후보자 플로우 (Candidate Flow)

```
[ 배경: #F7F8FA ]

  [타이틀] 8-Step Candidate Submission Flow

  [8분할 아이콘 스텝 — 가로 배열]
  1.안내     2.동의    3.기본정보  4.포트폴리오
  ──────     ──────    ──────      ──────
  5.문서업로드  6.셀피    7.음성     8.완료
  ──────       ──────    ──────     ──────

  [하단 원칙 카드]
  이 과정은 후보자의 합격/불합격을 자동으로 결정하지 않습니다.
  수집 데이터는 검수 목적으로만 사용됩니다.
```

### Slide 07 — Candidate Trust Report

```
[ 배경: White ]

  [타이틀] Candidate Trust Report

  [2분할]
  [좌: 리포트 섹션 목록]              [우: 리포트 스크린샷]
  1. Candidate Overview
  2. Verification Summary
  3. Identity Consistency         → [Low Attention 배지]
  4. Portfolio Provenance         → [Review Recommended 배지]
  5. Interview Session Integrity  → [Low Attention 배지]
  6. Review Signals (매트릭스)
  7. Reviewer Notes
  8. Recommended Action
  9. Guardrail Notice

  [하단 Guardrail 박스 — 테두리 #E5E7EB]
  "This report does not determine hiring eligibility."
```

### Slide 08 — Attention 언어 (No Red Policy)

```
[ 배경: #F7F8FA ]

  [타이틀] AI Guardrail — 우리가 쓰지 않는 언어

  [2분할 비교표]
  ✗ 사용 금지                    ✓ 대신 사용
  ────────────────────────       ────────────────────────
  High Risk                  →  High Attention
  Suspicious                 →  Review Recommended
  Fraud Detected             →  Additional Check Needed
  Fake Candidate             →  Identity Consistency Needs Review
  Reject / Block             →  Manual Review Required
  AI Failed / AI Detected    →  Signal Flagged for Review

  [배지 예시 행]
  [🔵 Low Attention]  [🟡 Review Recommended]  [🔷 Manual Review Required]
```

### Slide 09 — 비즈니스 임팩트 (Value Proposition)

```
[ 배경: Primary Navy #172033 ]

  [타이틀 — White] HireSift가 만드는 가치

  [3분할 카드 — 반투명 White 배경]
  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
  │  채용팀 (HR)   │  │   후보자       │  │   조직         │
  │                │  │                │  │                │
  │ 복잡한 신호를  │  │ 투명한 프로세스 │  │ 채용 공정성    │
  │ 빠르게 검토    │  │ 에서 제출      │  │ 및 컴플라이언스│
  │                │  │                │  │ 향상           │
  │ 리뷰어 시간    │  │ 위협적이지      │  │                │
  │ 절감           │  │ 않은 UX        │  │ 감사 로그      │
  │                │  │                │  │ 자동 기록      │
  └────────────────┘  └────────────────┘  └────────────────┘
```

### Slide 10 — 기술 스택 (Tech Stack)

```
[ 배경: White ]

  [타이틀] MVP 기술 스택

  [2분할]
  [좌: 프론트엔드]               [우: 인프라]
  • React 18 + TypeScript       • Vercel (SPA hosting)
  • Vite 6 (빌드 도구)          • Supabase (DB + Auth + Storage)
  • react-router v7             • GitHub Actions (CI/CD)
  • Tailwind CSS v4
  • Radix UI (접근성)
  • MediaRecorder API (카메라/마이크)
  • recharts (시각화)
  • sonner (토스트)

  [하단 배지]
  [현재: Mock API + localStorage]  →  [다음: Supabase 연동]
```

### Slide 11 — 로드맵 (Roadmap)

```
[ 배경: #F7F8FA ]

  [타이틀] Product Roadmap

  [수평 타임라인]

  ●─────────────●─────────────●─────────────●
  MVP v1           v2               v3             v4
  (현재)         (1~2개월)       (3~4개월)       (6개월+)

  ↕              ↕               ↕              ↕
  프론트엔드     Supabase        AI Hook        다국어
  + Mock API     백엔드 연동     (Face/OCR)     + 엔터프라이즈
  배포 완료      Supabase Auth   Portfolio      멀티테넌트
  EN/KR 토글     파일 Storage    Provenance API
                 멀티테넌트 RLS
```

### Slide 12 — 마무리 (Closing)

```
[ 배경: Primary Navy #172033 ]

  [중앙 정렬]

  "Less color, more trust.           ← White, 28pt, 이탤릭
   Less judgment, more review.
   Less automation, more human oversight."

  HireSift                           ← 브랜드명, White, 24pt
  hire-sift.vercel.app               ← URL, Teal #2F7D7E, 16pt

  [발표자 정보]
  [이름] | [이메일] | [날짜]
```

---

## 7. 아이콘 가이드라인

### 권장 스타일

- **스타일**: 얇은 선 (1.5–2px), 라운드 스트로크
- **색상**: Navy / Teal / Amber (슬라이드 배경에 따라)
- **크기**: 32×32 또는 48×48 (카드 헤딩 아이콘), 24×24 (인라인)
- **라이브러리**: lucide.dev (MVP와 동일한 아이콘 세트)

### 권장 아이콘

| 아이콘 | 용도 |
|--------|------|
| `shield-check` | 브랜드, 신뢰 |
| `file-check` | 문서 검증 |
| `user-check` | 신원 확인 |
| `link` | 포트폴리오 링크 |
| `eye` | 리뷰/검토 |
| `clipboard-list` | 리포트 |
| `clock` | 타임라인, 기록 |
| `lock` | 보안, 프라이버시 |
| `check-circle` | 완료 |
| `alert-circle` | 주의 (Amber 사용) |

### 금지 아이콘

경찰 배지, 지문 메인 모티프, 빨간 사이렌, 타겟/조준선, 범죄자 아이콘, 분노한 경고 삼각형

---

## 8. 스크린샷 사용 가이드

MVP 스크린샷을 PPT에 삽입할 때:

1. **해상도**: 최소 1920×1080, Retina 환경에서 캡처 권장
2. **자르기**: 브라우저 UI(주소창, 탭) 제거, 앱 UI만 표시
3. **테두리**: 라운드 16px + `#E5E7EB` 1pt 테두리 추가
4. **그림자**: 슬라이드 배경과 구분을 위해 약한 드롭 섀도우 추가
5. **배치**: 슬라이드 우측 또는 하단 60% 영역 사용
6. **하이라이트**: 설명 대상 영역에 Teal 또는 Amber로 얇은 테두리 오버레이 추가

**캡처 추천 페이지**:
- `/app/dashboard` — 통계 카드 + 차트
- `/app/candidates` — 필터 + 배지 테이블
- `/app/reviewer/:id` — 신호 매트릭스
- `/app/reports/:id` — Trust Report 전체
- `/verify` — 후보자 제출 플로우 (스텝 UI)

---

## 9. 금지 사항 요약

| 항목 | 금지 | 대안 |
|------|------|------|
| 배경 색상 | 네온 그라디언트, 형광색 | Navy 또는 #F7F8FA |
| 경고 색상 | 빨간색 | Soft Amber |
| 텍스트 언어 | Fraud, Fake, Reject, 탈락, 거짓말 탐지 | Attention, Review, Additional Check |
| 비주얼 | 범죄자/용의자 이미지, 도청 이미지 | 문서, 체크리스트, 사람 실루엣 |
| 데이터 표현 | 87/100 점수, 위험 수치 게이지 | Attention 배지, 신호 매트릭스 |
| 자동화 강조 | "AI가 자동으로 탐지" | "Human-in-the-loop" |

---

## 10. 빠른 시작 체크리스트

PPT 슬라이드 작성 전 확인:

- [ ] 폰트: Pretendard 또는 Noto Sans KR 설치 확인
- [ ] 색상: Primary Navy `#172033`, Teal `#2F7D7E`, Amber `#C6923A` 슬라이드 테마에 추가
- [ ] 슬라이드 크기: 16:9 와이드 (1920×1080 또는 33.87cm × 19.05cm)
- [ ] 커버 슬라이드: Navy 배경 + White 텍스트
- [ ] 콘텐츠 슬라이드: #F7F8FA 또는 White 배경
- [ ] 아이콘: lucide 스타일 thin line
- [ ] 스크린샷: hire-sift.vercel.app에서 캡처 + 라운드 처리
- [ ] 모든 배지: Teal 또는 Amber만 사용 (빨간색 없음)
- [ ] 마지막 슬라이드 하단: Guardrail 문구 포함
