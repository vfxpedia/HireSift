# HireSift — Supabase 데이터베이스 설정 가이드

> 이 가이드는 현재 localStorage 기반 Mock API를 Supabase PostgreSQL 백엔드로 전환하기 위해 **사용자가 직접 설정해야 하는 항목**을 정리합니다.

---

## 1. Supabase 프로젝트 생성

1. https://supabase.com → **New project** 클릭
2. 프로젝트 이름: `hiresift` (또는 원하는 이름)
3. 데이터베이스 비밀번호: 안전한 비밀번호 생성 후 반드시 저장
4. Region: `Northeast Asia (Seoul)` 권장
5. Plan: Free tier로 시작 가능 (500MB DB, 1GB 파일 스토리지)

---

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

**값 확인 위치**: Supabase 대시보드 → **Settings → API**
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` → `VITE_SUPABASE_ANON_KEY`

> `.env.local`은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.  
> Vercel 배포 시에는 **Settings → Environment Variables**에 동일하게 추가해야 합니다.

---

## 3. 테이블 생성 SQL

Supabase 대시보드 → **SQL Editor** → 아래 SQL을 순서대로 실행합니다.

### 3.1 candidates

```sql
create table candidates (
  id           text primary key,
  code         text not null unique,
  name         text not null,
  email        text not null,
  role         text not null,
  submission_status text not null default 'pending'
    check (submission_status in ('pending','in-progress','submitted','reviewed','report-ready')),
  attention_level text not null default 'low'
    check (attention_level in ('low','medium','high','manual')),
  reviewer     text,
  report_ready boolean not null default false,
  last_updated text not null,
  created_at   timestamptz not null default now()
);
```

### 3.2 candidate_submissions

```sql
create table candidate_submissions (
  candidate_id text primary key references candidates(id) on delete cascade,
  step         integer not null default 0,
  consent_agreed boolean not null default false,
  consent_agreed_at text,
  basic_info   jsonb,      -- { fullName, email, country, linkedin? }
  portfolio    jsonb not null default '[]',   -- [{ platform, url }]
  document     jsonb,      -- MediaAsset: { dataUrl, mimeType, size, fileName }
  selfie       jsonb,      -- MediaAsset
  voice        jsonb,      -- MediaAsset
  submitted_at text,
  reference    text
);
```

> **주의**: `document`, `selfie`, `voice`의 `dataUrl`은 base64 인코딩된 blob입니다.  
> 프로덕션에서는 Supabase Storage에 파일을 올리고 URL만 저장하는 방식으로 전환 권장.

### 3.3 reviewer_data

```sql
create table reviewer_data (
  candidate_id text primary key references candidates(id) on delete cascade,
  notes        text not null default '',
  recommended_action text not null default 'no-action'
    check (recommended_action in ('no-action','verification-call','portfolio-walkthrough','additional-doc','manual-review')),
  signal_notes jsonb not null default '{}',   -- Record<string, string>
  reviewed_at  text,
  reviewer     text
);
```

### 3.4 trust_reports

```sql
create table trust_reports (
  candidate_id            text primary key references candidates(id) on delete cascade,
  generated_at            text not null,
  reviewer                text not null,
  recommended_action      text not null,
  recommended_action_title  text not null,
  recommended_action_detail text not null,
  reviewer_notes          text not null default '',
  summary                 jsonb not null,    -- { identity, portfolio, session, mediaQuality, manualReview }
  signal_matrix           jsonb not null default '[]',
  portfolio               jsonb not null default '[]'
);
```

### 3.5 audit_log

```sql
create table audit_log (
  id        text primary key,
  action    text not null,
  "user"    text not null,
  candidate text not null,
  time      text not null,
  type      text not null
    check (type in ('report','review','submission','request','consent','share')),
  created_at timestamptz not null default now()
);
```

### 3.6 org_settings

```sql
create table org_settings (
  id                          serial primary key,
  name                        text not null default 'TechCorp Inc.',
  contact_email               text not null default 'admin@techcorp.com',
  time_zone                   text not null default 'Asia/Seoul',
  retention_submission        text not null default '90 days',
  retention_media             text not null default '30 days',
  retention_reports           text not null default '1 year',
  retention_audit_logs        text not null default '2 years',
  consent_template            text not null default '',
  consent_template_updated_at text,
  consent_template_version    text
);

