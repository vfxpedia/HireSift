# HireSift — AI-powered Remote Hiring Trust Layer 최종 리서치 프롬프트 v1.1

나는 AI-native 생활 문제 기반 AI 비즈니스 모델을 기획하고 있다.

서비스명은 **HireSift**다.

HireSift는 원격 채용 과정에서 후보자의 신원, 포트폴리오, 인터뷰 신호를 AI로 정제해 **Candidate Trust Report**를 생성하는 검수 보조 서비스다.

이 서비스는 “가짜 지원자를 자동으로 잡아내는 서비스”가 아니다.  
지원자의 신원, 제출 자료, 포트폴리오, 인터뷰 기록 사이의 일관성을 검토하고, 채용 담당자가 추가 확인이 필요한 위험 신호를 파악할 수 있도록 돕는 **Human-in-the-loop 기반 AI Trust Layer**다.

---

## 0. 최종 산출물 순서

다음 순서로 HireSift의 사업화 가능성을 검증한다.

0. Naming / Service Thesis
1. Problem Definition
2. 2C Analysis
3. Customer Persona / JTBD
4. Existing Alternatives & Gap
5. Value Proposition / Positioning
6. TAM / SAM / SOM
7. MVP Scope & User Flow
8. Data Structure / AI Architecture
9. Business Model Canvas
10. OKR / Validation Plan
11. Business Brief

---

## 1. 리서치 기간과 출처 기준

### 1.1 기간

주요 근거 자료는 **2025년 5월 1일부터 2026년 5월 현재까지**의 최근 약 1년 자료를 우선한다.

다만 시장 규모, HR Tech, identity verification, background check, remote hiring 관련 기본 시장 데이터는 **2023년 이후 자료**까지 보조적으로 사용할 수 있다.

### 1.2 우선 출처

다음 순서로 신뢰도를 둔다.

1. 정부/공공기관 자료
2. 국제기구/공신력 있는 연구기관 자료
3. 보안 기업 리포트
4. HR Tech / Recruiting 산업 리포트
5. 상장사 공시자료, IR 자료
6. 공신력 있는 언론 기사
7. 학술 논문 / arXiv
8. 기업 블로그
9. 커뮤니티 후기, Reddit, Product Hunt, G2, Capterra, 앱스토어 리뷰

### 1.3 출처 표기 규칙

각 핵심 주장에는 반드시 다음을 포함한다.

- 출처명
- 발행일
- 링크
- 해당 자료가 뒷받침하는 주장
- 신뢰도 등급: High / Medium / Low

자료가 부족한 경우 억지로 추정하지 말고 다음처럼 표시한다.

> 해당 항목은 공개 자료가 부족함. 아래 수치는 가정 기반 추정치이며, 추가 검증이 필요함.

---

## 2. 반드시 지켜야 할 제품 가드레일

HireSift는 다음 원칙을 반드시 따른다.

1. 거짓말 탐지기가 아니다.
2. 후보자를 자동 탈락시키지 않는다.
3. Human-in-the-loop 구조를 따른다.
4. 개인정보는 최소 수집한다.
5. 신분증·영상·음성 데이터는 마스킹과 제한 저장을 전제로 한다.
6. 결과 표현은 “가짜입니다”가 아니라 “추가 확인이 필요한 위험 신호가 있습니다”로 제한한다.
7. 채용 공정성, 차별, 편향, 개인정보 침해 가능성을 핵심 리스크로 다룬다.

---

## 3. 초기 고객 범위

초기 고객은 다음으로 제한한다.

> 원격 개발자·디자이너·프리랜서를 채용하는 스타트업 / 외주사 / 리크루팅 에이전시

대기업 HR, 정부기관, 글로벌 프리랜서 플랫폼, 교육기관은 확장 가능성으로만 다루고, 초기 고객 분석에서는 제외하거나 별도 참고로 분리한다.

---

## 4. 서비스 핵심 가설

다음 가설을 검증한다.

> AI 도구와 원격 채용이 확산되면서 기업은 후보자의 실력뿐 아니라, “화면 속 사람, 제출한 신분, 포트폴리오, 실제 입사자가 같은 사람인가?”를 확인해야 하는 새로운 채용 리스크를 겪고 있다.

HireSift는 이 문제를 해결하기 위해 원격 채용 전·중·후 과정에서 후보자의 신원, 포트폴리오, 인터뷰 신호를 검수하고, 채용 담당자에게 Candidate Trust Report를 제공한다.

