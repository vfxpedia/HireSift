# HireSift — Remote Hiring Trust Layer

> **AI organizes signals. Human reviewers confirm the report.**

HireSift는 원격 채용에서 후보자의 신원·포트폴리오·면접 일관성 신호를 수집하고 Human-in-the-loop 리뷰어가 검토할 수 있는 **Candidate Trust Report**를 생성하는 B2B SaaS 서비스입니다.

자동으로 후보자를 탈락시키거나 거짓말을 탐지하지 않습니다. 채용팀이 더 명확하고 안전하게 검토할 수 있도록 신호를 정리합니다.

**라이브 데모**: https://hire-sift.vercel.app/  
**GitHub**: https://github.com/vfxpedia/HireSift

---

## 서비스 핵심 워크플로우

```
채용팀 (HR)
  └─ Create Verification Request → 후보자 코드 + 링크 발급
        ↓
후보자 (Candidate)
  └─ /verify/:id → 8단계 제출 플로우
       1. 서비스 안내 + Consent
       2. Basic Info (이름/이메일/국가)
       3. Portfolio Links (GitHub / LinkedIn / Dribbble 등)
       4. Masked Document Upload (신분증 — 일련번호 마스킹 권장)
       5. Selfie Video Sample (10초, 320×240)
       6. Voice Sample (30초)
       7. 제출 전 Review
       8. 제출 완료
        ↓
리뷰어 (Reviewer)
  └─ /app/reviewer/:id → 신호 매트릭스 검토 + 노트 + 추천 조치 선택
        ↓
  Generate Trust Report
        ↓
  /app/reports/:id → Candidate Trust Report 열람 + Export PDF
```

HireSift는 **자동 판정이 없습니다**. 모든 최종 결정은 사람이 합니다.

---

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# → http://localhost:5173

# 프로덕션 빌드
npm run build
```

> 데모 계정: `sarah.chen@techcorp.com` / `demo-password`  
> 브라우저 DevTools → Application → Local Storage → `hiresift:v1:*` 키 삭제 시 데이터 초기화

---

## 주요 라우트

| 경로 | 화면 | 접근 대상 |
|------|------|-----------|
| `/` | 랜딩 페이지 | 모든 방문자 |
| `/login` | 관리자 로그인 | 채용팀 |
| `/verify` | 후보자 제출 플로우 (자동 ID 할당) | 후보자 |
| `/verify/:candidateId` | 후보자 제출 플로우 (지정 ID) | 후보자 |
| `/app/dashboard` | 대시보드 (통계 + 최근 후보자) | 채용팀 |
| `/app/candidates` | 후보자 목록 + 필터 | 채용팀 |
| `/app/candidates/:id` | 후보자 상세 | 채용팀 |
| `/app/reviewer/:id` | 리뷰어 콘솔 | 리뷰어 |
| `/app/reports/:id` | Candidate Trust Report | 리뷰어 |
| `/app/settings` | 조직/Retention/Consent 설정 | 관리자 |
| `/app/audit-log` | 감사 로그 + CSV 내보내기 | 관리자 |

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| UI 프레임워크 | React 18 + TypeScript |
| 빌드 도구 | Vite 6 |
| 라우팅 | react-router v7 (BrowserRouter) |
| 스타일링 | Tailwind CSS v4 (@tailwindcss/vite) |
| UI 컴포넌트 | Radix UI Primitives (shadcn/ui 기반) |
| 폼 관리 | react-hook-form |
| 차트 | recharts (BarChart, PieChart) |
| 토스트 | sonner |
| 아이콘 | lucide-react |
| 미디어 캡처 | MediaRecorder API (getUserMedia) |
| 데이터 저장 | localStorage (`hiresift:v1:*` 접두어) |
| PDF 내보내기 | window.print() + print.css |
| 배포 | Vercel (SPA rewrite) |

---

## 데이터 모델

```typescript
// 후보자
interface Candidate {
  id: string;
  code: string;               // "HS-0001" 형식
  name: string;
  email: string;
  role: string;
  submissionStatus: "pending" | "in-progress" | "submitted" | "reviewed" | "report-ready";
  attentionLevel: "low" | "medium" | "high" | "manual";
  reviewer?: string;
  reportReady: boolean;
  lastUpdated: string;
  createdAt: string;
}

