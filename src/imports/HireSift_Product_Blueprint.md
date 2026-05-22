# HireSift Product Blueprint

> 문서 버전: v0.1  
> 작성 기준: 2026.05.21 KST  
> 문서 목적: HireSift MVP의 제품 구조, 사용자 흐름, 핵심 기능, 데이터 구조, AI 모듈, 개인정보 가드레일을 정의하기 위한 Product Blueprint 문서

---

## 0. Document Positioning

이 문서는 HireSift MVP의 **제품 구조 / 사용자 흐름 / 핵심 기능 / 데이터 구조 / AI 모듈 / 개인정보 가드레일**을 정의하기 위한 문서다.

이 문서는 웹앱의 컬러, 타이포그래피, UI 스타일을 정의하는 `Design.md`가 아니다.

`Design.md`는 별도 문서로 작성하며, 아래 범위를 다룬다.

```md
Design.md
- Brand Tone
- Color System
- Typography
- UI Components
- Layout Rules
- Dashboard Visual Style
- Report PDF Style
```

따라서 본 문서의 권장 파일명은 다음과 같다.

```md
01_Product_Blueprint.md
```

또는 프로젝트 단위로는 다음처럼 사용할 수 있다.

```md
HireSift_Product_Blueprint.md
```

---

## 1. Product Thesis

HireSift는 원격 채용 과정에서 후보자의 신원, 포트폴리오, 인터뷰 신호를 AI로 정제해 **Candidate Trust Report**를 생성하는 **Human-in-the-loop 기반 검수 보조 서비스**다.

HireSift는 후보자를 자동 판정하는 서비스가 아니다.

이 서비스는 원격 채용 과정에서 발생하는 **신원, 제출 자료, 포트폴리오, 인터뷰 기록 사이의 일관성 신호**를 수집하고, 사람이 검토할 수 있는 리포트로 정리한다.

---

## 2. Product Guardrails

HireSift는 다음 원칙을 반드시 따른다.

| Guardrail | Description |
|---|---|
| 거짓말 탐지기 아님 | 표정, 감정, 시선, 행동으로 거짓말 여부를 판정하지 않는다. |
| 자동 탈락 금지 | AI 결과만으로 후보자를 합격/불합격 처리하지 않는다. |
| Human-in-the-loop | 최종 판단은 반드시 사람이 검토한다. |
| 개인정보 최소 수집 및 마스킹 | 신분증, 영상, 음성 등 민감 데이터는 최소 수집하고 마스킹 및 제한 저장을 전제로 한다. |

### 2.1 Result Expression Rules

결과 표현은 다음 방식으로 제한한다.

잘못된 표현:

```md
- 이 후보자는 가짜입니다.
- 이 후보자는 사기 가능성이 높습니다.
- 자동 탈락을 권장합니다.
```

올바른 표현:

```md
- 추가 확인이 필요한 신호가 있습니다.
- 포트폴리오 일관성 검토가 필요합니다.
- 짧은 재검증 콜을 권장합니다.
```

---

## 3. MVP Product Form

초기 MVP는 완전 자동 SaaS가 아니라 다음 형태로 설계한다.

```md
Wizard-of-Oz 기반 Semi-Automated Candidate Trust Report MVP
```

즉, 후보자 자료 제출과 리포트 생성은 웹앱으로 자동화하되, 일부 검토와 최종 판단은 사람이 보조한다.

### 3.1 Why Semi-Automated MVP?

| Reason | Explanation |
|---|---|
| 오탐 리스크 감소 | 얼굴, 음성, 문서 검증은 오탐 가능성이 있으므로 사람 검토가 필요하다. |
| 개인정보 리스크 관리 | 민감 데이터 처리 범위를 줄일 수 있다. |
| 3개월 MVP 가능성 | 완전 자동 시스템보다 빠르게 구현 가능하다. |
| 고객 검증 용이 | 고객이 실제로 Candidate Trust Report에 가치를 느끼는지 먼저 검증할 수 있다. |