---

# 5. 산출물별 리서치 지시

---

## 5.0 Naming / Service Thesis

서비스명은 **HireSift**로 고정한다.

조사할 내용:

1. HireSift라는 이름이 전달하는 의미
2. “Sift”가 채용 신호 정제, 선별, 검수와 어떻게 연결되는지
3. 서비스 한 줄 정의
4. 서비스가 아닌 것
   - Fraud detector 아님
   - Lie detector 아님
   - Automatic rejection system 아님
5. 추천 태그라인 3개

출력 형식:

- Service Name
- Service Thesis
- One-line Description
- Tagline Candidates
- What It Is Not

---

## 5.1 Problem Definition

다음 질문에 답한다.

1. AI 시대에 원격 채용에서 새롭게 발생하거나 심각해진 문제는 무엇인가?
2. 후보자 허위 진술, 가짜 신원, deepfake candidate, 대리 면접, 포트폴리오 조작, AI 지원서 작성 문제는 최근 어떻게 증가하고 있는가?
3. 기업은 이 문제로 어떤 비용과 리스크를 겪는가?
4. 왜 지금 이 문제가 중요해졌는가?
5. 이 문제를 “가짜 지원자 탐지”가 아니라 “신원·자료·인터뷰 일관성 검수”로 정의해야 하는 이유는 무엇인가?

필수 검색 키워드:

- deepfake candidates hiring
- candidate fraud AI 2025
- remote hiring identity verification
- AI candidate deception
- fake job candidates AI
- North Korean remote IT workers AI hiring
- AI hiring fraud
- candidate identity verification remote interview

추가 지시:

초기 고객이 겪는 핵심 페인포인트를 최소 5개 도출하고, 각 페인포인트마다 기사·설문·리포트·통계 근거를 붙인다.

출력 형식:

1. Problem Statement
2. Why Now
3. Evidence Summary
4. Pain Point 5개
   - Pain Point
   - 근거 자료
   - 고객에게 발생하는 비용/리스크
5. Risk for Companies
6. Problem Boundary
7. Sources

---

## 5.2 2C Analysis

2C는 **Customer / Competitor** 기준으로 분석한다.

### 5.2.1 Customer

초기 고객군을 다음 세 그룹으로만 나눈다.

1. 원격 개발자를 채용하는 스타트업
2. 디자이너·크리에이티브 인력을 원격 채용하는 외주사
3. 후보자를 검수해야 하는 리크루팅 에이전시

각 고객군에 대해 조사한다.

- 어떤 상황에서 이 문제가 발생하는가?
- 채용 실패 비용은 무엇인가?
- 기존에 어떤 방식으로 후보자를 검증하는가?
- 어떤 기능이면 돈을 낼 가능성이 있는가?
- 구매 의사결정자는 누구인가?
- 도입 저항은 무엇인가?

### 5.2.2 Competitor

직접 경쟁자와 간접 대안을 나누어 조사한다.

최소 5개 이상 실제 서비스를 조사한다.

경쟁/대안 범주:

1. Background check service
2. Identity verification service
3. Video interview platform
4. ATS / HR Tech platform
5. Deepfake detection solution
6. Portfolio verification / credential verification tool
7. Manual reference check

경쟁 서비스 표 컬럼:

- 서비스명
- 국가/시장
- 핵심 기능
- 가격 또는 과금 방식
- 타깃 고객
- HireSift와 겹치는 기능
- 해결하지 못하는 공백
- 약점
- 약점 근거 출처

약점은 가능하면 G2, Capterra, Product Hunt, Reddit, 앱스토어 리뷰, 언론 기사, 사용자 후기 근거를 사용한다.

출력 형식:

1. Customer Segment Table
2. Competitor / Alternative Table
3. Competitor Weakness Evidence
4. Gap Analysis
5. Initial Beachhead Customer Recommendation

---

## 5.3 Customer Persona / JTBD

초기 고객을 기반으로 페르소나를 만든다.

필수 페르소나:

1. 스타트업 HR / People Manager
2. 외주사 대표 또는 PM
3. 리크루팅 에이전시 담당자

각 페르소나별로 다음을 작성한다.

1. 역할
2. 상황
3. 현재 겪는 문제
4. 가장 두려워하는 리스크
5. 기존 해결 방식
6. 불만
7. 구매 동기
8. 구매 저항
9. Job To Be Done

