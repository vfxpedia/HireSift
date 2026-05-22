import { useNavigate } from "react-router";
import {
  Shield,
  CheckCircle,
  User,
  FileText,
  Lock,
  Link as LinkIcon,
  Video,
  ClipboardCheck,
  AlertTriangle,
  Check,
  ArrowRight,
  Eye,
  Sparkles,
  Rocket,
  XCircle,
} from "lucide-react";
import { cn } from "../lib/cn";
import { Card, SectionLabel } from "../components/primitives/Card";
import { AttentionBadge } from "../components/primitives/Badges";
import { PrimaryBtn, SecondaryBtn } from "../components/primitives/Buttons";

const FEATURES = [
  { icon: User, title: "Identity Consistency Review", desc: "Organize submitted identity signals for structured human review." },
  { icon: LinkIcon, title: "Portfolio Provenance", desc: "Review portfolio account age, activity patterns, and ownership consistency." },
  { icon: Video, title: "Interview Session Integrity", desc: "Collect and organize media samples for reviewer inspection." },
  { icon: ClipboardCheck, title: "Human-in-the-Loop Review", desc: "Every signal is reviewed by a human before any recommendation is made." },
  { icon: FileText, title: "Candidate Trust Report", desc: "Generate structured, audit-ready reports to support your hiring team." },
  { icon: Lock, title: "Privacy by Design", desc: "Minimal data collection, masked document uploads, transparent consent." },
];

const STEPS = [
  { num: "01", title: "Create Verification Request", desc: "Admin sends a secure verification link to the candidate." },
  { num: "02", title: "Candidate Submits Signals", desc: "Candidate completes a guided submission: identity, portfolio, media samples." },
  { num: "03", title: "Reviewer Inspects Signals", desc: "Human reviewer checks each signal category and adds notes." },
  { num: "04", title: "Trust Report Generated", desc: "A structured Candidate Trust Report is delivered for team review." },
];

const PRICING = [
  { plan: "Starter", price: "$49", period: "/mo", seats: "Up to 3 hiring seats", verifications: "20 verifications/mo", features: ["Candidate submission flow", "Trust Report", "PDF export", "Email support"] },
  { plan: "Growth", price: "$149", period: "/mo", seats: "Up to 10 hiring seats", verifications: "100 verifications/mo", features: ["All Starter features", "Reviewer dashboard", "Audit log", "Priority support", "Data retention controls"], highlighted: true },
  { plan: "Enterprise", price: "Custom", period: "", seats: "Unlimited seats", verifications: "Unlimited verifications", features: ["All Growth features", "ATS integration (coming)", "Enterprise compliance log", "Dedicated support", "Custom consent templates"] },
];