---

## 4. Target Customer

초기 고객은 다음으로 제한한다.

```md
원격 개발자·디자이너·프리랜서를 채용하는 스타트업 / 외주사 / 리크루팅 에이전시
```

대기업 HR, 정부기관, 글로벌 프리랜서 플랫폼, 교육기관은 확장 가능성으로만 다룬다.

---

## 5. User Roles

HireSift MVP의 주요 사용자 역할은 다음과 같다.

| Role | Description |
|---|---|
| Admin / Hiring Team | 후보자 검증 요청을 생성하고 결과 리포트를 확인하는 채용 담당자 |
| Candidate | 검증 링크를 받고 동의 후 자료를 제출하는 지원자 |
| Reviewer | AI가 정리한 신호를 검토하고 리포트를 확정하는 내부 검수자 |
| Client Viewer | 최종 Candidate Trust Report를 확인하는 채용 의사결정자 |

초기 MVP에서는 `Admin`과 `Reviewer`를 동일한 사용자로 처리할 수 있다.

---

## 6. Core User Flow

HireSift의 핵심 흐름은 다음과 같다.

```md
1. 채용팀이 후보자 검증 요청 생성
2. 후보자에게 검증 링크 발송
3. 후보자가 개인정보 수집·이용 동의
4. 후보자가 기본 자료 제출
5. 시스템이 신원, 셀피, 음성, 포트폴리오 신호 수집
6. AI/Rule 모듈이 일관성 신호 정리
7. Reviewer가 검토
8. Candidate Trust Report 생성
9. 채용팀이 추가 확인 필요 여부 판단
```

중요한 점은 마지막 단계가 합격/불합격이 아니라는 것이다.

HireSift의 출력은 `Reject`가 아니라 **Recommended Action**이다.

---

## 7. MVP Scope

### 7.1 In Scope

초기 MVP에 포함할 기능은 다음과 같다.

| Feature | Description |
|---|---|
| Candidate Invite | 후보자 검증 링크 생성 |
| Consent Flow | 개인정보 수집·이용 동의 |
| Masked ID Upload | 마스킹된 신분증, 자격증, 학생증 업로드 |
| Selfie Video | 5~10초 셀피 영상 제출 |
| Voice Sample | 랜덤 문장 읽기 기반 음성 샘플 제출 |
| Portfolio Links | GitHub, LinkedIn, Behance, Notion, Website 링크 제출 |
| Risk Signal Summary | 수집된 신호를 일관성 기준으로 요약 |
| Human Review | Reviewer가 신호를 검토 |
| Candidate Trust Report | 최종 리포트 생성 |
| PDF Export | 리포트 PDF 다운로드 |

### 7.2 Out of Scope

초기 MVP에서 제외할 기능은 다음과 같다.

| Out of Scope | Reason |
|---|---|
| 자동 탈락 기능 | 법적/윤리적 리스크가 크다. |
| 거짓말 탐지 | 과학적 근거와 규제 리스크가 크다. |
| 감정 분석 | 채용 공정성 및 차별 리스크가 있다. |
| 성격 분석 | 채용 차별 및 편향 문제가 발생할 수 있다. |
| 전체 백그라운드 체크 대체 | MVP 범위를 초과한다. |
| 완전 자동 딥페이크 단정 | 오탐 리스크가 크다. |
| ATS 양방향 연동 | 초기 MVP 구현 범위를 초과한다. |
| 자체 화상회의 플랫폼 | Zoom, Google Meet 대체는 초기 범위가 아니다. |

---

## 8. Required Screens

초기 MVP에 필요한 화면은 다음과 같다.

| Screen | Purpose |
|---|---|
| Landing / Service Brief | 서비스 소개 및 핵심 가치 전달 |
| Admin Login | 관리자 로그인 |
| Candidate List | 후보자 검증 상태 목록 |
| Create Verification Request | 후보자 검증 요청 생성 |
| Candidate Consent Page | 후보자 개인정보 동의 |
| Candidate Submission Page | 후보자 자료 제출 |
| Reviewer Dashboard | 수집된 신호 검토 |
| Candidate Trust Report Page | 최종 리포트 확인 |
| Export PDF | 리포트 다운로드 |

