# HireSift Design.md

> **Document Type:** Visual Design Guide / UI Design System Prompt  
> **Project:** HireSift — AI-powered Remote Hiring Trust Layer  
> **Palette Decision:** A안 — Trust SaaS  
> **Version:** v1.0  
> **Last Updated:** 2026.05.21 KST

---

## 0. Document Purpose

이 문서는 HireSift 웹앱의 **시각 디자인 시스템, UI 톤앤매너, 컬러, 타이포그래피, 컴포넌트, 상태 표현, 리포트 스타일**을 정의한다.

이 문서는 제품 기능 구조를 정의하는 `Product_Blueprint.md`가 아니다.  
이 문서는 개발자, 디자이너, AI 코딩 에이전트, 프론트엔드 구현자가 HireSift 웹앱의 시각적 일관성을 유지하기 위해 사용하는 **Design.md**다.

HireSift는 원격 채용 과정에서 후보자의 신원, 포트폴리오, 인터뷰 신호를 정제해 **Candidate Trust Report**를 생성하는 Human-in-the-loop 기반 검수 보조 서비스다.

따라서 디자인은 다음 인상을 주어야 한다.

- 신뢰 가능함
- 차분함
- 과장되지 않음
- B2B SaaS답게 정돈됨
- 보안/검수/리포트 도구처럼 전문적임
- 후보자를 위협하거나 단정하지 않음

---

## 1. Design Thesis

HireSift의 디자인은 후보자를 판정하거나 위협하는 느낌이 아니라, 채용팀이 복잡한 신호를 차분하게 검토할 수 있도록 돕는 **신뢰 중심의 B2B SaaS UI**를 지향한다.

```txt
Clean. Trustworthy. Calm. Structured. Human-reviewed.
```

HireSift는 AI 탐지기처럼 보이면 안 된다.  
HireSift는 채용팀이 **추가 확인이 필요한 신호를 이해하고 검토할 수 있도록 돕는 신뢰 레이어**처럼 보여야 한다.

---

## 2. Brand Personality

| Attribute | Direction |
|---|---|
| Core Feeling | Trust, clarity, control |
| Visual Tone | Clean, quiet, professional |
| Product Category Feel | B2B SaaS, HR Tech, Trust & Verification Tool |
| Avoided Feeling | Flashy AI, surveillance, fraud hunting, lie detection |
| Emotional Tone | Calm confidence, not fear |
| User Mindset | “I can review this safely and clearly.” |

### 2.1 Keywords

```txt
Trustworthy
Clean
Calm
Structured
Evidence-based
Human-reviewed
Non-judgmental
Professional
Secure
```

### 2.2 Anti-Keywords

```txt
Flashy
Aggressive
Police-like
Surveillance-heavy
Neon AI
Gaming UI
Fear-based
Over-warning
Fraud-hunting
Lie-detection
```

---

## 3. Color System

HireSift는 컬러풀한 UI를 사용하지 않는다.  
컬러는 최대한 절제하고, **Primary 1개 + Accent 1개 + Attention 1개 + Neutral Scale**로 구성한다.

### 3.1 Selected Palette — A안 Trust SaaS

| Token | Name | HEX | Usage |
|---|---|---:|---|
| `color.primary` | Primary Navy | `#172033` | Header, sidebar, primary button, brand anchor |
| `color.accent` | Muted Teal | `#2F7D7E` | Positive/complete signal, verified state, subtle accent |
| `color.attention` | Soft Amber | `#C6923A` | Review needed, attention, warning without alarm |
| `color.background` | Neutral Background | `#F7F8FA` | Page background |
| `color.text` | Main Text | `#111827` | Primary text |

### 3.2 Neutral Scale

