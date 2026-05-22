# HireSift MVP Web App Prototype Prompt

You are designing a complete MVP web app prototype for **HireSift**.

This prompt should work for both **Stitch** and **Figma Make**.

Use the attached files as source-of-truth:

1. `HireSift_deep-research-report.md`
   - Use this for business context, problem background, target customer, market logic, and trust positioning.

2. `HireSift_Product_Blueprint.md`
   - Use this as the main product structure reference.
   - Prioritize the full workflow, user roles, MVP features, Candidate Trust Report, Human-in-the-loop review, and privacy guardrails.

3. `HireSift_Design.md`
   - Use this as the visual design system.
   - Follow the Trust SaaS visual direction.

---

## 1. Product Definition

HireSift is an **AI-powered Remote Hiring Trust Layer**.

It helps hiring teams review candidate identity, portfolio, and interview consistency signals in remote hiring.

HireSift generates a **Candidate Trust Report** for human reviewers.

The product is not designed to automatically reject candidates.  
It is a review-assist system for structured human decision-making.

---

## 2. Core Product Principle

Design HireSift as:

> A calm, trustworthy, B2B SaaS web app that helps hiring teams review remote candidate consistency signals through a Human-in-the-loop workflow.

Do not design it as:
- A lie detector
- A fraud detector
- An automatic rejection system
- A surveillance tool
- A colorful AI toy
- A risk-scoring tool that judges people automatically

---

## 3. Mandatory Guardrails

These guardrails must be visible in the product experience, especially in the report and reviewer dashboard.

- Not a lie detector
- No automatic rejection
- Human-in-the-loop review
- Minimal personal data collection
- Masked document upload
- Limited media sample usage
- Review signals only, not final hiring decisions
- Use “Attention” language instead of “Fraud”, “Fake”, or “Reject”

Recommended wording:

Use:
- Low Attention
- Medium Attention
- High Attention
- Review Recommended
- Additional Check Needed
- Manual Review Required

Avoid:
- Fraud Detected
- Fake Candidate
- Lie Detected
- Reject Candidate
- Suspicious Person

---

## 4. Target Customer

Design for the initial customer segment only:

> Startups, outsourcing companies, and recruiting agencies hiring remote developers, designers, and freelancers.

Primary users:
1. Hiring Admin
2. Candidate
3. Human Reviewer
4. Client Viewer / Decision Maker

---

## 5. Visual Design Direction

Use the attached `HireSift_Design.md` as the visual source-of-truth.

Follow this palette:

- Primary Navy: `#172033`
- Muted Teal: `#2F7D7E`
- Soft Amber: `#C6923A`
- Neutral Background: `#F7F8FA`
- Text: `#111827`

Design style:
- Clean
- Minimal
- Trustworthy
- Calm
- Structured
- Professional
- B2B SaaS
- Report-oriented
- Audit-ready

Avoid:
- Neon AI gradients
- Overly colorful dashboards
- Red warning-heavy UI
- Game-like scoring
- Aggressive fraud detection visuals
- Surveillance-like visual language

Use:
- White cards
- Subtle borders
- Clear hierarchy
- Generous spacing
- Document-like report sections
- Calm dashboard layout
- Soft amber for review-needed signals
- Muted teal for completed or consistent signals
- Navy for structure and primary actions

---

## 6. Prototype Scope

Create a **complete clickable MVP workflow prototype**.

Do not limit the prototype to only a few screens.  
Show the full service journey from landing page to final visualized report.

However, clearly distinguish:
- MVP Core Flow
- Optional / Future Expansion
- Out-of-Scope features

The prototype should feel like a real SaaS product that could be presented to teammates, mentors, or early customers.

---

## 7. Required Information Architecture

Create the following major areas:

### A. Public / Pre-login

1. Landing Page
2. Product Overview
3. Trust & Guardrails Section
4. Demo Candidate Trust Report Preview
5. Pricing / Request Demo Section

### B. Admin / Hiring Team

6. Admin Login
7. Admin Dashboard
8. Candidate List
9. Create Verification Request
10. Verification Request Detail
11. Send Candidate Verification Link

### C. Candidate Flow

12. Candidate Welcome Page
13. Consent & Privacy Notice
14. Candidate Basic Information
15. Portfolio Link Submission
16. Masked ID / Certificate Upload
17. Selfie Video Submission
18. Voice Sample Submission
19. Submission Review
20. Submission Complete

### D. Reviewer Flow

21. Reviewer Dashboard
22. Candidate Review Detail
23. Identity Consistency Review
24. Portfolio Provenance Review
25. Interview Session Integrity Review
26. Risk Signal / Attention Signal Summary
27. Reviewer Notes
28. Recommended Action Selection

### E. Report Flow

29. Candidate Trust Report Page
30. Visual Report Dashboard
31. Evidence Cards Section
32. Recommended Action Section
33. Guardrail Notice Section
34. Export PDF Preview
35. Share Report / Client Viewer Page

### F. Settings / Compliance

36. Organization Settings
37. Data Retention Settings
38. Consent Template Settings
39. Audit Log Page

You may combine closely related screens if needed, but the full workflow must be represented.

---

## 8. Key User Flow

The core user flow should be:

1. Hiring Admin creates a candidate verification request.
2. Candidate receives a secure verification link.
3. Candidate reviews consent and privacy notice.
4. Candidate submits basic information.
5. Candidate submits portfolio links.
6. Candidate uploads masked ID or certificate.
7. Candidate records a short selfie video.
8. Candidate records a short voice sample.
9. System organizes submitted signals.
10. Reviewer checks identity, portfolio, and interview consistency signals.
11. Reviewer adds notes and selects recommended action.
12. HireSift generates a visual Candidate Trust Report.
13. Hiring team reviews the report.
14. Hiring team decides whether additional verification is needed.