### 8.1 MVP Priority Screens

초기 개발 우선순위는 다음 5개 화면이다.

```md
1. Candidate List
2. Create Verification Request
3. Candidate Submission Page
4. Reviewer Dashboard
5. Candidate Trust Report Page
```

---

## 9. Candidate Submission Flow

후보자는 검증 링크를 통해 다음 순서로 자료를 제출한다.

```md
1. 검증 링크 접속
2. 서비스 목적 안내 확인
3. 개인정보 수집·이용 동의
4. 기본 정보 입력
5. 포트폴리오 링크 제출
6. 마스킹된 신분증 또는 자격증 업로드
7. 셀피 영상 제출
8. 랜덤 문장 기반 음성 샘플 제출
9. 제출 완료 화면 확인
```

### 9.1 Candidate Submission Data

| Data | Example |
|---|---|
| Basic Info | 이름, 이메일, 지원 직무 |
| Portfolio Links | GitHub, LinkedIn, Behance, Notion, 개인 웹사이트 |
| Masked ID | 이름 일부, 사진, 생년 일부 등 필요한 최소 정보만 표시 |
| Selfie Video | 5~10초 셀피 영상 |
| Voice Sample | 랜덤 문장 읽기 |
| Consent Record | 동의 일시, IP, 동의 버전 |

---

## 10. Admin / Reviewer Dashboard

Reviewer Dashboard는 수집된 자료와 AI/Rule 기반 신호를 사람이 검토하는 공간이다.

### 10.1 Dashboard Sections

```md
1. Candidate Overview
2. Submission Status
3. Identity Consistency
4. Portfolio Provenance
5. Media Sample Quality
6. Risk Signal Summary
7. Reviewer Notes
8. Recommended Action
9. Report Generation
```

### 10.2 Reviewer Actions

| Action | Description |
|---|---|
| Approve Signal | 해당 신호를 문제 없음으로 검토 |
| Mark for Review | 추가 확인 필요로 표시 |
| Request More Info | 후보자에게 추가 자료 요청 |
| Add Note | 수동 검토 메모 작성 |
| Generate Report | Candidate Trust Report 생성 |

---

## 11. Candidate Trust Report

Candidate Trust Report는 HireSift의 핵심 산출물이다.

이 리포트는 후보자의 합격/불합격을 판단하지 않는다.  
리포트의 목적은 채용팀이 추가 확인이 필요한 부분을 빠르게 파악하도록 돕는 것이다.

### 11.1 Report Structure

```md
# Candidate Trust Report

## 1. Candidate Overview
- Candidate ID
- Role
- Verification Date
- Reviewer
- Report Status

## 2. Identity Consistency
- Name / Email / Portfolio account consistency
- Masked ID check result
- Selfie match signal

## 3. Interview Session Integrity
- Face consistency signal
- Voice consistency signal
- Random prompt response
- Session quality
- Device/IP metadata summary

## 4. Portfolio Provenance
- GitHub / LinkedIn / Behance / Website
- Account age signal
- Activity pattern signal
- Portfolio ownership signal
- Manual review notes

## 5. Review Signals
- Low Attention
- Medium Attention
- High Attention

## 6. Recommended Action
- No additional check needed
- Request short re-verification call
- Request portfolio walkthrough
- Request additional document
- Manual review required

## 7. Guardrail Notice
This report does not determine hiring eligibility.
It only summarizes review signals for human decision-makers.
```

---

## 12. Risk Signal Logic

HireSift는 후보자를 가짜로 단정하지 않는다.  
대신 검토가 필요한 신호를 Attention Level로 표현한다.

### 12.1 Attention Levels

