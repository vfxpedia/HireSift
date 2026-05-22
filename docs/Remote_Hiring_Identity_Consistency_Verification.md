[2026.05.21 11:50 KST]

## 모드 판정

**모드 C — AI 학습 주제 + CV/Physical AI 실습 + B2B 사업화 통합형**

결론부터 말하면, 이 주제 선정은 좋다. 다만 그대로 가면 너무 보안/HR/법무 쪽으로 커질 수 있으므로, 우리가 다룰 문제를 더 좁혀야 한다.

---

## 1. 진단

JAY가 고른 주제의 본질은 단순히 **“가짜 지원자를 잡자”**가 아니다.

정확히는 이것이다.

> **AI 시대의 원격 채용에서 “화면 속 사람, 제출한 신분, 포트폴리오, 실제 입사자가 같은 사람인가?”를 검증하는 문제**

이건 최근 AI-native 문제로서 타당하다. Checkr의 2025년 조사에서는 관리자 59%가 채용 과정에서 후보자가 AI를 이용해 자신을 허위로 표현했다고 의심했고, 31%는 가짜 신원 후보자를 인터뷰한 경험이 있으며, 35%는 지원자와 다른 사람이 화상면접에 참여한 사례를 경험했다고 답했다. ([체크르][1])

또 HR Dive는 Gartner 전망을 인용해 2028년까지 전 세계 후보자 프로필 4개 중 1개가 가짜일 수 있다고 보도했다. 핵심 문장은 “후보자의 실제 능력뿐 아니라 신원까지 평가하기 어려워지고 있다”는 것이다. ([HR 다이브][2])

Microsoft도 북한 원격 IT worker 계열 공격에서 AI가 가짜 신원, 사진 보정, 신분 문서 이미지 조작, voice-changing software에 활용되고 있다고 분석했다. Microsoft는 기업이 후보자의 디지털 풋프린트, 연락처, 이력서 일관성, 화상 검증, 신분증 확인 등을 더 엄격히 해야 한다고 권고한다. ([Microsoft][3])

---

## 2. 핵심 변수

### 2.1 우리가 풀 문제

이 주제는 이렇게 정의해야 한다.

> **Remote Hiring Identity Consistency Verification**
> 원격 채용 과정에서 지원자의 신원, 얼굴, 음성, 제출 자료, 포트폴리오, 인터뷰 기록의 일관성을 검증해 채용팀의 리스크를 줄이는 AI 검수 도구.

즉, “이 사람은 사기꾼입니다”라고 판정하는 서비스가 아니라,

> **“이 후보자에 대해 추가 확인이 필요한 위험 신호가 있습니다”**
> 를 알려주는 **검수 보조 / triage tool**로 가야 한다.

이 차이가 중요하다.

---

## 3. 하면 안 되는 방향

### 3.1 거짓말 탐지기 방향은 피해야 한다

화상면접에서 표정, 눈동자, 머리 움직임으로 “거짓말 여부”를 판정하는 방향은 위험하다. 채용 공정성, 차별, 편향, 개인정보 이슈가 너무 크다.

우리가 다룰 것은 **심리 판독**이 아니라 **동일인성·자료 일관성·프로세스 무결성 검증**이어야 한다.

### 3.2 “북한 IT worker 탐지기”로 포지셔닝하면 안 된다

근거 사례로는 쓸 수 있지만, 제품명을 그렇게 잡으면 정치·안보·오탐 리스크가 커진다.

제품 포지션은 이렇게 잡는 게 안전하다.

> **AI-powered Remote Hiring Trust Layer**

### 3.3 완전 자동 탈락 시스템은 안 된다

AI가 후보자를 자동으로 떨어뜨리면 법적·윤리적 리스크가 커진다.
초기 MVP는 반드시 **human-in-the-loop** 구조로 가야 한다.

---

## 4. 전략 제안

### 4.1 제품의 핵심 가설

> 원격 채용이 늘고 AI 도구가 고도화될수록, 기업은 “좋은 사람을 찾는 문제”보다 먼저 “화면 속 사람이 진짜 지원자인지 확인하는 문제”를 겪게 된다.

이 가설은 좋다. 특히 B2B SaaS로 설명하기 쉽다.

기업 입장에서 손실은 명확하다.

