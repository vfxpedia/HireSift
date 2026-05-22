import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Users,
  Clock,
  FileText,
  AlertTriangle,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TopBar } from "../components/layout/TopBar";
import { Card } from "../components/primitives/Card";
import { PrimaryBtn } from "../components/primitives/Buttons";
import { AttentionBadge, StatusBadge } from "../components/primitives/Badges";
import { CreateVerificationModal } from "../components/modals/CreateVerificationModal";
import { cn } from "../lib/cn";
import {
  listCandidates,
  dashboardStats,
  attentionDistribution,
} from "../api/candidates";
import { WEEKLY_DATA } from "../lib/seed";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const stats = dashboardStats();
  const dist = attentionDistribution();
  const candidates = listCandidates();

  void tick;

  const statCards = [
    {
      label: "Total Candidates",
      value: stats.total,
      icon: <Users className="w-4 h-4" />,
      color: "text-[#172033]",
      bg: "bg-[#172033]/8",
    },
    {
      label: "Pending Submission",
      value: stats.pending,
      icon: <Clock className="w-4 h-4" />,
      color: "text-[#C6923A]",
      bg: "bg-[#C6923A]/8",
    },
    {
      label: "Reports Ready",
      value: stats.reportsReady,
      icon: <FileText className="w-4 h-4" />,
      color: "text-[#2F7D7E]",
      bg: "bg-[#2F7D7E]/8",
    },
    {
      label: "High Attention",
      value: stats.highAttention,
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "text-[#8A6422]",
      bg: "bg-[#C6923A]/8",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Dashboard"
        subtitle="Overview of your hiring pipeline"
        actions={
          <PrimaryBtn
            onClick={() => setShowModal(true)}
            icon={<Plus className="w-4 h-4" />}
            className="text-sm py-2"
          >
            New Verification
          </PrimaryBtn>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => (
            <Card key={s.label} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-[#6B7280]">{s.label}</p>
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", s.bg, s.color)}>
                  {s.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-[#111827]">{s.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          <Card className="col-span-2 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-[#111827]">Weekly Activity</h3>
              <span className="text-xs text-[#6B7280]">This week</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={WEEKLY_DATA} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="submissions" fill="#2F7D7E" radius={[4, 4, 0, 0]} name="Submissions" />
                <Bar dataKey="reviews" fill="#C6923A" radius={[4, 4, 0, 0]} name="Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-sm text-[#111827] mb-4">Attention Distribution</h3>
            <div className="flex justify-center mb-4">
              <PieChart width={140} height={140}>
                <Pie data={dist} cx={65} cy={65} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {dist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2">
              {dist.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[#6B7280]">{d.name}</span>
                  </div>
                  <span className="font-medium text-[#374151]">{d.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <h3 className="font-semibold text-sm text-[#111827]">Recent Candidates</h3>
            <button onClick={() => navigate("/app/candidates")} className="text-xs text-[#2F7D7E] hover:underline">
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  {["Candidate", "Role", "Status", "Attention", "Report", "Updated"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-[#6B7280]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidates.slice(0, 4).map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                    onClick={() => navigate(`/app/candidates/${c.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{c.name}</p>
                        <p className="text-xs text-[#6B7280] font-mono">{c.code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{c.role}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.submissionStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <AttentionBadge level={c.attentionLevel} />
                    </td>
                    <td className="px-4 py-3">
                      {c.reportReady ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/reports/${c.id}`);
                          }}
                          className="text-xs text-[#2F7D7E] hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">Not ready</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{c.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {showModal && (
        <CreateVerificationModal
          onClose={() => {
            setShowModal(false);
            refresh();
          }}
          onCreated={(c) => {
            setShowModal(false);
            navigate(`/app/candidates/${c.id}`);
          }}
        />
      )}
    </div>
  );
}