const SCOPE = {
  mvp: [
    "Candidate verification request",
    "Candidate consent flow",
    "Candidate submission flow",
    "Portfolio link collection",
    "Masked document upload",
    "Selfie video sample",
    "Voice sample",
    "Reviewer dashboard",
    "Candidate Trust Report",
    "PDF export preview",
  ],
  future: [
    "ATS integration",
    "Advanced face verification",
    "Advanced speaker verification",
    "Live interview plugin",
    "Enterprise compliance dashboard",
    "Candidate appeal workflow",
    "Multi-organization admin",
    "Audit-ready enterprise log exports",
  ],
  outOfScope: [
    "Automatic rejection",
    "Lie detection",
    "Emotion analysis",
    "Personality analysis",
    "Fully automated fraud judgment",
    "Replacing background check vendors",
    "Replacing Zoom or Google Meet",
  ],
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }} className="bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#172033] rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[#172033] text-sm">HireSift</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#6B7280]">
            <a href="#how-it-works" className="hover:text-[#172033] transition-colors">How it works</a>
            <a href="#trust" className="hover:text-[#172033] transition-colors">Trust & Privacy</a>
            <a href="#scope" className="hover:text-[#172033] transition-colors">Scope</a>
            <a href="#pricing" className="hover:text-[#172033] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="text-sm text-[#374151] hover:text-[#172033] transition-colors">Sign in</button>
            <PrimaryBtn onClick={() => navigate("/login")} className="text-sm py-2">Request Demo</PrimaryBtn>
          </div>
        </div>
      </nav>

      <section className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#2F7D7E]/10 text-[#2F7D7E] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <Shield className="w-3 h-3" />
                Human-in-the-loop · Privacy by Design
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#172033] leading-tight mb-5">
                Remote hiring needs a trust layer.
              </h1>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
                HireSift helps teams review identity, portfolio, and interview consistency signals
                before making remote hiring decisions — through a structured, human-reviewed workflow.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <PrimaryBtn onClick={() => navigate("/login")} className="text-sm" icon={<ArrowRight className="w-4 h-4" />}>
                  Create Verification Request
                </PrimaryBtn>
                <SecondaryBtn onClick={() => navigate("/app/reports")} className="text-sm" icon={<Eye className="w-4 h-4" />}>
                  View Sample Report
                </SecondaryBtn>
                <SecondaryBtn onClick={() => navigate("/verify")} className="text-sm" icon={<User className="w-4 h-4" />}>
                  Try as Candidate
                </SecondaryBtn>
              </div>
              <p className="text-xs text-[#9CA3AF]">Not a lie detector. Not an auto-rejection system. A trust review tool for human decision-makers.</p>
            </div>
            <div className="relative">
              <Card className="p-5 shadow-xl shadow-[#172033]/8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-0.5">Candidate Trust Report</p>
                    <p className="font-semibold text-[#111827] text-sm">Alex Kim · HS-2026-041</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#2F7D7E]/10 text-[#2F7D7E] text-xs font-medium px-2.5 py-1 rounded-lg">
                    <CheckCircle className="w-3 h-3" />
                    Human Reviewed
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Identity", status: "low" as const },
                    { label: "Portfolio", status: "medium" as const },
                    { label: "Session", status: "low" as const },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#F7F8FA] rounded-xl p-3">
                      <p className="text-[10px] text-[#6B7280] mb-1.5">{s.label}</p>
                      <AttentionBadge level={s.status} />
                    </div>
                  ))}
                </div>
                <div className="bg-[#172033]/5 rounded-xl p-3">
                  <p className="text-xs font-medium text-[#172033] mb-1">Recommended Action</p>
                  <p className="text-xs text-[#6B7280]">Request short portfolio walkthrough before final review.</p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                  <p className="text-[10px] text-[#9CA3AF]">This report does not determine hiring eligibility.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Workflow</SectionLabel>
            <h2 className="text-3xl font-bold text-[#172033]">How HireSift works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-0 h-px bg-[#E5E7EB]" />
                )}
                <div className="text-3xl font-bold text-[#E5E7EB] mb-3 font-mono">{step.num}</div>
                <h3 className="font-semibold text-[#111827] text-sm mb-2">{step.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F7F8FA] border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Capabilities</SectionLabel>
            <h2 className="text-3xl font-bold text-[#172033]">Everything your hiring team needs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Card key={f.title} className="p-5">
                <div className="w-9 h-9 bg-[#2F7D7E]/10 rounded-lg flex items-center justify-center text-[#2F7D7E] mb-4">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[#111827] text-sm mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Trust & Guardrails</SectionLabel>
              <h2 className="text-3xl font-bold text-[#172033] mb-5">
                Designed with candidate dignity in mind
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-8">
                HireSift is not a surveillance tool, lie detector, or automatic rejection system. It is a
                structured review-assist platform built around human decision-making and candidate
                transparency.
              </p>
              <div className="space-y-3">
                {[
                  "No automatic rejection — human decision required",
                  "Masked document uploads — no unnecessary data",
                  "Candidate consent is explicit and documented",
                  '"Attention" signals, not fraud accusations',
                  "Clear data retention and deletion policy",
                  "Every report reviewed by a human reviewer",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-[#374151]">
                    <CheckCircle className="w-4 h-4 text-[#2F7D7E] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#C6923A]/10 rounded-lg flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#C6923A]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#111827] mb-1">We say "Review Recommended"</p>
                    <p className="text-xs text-[#6B7280]">Not "Fraud Detected" or "Fake Candidate" — ever.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#2F7D7E]/10 rounded-lg flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#2F7D7E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#111827] mb-1">Human-in-the-Loop Required</p>
                    <p className="text-xs text-[#6B7280]">AI organizes signals. Humans make all decisions.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#172033]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-[#172033]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#111827] mb-1">Minimal Data, Maximum Transparency</p>
                    <p className="text-xs text-[#6B7280]">Candidates always know what is collected and why.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="scope" className="py-20 bg-[#F7F8FA] border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>Product Scope</SectionLabel>
            <h2 className="text-3xl font-bold text-[#172033]">What's in, what's next, what's out</h2>
            <p className="text-sm text-[#6B7280] mt-3 max-w-xl mx-auto">
              We're explicit about what HireSift does and doesn't do. Transparency about scope is part of
              our trust contract.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#2F7D7E]/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#2F7D7E]" />
                </div>
                <h3 className="font-bold text-sm text-[#111827]">MVP Core</h3>
              </div>
              <div className="space-y-2">
                {SCOPE.mvp.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#374151]">
                    <Check className="w-3.5 h-3.5 text-[#2F7D7E] shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#C6923A]/10 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-[#C6923A]" />
                </div>
                <h3 className="font-bold text-sm text-[#111827]">Later Expansion</h3>
              </div>
              <div className="space-y-2">
                {SCOPE.future.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#374151]">
                    <ArrowRight className="w-3.5 h-3.5 text-[#C6923A] shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6 border-[#172033]/20 bg-[#172033]/[0.02]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#172033]/10 rounded-lg flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-[#172033]" />
                </div>
                <h3 className="font-bold text-sm text-[#111827]">Out of Scope</h3>
              </div>
              <div className="space-y-2">
                {SCOPE.outOfScope.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-[#374151]">
                    <XCircle className="w-3.5 h-3.5 text-[#172033]/40 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-3xl font-bold text-[#172033]">Simple, transparent pricing</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {PRICING.map((p) => (
              <Card key={p.plan} className={cn("p-6", p.highlighted && "border-[#172033] ring-2 ring-[#172033]/10")}>
                {p.highlighted && (
                  <div className="text-xs font-semibold text-[#2F7D7E] mb-3 uppercase tracking-wider">Most Popular</div>
                )}
                <h3 className="font-bold text-[#111827] text-lg mb-1">{p.plan}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-[#172033]">{p.price}</span>
                  <span className="text-[#6B7280] text-sm">{p.period}</span>
                </div>
                <p className="text-xs text-[#6B7280] mb-4">{p.seats}</p>
                <p className="text-xs text-[#374151] font-medium mb-4">{p.verifications}</p>
                <div className="space-y-2 mb-6">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-[#374151]">
                      <Check className="w-3.5 h-3.5 text-[#2F7D7E]" />
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className={cn(
                    "w-full py-2.5 text-sm font-medium rounded-xl transition-colors",
                    p.highlighted
                      ? "bg-[#172033] text-white hover:bg-[#1e2d47]"
                      : "bg-white text-[#172033] border border-[#E5E7EB] hover:bg-gray-50",
                  )}
                >
                  Get started
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#172033] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-7 h-7 bg-[#2F7D7E] rounded-lg flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">HireSift</span>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-sm text-white/50 mb-8">
            <div>
              <p className="text-white/80 font-medium mb-3">Product</p>
              <div className="space-y-2">
                <p>How it works</p>
                <p>Trust Reports</p>
                <p>Pricing</p>
              </div>
            </div>
            <div>
              <p className="text-white/80 font-medium mb-3">Trust</p>
              <div className="space-y-2">
                <p>Privacy Policy</p>
                <p>Data Retention</p>
                <p>Guardrails</p>
              </div>
            </div>
            <div>
              <p className="text-white/80 font-medium mb-3">Company</p>
              <div className="space-y-2">
                <p>About</p>
                <p>Contact</p>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 text-white/30 text-xs">
            © 2026 HireSift. HireSift does not make automatic hiring decisions. All reports require human review.
          </div>
        </div>
      </footer>
    </div>
  );
}