JTBD 형식:

> When [상황], I want to [하고 싶은 일], so I can [얻고 싶은 결과].

출력 형식:

- Persona Profile
- Pain Point
- Trigger Event
- Buying Motivation
- Objection
- JTBD Statement
- Evidence Source

---

## 5.4 Existing Alternatives & Gap

고객이 현재 이 문제를 어떻게 해결하고 있는지 조사한다.

기존 대안:

1. 수동 신분증 확인
2. 화상면접 녹화
3. LinkedIn / GitHub / Behance 수동 확인
4. 레퍼런스 체크
5. 과제 테스트
6. 백그라운드 체크 업체
7. ATS 내 검증 기능
8. Zoom / Google Meet 기반 수동 확인
9. 이메일·전화번호·계정 활동 이력 확인

각 대안별로 분석한다.

- 장점
- 한계
- 비용
- 시간 소모
- 정확도 문제
- 개인정보 리스크
- HireSift가 보완할 수 있는 지점

추가 지시:

기존 대안이 공통적으로 해결하지 못하는 문제를 최소 5개 도출한다.  
가능하면 실제 사용자 리뷰나 HR 담당자 후기에서 반복되는 불만을 짧게 인용한다.

출력 형식:

1. Alternative Comparison Table
2. Current Workflow
3. Friction Points
4. Review-based Complaints
5. Opportunity Gap
6. HireSift Entry Point

---

## 5.5 Value Proposition / Positioning

HireSift의 가치 제안을 정리한다.

다음 질문에 답한다.

1. HireSift는 누구를 위한 서비스인가?
2. 어떤 문제를 해결하는가?
3. 기존 방식보다 무엇이 나은가?
4. 왜 AI/CV/LLM이 필요한가?
5. 어떤 표현은 피해야 하는가?
6. 채용팀에게 어떤 결과물을 제공하는가?

반드시 포함할 포지셔닝:

> HireSift is not an automatic fraud detector.  
> It is an AI-powered trust layer that helps hiring teams review identity, portfolio, and interview consistency in remote hiring.

출력 형식:

1. Value Proposition
2. Positioning Statement
3. Core Message
4. Anti-Positioning
5. Messaging Do / Don’t
6. Candidate Trust Report Value

---

## 5.6 TAM / SAM / SOM

HireSift의 시장 규모를 분석한다.

주의사항:

- HR Tech 전체 시장 규모만으로 과장하지 않는다.
- Remote hiring, background check, identity verification, video interview, freelance hiring, recruiting agency 시장을 나누어 본다.
- 가능한 경우 글로벌 시장과 한국/아시아 시장을 구분한다.
- 추정치에는 출처와 계산식을 반드시 포함한다.
- 보수적 / 중립 / 공격적 시나리오를 분리한다.
- 공개 자료가 없으면 가정 기반 추정치라고 명확히 표시한다.

### 5.6.1 TAM 계산

TAM은 다음 방식 중 자료 확보가 가능한 방식으로 계산한다.

1안:

> TAM = 전체 원격 채용 또는 검증 대상 후보자 수 × 후보자 1명당 연간 검증 지출 가능액

2안:

> TAM = 관련 시장 규모  
> 예: background check market + identity verification market + video interview market 중 HireSift 적용 가능 비율

가능하면 1안과 2안을 모두 비교한다.

### 5.6.2 SAM 계산

> SAM = TAM × 초기 고객군 서비스 가능 비율

초기 고객군:

- 원격 개발자 채용 스타트업
- 원격 디자이너·프리랜서 채용 외주사
- 리크루팅 에이전시

서비스 가능 비율은 지역, 언어, 플랫폼, 법적 제약, 초기 영업 가능성을 기준으로 보수적으로 산정한다.

### 5.6.3 SOM 계산

> SOM = SAM × 3년 내 현실적 점유율

점유율 가정은 다음 범위로 나눈다.

- 보수적: 0.1~0.5%
- 중립: 0.5~1%
- 공격적: 1~3%

각 점유율 가정에는 유사 B2B SaaS, HR Tech, identity verification, recruiting tool 사례를 근거로 붙인다.

출력 형식:

1. Market Definition
2. TAM Calculation
3. SAM Calculation
4. SOM Calculation
5. Assumptions
6. Conservative / Base / Aggressive Scenario
7. Market Risk
8. Data Confidence Level
9. Sources