| Level | Meaning |
|---|---|
| Low Attention | 특별한 추가 확인 신호가 적음 |
| Medium Attention | 일부 항목에서 추가 확인 필요 |
| High Attention | 여러 항목에서 불일치 신호가 있어 수동 검토 필요 |

### 12.2 Recommended Actions

| Action | Use Case |
|---|---|
| No additional check needed | 제출 자료와 계정 정보의 기본 일관성이 양호한 경우 |
| Request short re-verification call | 셀피, 음성, 면접 신호가 불충분한 경우 |
| Request portfolio walkthrough | 포트폴리오 소유 및 제작 과정 확인이 필요한 경우 |
| Request additional document | 신분 확인 자료가 불명확한 경우 |
| Manual review required | 여러 신호에서 불일치가 발견된 경우 |

---

## 13. AI Module Design

초기 MVP의 AI 모듈은 최종 판정을 내리지 않는다.  
AI 모듈은 사람이 검토할 수 있는 신호를 생성한다.

| Module | Input | Output |
|---|---|---|
| Face Consistency Module | 셀피 영상, 면접 프레임 | 얼굴 유사도 신호 |
| Liveness Prompt Module | 랜덤 문장, 행동 요청 | 응답 완료 여부 |
| Voice Consistency Module | 음성 샘플, 면접 음성 | 음성 일관성 신호 |
| OCR / Document Module | 마스킹 ID 이미지 | 이름, 생년 일부, 문서 형식 신호 |
| Portfolio Provenance Module | 포트폴리오 링크 URL | 계정 활동, 생성 시점, 일관성 신호 |
| Risk Signal Aggregator | 모든 검증 신호 | Attention Level |
| LLM Report Generator | 구조화된 신호 | Candidate Trust Report 초안 |

### 13.1 AI Module Principle

```md
AI module does not produce a final fraud judgment.
It only generates review signals.
```

---

## 14. Data Structure

초기 MVP의 데이터 구조는 다음을 기준으로 한다.

```md
users
- id
- email
- role
- organization_id
- created_at

organizations
- id
- name
- type
- created_at

candidates
- id
- organization_id
- candidate_code
- role_title
- status
- created_at

verification_requests
- id
- candidate_id
- request_status
- expires_at
- consent_status
- created_at

identity_artifacts
- id
- candidate_id
- artifact_type
- masked_file_url
- extracted_metadata
- review_status
- created_at

media_samples
- id
- candidate_id
- media_type
- file_url
- duration
- quality_score
- embedding_ref
- retention_expiry
- created_at

portfolio_links
- id
- candidate_id
- platform
- url
- metadata
- provenance_summary
- created_at

interview_sessions
- id
- candidate_id
- session_date
- session_metadata
- quality_summary
- created_at

risk_signals
- id
- candidate_id
- signal_type
- severity
- evidence
- explanation
- created_at

trust_reports
- id
- candidate_id
- report_status
- summary
- recommended_action
- reviewer_id
- created_at
```

---

## 15. Privacy & Compliance Design

HireSift는 개인정보 보호를 제품 설계의 핵심 원칙으로 둔다.

### 15.1 Privacy Principles

| Item | Policy |
|---|---|
| 신분증 | 전체 저장 금지, 마스킹 업로드 |
| 영상 | 원본 장기 저장 금지 |
| 음성 | 짧은 샘플만 수집 |
| 결과 | 위험 신호 중심 표현 |
| 후보자 | 동의·고지 필수 |
| 채용팀 | 자동 탈락 금지 문구 표시 |
| Reviewer | 수동 검토 로그 저장 |

### 15.2 Consent Requirements

후보자 동의 화면에는 다음 내용이 포함되어야 한다.

```md
1. 수집 목적
2. 수집 항목
3. 보관 기간
4. 제3자 제공 여부
5. 자동 의사결정에 사용하지 않는다는 안내
6. 결과가 채용 합격/불합격을 자동 결정하지 않는다는 안내
7. 문의 및 삭제 요청 경로
```

---

## 16. Technical MVP Direction

