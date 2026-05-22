import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield } from "lucide-react";
import { Card } from "../components/primitives/Card";
import { PrimaryBtn } from "../components/primitives/Buttons";
import { Field, TextInput } from "../components/primitives/Field";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sarah.chen@techcorp.com");
  const [password, setPassword] = useState("demo-password");

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#172033] rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#172033] mb-1">Sign in to HireSift</h1>
          <p className="text-sm text-[#6B7280]">Secure access for hiring teams</p>
        </div>
        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4 mb-6">
            <Field label="Work email">
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <PrimaryBtn type="submit" className="w-full justify-center text-sm">
              Sign in
            </PrimaryBtn>
          </form>
          <p className="text-center text-xs text-[#9CA3AF]">
            <a href="#" className="text-[#2F7D7E] hover:underline">
              Forgot password?
            </a>
          </p>
        </Card>
        <p className="text-center text-xs text-[#9CA3AF] mt-4">
          <button onClick={() => navigate("/")} className="hover:text-[#6B7280] transition-colors">
            ← Back to homepage
          </button>
        </p>
      </div>
    </div>
  );
}