| Token | HEX | Usage |
|---|---:|---|
| `neutral.0` | `#FFFFFF` | Card, modal, report surface |
| `neutral.50` | `#F7F8FA` | App background |
| `neutral.100` | `#F3F4F6` | Section background, subtle blocks |
| `neutral.200` | `#E5E7EB` | Border, divider |
| `neutral.300` | `#D1D5DB` | Disabled border |
| `neutral.500` | `#6B7280` | Secondary text |
| `neutral.700` | `#374151` | Body text |
| `neutral.900` | `#111827` | Strong text |

### 3.3 Semantic Color Use

| Semantic State | Color | UI Expression |
|---|---|---|
| Stable / Completed | Muted Teal `#2F7D7E` | Badge, check state, progress complete |
| Review Needed | Soft Amber `#C6923A` | Badge, border, icon, attention note |
| Manual Review Required | Navy + Amber Border | Avoid red; use structured emphasis |
| Disabled | Neutral 300/500 | Low contrast, non-active state |
| Primary Action | Primary Navy | Main CTA |
| Secondary Action | White + Navy Border | Secondary CTA |

### 3.4 Red Color Policy

기본 팔레트에서 빨간색은 사용하지 않는다.

Red는 후보자를 범죄자처럼 보이게 하거나 “위험/사기/탈락”의 강한 인상을 줄 수 있다.  
HireSift는 채용 공정성 및 Human-in-the-loop 원칙을 지키기 위해, 위험 상태를 빨간색으로 단정하지 않는다.

```txt
Do not use red for candidate status.
Use Soft Amber for “Needs Review” or “Additional Check Recommended”.
```

---

## 4. Typography

HireSift는 명확한 정보 전달이 중요한 리포트형 SaaS다.  
타이포그래피는 장식성보다 가독성, 계층 구조, 전문성을 우선한다.

### 4.1 Font Direction

| Environment | Recommended Font |
|---|---|
| Web App English UI | Inter, IBM Plex Sans, system-ui |
| Korean UI | Pretendard, Noto Sans KR, system-ui |
| Report PDF | Pretendard, Noto Sans KR, Inter |
| Code / Metadata | JetBrains Mono, IBM Plex Mono |

### 4.2 Type Scale

| Token | Size | Weight | Usage |
|---|---:|---:|---|
| `text.display` | 40–48px | 700 | Landing hero title |
| `text.h1` | 30–36px | 700 | Page title |
| `text.h2` | 24–28px | 650 | Section heading |
| `text.h3` | 18–22px | 600 | Card heading |
| `text.body` | 15–16px | 400 | Main body |
| `text.caption` | 12–13px | 400 | Metadata, helper text |
| `text.badge` | 12–13px | 600 | Status badge |

### 4.3 Typography Rules

- 헤딩은 짧고 명확하게 작성한다.
- 리포트 문장은 판단형이 아니라 검토 보조형으로 작성한다.
- 상태 텍스트는 강한 단정어를 피한다.
- 긴 문단보다 카드, 표, 리스트를 우선한다.
- 숫자, 날짜, 상태는 시각적으로 쉽게 스캔 가능해야 한다.

---

## 5. Layout System

HireSift UI는 여백이 충분하고, 정보 계층이 명확한 대시보드형 구조를 따른다.

### 5.1 Layout Principle

```txt
Structured cards, clear sections, minimal color, strong hierarchy.
```

### 5.2 Page Structure

| Area | Usage |
|---|---|
| Sidebar | Main navigation, organization context |
| Top Bar | Page title, search, user menu |
| Main Content | Candidate list, dashboard, report |
| Right Panel | Details, reviewer note, action panel |
| Modal | Confirmation, request creation, consent preview |

### 5.3 Spacing

| Token | Size | Usage |
|---|---:|---|
| `space.4` | 4px | Tight inline gap |
| `space.8` | 8px | Badge/icon gap |
| `space.12` | 12px | Small component padding |
| `space.16` | 16px | Card inner padding minimum |
| `space.24` | 24px | Section gap |
| `space.32` | 32px | Page section gap |
| `space.48` | 48px | Major page blocks |

