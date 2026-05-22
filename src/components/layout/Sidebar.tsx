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
} from "lucide-react";
import { cn } from "../../lib/cn";

const NAV_ITEMS = [
  { label: "Dashboard", icon: BarChart2, to: "/app/dashboard", group: "Overview" },
  { label: "Candidates", icon: Users, to: "/app/candidates", group: "Hiring" },
  { label: "Reviewer", icon: ClipboardCheck, to: "/app/reviewer", group: "Hiring" },
  { label: "Trust Reports", icon: FileText, to: "/app/reports", group: "Reports" },
  { label: "Settings", icon: Settings, to: "/app/settings", group: "Admin" },
  { label: "Audit Log", icon: BookOpen, to: "/app/audit-log", group: "Admin" },
];

const GROUPS = ["Overview", "Hiring", "Reports", "Admin"];

export function Sidebar() {
  const navigate = useNavigate();

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
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
          <Building className="w-3.5 h-3.5 text-white/40" />
          <span className="text-white/60 text-xs">TechCorp Hiring</span>
          <ChevronDown className="w-3 h-3 text-white/30 ml-auto" />
        </div>
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
