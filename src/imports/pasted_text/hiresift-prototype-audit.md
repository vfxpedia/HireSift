# HireSift MVP Prototype Functional Audit & Refinement Prompt

You are refining the current Figma Make prototype for **HireSift**.

Do not redesign the entire product from scratch.  
Use the current prototype as the base and improve it functionally.

Your task has three goals:

1. Audit what is currently missing or not working.
2. Compare the current prototype against the original HireSift MVP requirements.
3. Improve the prototype by making the core workflow more functional and adding EN/KR language switching.

---

## 1. Source of Truth

Use the following project context as the source of truth:

- HireSift is an AI-powered Remote Hiring Trust Layer.
- It helps hiring teams review candidate identity, portfolio, and interview consistency signals in remote hiring.
- It generates a visual Candidate Trust Report for human reviewers.
- It is not a lie detector.
- It is not an automatic fraud detector.
- It must not automatically reject candidates.
- It must use Human-in-the-loop review.
- It must minimize personal data collection and use masked document concepts.

Use the existing prototype layout and visual style as much as possible.

Use the Trust SaaS palette:

- Primary Navy: `#172033`
- Muted Teal: `#2F7D7E`
- Soft Amber: `#C6923A`
- Neutral Background: `#F7F8FA`
- Text: `#111827`

Avoid:
- Neon AI gradients
- Overly colorful UI
- Red-heavy warning states
- Fraud/fake/reject language
- Candidate scoring that looks like an automatic judgment

---

## 2. First: Audit the Current Prototype

Before modifying the prototype, inspect the current pages and interactions.

Create an audit checklist inside the design file or as a visible notes section.

Check whether the following items exist and function properly:

### A. Navigation / Global Structure

- Landing page links work
- Login / Admin entry works
- Admin dashboard navigation works
- Candidate flow navigation works
- Reviewer flow navigation works
- Report flow navigation works
- Settings / compliance pages are reachable
- Back / Next buttons work consistently
- Primary CTAs move users to the correct next step

### B. Admin / Hiring Team Flow

Check whether these screens exist and connect correctly:

1. Admin Dashboard
2. Candidate List
3. Create Verification Request
4. Verification Request Detail
5. Send Candidate Verification Link

Functional requirements:

- “Create Verification Request” should open a request form.
- The request form should include candidate name/code, role, email, verification type, and due date.
- “Send Link” should move to a confirmation state.
- Candidate status should update visually, such as:
  - Draft
  - Link Sent
  - Submitted
  - In Review
  - Report Ready

### C. Candidate Flow

Check whether these screens exist and connect correctly:

1. Candidate Welcome Page
2. Consent & Privacy Notice
3. Candidate Basic Information
4. Portfolio Link Submission
5. Masked ID / Certificate Upload
6. Selfie Video Submission
7. Voice Sample Submission
8. Submission Review
9. Submission Complete

Functional requirements:

- Candidate should move through the process step by step.
- Progress indicator should be visible.
- Consent must appear before data submission.
- Candidate should understand what data is collected and why.
- Upload and recording areas can be simulated but should look functional.
- Submission Review should summarize all submitted items.
- Submission Complete should clearly confirm the process is finished.

### D. Reviewer Flow

Check whether these screens exist and connect correctly:

1. Reviewer Dashboard
2. Candidate Review Detail
3. Identity Consistency Review
4. Portfolio Provenance Review
5. Interview Session Integrity Review
6. Attention Signal Summary
7. Reviewer Notes
8. Recommended Action Selection

Functional requirements:

- Reviewer should be able to inspect submitted signals.
- Reviewer should be able to add notes.
- Reviewer should be able to select a recommended action.
- Reviewer should be able to generate a Candidate Trust Report.
- The system should clearly show that AI only organizes signals and the human reviewer confirms the report.

### E. Candidate Trust Report

Check whether the report is visual and structured, not text-only.

The report must include:

1. Report Header
2. Candidate Overview
3. Identity Consistency
4. Portfolio Provenance
5. Interview Session Integrity
6. Media Sample Quality
7. Review Signal Matrix
8. Evidence Cards
9. Recommended Action
10. Guardrail Notice
11. Export PDF Preview
12. Share Report / Client Viewer Page

Functional requirements:

- Report should use cards, badges, visual matrix, evidence cards, and timeline-style sections.
- Do not use numeric candidate scores such as 87/100.
- Use Attention language:
  - Low Attention
  - Medium Attention
  - High Attention
  - Review Recommended
  - Manual Review Required
- Do not use:
  - Fraud Detected
  - Fake Candidate
  - Lie Detected
  - Reject Candidate

### F. Compliance / Settings

Check whether these pages or sections exist:

1. Organization Settings
2. Data Retention Settings
3. Consent Template Settings
4. Audit Log Page

Functional requirements:

- Settings should show data retention period.
- Consent template should be editable or visually represented.
- Audit log should show reviewer actions.
- Privacy and compliance guardrails should be visible.

---

## 3. Then: Fix Missing or Non-working Functional Areas

After auditing, update the prototype.

Do not remove existing good screens.  
Improve missing or incomplete parts.

Focus on making the workflow feel clickable and complete.

### Required Improvements

1. Connect all major CTA buttons.
2. Add missing pages if necessary.
3. Add progress indicators to candidate submission flow.
4. Add realistic form states.
5. Add upload placeholder states.
6. Add reviewer note interaction.
7. Add recommended action selection.
8. Add report generation flow.
9. Add report export preview.
10. Add clear MVP / Later Expansion / Out-of-Scope distinction.