### 5.4 Border Radius

| Token | Size | Usage |
|---|---:|---|
| `radius.sm` | 6px | Small badges, input controls |
| `radius.md` | 10px | Buttons, form fields |
| `radius.lg` | 16px | Cards |
| `radius.xl` | 24px | Large panels, report blocks |

---

## 6. Component Style

### 6.1 Buttons

#### Primary Button

- Background: Primary Navy `#172033`
- Text: White `#FFFFFF`
- Radius: 10–12px
- Usage: Generate Report, Create Verification Request, Send Invite

```txt
Use primary button only for the main action on a page.
```

#### Secondary Button

- Background: White
- Border: Neutral 200 or Navy
- Text: Primary Navy
- Usage: Add Note, Preview, Cancel, Export Draft

#### Attention Button

- Background: White or Soft Amber tint
- Border: Soft Amber
- Text: Text/Navy
- Usage: Request Re-verification, Request Additional Document

Avoid aggressive CTA labels.

| Avoid | Use Instead |
|---|---|
| Reject Candidate | Mark for Manual Review |
| Flag as Fraud | Add Review Note |
| Detect Fake | Review Consistency |
| Block Candidate | Request Additional Check |

---

### 6.2 Cards

Cards are the primary layout unit.

| Property | Value |
|---|---|
| Background | White |
| Border | `#E5E7EB` |
| Radius | 16–24px |
| Shadow | Very subtle, optional |
| Padding | 20–28px |

Card titles should be short and functional.

Examples:

```txt
Identity Consistency
Portfolio Provenance
Interview Session Integrity
Review Signals
Recommended Action
```

---

### 6.3 Badges

Badges should communicate review status without judgment.

| Badge | Color Direction | Meaning |
|---|---|---|
| Low Attention | Teal outline or soft teal fill | No strong additional signal |
| Review Recommended | Amber outline or soft amber fill | Additional check recommended |
| Manual Review Required | Navy text + Amber border | Human review required |
| Submitted | Neutral or Teal | Candidate submitted materials |
| In Review | Amber | Reviewer is checking |
| Report Ready | Navy or Teal | Final report generated |

Do not use:

```txt
Fraud
Fake
Suspicious
Liar
Rejected by AI
Deepfake Detected
```

---

### 6.4 Tables

Tables should be clean and report-like.

- Use soft borders.
- Avoid heavy grid lines.
- Use neutral background for header rows.
- Use status badges inside cells.
- Keep row height comfortable.

Common tables:

```txt
Candidate List
Verification Status Table
Risk Signal Table
Portfolio Link Table
Reviewer Action Log
```

---

### 6.5 Forms

Forms must feel safe and transparent.

Rules:

- Every sensitive input must include helper text.
- Consent must be explicit.
- Do not ask for unnecessary information.
- Explain why a file or media sample is requested.
- Use upload progress and confirmation states.

Example helper copy:

```txt
Please upload a masked document. Do not upload full ID numbers or unnecessary personal details.
```

---

## 7. Dashboard UI Direction

The dashboard should help hiring teams quickly understand candidate verification status.

### 7.1 Candidate List

Candidate List should show:

- Candidate name or anonymized candidate code
- Role
- Submission status
- Review status
- Attention level
- Last updated
- Report status

Suggested columns:

```txt
Candidate | Role | Submission | Identity | Portfolio | Session | Attention | Report
```

### 7.2 Reviewer Dashboard

Reviewer Dashboard should be organized into sections.

```txt
1. Candidate Overview
2. Submission Status
3. Identity Consistency
4. Portfolio Provenance
5. Media Sample Quality
6. Review Signals
7. Reviewer Notes
8. Recommended Action
9. Generate Report
```

### 7.3 Dashboard Feel

- Calm and evidence-based.
- No dramatic warning screens.
- No large red alert banners.
- Use cards, badges, and short explanatory text.
- Important actions should require reviewer confirmation.