---

## 5.7 Revenue Model Benchmark

HireSift와 유사한 B2B SaaS 또는 HR Tech 서비스의 수익 모델을 조사한다.

최소 5개 서비스를 조사한다.

가능하면 다음 정보를 포함한다.

- 서비스명
- 가격 정책
- 과금 단위
  - 후보자 1명당
  - 월 구독
  - 좌석당
  - API 호출당
  - 기업 계약
- 무료 체험 여부
- 주요 고객
- 공개된 매출/ARR/MAU/고객 수
- 출처

공개되지 않은 수치는 추정하지 말고 “공개 자료 없음”으로 표시한다.

출력 형식:

1. Revenue Benchmark Table
2. Pricing Pattern
3. Recommended Pricing Hypothesis for HireSift
4. Pricing Risks
5. Sources

---

## 5.8 MVP Scope & User Flow

3개월 안에 개인 또는 소규모 팀이 구현 가능한 MVP를 설계한다.

MVP는 다음 3단계를 중심으로 한다.

### 1. 면접 전 검증

후보자가 제출하는 자료:

- 이력서
- 포트폴리오 링크
- 신분증 또는 학생증/자격증 일부 마스킹 이미지
- 셀피 영상 5~10초
- 본인 확인용 짧은 음성 문장

검증 항목:

- 이력서 이름 / 이메일 / 포트폴리오 계정명 일관성
- 프로필 사진과 셀피 얼굴 유사도
- 포트폴리오 생성 시점과 계정 활동 흔적
- GitHub / LinkedIn / Behance 등 공개 디지털 풋프린트
- 신분증 이미지 조작 의심 신호

### 2. 면접 중 검증

검증 항목:

- 랜덤 문장 읽기
- 고개 좌우 움직임
- 특정 숫자나 단어 말하기
- 화면 속 얼굴과 사전 등록 셀피 비교
- 인터뷰 세션 메타데이터 기록

### 3. 면접 후 리포트

최종 산출물:

- Candidate Trust Report
- Identity Consistency
- Face Match
- Voice Consistency
- Portfolio Provenance
- Interview Session Integrity
- Red Flags
- Recommended Action

출력 형식:

1. MVP Feature List
2. Feature Priority
3. User Flow
4. Admin Flow
5. Candidate Flow
6. Candidate Trust Report Sample
7. 3-Month MVP Roadmap
8. Out-of-Scope Features

---

## 5.9 Data Structure / AI Architecture

MVP 구현에 필요한 데이터 구조와 AI 모듈을 설계한다.

필수 원칙:

- 개인정보 최소 수집
- 신분증 전체 저장 금지
- 원본 영상 장기 저장 금지
- 민감 데이터 마스킹
- 지원자 동의 기록
- 결과는 위험 신호 중심으로 표현
- 자동 탈락 판단 금지

분석할 데이터:

1. Candidate profile
2. Resume metadata
3. Portfolio links
4. Selfie video metadata
5. Voice sample metadata
6. Masked ID document metadata
7. Interview session metadata
8. Verification result
9. Risk signal
10. Candidate Trust Report

AI 모듈:

1. Face verification
2. Liveness check
3. OCR / document layout check
4. Keyframe extraction
5. Speaker verification
6. Portfolio provenance analysis
7. LLM report generation
8. Risk scoring assistant

출력 형식:

1. Data Entity List
2. Suggested Database Schema
3. AI Module Architecture
4. Data Flow
5. Privacy-by-Design Checklist
6. Risk Scoring Logic
7. Human Review Workflow

---

## 5.10 Business Model Canvas

HireSift의 Business Model Canvas를 작성한다.

반드시 포함할 항목:

1. Customer Segments
2. Value Propositions
3. Channels
4. Customer Relationships
5. Revenue Streams
6. Key Resources
7. Key Activities
8. Key Partners
9. Cost Structure

초기 수익 모델은 다음을 우선 고려한다.

1. 후보자 1명당 Candidate Trust Report 과금
2. 월 30명 / 100명 / 300명 검증 패키지
3. 리크루팅 에이전시용 팀 대시보드
4. ATS 연동은 후순위
5. Enterprise 보안 연동은 장기 확장

출력 형식:

- Business Model Canvas Table
- Revenue Model Options
- Pricing Hypothesis
- Cost Drivers
- Key Risks
- Validation Questions