* 잘못된 채용 비용
* 내부 정보 접근 위험
* 외주/프리랜서 사칭 위험
* 기술 과제 대리 수행
* 포트폴리오 조작
* 입사 후 동일인성 불확실성
* 보안 사고 가능성

---

## 5. MVP 범위 제안

처음부터 “채용 전체 보안 플랫폼”으로 가면 너무 크다.
3개월 MVP는 아래 3단계만 잡는 게 좋다.

### 5.1 면접 전 검증

지원자가 업로드하는 자료:

* 이력서
* 포트폴리오 링크
* 신분증 또는 학생증/자격증 일부 마스킹 이미지
* 셀피 영상 5~10초
* 본인 확인용 짧은 음성 문장

AI 검증:

* 이력서 이름 / 이메일 / 포트폴리오 계정명 일관성
* 프로필 사진과 셀피 얼굴 유사도
* 포트폴리오 생성 시점·계정 활동 흔적
* GitHub / LinkedIn / Behance 등 공개 디지털 풋프린트 존재 여부
* 신분증 이미지의 조작 의심 신호

### 5.2 면접 중 검증

화상면접에서 할 수 있는 것:

* 랜덤 문장 읽기
* 고개 좌우 움직임
* 손으로 신분증 일부 가리고 보여주기
* 특정 숫자나 단어를 말하게 하기
* 화면 속 얼굴과 사전 등록 셀피 비교

여기서 중요한 건 “deepfake 탐지”보다 **라이브니스 + 동일인성 확인**이다.

### 5.3 면접 후 리포트

채용 담당자에게 최종적으로 보여줄 것은 판정문이 아니라 리스크 리포트다.

예:

```md
Candidate Trust Report

1. Identity Consistency: Medium Risk
2. Face Match: Pass
3. Voice Consistency: Not enough data
4. Portfolio Provenance: Needs review
5. Interview Session Integrity: Pass
6. Red Flags:
   - Portfolio account created recently
   - GitHub activity does not match claimed experience
   - Interview video quality too low for reliable liveness check
7. Recommended Action:
   - Request one additional live verification session
   - Ask candidate to explain one portfolio project in detail
```

---

## 6. 기술 구조

### 6.1 CV / Physical AI 연결 지점

이 주제는 Physical AI와 연결되긴 하지만, 로봇보다는 **사람-카메라-현실 행동 검증**에 가깝다.

즉:

> Physical AI = 카메라를 통해 현실의 사람, 행동, 신분 문서, 공간 단서를 인식하고 검증하는 시스템

초기 기능은 아래가 적합하다.

| 기능        | 기술                                             |
| --------- | ---------------------------------------------- |
| 얼굴 동일성 비교 | Face embedding / face verification             |
| 라이브니스 체크  | Head pose, blink, random action                |
| 문서 OCR    | OCR + layout check                             |
| 영상 프레임 분석 | keyframe extraction                            |
| 음성 일관성    | speaker verification, voice feature comparison |
| 포트폴리오 검증  | RAG + web metadata + 계정 활동 분석                  |
| 리포트 생성    | LLM summary                                    |

---

## 7. 비즈니스 모델

### 7.1 초기 고객

가장 현실적인 타깃은 대기업 HR이 아니다. 초기에는 더 좁혀야 한다.

1순위:

> **원격 개발자·디자이너·프리랜서를 채용하는 스타트업 / 외주사 / 리크루팅 에이전시**

이들은 보안팀은 약하지만 채용 실패 비용은 크다.

2순위:

> **부트캠프 / 교육기관 / 온라인 평가 플랫폼**

과제 대리 수행, 포트폴리오 진위, 화상 평가 동일인성 문제가 있다.

3순위:

> **글로벌 프리랜서 매칭 플랫폼 / 아웃소싱 회사**

시장성은 크지만 초기 진입 장벽이 높다.

### 7.2 수익 모델

초기에는 SaaS보다 **검증 리포트 단위 과금**이 현실적이다.

예상 모델:

* 후보자 1명 검증 리포트당 과금
* 월 30명/100명/300명 검증 패키지
* 리크루팅 에이전시용 대시보드
* ATS 연동은 후순위

---

## 8. 리스크

### 8.1 개인정보 리스크

얼굴, 음성, 신분증은 민감정보에 가깝다.
따라서 MVP부터 원칙을 세워야 한다.