---

## 8. Candidate Submission UI

Candidate-facing UI must feel transparent and non-threatening.

### 8.1 Candidate Page Principles

- Explain why verification is requested.
- Explain what will be collected.
- Explain what will not happen.
- Make consent clear.
- Avoid legal intimidation language.
- Avoid implying the candidate is suspected.

### 8.2 Candidate Flow Visual Tone

Candidate submission should feel like a secure onboarding process, not an investigation.

Suggested sections:

```txt
Welcome
Consent
Basic Information
Portfolio Links
Masked Document Upload
Selfie Video Sample
Voice Sample
Submit Complete
```

### 8.3 Candidate Copy Example

```txt
HireSift helps the hiring team review identity and portfolio consistency in remote hiring.
This process does not automatically determine your hiring result.
Your submitted information is used only for verification review and will be handled according to the stated retention policy.
```

---

## 9. Candidate Trust Report Style

Candidate Trust Report is the core product output.  
It should look like a professional review document, not a surveillance report.

### 9.1 Report Design Principles

- Report-like, printable, shareable.
- Clear hierarchy.
- No emotional language.
- No fraud accusation.
- Human review notice visible.
- Recommended action must be neutral.

### 9.2 Report Sections

```txt
1. Candidate Overview
2. Verification Summary
3. Identity Consistency
4. Portfolio Provenance
5. Interview Session Integrity
6. Review Signals
7. Reviewer Notes
8. Recommended Action
9. Guardrail Notice
```

### 9.3 Report Visual Elements

| Element | Style |
|---|---|
| Header | Navy title bar or clean white report header |
| Section Cards | White surface, light border |
| Status Badges | Teal / Amber / Navy only |
| Evidence Items | Table or compact list |
| Recommended Action | Highlighted card with Navy heading |
| Guardrail Notice | Small but visible neutral box |

### 9.4 Guardrail Notice Text

```txt
This report does not determine hiring eligibility.
It only summarizes review signals for human decision-makers.
Final hiring decisions must be made by the hiring team through a fair and compliant process.
```

Korean version:

```txt
이 리포트는 후보자의 합격 또는 불합격을 자동 결정하지 않습니다.
본 리포트는 채용 담당자가 검토할 수 있는 일관성 신호를 요약한 참고 자료입니다.
최종 채용 판단은 공정한 절차에 따라 사람이 수행해야 합니다.
```

---

## 10. Status & Risk Signal UI

HireSift should not use “risk” language as the main UI language.  
Use “attention” and “review” language.

### 10.1 Recommended Status Language

| Bad | Good |
|---|---|
| High Risk | High Attention |
| Suspicious | Review Recommended |
| Fraud Detected | Additional Check Needed |
| Fake Candidate | Identity Consistency Needs Review |
| Reject | Manual Review Required |

### 10.2 Attention Levels

| Level | Visual Style | Meaning |
|---|---|---|
| Low Attention | Teal badge | Basic consistency appears sufficient |
| Medium Attention | Amber badge | Some items require additional check |
| High Attention | Amber border + Navy text | Human review strongly recommended |

### 10.3 Recommended Actions

Use these action labels:

```txt
No additional check needed
Request short re-verification call
Request portfolio walkthrough
Request additional document
Manual review required
```

Do not use:

```txt
Reject
Ban
Fraud
Fake
Block
AI Failed
```

---

## 11. Icon / Illustration Rules

HireSift should use minimal line icons.

### 11.1 Icon Style

| Attribute | Direction |
|---|---|
| Style | Thin line, rounded stroke |
| Color | Navy / Slate / Teal / Amber |
| Mood | Functional, not playful |
| Avoid | Cartoon, mascot, police/shield-heavy imagery |

### 11.2 Suitable Icons

```txt
File check
User check
Link
Clock
Shield check
Document search
Eye-off / privacy
Checklist
Report
```