The flow must end with a human-reviewed recommended action, not an automatic decision.

---

## 9. Candidate Trust Report Requirements

The Candidate Trust Report is the most important screen.

It should not be text-only.  
Design it as a visual, structured, audit-ready report.

Include the following sections:

### 9.1 Report Header

- Candidate name or candidate code
- Role
- Organization
- Verification date
- Reviewer
- Report status
- Human-reviewed badge

### 9.2 Summary Cards

Create visual summary cards for:

- Identity Consistency
- Portfolio Provenance
- Interview Session Integrity
- Media Sample Quality
- Manual Review Status

Each card should use:
- Low Attention
- Medium Attention
- High Attention
- Review Recommended
- Manual Review Required

Do not use fraud/fake/reject language.

### 9.3 Visual Signal Matrix

Create a matrix or dashboard that visually compares:

| Area | Signal | Status | Evidence | Reviewer Note |
|---|---|---|---|---|

Areas:
- Basic identity information
- Portfolio account consistency
- Masked document review
- Selfie sample quality
- Voice sample quality
- Interview session consistency
- Public profile / digital footprint
- Manual reviewer notes

### 9.4 Portfolio Provenance Visualization

Design a visual section for portfolio provenance.

Include:
- Portfolio links
- Platform badges: GitHub / LinkedIn / Behance / Notion / Website
- Account age signal
- Activity pattern summary
- Ownership consistency
- Reviewer note

Visual style:
- Timeline
- Evidence cards
- Metadata summary cards

### 9.5 Interview Session Integrity Visualization

Include:
- Session completed
- Random prompt response
- Media quality
- Face consistency signal
- Voice consistency signal
- Manual review note

Do not imply surveillance or emotion analysis.

### 9.6 Recommended Action

Use a strong but calm recommendation block.

Possible actions:
- No additional check needed
- Request short re-verification call
- Request portfolio walkthrough
- Request additional document
- Manual review required

### 9.7 Guardrail Notice

At the bottom of the report, include:

> This report does not determine hiring eligibility.  
> It summarizes review signals for human decision-makers.

---

## 10. Dashboard Requirements

The Admin Dashboard should include:

- Candidate pipeline overview
- Verification status
- Pending submissions
- Reports ready for review
- Attention level distribution
- Recent activity
- Quick action: Create Verification Request

Use visual elements:
- Status cards
- Clean tables
- Subtle progress indicators
- Attention badges
- Report-ready indicators

Avoid:
- Aggressive alerts
- Red-heavy warnings
- Candidate scoring leaderboard

---

## 11. Candidate Flow Requirements

Candidate screens must feel respectful, transparent, and safe.

The candidate should understand:
- Why data is being collected
- What data is collected
- How long it is stored
- That the result does not automatically decide hiring outcome
- How to request deletion or support

Candidate submission screens should be simple and step-by-step.

Use progress steps:
1. Consent
2. Basic Info
3. Portfolio
4. Masked Document
5. Selfie Video
6. Voice Sample
7. Review
8. Complete

---

## 12. Reviewer Flow Requirements

Reviewer screens should help a human reviewer inspect signals clearly.

Include:
- Candidate overview
- Submission completeness
- Identity consistency signals
- Portfolio provenance signals
- Media sample quality
- Interview session signals
- Evidence cards
- Reviewer notes
- Recommended action selection
- Generate report button

Important:
The reviewer is the decision support operator.  
The AI only organizes signals.

---

## 13. Report Visualization Style

The report should feel like:

- A compliance-friendly business document
- A structured trust review report
- A hiring risk review summary
- A calm visual dashboard

It should not feel like:
- A police report
- A fraud accusation
- A credit score
- A surveillance report
- A candidate ranking page

Recommended visual components:
- Summary cards
- Attention badges
- Evidence cards
- Timeline
- Matrix table
- Section progress
- Reviewer note blocks
- Guardrail notice box
- Export PDF preview

---

## 14. MVP vs Future Features

Clearly include a product roadmap or sidebar that separates:

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
- PDF export

### Later Expansion

- ATS integration
- Automated API-based background checks
- Advanced face verification
- Advanced speaker verification
- Live interview plugin
- Enterprise compliance dashboard
- Candidate appeal workflow
- Multi-organization admin
- Audit-ready enterprise log exports

### Out-of-Scope for MVP

- Automatic rejection
- Lie detection
- Emotion analysis
- Personality analysis
- Fully automated fraud judgment
- Replacing background check vendors
- Replacing Zoom or Google Meet

---

## 15. Copy Tone

Use clear, careful, professional language.

Tone:
- Calm
- Neutral
- Trustworthy
- Human-reviewed
- Non-accusatory
- Compliance-aware

Example copy:

Good:
- “Review signals are ready.”
- “Additional verification may be helpful.”
- “Portfolio ownership needs manual review.”
- “This report supports human decision-making.”
- “No automatic hiring decision is made by HireSift.”

Avoid:
- “Candidate is fake.”
- “Fraud detected.”
- “Reject this candidate.”
- “AI has determined the candidate is suspicious.”
- “Lie detected.”

---

## 16. Deliverable Requirements

Generate a polished MVP web app prototype with:

1. Full page structure
2. Clickable workflow
3. Realistic dashboard UI
4. Candidate submission flow
5. Reviewer flow
6. Visual Candidate Trust Report
7. PDF export preview
8. Guardrail and privacy messaging
9. Consistent Trust SaaS design system
10. Clear MVP / Future / Out-of-Scope distinction

The final prototype should be suitable for:
- Team review
- FigJam discussion
- Mentor feedback
- MVP planning
- Business presentation