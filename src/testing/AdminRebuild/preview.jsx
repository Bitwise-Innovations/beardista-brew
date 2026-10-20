import React from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import "../../index.css";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import MenuManagement from "./pages/MenuManagement";
import Analytics from "./pages/Analytics";

const sections = [
  {
    path: "/admin/menu-management",
    title: "Menu Management",
    description: "Manage and organize the café menu.",
  },
  {
    path: "/admin/analytics",
    title: "Analytics",
    description: "Review café performance and business insights.",
  },
  {
    path: "/admin/content-management",
    title: "Content Management",
    description: "Manage the content displayed across the café system.",
  },
  {
    path: "/admin/user-management",
    title: "User Management",
    description: "View and manage system user information.",
  },
  {
    path: "/admin/audit-logs",
    title: "Audit Logs",
    description: "Review a record of system activities.",
  },
  {
    path: "/admin/events",
    title: "Events",
    description: "Organize and review café events.",
  },
  {
    path: "/admin/settings",
    title: "Settings",
    description: "Review administrator settings.",
  },
];

function PlaceholderPage({ title, description }) {
  return (
    <AdminLayout activePage={title}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-[#E58422]">
            ADMIN WORKSPACE
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-[#19244E] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        </div>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mx-auto flex max-w-lg flex-col items-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              ☕
            </div>
            <h2 className="mt-5 text-lg font-bold text-[#19244E]">
              Page ready for development
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Routing is working. The actual {title.toLowerCase()} features
              have not been implemented in this preview yet.
            </p>
            <Link
              to="/admin/dashboard"
              className="mt-6 rounded-xl bg-[#19244E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#27376f]"
            >
              Return to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEF2F7] px-5">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-[#E58422]">404 ERROR</p>
        <h1 className="mt-3 text-2xl font-extrabold text-[#19244E]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          This URL does not match a page in the admin preview.
        </p>
        <Link
          to="/admin/dashboard"
          className="mt-6 inline-flex rounded-xl bg-[#19244E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#27376f]"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

function AdminRebuildApp() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout activePage="Dashboard">
              <AdminDashboard />
            </AdminLayout>
          }
        />


        {sections.map((section) => (
          <Route
            key={section.path}
            path={section.path}
          element={
  section.path === "/admin/menu-management" ? (
    <AdminLayout activePage="Menu Management">
      <MenuManagement />
    </AdminLayout>
  ) : section.path === "/admin/analytics" ? (
    <AdminLayout activePage="Analytics">
      <Analytics />
    </AdminLayout>
  ) : (
    <PlaceholderPage
      title={section.title}
      description={section.description}
    />
  )
}
          />
        ))}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminRebuildApp />
  </React.StrictMode>
);