### 11.3 Avoid Icons

```txt
Police badge
Fingerprint as main brand motif
Red alert siren
Target/crosshair
Skull
Bug/criminal icon
Angry warning triangle
```

---

## 12. Copy Tone

HireSift copy must be calm, clear, and non-accusatory.

### 12.1 Voice

```txt
Professional
Neutral
Transparent
Evidence-based
Human-centered
```

### 12.2 Copy Rules

- Say “review” instead of “detect”.
- Say “attention” instead of “risk” when possible.
- Say “additional check” instead of “suspicion”.
- Say “consistency signal” instead of “proof of fraud”.
- Avoid fear-based claims.

### 12.3 Example Copy

Good:

```txt
Some portfolio signals may need additional review.
```

Bad:

```txt
This candidate is likely fake.
```

Good:

```txt
A short re-verification call is recommended before final review.
```

Bad:

```txt
Reject this candidate immediately.
```

---

## 13. Accessibility & Readability

HireSift must prioritize readability and accessibility.

### 13.1 Requirements

- Maintain sufficient text contrast.
- Do not communicate status by color alone.
- Every badge should include text label.
- Tables should be readable at small sizes.
- Report PDF should be printable in grayscale.
- Interactive elements should have clear focus states.

### 13.2 Color Accessibility Rule

Never rely only on teal or amber to communicate status.  
Always pair color with text.

Example:

```txt
Amber badge + “Review Recommended” label
```

---

## 14. Page-Level Design Direction

### 14.1 Landing Page

Purpose: Explain the service without sounding threatening.

Recommended hero structure:

```txt
Headline:
Remote hiring needs a trust layer.

Subheadline:
HireSift helps teams review identity, portfolio, and interview consistency before making hiring decisions.

CTA:
Create Verification Request
View Sample Report
```

Visual direction:

- White/neutral background
- Navy heading
- Subtle teal accent
- No dramatic AI imagery
- Show report preview or dashboard card

---

### 14.2 Admin Dashboard

Purpose: Manage candidate verification requests.

Visual direction:

- Navy sidebar
- White content cards
- Neutral table
- Teal and Amber badges only
- Strong scannability

---

### 14.3 Candidate Submission Page

Purpose: Candidate submits data with informed consent.

Visual direction:

- Minimal, safe, transparent
- Stepper UI
- Clear consent notice
- No suspicion language
- Upload cards with helper text

---

### 14.4 Reviewer Dashboard

Purpose: Reviewer checks submitted signals.

Visual direction:

- Evidence-based card layout
- Each signal has explanation
- Reviewer note area prominent
- Recommended Action selection visible

---

### 14.5 Candidate Trust Report Page

Purpose: Present a clean review summary.

Visual direction:

- Report-like layout
- Printable page style
- Guardrail notice at bottom
- Recommended Action highlighted
- No automatic decision UI

---

## 15. Do / Don’t

### 15.1 Do

```txt
Use Navy as the core trust color.
Use Teal for complete/verified/stable states.
Use Amber for additional review states.
Keep UI calm and spacious.
Use cards and structured tables.
Use “Attention” language.
Show guardrail notices clearly.
Make human review visible.
```

### 15.2 Don’t

```txt
Do not use colorful AI gradients.
Do not use red as the main warning color.
Do not use lie detector or fraud hunter language.
Do not design automatic rejection UI.
Do not make candidates look criminal.
Do not overuse biometric visuals.
Do not use playful gamified scoring.
Do not hide privacy notices.
```

---

## 16. Tailwind Token Recommendation

Use these tokens when implementing with Tailwind CSS.

```js
const hireSiftTheme = {
  colors: {
    primary: '#172033',
    accent: '#2F7D7E',
    attention: '#C6923A',
    background: '#F7F8FA',
    text: '#111827',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    muted: '#6B7280',
    slate: '#374151'
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px'
  },
  fontFamily: {
    sans: ['Pretendard', 'Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace']
  }
}
```