// 후보자 제출 데이터
interface CandidateSubmission {
  candidateId: string;
  step: number;
  consent: { agreed: boolean; agreedAt?: string };
  basicInfo?: { fullName; email; country; linkedin? };
  portfolio: { platform; url }[];
  document?: MediaAsset;      // 업로드 파일
  selfie?: MediaAsset;        // 동영상 blob
  voice?: MediaAsset;         // 오디오 blob
  submittedAt?: string;
}

// 리뷰어 데이터
interface ReviewerData {
  candidateId: string;
  notes: string;
  recommendedAction: "no-action" | "verification-call" | "portfolio-walkthrough" | "additional-doc" | "manual-review";
  signalNotes: Record<string, string>;
  reviewedAt?: string;
}

// 신뢰 리포트
interface TrustReport {
  candidateId: string;
  generatedAt: string;
  reviewer: string;
  recommendedAction: RecommendedAction;
  recommendedActionTitle: string;
  recommendedActionDetail: string;
  reviewerNotes: string;
  summary: { identity; portfolio; session; mediaQuality; manualReview };
  signalMatrix: SignalRow[];
  portfolio: PortfolioProvenance[];
}

// 감사 로그
interface AuditEntry {
  id: string;
  action: string;
  user: string;
  candidate: string;
  time: string;
  type: "report" | "review" | "submission" | "request" | "consent" | "share";
}
```

모든 데이터는 `localStorage`에 유지됩니다. 실제 백엔드 전환 시 API 레이어(`src/api/`)만 교체하면 됩니다.

---

## 프로젝트 구조

```
src/
├── app/
│   └── App.tsx               # react-router 라우트 정의
├── types/
│   └── index.ts              # 도메인 타입 전체
├── lib/
│   ├── cn.ts                 # className 헬퍼
│   ├── format.ts             # 날짜/코드/uid 유틸
│   └── seed.ts               # 초기 시드 데이터 (6 candidates)
├── api/
│   ├── storage.ts            # localStorage load/save 래퍼
│   ├── db.ts                 # ensureSeeded + getter/setter
│   ├── candidates.ts         # CRUD + 통계
│   ├── submissions.ts        # 단계별 저장 + finalize
│   ├── reviews.ts            # 리뷰어 노트 + 추천 조치
│   ├── reports.ts            # Trust Report 생성 로직
│   └── audit.ts              # 감사 로그 추가/조회
├── hooks/
│   └── useMediaRecorder.ts   # getUserMedia + MediaRecorder
├── components/
│   ├── primitives/
│   │   ├── Buttons.tsx       # PrimaryBtn, SecondaryBtn, AttentionBtn
│   │   ├── Badges.tsx        # AttentionBadge, StatusBadge
│   │   ├── Card.tsx          # Card, SectionLabel, GuardrailNotice
│   │   ├── Field.tsx         # Field, TextInput
│   │   ├── Modal.tsx         # Radix Dialog 래퍼
│   │   └── Popover.tsx       # Radix Popover 래퍼
│   ├── layout/
│   │   ├── AppLayout.tsx     # Sidebar + Outlet
│   │   ├── Sidebar.tsx       # 내비게이션 + 조직 컨텍스트
│   │   └── TopBar.tsx        # 페이지 타이틀 + 알림 벨
│   └── modals/
│       ├── CreateVerificationModal.tsx
│       └── InfoModal.tsx
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── CandidatesPage.tsx
│   ├── ReviewerPage.tsx
│   ├── TrustReportPage.tsx
│   ├── SettingsPage.tsx
│   ├── AuditLogPage.tsx
│   └── CandidateFlowPage.tsx # 8단계 후보자 제출 플로우
└── styles/
    ├── index.css             # Tailwind + 폰트 + 테마 통합
    ├── print.css             # PDF 인쇄 스타일 (A4, sidebar 숨김)
    └── theme.css             # CSS 변수 (Trust SaaS 팔레트)
