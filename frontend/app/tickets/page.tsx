"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getTickets } from "../../lib/api";
import { Ticket } from "../../types/ticket";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadTickets() {
    try {
      setLoading(true);
      setError("");

      const result = await getTickets(
        page,
        10,
        search,
        status,
        priority,
        category,
        "",
        sort
      );

      setTickets(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error(error);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [page, status, priority, category, sort]);

  function handleSearch() {
    setPage(1);
    loadTickets();
  }

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          Tickets
        </h1>

        <Link href="/tickets/new">
          <button>Create Ticket</button>
        </Link>
      </div>

      {/* Search */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "25px",
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer, email or subject"
          style={{
            flex: "1 1 250px",
            minWidth: 0,
            padding: "10px",
            boxSizing: "border-box",
          }}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Filters */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Category</option>
          <option value="TECHNICAL">Technical</option>
          <option value="BILLING">Billing</option>
          <option value="ACCOUNT">Account</option>
          <option value="GENERAL">General</option>
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Loading */}

      {loading && (
        <p
          style={{
            marginTop: "30px",
          }}
        >
          Loading tickets...
        </p>
      )}

      {/* Error */}

      {error && (
        <p
          style={{
            marginTop: "30px",
            color: "red",
          }}
        >
          {error}
        </p>
      )}

      {/* Tickets */}

      {!loading && !error && (
        <>
          {/* Responsive Table */}

          <div
            style={{
              width: "100%",
              overflowX: "auto",
              marginTop: "30px",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "850px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Agent</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>

                    <td>{ticket.customer_name}</td>

                    <td>
                      <Link href={`/tickets/${ticket.id}`}>
                        {ticket.subject}
                      </Link>
                    </td>

                    <td>{ticket.priority}</td>

                    <td>{ticket.status}</td>

                    <td>
                      {ticket.agent_name || "Unassigned"}
                    </td>

                    <td>
                      {new Date(
                        ticket.created_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Tickets */}

          {tickets.length === 0 && (
            <p>No tickets found.</p>
          )}

          {/* Pagination */}

          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}