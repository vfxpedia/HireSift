import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div
      className="flex h-screen bg-[#F7F8FA] overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