### 16.1 Recommended Product Form

초기 MVP는 웹앱으로 구현한다.

이유:

- 후보자에게 링크 발송이 쉽다.
- 별도 앱 설치가 필요 없다.
- 관리자 대시보드 구현이 쉽다.
- 팀 프로젝트 발표에 적합하다.

### 16.2 Video Interview Strategy

초기 MVP에서는 자체 화상회의 기능을 만들지 않는다.

추천 방향:

```md
Zoom / Google Meet을 그대로 사용하고,
HireSift는 면접 전후 검증 링크와 Candidate Trust Report 도구로 작동한다.
```

### 16.3 Automation Level

| Area | Automation Level |
|---|---|
| 자료 수집 | 자동 |
| 파일 정리 | 자동 |
| 포트폴리오 메타데이터 수집 | 반자동 |
| 얼굴/음성 일관성 | 기술 데모 수준 |
| 최종 리포트 | LLM 초안 + 사람 검토 |
| 최종 판단 | 사람 |

---

## 17. MVP Feature Priority

초기 3개월 MVP에서 가장 중요한 기능 3개는 다음과 같다.

```md
1. Candidate Verification Link + Consent + Upload Flow
2. Portfolio Provenance Summary
3. Candidate Trust Report Generator
```

얼굴/음성 모델은 데모 수준으로 포함하되, 제품의 본질은 Candidate Trust Report에 둔다.

---

## 18. MVP Roadmap

### Phase 1. Foundation

```md
- 프로젝트 구조 생성
- 기본 DB 설계
- Admin 로그인
- 후보자 생성
- 검증 링크 생성
```

### Phase 2. Candidate Submission

```md
- 후보자 동의 화면
- 기본 정보 입력
- 포트폴리오 링크 제출
- 마스킹 ID 업로드
- 셀피 영상 업로드
- 음성 샘플 업로드
```

### Phase 3. Reviewer Dashboard

```md
- 후보자 제출 상태 확인
- 자료별 검토 화면
- 위험 신호 수동 입력
- AI/Rule 기반 신호 요약
```

### Phase 4. Candidate Trust Report

```md
- 리포트 초안 생성
- Reviewer 메모 반영
- Recommended Action 선택
- PDF Export
```

---

## 19. Open Questions

아래 항목은 이후 팀 논의가 필요하다.

```md
1. 후보자에게 최종 리포트를 보여줄 것인가?
2. 영상/음성 원본 보관 기간은 며칠로 설정할 것인가?
3. Face Verification을 MVP에 실제 모델로 넣을 것인가, 데모 수준으로 처리할 것인가?
4. 포트폴리오 Provenance는 어떤 플랫폼부터 지원할 것인가?
5. 초기 유료 과금 단위는 후보자 1명당 리포트인가, 월 패키지인가?
6. 후보자 이의제기 프로세스를 MVP에 포함할 것인가?
7. 국내 개인정보보호법 검토를 어느 수준까지 반영할 것인가?
```

---

## 20. Related Documents

이 문서 이후 작성할 문서는 다음과 같다.

```md
01_Product_Blueprint.md
02_PRD.md
03_User_Flow.md
04_Data_Schema.md
05_AI_Module_Spec.md
06_Candidate_Trust_Report_Template.md
07_Privacy_Guardrail.md
08_Design.md
09_MVP_Roadmap.md
10_Business_Brief.md
```

---

## 21. Summary

HireSift의 MVP는 원격 채용에서 후보자의 신원, 포트폴리오, 인터뷰 신호를 수집하고 정리해 Candidate Trust Report를 생성하는 검수 보조 시스템이다.

초기 MVP는 완전 자동 탐지기가 아니라, Human-in-the-loop 기반의 Semi-Automated Report Tool로 설계한다.

제품의 핵심은 후보자를 판정하는 것이 아니라, 채용팀이 추가 확인이 필요한 신호를 더 빠르고 구조적으로 검토할 수 있도록 돕는 것이다.
