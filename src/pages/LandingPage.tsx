import { useState } from "react";
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
import { InfoModal } from "../components/modals/InfoModal";
import { POLICY_KEYS, POLICY_PARAGRAPH_KEYS, type PolicyKey } from "../lib/policies";
import { LanguageToggle } from "../components/primitives/LanguageToggle";
import { useTranslation } from "react-i18next";

const FEATURE_ICONS = [User, LinkIcon, Video, ClipboardCheck, FileText, Lock];

interface LandingStep {
  num: string;
  title: string;
  desc: string;
}
interface LandingFeature {
  title: string;
  desc: string;
}
interface LandingPricingPlan {
  plan: string;
  price: string;
  period: string;
  seats: string;
  verifications: string;
  features: string[];
}
interface LandingTrustCard {
  title: string;
  desc: string;
}
interface LandingScope {
  mvp: string[];
  future: string[];
  outOfScope: string[];
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [policy, setPolicy] = useState<PolicyKey | null>(null);

  const steps = t("landing.workflowSteps", { returnObjects: true }) as LandingStep[];
  const features = t("landing.features", { returnObjects: true }) as LandingFeature[];
  const trustItems = t("landing.trustItems", { returnObjects: true }) as string[];
  const trustCards = t("landing.trustCards", { returnObjects: true }) as LandingTrustCard[];
  const scope = t("landing.scopeItems", { returnObjects: true }) as LandingScope;
  const pricing = t("landing.pricingPlans", { returnObjects: true }) as LandingPricingPlan[];
  const pricingHighlightIdx = 1;

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
            <a href="#how-it-works" className="hover:text-[#172033] transition-colors">{t("landing.navHowItWorks")}</a>
            <a href="#trust" className="hover:text-[#172033] transition-colors">{t("landing.navTrust")}</a>
            <a href="#scope" className="hover:text-[#172033] transition-colors">{t("landing.navScope")}</a>
            <a href="#pricing" className="hover:text-[#172033] transition-colors">{t("landing.navPricing")}</a>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button onClick={() => navigate("/login")} className="text-sm text-[#374151] hover:text-[#172033] transition-colors">{t("landing.signIn")}</button>
            <PrimaryBtn onClick={() => navigate("/login")} className="text-sm py-2">{t("landing.requestDemo")}</PrimaryBtn>
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
                {t("landing.heroHeading")}
              </h1>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
                {t("landing.heroDesc")}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <PrimaryBtn onClick={() => navigate("/login")} className="text-sm" icon={<ArrowRight className="w-4 h-4" />}>
                  {t("landing.ctaCreate")}
                </PrimaryBtn>
                <SecondaryBtn onClick={() => navigate("/app/reports")} className="text-sm" icon={<Eye className="w-4 h-4" />}>
                  {t("landing.ctaSample")}
                </SecondaryBtn>
                <SecondaryBtn onClick={() => navigate("/verify")} className="text-sm" icon={<User className="w-4 h-4" />}>
                  {t("landing.ctaTryCandidate")}
                </SecondaryBtn>
              </div>
              <p className="text-xs text-[#9CA3AF]">{t("landing.disclaimer")}</p>
            </div>
            <div className="relative">
              <Card className="p-5 shadow-xl shadow-[#172033]/8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-0.5">{t("landing.heroPreview.label")}</p>
                    <p className="font-semibold text-[#111827] text-sm">Alex Kim · HS-2026-041</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#2F7D7E]/10 text-[#2F7D7E] text-xs font-medium px-2.5 py-1 rounded-lg">
                    <CheckCircle className="w-3 h-3" />
                    {t("landing.heroPreview.humanReviewed")}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { key: "identity", label: t("landing.heroPreview.identity"), status: "low" as const },
                    { key: "portfolio", label: t("landing.heroPreview.portfolio"), status: "medium" as const },
                    { key: "session", label: t("landing.heroPreview.session"), status: "low" as const },
                  ].map((s) => (
                    <div key={s.key} className="bg-[#F7F8FA] rounded-xl p-3">
                      <p className="text-[10px] text-[#6B7280] mb-1.5">{s.label}</p>
                      <AttentionBadge level={s.status} />
                    </div>
                  ))}
                </div>
                <div className="bg-[#172033]/5 rounded-xl p-3">
                  <p className="text-xs font-medium text-[#172033] mb-1">{t("landing.heroPreview.recommendedAction")}</p>
                  <p className="text-xs text-[#6B7280]">{t("landing.heroPreview.recommendedActionBody")}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                  <p className="text-[10px] text-[#9CA3AF]">{t("landing.heroPreview.disclaimer")}</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel>{t("landing.workflowLabel")}</SectionLabel>
            <h2 className="text-3xl font-bold text-[#172033]">{t("landing.workflowHeading")}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
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
            <SectionLabel>{t("landing.capabilities")}</SectionLabel>
            <h2 className="text-3xl font-bold text-[#172033]">{t("landing.capabilitiesHeading")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? User;
              return (
                <Card key={f.title} className="p-5">
                  <div className="w-9 h-9 bg-[#2F7D7E]/10 rounded-lg flex items-center justify-center text-[#2F7D7E] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-[#111827] text-sm mb-2">{f.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="trust" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>{t("landing.trustLabel")}</SectionLabel>
              <h2 className="text-3xl font-bold text-[#172033] mb-5">
                {t("landing.trustHeading")}
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-8">
                {t("landing.trustDesc")}
              </p>
              <div className="space-y-3">
                {trustItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-[#374151]">
                    <CheckCircle className="w-4 h-4 text-[#2F7D7E] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {trustCards.map((card, i) => {
                const accents = [
                  { bg: "bg-[#C6923A]/10", text: "text-[#C6923A]", Icon: AlertTriangle },
                  { bg: "bg-[#2F7D7E]/10", text: "text-[#2F7D7E]", Icon: User },
                  { bg: "bg-[#172033]/10", text: "text-[#172033]", Icon: Lock },
                ];
                const accent = accents[i] ?? accents[0];
                const Icon = accent.Icon;
                return (
                  <Card key={card.title} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", accent.bg)}>
                        <Icon className={cn("w-4 h-4", accent.text)} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#111827] mb-1">{card.title}</p>
                        <p className="text-xs text-[#6B7280]">{card.desc}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="scope" className="py-20 bg-[#F7F8FA] border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>{t("landing.scopeLabel")}</SectionLabel>
            <h2 className="text-3xl font-bold text-[#172033]">{t("landing.scopeHeading")}</h2>
            <p className="text-sm text-[#6B7280] mt-3 max-w-xl mx-auto">{t("landing.scopeDesc")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#2F7D7E]/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#2F7D7E]" />
                </div>
                <h3 className="font-bold text-sm text-[#111827]">{t("landing.scopeMvp")}</h3>
              </div>
              <div className="space-y-2">
                {scope.mvp.map((item) => (
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
                <h3 className="font-bold text-sm text-[#111827]">{t("landing.scopeFuture")}</h3>
              </div>
              <div className="space-y-2">
                {scope.future.map((item) => (
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
                <h3 className="font-bold text-sm text-[#111827]">{t("landing.scopeOut")}</h3>
              </div>
              <div className="space-y-2">
                {scope.outOfScope.map((item) => (
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
            <SectionLabel>{t("landing.navPricing")}</SectionLabel>
            <h2 className="text-3xl font-bold text-[#172033]">{t("landing.pricingHeading")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {pricing.map((p, i) => {
              const highlighted = i === pricingHighlightIdx;
              return (
                <Card key={p.plan} className={cn("p-6", highlighted && "border-[#172033] ring-2 ring-[#172033]/10")}>
                  {highlighted && (
                    <div className="text-xs font-semibold text-[#2F7D7E] mb-3 uppercase tracking-wider">
                      {t("landing.mostPopular")}
                    </div>
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
                      highlighted
                        ? "bg-[#172033] text-white hover:bg-[#1e2d47]"
                        : "bg-white text-[#172033] border border-[#E5E7EB] hover:bg-gray-50",
                    )}
                  >
                    {t("landing.getStarted")}
                  </button>
                </Card>
              );
            })}
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
              <p className="text-white/80 font-medium mb-3">{t("landing.footerProduct")}</p>
              <div className="space-y-2 flex flex-col items-start">
                <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
                <button
                  type="button"
                  onClick={() => navigate("/app/reports")}
                  className="hover:text-white transition-colors text-left"
                >
                  Trust Reports
                </button>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              </div>
            </div>
            <div>
              <p className="text-white/80 font-medium mb-3">{t("landing.footerTrust")}</p>
              <div className="space-y-2 flex flex-col items-start">
                {(["privacy", "retention", "guardrails"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setPolicy(k)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {t(`policies.${k}.title`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/80 font-medium mb-3">{t("landing.footerCompany")}</p>
              <div className="space-y-2 flex flex-col items-start">
                {(["about", "contact"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setPolicy(k)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {t(`policies.${k}.title`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 text-white/30 text-xs">
            {t("landing.footerCopyright")}
          </div>
        </div>
      </footer>
      <InfoModal
        open={!!policy}
        onClose={() => setPolicy(null)}
        title={policy ? t(`policies.${policy}.title`) : ""}
        body={
          <>
            {policy &&
              POLICY_PARAGRAPH_KEYS[policy].map((pk) => (
                <p key={pk}>{t(`policies.${policy}.${pk}`)}</p>
              ))}
          </>
        }
        closeLabel={t("common.close")}
      />
    </div>
  );
}
