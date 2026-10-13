"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RecentTicket {
  id: number;
  customer_name: string;
  subject: string;
  priority: string;
  status: string;
  created_at: string;
}

interface DashboardData {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  recentTickets: RecentTicket[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyle(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "CLOSED":
      return "bg-slate-100 text-slate-600 ring-slate-500/20";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-500/20";
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return "text-red-700";
    case "HIGH":
      return "text-orange-700";
    case "MEDIUM":
      return "text-amber-700";
    case "LOW":
      return "text-slate-500";
    default:
      return "text-slate-600";
  }
}

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/dashboard`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load dashboard data.");
      }

      const data: DashboardData = await response.json();
      setDashboard(data);
    } catch {
      setError(
        "Unable to connect to the dashboard. Please check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const stats = [
    {
      label: "Total tickets",
      value: dashboard?.total ?? 0,
      description: "All customer support tickets",
      icon: "▤",
      iconStyle: "bg-blue-50 text-blue-700",
    },
    {
      label: "Open tickets",
      value: dashboard?.open ?? 0,
      description: "Waiting for attention",
      icon: "◷",
      iconStyle: "bg-amber-50 text-amber-700",
    },
    {
      label: "In progress",
      value: dashboard?.inProgress ?? 0,
      description: "Currently being handled",
      icon: "↗",
      iconStyle: "bg-violet-50 text-violet-700",
    },
    {
      label: "Resolved",
      value: dashboard?.resolved ?? 0,
      description: "Successfully resolved",
      icon: "✓",
      iconStyle: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              S
            </div>

            <div>
              <h1 className="text-base font-bold tracking-tight">
                SupportDesk
              </h1>
              <p className="text-xs text-slate-500">
                Ticket management
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 text-sm font-semibold text-blue-700"
            >
              <span className="text-lg">▦</span>
              Dashboard
            </Link>

            <Link
              href="/tickets"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <span className="text-lg">▤</span>
              All tickets
            </Link>

            <Link
              href="/tickets/new"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <span className="text-lg">＋</span>
              Create ticket
            </Link>

            <Link
              href="/agents"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <span className="text-lg">♙</span>
              Support agents
            </Link>
          </nav>

          <div className="border-t border-slate-100 p-5">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                Support workspace
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Manage customer issues and track ticket progress in one place.
              </p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div>
              <p className="text-sm text-slate-500">
                Workspace / Overview
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Dashboard
              </h2>
            </div>

            <Link
              href="/tickets/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="text-lg leading-none">+</span>
              Create ticket
            </Link>
          </header>

          <div className="mx-auto max-w-[1600px] space-y-8 p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                  Support overview
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Monitor ticket activity and keep track of customer requests.
                </p>
              </div>

              <Link
                href="/tickets"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                View all tickets →
              </Link>
            </div>

            {loading && (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500"
                role="status"
              >
                Loading dashboard data...
              </div>
            )}

            {error && !loading && (
              <div
                className="rounded-2xl border border-red-200 bg-red-50 p-5"
                role="alert"
              >
                <p className="font-semibold text-red-800">
                  Dashboard unavailable
                </p>
                <p className="mt-1 text-sm leading-6 text-red-700">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => void loadDashboard()}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && dashboard && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <article
                      key={stat.label}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-slate-500">
                          {stat.label}
                        </p>
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl font-semibold ${stat.iconStyle}`}
                        >
                          {stat.icon}
                        </div>
                      </div>

                      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        {stat.description}
                      </p>
                    </article>
                  ))}
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Recent tickets
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        The latest customer support requests.
                      </p>
                    </div>

                    <Link
                      href="/tickets"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View all
                    </Link>
                  </div>

                  {dashboard.recentTickets.length === 0 ? (
                    <div className="px-5 py-12 text-center sm:px-6">
                      <h4 className="font-semibold text-slate-800">
                        No tickets yet
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Create a ticket to see it listed here.
                      </p>
                      <Link
                        href="/tickets/new"
                        className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Create your first ticket
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-6 py-4 font-semibold">Ticket</th>
                            <th className="px-6 py-4 font-semibold">Customer</th>
                            <th className="px-6 py-4 font-semibold">Priority</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Created</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {dashboard.recentTickets.map((ticket) => (
                            <tr key={ticket.id} className="transition hover:bg-slate-50">
                              <td className="px-6 py-4">
                                <Link
                                  href={`/tickets/${ticket.id}`}
                                  className="font-semibold text-blue-700 hover:text-blue-800"
                                >
                                  #{ticket.id}
                                </Link>
                                <p className="mt-1 max-w-xs truncate text-slate-700">
                                  {ticket.subject}
                                </p>
                              </td>

                              <td className="px-6 py-4 font-medium text-slate-700">
                                {ticket.customer_name}
                              </td>

                              <td className="px-6 py-4">
                                <span className={`font-semibold ${getPriorityStyle(ticket.priority)}`}>
                                  {ticket.priority}
                                </span>
                              </td>

                              <td className="px-6 py-4">
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(ticket.status)}`}>
                                  {formatStatus(ticket.status)}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                                {formatDate(ticket.created_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="mb-4 font-bold text-slate-900">
                    Quick actions
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Link
                      href="/tickets/new"
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                        +
                      </span>
                      <p className="mt-4 font-semibold text-slate-900">
                        Create a ticket
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Record a new customer issue.
                      </p>
                      <p className="mt-4 text-sm font-semibold text-blue-700">
                        Get started →
                      </p>
                    </Link>

                    <Link
                      href="/tickets"
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-700">
                        ▤
                      </span>
                      <p className="mt-4 font-semibold text-slate-900">
                        Manage tickets
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Search and update support requests.
                      </p>
                      <p className="mt-4 text-sm font-semibold text-blue-700">
                        Open tickets →
                      </p>
                    </Link>

                    <Link
                      href="/agents"
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">
                        ♙
                      </span>
                      <p className="mt-4 font-semibold text-slate-900">
                        Support agents
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        View the support team.
                      </p>
                      <p className="mt-4 text-sm font-semibold text-blue-700">
                        View agents →
                      </p>
                    </Link>
                  </div>
                </section>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}