import type { ReactNode } from "react";
import Link from "next/link";

type Stat = {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
};

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default function MoReplyDashboardPage() {
  const stats: Stat[] = [
    {
      title: "Total Reviews",
      value: "127",
      change: "+12%",
      icon: "⭐",
      color: "text-yellow-500",
    },
    {
      title: "Social Comments",
      value: "284",
      change: "+23%",
      icon: "💬",
      color: "text-blue-600",
    },
    {
      title: "Replies Generated",
      value: "356",
      change: "+18%",
      icon: "⚡",
      color: "text-green-500",
    },
    {
      title: "Pending Responses",
      value: "42",
      change: "-8%",
      icon: "⏰",
      color: "text-orange-500",
    },
  ];

  return (
    <section className="space-y-10">
      <div className="grid items-start gap-10 md:grid-cols-[3fr,2fr]">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            MoFlo Cloud · MoReply
          </p>

          <h1 className="mb-5 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            <span className="block text-blue-600">AI Replies</span>
            <span className="block">For Small Business</span>
            <span className="block">Success</span>
          </h1>

          <p className="mb-6 max-w-xl text-base text-gray-600 md:text-lg">
            Every business deserves the AI advantage. MoReply makes
            enterprise-level automation accessible to small businesses with
            simple setup and immediate impact on customer reviews and comments.
          </p>

          <div className="mb-4 flex flex-wrap gap-4">
            <Link
              href="/moreply/create"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-black transition"
            >
              Create New Template
            </Link>
            <Link
              href="/moreply/view"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-100 transition"
            >
              View Your Templates
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            Conceptually supports Google, Yelp, Facebook &amp; Instagram
            integrations (placeholder connections for this assignment).
          </p>
        </div>

        <div className="hidden md:block">
          <Card className="p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
              Auto-replies this week
            </p>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Leads from replies</p>
                <p className="text-3xl font-semibold text-gray-900">218</p>
              </div>
              <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                ↑ 57% vs last week
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Avg response time</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  3.2 min
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