---

## 5.11 OKR / Validation Plan

HireSift의 초기 검증 계획을 작성한다.

기간은 8주 또는 12주 기준으로 설정한다.

예시 Objective:

> 원격 채용 신원 검증 문제에 대한 HireSift의 MVP 시장성을 검증한다.

반드시 포함할 검증 항목:

1. 문제 검증
2. 고객 검증
3. 지불 의사 검증
4. 기능 우선순위 검증
5. 개인정보/법적 리스크 검증
6. 기술 구현 가능성 검증

출력 형식:

1. Objective
2. Key Results
3. 8-Week Validation Plan
4. Interview Plan
5. Prototype Test Plan
6. Landing Page Test Plan
7. Success Criteria
8. Kill Criteria
9. Pivot Options

---

## 5.12 Business Brief

마지막으로 전체 리서치를 기반으로 Business Brief를 작성한다.

Business Brief는 팀원, 멘토, 심사위원, 투자자에게 설명 가능한 1~2페이지 요약본으로 만든다.

포함 항목:

1. Service Name
2. One-line Summary
3. Problem
4. Why Now
5. Target Customer
6. Current Alternatives
7. Solution
8. MVP
9. Technology
10. Business Model
11. Market Opportunity
12. Competitive Advantage
13. Risks
14. Validation Plan
15. Next Step

출력 형식:

- Executive Summary
- Problem & Opportunity
- Solution
- Target Customer
- MVP
- Business Model
- Market Size
- Risks & Guardrails
- Next 8 Weeks

---

# 6. 최종 리서치 출력 방식

최종 결과는 아래 구조로 작성한다.

## Part 1. Executive Summary

- HireSift의 핵심 결론
- 가장 중요한 시장 기회
- 가장 큰 리스크
- 3개월 MVP 가능성 판단

## Part 2. Detailed Research

0. Naming / Service Thesis
1. Problem Definition
2. 2C Analysis
3. Customer Persona / JTBD
4. Existing Alternatives & Gap
5. Value Proposition / Positioning
6. TAM / SAM / SOM
7. Revenue Model Benchmark
8. MVP Scope & User Flow
9. Data Structure / AI Architecture
10. Business Model Canvas
11. OKR / Validation Plan
12. Business Brief

## Part 3. Final Recommendation

1. HireSift를 진행할 만한가?
2. 가장 먼저 검증해야 할 가설은 무엇인가?
3. 3개월 MVP에서 반드시 넣을 기능 3개는 무엇인가?
4. 당장 제외해야 할 기능은 무엇인가?
5. 첫 2주 실행 계획은 무엇인가?
6. 추가 리서치가 필요한 부분은 무엇인가?

---

# 7. 평가 기준

각 섹션은 다음 기준으로 평가한다.

1. 근거 자료의 신뢰성
2. 최근성
3. 문제의 심각도
4. 고객의 지불 가능성
5. MVP 구현 가능성
6. AI/CV/Physical AI 적합도
7. 개인정보·법적 리스크 관리 가능성
8. 차별화 가능성
9. 사업 확장성
10. 팀 프로젝트 발표 적합성
11. 데이터 신뢰도
12. 수익 모델 현실성

---

# 8. 주의사항

1. 근거 없는 낙관론을 피한다.
2. HR Tech 전체 시장 규모만으로 시장성을 과장하지 않는다.
3. 후보자를 범죄자처럼 단정하는 표현을 피한다.
4. 거짓말 탐지, 감정 분석, 성격 분석 방향으로 가지 않는다.
5. 자동 탈락 시스템으로 설계하지 않는다.
6. 모든 판단은 Human-in-the-loop 구조로 설계한다.
7. 개인정보 수집은 최소화하고 마스킹·동의·보관 기간을 명확히 한다.
8. MVP는 3개월 안에 구현 가능한 범위로 제한한다.
9. 초기 고객은 “원격 개발자·디자이너·프리랜서를 채용하는 스타트업 / 외주사 / 리크루팅 에이전시”로 제한한다.
10. 최종 문서는 팀원과 FigJam, 발표자료, 사업기획서로 전환 가능하게 구조화한다.
11. 공개 자료가 부족한 수치는 추정하지 말고 “공개 자료 없음” 또는 “가정 기반 추정”으로 표시한다.
12. 모든 시장 계산에는 계산식과 가정을 함께 적는다.