```

---

## 디자인 시스템 (Trust SaaS Palette A)

### 색상 토큰

| 토큰 | HEX | 사용처 |
|------|-----|--------|
| Primary Navy | `#172033` | 사이드바, 헤더, Primary 버튼, 브랜드 앵커 |
| Muted Teal | `#2F7D7E` | 완료/검증 상태, 긍정 신호, 포인트 컬러 |
| Soft Amber | `#C6923A` | 추가 검토 필요, 주의 상태 (경고 없이) |
| Neutral Background | `#F7F8FA` | 페이지 배경 |
| Main Text | `#111827` | 본문 텍스트 |
| White Surface | `#FFFFFF` | 카드, 모달, 리포트 표면 |
| Border | `#E5E7EB` | 구분선, 카드 테두리 |

### Attention 언어 정책

| 사용 금지 | 대신 사용 |
|-----------|-----------|
| High Risk | High Attention |
| Suspicious | Review Recommended |
| Fraud Detected | Additional Check Needed |
| Fake Candidate | Identity Consistency Needs Review |
| Reject / Block | Manual Review Required |

**빨간색은 후보자 상태 UI에 사용하지 않습니다.**

### Guardrail Notice (모든 리포트 하단)

> This report does not determine hiring eligibility.  
> It only summarizes review signals for human decision-makers.  
> Final hiring decisions must be made by the hiring team through a fair and compliant process.

---

## 배포 (Vercel)

`vercel.json`이 SPA rewrite + Vite preset을 명시해 두었습니다.

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**자동 배포**: `main` 브랜치에 push → Vercel 자동 재배포  
**Preview URL**: PR 생성 시 자동으로 Preview 환경 URL 발급

### 로컬에서 프로덕션 빌드 확인

```bash
npm run build
npm run preview  # → http://localhost:4173
```

---

## 알려진 제한 사항 (MVP)

- **localStorage 용량**: 미디어 blob을 dataURL로 저장하므로 5–10MB 한도에서 실패할 수 있습니다. selfie는 10초/320×240/400kbps로 제한됨.
- **EN/KR i18n**: 개발 중 (다음 단계).
- **백엔드/AI**: 전부 mock. 신호 분류는 단순 규칙 기반.
- **카메라/마이크**: HTTPS 또는 localhost에서만 동작합니다. 배포 URL은 HTTPS이므로 문제없음.

---

## 다음 단계 (Roadmap)

| 단계 | 내용 |
|------|------|
| Phase 1 | 미작동 버튼 전부 수리 (Filter, Bell, Edit template, Org switcher 등) |
| Phase 2 | Candidate Detail 페이지 신설 (`/app/candidates/:id`) |
| Phase 3 | Create Verification Request 모달 확장 (type, due date, note) |
| Phase 6 | Trust Report 시각화 강화 (Signal Overview bar, Evidence Cards, Timeline) |
| Phase 7 | Share Report + Export PDF 모달 |
| Phase 8 | Prototype Completion Checklist 페이지 |
| Phase 9 | EN/KR i18n (react-i18next) |
| Backend | Supabase 연동 (candidates, submissions, reviews, reports, audit tables) |
| AI Hook | Face consistency / OCR / Portfolio Provenance API 연결 자리 |
| Media | IndexedDB 이전 (localStorage quota 해소) |

---

## 디자인·리서치 문서

`docs/` 폴더에 HireSift 제품 정의, 디자인 가이드, 리서치 보고서가 동봉되어 있습니다.

| 파일 | 내용 |
|------|------|
| `docs/HireSift_Design.md` | Trust SaaS 디자인 시스템 전체 (색상/타이포/컴포넌트/리포트 스타일) |
| `docs/HireSift_Product_Blueprint.md` | 제품 구조, 페르소나, 엔티티 정의 |
| `docs/HireSift_MVP_Prompt.md` | MVP 범위 정의 |
| `docs/HireSift_deep-research-report.md` | 시장 리서치 보고서 |
| `docs/Remote_Hiring_Identity_Consistency_Verification.md` | 원격 채용 신원 일관성 검증 리서치 |

---

## 라이선스

MIT