* 지원자 동의 필수
* 신분증 전체 저장 금지
* 필요한 부분만 마스킹 업로드
* 원본 영상 장기 저장 금지
* 결과는 “위험 신호”로만 표시
* 자동 탈락 금지

### 8.2 오탐 리스크

AI가 잘못 판단하면 좋은 후보자를 의심하게 만들 수 있다.
그래서 표현은 반드시 이렇게 해야 한다.

안 좋은 표현:

> “이 후보자는 가짜입니다.”

좋은 표현:

> “추가 확인이 필요한 일관성 부족 신호가 있습니다.”

### 8.3 시장 진입 리스크

HR 시장은 신뢰가 중요하다.
처음부터 “보안 SaaS”처럼 팔기보다, **채용 검수 리포트 자동화 도구**로 낮게 진입하는 게 좋다.

---

## 9. JAY와의 적합도

이 주제는 JAY에게 꽤 맞다.

### 강점

* CV / 영상 분석과 연결된다.
* VFX 경험이 “시각적 진위 판단”으로 전환될 수 있다.
* AI 시대 신뢰 인프라라는 큰 흐름에 올라탄다.
* B2B 문제라 수익화 설명이 쉽다.
* 인공지능사관학교 프로젝트 주제로도 설득력이 있다.

### 약점

* HR 법무·개인정보 이슈가 복잡하다.
* Physical AI 색깔은 “로봇”보다 약하다.
* 딥페이크 탐지 정확도만으로 승부하면 대기업/보안기업과 경쟁하게 된다.
* 국내 시장에서는 아직 문제 인식이 글로벌보다 약할 수 있다.

---

## 10. 지금 단계에서의 핵심 질문

우리가 리서치 전에 정해야 할 것은 하나다.

> **이 서비스를 누구의 어떤 순간에 끼워 넣을 것인가?**

나는 1차 범위를 이렇게 추천한다.

```md
서비스 가설:
원격 채용을 진행하는 스타트업·리크루팅 에이전시가
화상면접 전후에 후보자의 신원, 포트폴리오, 인터뷰 동일인성을 검수할 수 있도록
AI 기반 Candidate Trust Report를 생성해주는 B2B 검증 도구.
```

---

## 11. 지금 당장 할 것 5개

1. 문제명을 확정한다.
   추천: **AI Remote Hiring Trust / Candidate Trust Layer / HireProof AI**

2. 고객을 좁힌다.
   추천: **원격 개발자·디자이너를 채용하는 스타트업과 리크루팅 에이전시**

3. MVP 기능을 3개만 고른다.
   추천: **얼굴 동일성, 포트폴리오 provenance, 인터뷰 리스크 리포트**

4. 법적 표현을 정한다.
   “가짜 판별”이 아니라 **“추가 검증 필요 신호 탐지”**로 간다.

5. 다음 리서치 범위를 정한다.
   “가짜 지원자 전체”가 아니라 **remote hiring identity fraud + AI candidate deception + video interview verification**으로 좁힌다.

---

## 12. 다음 선택지

내 판단으로는 이 주제는 진행할 만하다.
다만 사업 기획의 첫 문장은 이렇게 바꾸는 게 좋다.

> **AI로 인해 원격 채용에서 지원자의 신원·실력·포트폴리오를 신뢰하기 어려워진 문제를 해결하기 위해, 채용 전·중·후 동일인성과 자료 일관성을 검증하는 AI Candidate Trust Report 서비스를 만든다.**

다음 단계에서는 이 문장을 기준으로 **문제정의 → 고객 페르소나 → 기존 대안 → MVP 기능 → 데이터 구조 → 비즈니스 모델 캔버스** 순서로 좁히면 된다.

[1]: https://checkr.com/resources/articles/hiring-hoax-manager-survey-2025 "The Hiring Hoax: What 3,000 Managers Revealed about Hiring Fraud in 2025 | Checkr"
[2]: https://www.hrdive.com/news/fake-job-candidates-ai/757126/ "By 2028, 1 in 4 candidate profiles will be fake, Gartner predicts | HR Dive"
[3]: https://www.microsoft.com/en-us/security/blog/2025/06/30/jasper-sleet-north-korean-remote-it-workers-evolving-tactics-to-infiltrate-organizations/ "Jasper Sleet: North Korean remote IT workers’ evolving tactics to infiltrate organizations | Microsoft Security Blog"
