import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  Shield,
  BarChart2,
  Users,
  ClipboardCheck,
  FileText,
  Settings,
  BookOpen,
  Building,
  ChevronDown,
  LogOut,
  Check,
  ListChecks,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Popover } from "../primitives/Popover";
import { ORGANIZATIONS, getCurrentOrgId, setCurrentOrgId } from "../../lib/orgContext";
import { toast } from "../primitives/Toaster";

const NAV_ITEMS = [
  { label: "Dashboard", icon: BarChart2, to: "/app/dashboard", group: "Overview" },
  { label: "Candidates", icon: Users, to: "/app/candidates", group: "Hiring" },
  { label: "Reviewer", icon: ClipboardCheck, to: "/app/reviewer", group: "Hiring" },
  { label: "Trust Reports", icon: FileText, to: "/app/reports", group: "Reports" },
  { label: "Settings", icon: Settings, to: "/app/settings", group: "Admin" },
  { label: "Audit Log", icon: BookOpen, to: "/app/audit-log", group: "Admin" },
  { label: "Checklist", icon: ListChecks, to: "/app/checklist", group: "Admin" },
];

const GROUPS = ["Overview", "Hiring", "Reports", "Admin"];

export function Sidebar() {
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState(getCurrentOrgId());
  const current = ORGANIZATIONS.find((o) => o.id === currentId) ?? ORGANIZATIONS[0];

  const switchOrg = (id: string) => {
    setCurrentOrgId(id);
    setCurrentId(id);
    const next = ORGANIZATIONS.find((o) => o.id === id);
    if (next) toast.success(`Switched to ${next.name}`);
  };

  return (
    <aside className="w-60 bg-[#172033] flex flex-col h-full shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#2F7D7E] rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">HireSift</div>
            <div className="text-white/40 text-xs">Trust Layer</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-white/10">
        <Popover
          align="start"
          trigger={
            <button
              type="button"
              className="w-full flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-white/40" />
              <span className="text-white/70 text-xs flex-1 text-left truncate">{current.name}</span>
              <ChevronDown className="w-3 h-3 text-white/30" />
            </button>
          }
        >
          <div className="min-w-56">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Switch organization
            </p>
            <div className="space-y-1">
              {ORGANIZATIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => switchOrg(o.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left hover:bg-[#F7F8FA]",
                    o.id === current.id && "bg-[#F7F8FA]",
                  )}
                >
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#111827]">{o.name}</p>
                    <p className="text-[10px] text-[#9CA3AF] capitalize">{o.type} · {o.seats} seats</p>
                  </div>
                  {o.id === current.id && <Check className="w-3.5 h-3.5 text-[#2F7D7E]" />}
                </button>
              ))}
            </div>
          </div>
        </Popover>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group);
          return (
            <div key={group} className="mb-5">
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 mb-1.5">
                {group}
              </p>
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                      isActive
                        ? "bg-white/10 text-white font-medium"
                        : "text-white/55 hover:text-white hover:bg-white/5",
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-6 h-6 bg-[#2F7D7E] rounded-full flex items-center justify-center text-white text-xs font-semibold">
            S
          </div>
          <div>
            <div className="text-white text-xs font-medium">Sarah Chen</div>
            <div className="text-white/40 text-[10px]">Hiring Admin</div>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2 px-3 py-2 text-white/40 hover:text-white/70 text-xs rounded-lg hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