### 16.1 Tailwind Usage Examples

```txt
Page background: bg-[#F7F8FA]
Primary button: bg-[#172033] text-white rounded-xl
Card: bg-white border border-[#E5E7EB] rounded-2xl
Teal badge: bg-[#2F7D7E]/10 text-[#2F7D7E]
Amber badge: bg-[#C6923A]/10 text-[#8A6422]
Main text: text-[#111827]
Secondary text: text-[#6B7280]
```

---

## 17. Universal UI Generation Prompt

Use the following prompt when asking an AI coding/design tool to generate HireSift UI.

```md
You are designing the UI for HireSift, an AI-powered Remote Hiring Trust Layer.

HireSift helps hiring teams review identity, portfolio, and interview consistency in remote hiring. It generates a Candidate Trust Report for human reviewers. The product is not a lie detector, not an automatic fraud detector, and not an automatic rejection system.

Design direction:
- Clean, trustworthy, calm, professional B2B SaaS UI.
- Use minimal color. Do not create a colorful AI-style interface.
- Use the selected Trust SaaS palette:
  - Primary Navy: #172033
  - Muted Teal: #2F7D7E
  - Soft Amber: #C6923A
  - Neutral Background: #F7F8FA
  - Main Text: #111827
- Use white cards, subtle borders, generous spacing, clear hierarchy.
- Use Teal for completed/stable states.
- Use Amber for review-needed states.
- Avoid red warnings unless absolutely necessary.
- Use “Attention” and “Review” language instead of “Fraud”, “Fake”, or “Suspicious”.
- Make Human-in-the-loop visible.
- Include guardrail language where relevant: “This report does not determine hiring eligibility. It only summarizes review signals for human decision-makers.”

Recommended UI pages:
1. Landing / Service Brief
2. Admin Dashboard
3. Candidate List
4. Create Verification Request
5. Candidate Consent Page
6. Candidate Submission Page
7. Reviewer Dashboard
8. Candidate Trust Report Page
9. PDF Export View

Component style:
- Navy sidebar or top navigation.
- White cards with #E5E7EB borders.
- Rounded corners: 16px to 24px.
- Primary CTA in Navy.
- Secondary actions as outlined buttons.
- Status badges in Teal or Amber.
- Tables should be clean and report-like.
- Candidate Trust Report should feel printable, structured, and professional.

Do not design:
- Lie detector UI
- Police/fraud hunter UI
- Red alert dashboard
- Candidate scoring game UI
- Automatic rejection controls
- Emotion or personality analysis UI
```

---

## 18. Implementation Checklist

Before implementing a HireSift screen, check the following.

```txt
[ ] Does this screen feel trustworthy and calm?
[ ] Are we using no more than the selected core colors?
[ ] Are we avoiding red/fraud/fake language?
[ ] Is the human reviewer role visible?
[ ] Are statuses expressed as Attention/Review signals?
[ ] Are privacy notices clear?
[ ] Are sensitive data requests explained?
[ ] Are cards, tables, and reports readable?
[ ] Does the UI avoid automatic rejection patterns?
[ ] Can this screen be understood by HR/non-technical users?
```

---

## 19. Summary

HireSift의 시각 디자인은 “AI가 사람을 판정한다”는 인상이 아니라, “사람이 더 안전하고 명확하게 검토할 수 있도록 AI가 신호를 정리한다”는 인상을 주어야 한다.

A안 Trust SaaS 팔레트를 기준으로, HireSift는 Navy 기반의 신뢰감, Teal 기반의 정제/완료감, Amber 기반의 부드러운 검토 필요 상태를 사용한다.

핵심 원칙은 다음과 같다.

```txt
Less color, more trust.
Less judgment, more review.
Less automation, more human oversight.
Less fear, more clarity.
```
