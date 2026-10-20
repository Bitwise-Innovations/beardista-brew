import { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  activePage = "Dashboard",
  children,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EEF2F7] text-gray-900">
      <AdminSidebar
        activePage={activePage}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen min-w-0 lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-gray-100 bg-white/95 px-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="hidden items-center gap-2 text-sm text-gray-400 sm:flex">
              <span>Admin</span>
              <span>/</span>
              <span className="font-bold text-[#19244E]">{activePage}</span>
            </div>

            <p className="truncate text-sm font-bold text-[#19244E] sm:hidden">
              {activePage}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 md:flex">
              <Search size={16} className="text-gray-400" />
              <span className="text-xs text-gray-400">Search anything...</span>
            </div>

            <div className="relative rounded-xl p-2 text-gray-500">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#E58422] ring-2 ring-white" />
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#19244E] text-xs font-bold text-white">
              AD
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
