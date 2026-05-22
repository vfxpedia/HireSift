# HireSift MVP Prototype Refinement Request

Use the current HireSift Figma Make prototype as the base.
Do not redesign the product from scratch.

The current prototype is already visually close to the desired Trust SaaS direction.
Now improve functional completeness, missing flows, and bilingual support.

## 1. Keep the Existing Design Direction

Keep the current visual style:
- Primary Navy: #172033
- Muted Teal: #2F7D7E
- Soft Amber: #C6923A
- Neutral Background: #F7F8FA
- Text: #111827

Keep the product calm, professional, B2B SaaS-like, privacy-aware, and report-oriented.

Do not add:
- Neon AI gradients
- Red-heavy warnings
- Fraud/fake/reject language
- Automatic candidate scoring
- Lie detection wording
- Emotion analysis wording

## 2. Add EN / KR Language Toggle

Add a global EN/KR language toggle.

Preferred placement:
- Top-right area of the landing page header
- Top-right area of the app TopBar
- Candidate flow header

The toggle should switch major UI copy between English and Korean.

If full dynamic translation is difficult, create language state and apply it to all major screens.

Required screens for EN/KR support:
- Landing Page
- Login
- Dashboard
- Candidates
- Create Verification Request modal
- Candidate Flow
- Reviewer Dashboard
- Candidate Trust Report
- Settings
- Audit Log

Use this label mapping:

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

Korean guardrail copy:
“이 리포트는 채용 합격 또는 불합격을 자동 결정하지 않습니다. 사람의 의사결정을 돕기 위해 검토 신호를 요약합니다.”

English guardrail copy:
“This report does not determine hiring eligibility. It summarizes review signals for human decision-makers.”

## 3. Fix Candidate Detail Flow

The current app has a candidate-detail route concept, but it is not fully rendered.

Add a Candidate Detail page.

Candidate Detail should include:
- Candidate overview
- Current verification status
- Submission status
- Identity section
- Portfolio section
- Media sample section
- Reviewer assignment
- Recent activity
- CTA buttons:
  - Open Reviewer Review
  - View Trust Report
  - Send / Copy Verification Link
  - Request More Information

Connect:
- Candidate List row click → Candidate Detail
- Candidate Detail → Reviewer Dashboard
- Candidate Detail → Candidate Trust Report
- Candidate Detail → Copy/Send Verification Link modal

## 4. Improve Create Verification Request Flow

The current modal is good, but the send-link flow needs to feel functional.

Add or improve:
- Candidate name
- Candidate email
- Role
- Verification type
- Due date
- Assigned reviewer
- Optional note to candidate
- Send Invite button
- After sending, show confirmation state:
  - Verification link generated
  - Link copied
  - Email invite sent
  - Candidate status changed to “Link Sent”

Add a mock generated link:
https://hiresift.app/verify/HS-2026-047

## 5. Improve Candidate Submission Functional States

Keep the existing step-by-step candidate flow, but make the upload and recording steps feel interactive.

For Masked Document Upload:
- Add upload selected state
- Show file name
- Show “Uploaded successfully”
- Add “Replace file” action

For Selfie Video:
- Start Recording → Recording... → Recorded
- Show sample duration, e.g. 8 seconds
- Add “Re-record” button
- Add privacy note: no emotion analysis

For Voice Sample:
- Start Recording → Recording... → Recorded
- Show sample duration, e.g. 7 seconds
- Add “Re-record” button
- Add privacy note: no voice profiling

For Review Step:
- Summarize actual submitted items
- Show all sections as Ready
- Show final consent reminder
- Submit Verification button should lead to Submission Complete

## 6. Improve Reviewer Flow

The reviewer flow is good but needs stronger functional states.

Add or improve:
- Preview Report button should navigate to Candidate Trust Report
- Generate Trust Report should show a generation confirmation or success state
- Reviewer notes should appear in the Candidate Trust Report
- Recommended Action selection should appear in the final report
- Add “Request More Info” action
- Add “Mark for Manual Review” action

Keep this principle visible:
AI organizes signals. Human reviewer confirms the report.

## 7. Improve Candidate Trust Report Visualization

The report is already good. Make it more visually analytical without using numeric candidate scores.

Add:
- Signal Overview section
- Attention Distribution visual bar or mini chart
- Evidence Card Grid
- Portfolio Timeline
- Section Completion Progress
- Export PDF Preview Modal
- Share Report Modal
- Client Viewer read-only preview

Do not add numeric candidate score like 87/100.
Do not rank candidates.
Do not use fraud/fake/reject language.

The report should include:
- Report Header
- Candidate Overview
- Summary Cards
- Review Signal Matrix
- Evidence Cards
- Portfolio Provenance Timeline
- Interview Session Integrity
- Recommended Action
- Guardrail Notice
- Export PDF Preview
- Share Report / Client Viewer Page

## 8. Add Share Report and Export PDF Functional States

For Export PDF:
- Clicking Export PDF opens a modal or preview panel
- Show document preview
- Show export options:
  - Download PDF
  - Include evidence cards
  - Include reviewer notes
  - Include guardrail notice
- Show “PDF ready” state

For Share Report:
- Clicking Share opens a modal
- Show read-only report link
- Copy link action
- Client Viewer option
- Expiration date setting
- Access level:
  - View only
  - Internal reviewer only
  - Client viewer

## 9. Add MVP / Future / Out-of-Scope Section

Add a scope section to the Product Overview or Settings area.

MVP Core:
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

Later Expansion:
- ATS integration
- Advanced face verification
- Advanced speaker verification
- Live interview plugin
- Enterprise compliance dashboard
- Candidate appeal workflow
- Multi-organization admin
- Audit-ready enterprise log exports

Out-of-Scope:
- Automatic rejection
- Lie detection
- Emotion analysis
- Personality analysis
- Fully automated fraud judgment
- Replacing background check vendors
- Replacing Zoom or Google Meet

## 10. Final Functional Checklist Page

Add a final internal checklist page or panel called “Prototype Completion Checklist”.

Use this table:

| Requirement | Status | Notes |
|---|---|---|

Statuses:
- Complete
- Partial
- Missing
- Needs Manual Review

Include:
- Landing Page
- Admin Dashboard
- Candidate List
- Candidate Detail
- Create Verification Request
- Candidate Consent
- Candidate Submission
- Reviewer Dashboard
- Candidate Trust Report
- Export PDF
- Share Report
- Settings
- Audit Log
- EN/KR Toggle
- Privacy Guardrails
- MVP/Future/Out-of-Scope

## 11. Preserve What Already Works

Do not remove the existing:
- Landing page
- Candidate flow
- Reviewer dashboard
- Candidate Trust Report
- Settings
- Audit Log
- Trust SaaS visual design

Only improve missing functionality, navigation, bilingual support, and report visualization.