---

## 4. Add EN / KR Language Toggle

Add a visible language toggle to the global header or top-right area.

Language options:

- EN
- KR

The toggle should allow the prototype to show both English and Korean versions.

If full interactive translation is not possible, create clearly separated EN/KR states or duplicate key screens in both languages.

### Required Language Behavior

The following key areas must support EN/KR:

1. Landing Page
2. Admin Dashboard
3. Candidate Consent Page
4. Candidate Submission Flow
5. Reviewer Dashboard
6. Candidate Trust Report
7. Guardrail Notice
8. Recommended Action labels

### English / Korean Copy Rules

Use careful, non-accusatory language.

English examples:

- “Review signals are ready.”
- “Additional verification may be helpful.”
- “Portfolio ownership needs manual review.”
- “This report supports human decision-making.”
- “No automatic hiring decision is made by HireSift.”

Korean examples:

- “검토 신호가 준비되었습니다.”
- “추가 확인이 도움이 될 수 있습니다.”
- “포트폴리오 소유 여부에 대한 수동 검토가 필요합니다.”
- “이 리포트는 사람의 의사결정을 보조합니다.”
- “HireSift는 채용 합격/불합격을 자동 결정하지 않습니다.”

Avoid in both languages:

- “Fraud detected”
- “Fake candidate”
- “Lie detected”
- “Reject this candidate”
- “AI determined this person is suspicious”
- “사기 후보자”
- “가짜 지원자”
- “거짓말 탐지”
- “자동 탈락”
- “AI가 이 사람을 의심스럽다고 판단했습니다”

---

## 5. Required EN/KR Label Mapping

Use this label mapping consistently.

| English | Korean |
|---|---|
| Candidate Trust Report | 후보자 신뢰 검토 리포트 |
| Identity Consistency | 신원 일관성 |
| Portfolio Provenance | 포트폴리오 출처/소유 검토 |
| Interview Session Integrity | 면접 세션 무결성 |
| Review Signals | 검토 신호 |
| Recommended Action | 권장 확인 조치 |
| Low Attention | 낮은 검토 필요 |
| Medium Attention | 일부 검토 필요 |
| High Attention | 높은 검토 필요 |
| Review Recommended | 검토 권장 |
| Manual Review Required | 수동 검토 필요 |
| Additional Check Needed | 추가 확인 필요 |
| Human-reviewed | 사람 검토 완료 |
| No automatic decision | 자동 결정 없음 |
| Consent & Privacy Notice | 동의 및 개인정보 안내 |
| Masked Document Upload | 마스킹 문서 업로드 |
| Voice Sample | 음성 샘플 |
| Selfie Video | 셀피 영상 |
| Export PDF | PDF 내보내기 |
| Share Report | 리포트 공유 |
| Data Retention | 데이터 보관 기간 |
| Audit Log | 검토 이력 |

---

## 6. Report Visualization Improvement

Improve the Candidate Trust Report so it feels like a polished business report.

The report should include visual sections:

### Summary Cards

- Identity Consistency
- Portfolio Provenance
- Interview Session Integrity
- Media Sample Quality
- Manual Review Status

### Review Signal Matrix

Create a visual table:

| Area | Signal | Status | Evidence | Reviewer Note |
|---|---|---|---|---|

### Evidence Cards

Each evidence card should show:

- Evidence type
- Source
- Status
- Reviewer note
- Timestamp

### Portfolio Timeline

Show portfolio provenance visually:

- GitHub
- LinkedIn
- Behance
- Notion
- Website
- Account age
- Activity pattern
- Ownership consistency

### Recommended Action Block

Show one selected recommendation:

- No additional check needed
- Request short re-verification call
- Request portfolio walkthrough
- Request additional document
- Manual review required

### Guardrail Notice

Include this notice clearly:

English:
“This report does not determine hiring eligibility. It summarizes review signals for human decision-makers.”

Korean:
“이 리포트는 채용 합격 또는 불합격을 자동 결정하지 않습니다. 사람의 의사결정을 돕기 위해 검토 신호를 요약합니다.”

---

## 7. MVP / Future / Out-of-Scope Section

Add a product scope section somewhere in the prototype, preferably in the product overview or settings area.

### MVP Core

- Candidate verification request
- Candidate consent flow
- Candidate submission flow
- Portfolio link collection
- Masked document upload
- Selfie video sample
- Voice sample
- Reviewer dashboard
- Candidate Trust Report
- PDF export preview

### Later Expansion

- ATS integration
- Advanced face verification
- Advanced speaker verification
- Live interview plugin
- Enterprise compliance dashboard
- Candidate appeal workflow
- Multi-organization admin
- Audit-ready enterprise log exports

### Out-of-Scope

- Automatic rejection
- Lie detection
- Emotion analysis
- Personality analysis
- Fully automated fraud judgment
- Replacing background check vendors
- Replacing Zoom or Google Meet

---

## 8. Final Output Requirements

After refinement, the prototype should include:

1. Full workflow from landing to report sharing.
2. Functional navigation between major flows.
3. Admin flow.
4. Candidate submission flow.
5. Reviewer flow.
6. Visual Candidate Trust Report.
7. EN/KR language toggle or EN/KR screen states.
8. Privacy and guardrail messaging.
9. MVP / Future / Out-of-Scope distinction.
10. Trust SaaS visual design consistency.

Do not over-redesign the current prototype.  
Improve functionality, completeness, and clarity.

The final prototype should be suitable for:

- Team review
- Mentor feedback
- FigJam discussion
- MVP planning
- Business presentation