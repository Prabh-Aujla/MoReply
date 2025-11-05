"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MoReplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { href: "/moreply", label: "Dashboard" },
    { href: "/moreply/reviews", label: "Reviews" },
    { href: "/moreply/social", label: "Social Media" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HEADER with tabs */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Left: App name */}
          <h1 className="text-2xl font-extrabold tracking-tight text-blue-600">
            MoReply
          </h1>

          {/* Center: Tabs */}
          <nav className="flex-1 flex justify-center">
            <div className="flex items-center gap-8">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={[
                      "rounded-full px-6 py-2 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100",
                    ].join(" ")}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right: optional tagline */}
          <p className="hidden text-xs text-gray-500 sm:block">
            AI-Powered Review &amp; Comment Management
          </p>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
