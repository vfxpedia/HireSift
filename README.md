# HireSift — Remote Hiring Trust Layer (MVP Web)

원격 채용에서 후보자 신원·포트폴리오·면접 일관성 신호를 검증해주는 Human-in-the-loop AI Trust Layer 서비스의 MVP 프로토타입입니다. 디자인은 Figma Make 로 생성되었고, 본 코드베이스에서 실제 기능(라우팅, 폼 저장, 파일 업로드, 카메라/마이크 녹화, 동적 리포트 생성, PDF 인쇄)이 동작하도록 확장되었습니다.

## 실행

```bash
npm install
npm run dev
# → http://localhost:5173
```

(pnpm 이 활성화된 환경이라면 `pnpm install && pnpm dev` 도 동작합니다.)

## 주요 라우트

| 경로 | 화면 | 비고 |
| --- | --- | --- |
| `/` | 랜딩 페이지 | "Try as Candidate" 로 후보자 플로우 진입 가능 |
| `/login` | 관리자 로그인 | Sign in → `/app/dashboard` |
| `/verify/:candidateId?` | 후보자 제출 플로우 (8단계) | 사이드바 없음. id 생략 시 자동 선택 |
| `/app/dashboard` | 통계 + 최근 후보자 | 실시간 mock 통계 |
| `/app/candidates` | 후보자 목록 | verification link 복사, 새 생성 |
| `/app/reviewer/:id?` | 리뷰어 콘솔 | 노트/추천조치 저장, Generate Report |
| `/app/reports/:id?` | Candidate Trust Report | 동적 데이터, Export PDF (window.print) |
| `/app/settings` | 조직/Retention/Consent | localStorage 영속화 |
| `/app/audit-log` | 감사 로그 | CSV 내보내기 |

## 데이터 모델

모든 데이터는 `localStorage` (`hiresift:v1:*` prefix) 에 저장됩니다. 새로 고침 후에도 후보자 생성·제출·리뷰·리포트·감사 로그가 유지됩니다. 초기화는 DevTools 에서 해당 키를 지우면 됩니다.

## 구조

```
src/
  types/          도메인 타입
  lib/            cn, format, seed
  api/            in-memory mock API (localStorage 영속)
    storage.ts   load/save 래퍼
    db.ts        ensureSeeded + getter/setter
    candidates.ts
    submissions.ts
    reviews.ts
    reports.ts
    audit.ts
  components/
    primitives/  Buttons, Badges, Card, Field
    layout/      AppLayout, Sidebar, TopBar
    modals/      CreateVerificationModal
  hooks/
    useMediaRecorder.ts  카메라/마이크 녹화
  pages/
    LandingPage.tsx
    LoginPage.tsx
    DashboardPage.tsx
    CandidatesPage.tsx
    ReviewerPage.tsx
    TrustReportPage.tsx
    SettingsPage.tsx
    AuditLogPage.tsx
    CandidateFlowPage.tsx  (8 steps)
  app/
    App.tsx     react-router 라우트 정의
  styles/
    index.css   fonts + tailwind + theme 통합
    print.css   PDF 인쇄용 스타일
  main.tsx
```

## 디자인 시스템

`Brain_Storming/HireSift_Design.md` 의 **A안 Trust SaaS 팔레트**를 따릅니다.

- Primary Navy `#172033`, Muted Teal `#2F7D7E`, Soft Amber `#C6923A`
- 빨간색 절대 미사용. Attention 언어만 사용 ("Low/Medium/High Attention", "Review Recommended", "Manual Review Required").
- 모든 리포트에 Guardrail Notice 노출.

## 알려진 제한 사항

- localStorage 5–10MB quota 를 넘어가는 미디어는 저장이 실패할 수 있습니다 (try/catch 로 경고만 출력). 셀피는 10초 / 320×240 / 400kbps 로 제한됨.
- EN/KR 토글은 아직 미구현 (다음 단계).
- 백엔드/AI 모듈은 mock. 신호 분류는 단순 규칙 기반.

## 배포 (Vercel)

`vercel.json` 이 SPA rewrite + Vite framework preset 을 명시해 두었습니다.

1. https://vercel.com 에 GitHub 계정으로 로그인
2. **Add New → Project** → `vfxpedia/HireSift` 선택 후 Import
3. 모든 기본 설정 유지 (Framework: Vite, Build: `npm run build`, Output: `dist`) → Deploy
4. 빌드 완료 후 `*.vercel.app` URL 이 발급되며 발표/공유 가능

`main` 브랜치에 push 할 때마다 자동 재배포됩니다. PR 별 Preview URL 도 자동 생성됩니다.

## 디자인/리서치 문서

`docs/` 폴더에 HireSift 의 제품 정의·디자인 가이드·리서치 보고서가 함께 들어 있습니다. 자세한 인덱스는 `docs/README.md` 참고.

## 다음 단계

- EN/KR i18n 토글 (`react-i18next`) — audit 문서가 지정한 라벨 매핑 적용.
- 미디어 저장을 IndexedDB 로 이전.
- 실제 백엔드/AI 연동 (Face/OCR/Portfolio Provenance API).