-- 초기 레코드 삽입
insert into org_settings (name) values ('TechCorp Inc.');
```

---

## 4. Row Level Security (RLS) 설정

Supabase는 기본적으로 RLS가 활성화되어 있습니다. MVP 단계에서는 인증된 사용자에게 전체 접근을 허용하는 정책을 추가합니다.

```sql
-- 각 테이블에 RLS 활성화 (이미 활성화된 경우 생략)
alter table candidates enable row level security;
alter table candidate_submissions enable row level security;
alter table reviewer_data enable row level security;
alter table trust_reports enable row level security;
alter table audit_log enable row level security;
alter table org_settings enable row level security;

-- 인증된 사용자 전체 접근 허용 (MVP용)
create policy "authenticated full access" on candidates
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on candidate_submissions
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on reviewer_data
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on trust_reports
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on audit_log
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on org_settings
  for all to authenticated using (true) with check (true);
```

> **프로덕션 전환 전** 조직별 멀티테넌트 정책으로 변경 필요:  
> `using (org_id = auth.jwt() ->> 'org_id')` 패턴 사용.

---

## 5. Supabase Storage (미디어 파일)

현재 MVP는 미디어를 base64 dataURL로 localStorage에 저장합니다.  
Supabase로 전환 시 Storage bucket을 사용합니다.

```sql
-- Supabase 대시보드 → Storage → New bucket
-- 이름: hiresift-media
-- Public: false (private bucket)
```

파일 업로드 경로 규칙:
```
hiresift-media/
  {candidateId}/document.{ext}
  {candidateId}/selfie.webm
  {candidateId}/voice.webm
```

---

## 6. 코드 연동 방법

### 6.1 Supabase 클라이언트 설치

```bash
npm install @supabase/supabase-js
```

### 6.2 클라이언트 초기화

`src/lib/supabase.ts` 파일 생성:

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### 6.3 API 레이어 교체 예시

`src/api/candidates.ts`에서 localStorage 대신 Supabase를 사용:

```typescript
import { supabase } from '../lib/supabase'

// 현재 (localStorage)
export function listCandidates(): Candidate[] {
  return db().candidates
}

// 교체 후 (Supabase) — React Query 또는 SWR과 함께 사용 권장
export async function listCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Candidate[]
}
```

---

## 7. 인증 설정 (Supabase Auth)

현재 MVP는 더미 로그인(비밀번호 무관)을 사용합니다.  
Supabase Auth로 전환 시:

1. 대시보드 → **Authentication → Providers → Email** 활성화
2. 테스트 사용자 추가: **Authentication → Users → Add user**
   - Email: `sarah.chen@techcorp.com`
   - Password: 원하는 비밀번호

```typescript
// 로그인
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'sarah.chen@techcorp.com',
  password: 'your-password',
})

// 로그아웃
await supabase.auth.signOut()

// 세션 확인
const { data: { session } } = await supabase.auth.getSession()
```

---

## 8. Vercel 환경 변수 설정

Vercel 배포 시 환경 변수를 추가해야 합니다:

1. Vercel 대시보드 → 프로젝트 선택 → **Settings → Environment Variables**
2. 다음 변수 추가:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` (anon public key) |

3. Environment: **Production, Preview, Development** 모두 체크
4. **Save** 후 재배포 필요 (Deployments → Redeploy)

---

## 9. 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] `.env.local` 파일 생성 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] SQL Editor에서 6개 테이블 생성 완료
- [ ] RLS 정책 설정 완료
- [ ] Storage bucket `hiresift-media` 생성
- [ ] Vercel 환경 변수 추가
- [ ] `npm install @supabase/supabase-js` 실행
- [ ] `src/lib/supabase.ts` 클라이언트 파일 생성
- [ ] API 레이어 교체 (candidates → submissions → reviews → reports → audit 순)
- [ ] Supabase Auth 사용자 추가 (optional, MVP는 더미 로그인 유지 가능)
