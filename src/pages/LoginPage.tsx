import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "../components/primitives/Card";
import { PrimaryBtn } from "../components/primitives/Buttons";
import { Field, TextInput } from "../components/primitives/Field";
import { InfoModal } from "../components/modals/InfoModal";
import { LanguageToggle } from "../components/primitives/LanguageToggle";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("sarah.chen@techcorp.com");
  const [password, setPassword] = useState("demo-password");
  const [showForgot, setShowForgot] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app/dashboard");
  };

  return (
    <div
      className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#172033] rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#172033] mb-1">{t("auth.signInTitle")}</h1>
          <p className="text-sm text-[#6B7280]">{t("auth.signInSubtitle")}</p>
        </div>
        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4 mb-6">
            <Field label={t("auth.workEmail")}>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </Field>
            <Field label={t("auth.password")}>
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <PrimaryBtn type="submit" className="w-full justify-center text-sm">
              {t("landing.signIn")}
            </PrimaryBtn>
          </form>
          <p className="text-center text-xs text-[#9CA3AF]">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-[#2F7D7E] hover:underline"
            >
              {t("auth.forgotPassword")}
            </button>
          </p>
        </Card>
        <p className="text-center text-xs text-[#9CA3AF] mt-4">
          <button onClick={() => navigate("/")} className="hover:text-[#6B7280] transition-colors">
            {t("auth.backHome")}
          </button>
        </p>
      </div>
      <InfoModal
        open={showForgot}
        onClose={() => setShowForgot(false)}
        title="Reset your password"
        body={
          <>
            <p>
              In the live product, you would receive a password reset email here. For this demo
              prototype, please reach out to your organization admin or HireSift support.
            </p>
            <p>
              <strong className="font-semibold">Demo admin:</strong> sarah.chen@techcorp.com
              <br />
              <strong className="font-semibold">Support:</strong>{" "}
              <a className="text-[#2F7D7E] hover:underline" href="mailto:support@hiresift.com">
                support@hiresift.com
              </a>
            </p>
          </>
        }
      />
    </div>
  );
}
