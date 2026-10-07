"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Ticket {
  id: number;
  customer_id: number;
  agent_id: number | null;
  customer_name: string;
  customer_email: string;
  agent_name: string | null;
  subject: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Agent {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
}

export default function TicketDetailsPage() {
  const params = useParams();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  const [selectedAgent, setSelectedAgent] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadTicket() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/tickets/${params.id}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load ticket");
      }

      const result = await response.json();

      setTicket(result.data);

      setSelectedAgent(
        result.data.agent_id
          ? String(result.data.agent_id)
          : ""
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }

  async function loadAgents() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/agents",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load agents");
      }

      const result = await response.json();

      setAgents(result.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (params.id) {
      loadTicket();
      loadAgents();
    }
  }, [params.id]);

  async function handleAssignAgent() {
    if (!selectedAgent) {
      setMessage("Please select an agent.");
      return;
    }

    try {
      setAssigning(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/tickets/${params.id}/agent`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agentId: Number(selectedAgent),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to assign agent"
        );
      }

      setMessage("Agent assigned successfully.");

      await loadTicket();
    } catch (err) {
      console.error(err);

      setMessage(
        err instanceof Error
          ? err.message
          : "Failed to assign agent"
      );
    } finally {
      setAssigning(false);
    }
  }

  if (loading) {
    return (
      <main className="ticket-page">
        <p>Loading ticket...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ticket-page">
        <p className="error">{error}</p>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="ticket-page">
        <p>Ticket not found.</p>
      </main>
    );
  }

  return (
    <main className="ticket-page">
      <div className="ticket-header">
        <h1>Ticket #{ticket.id}</h1>

        <a
          href="/tickets"
          className="back-button"
        >
          ← Back to Tickets
        </a>
      </div>

      <section className="ticket-card">
        <div className="detail">
          <span>Customer</span>
          <strong>
            {ticket.customer_name}
          </strong>
        </div>

        <div className="detail">
          <span>Email</span>
          <strong>
            {ticket.customer_email}
          </strong>
        </div>

        <div className="detail">
          <span>Subject</span>
          <strong>{ticket.subject}</strong>
        </div>

        <div className="detail">
          <span>Description</span>
          <strong>{ticket.description}</strong>
        </div>

        <div className="detail">
          <span>Priority</span>
          <strong>{ticket.priority}</strong>
        </div>

        <div className="detail">
          <span>Category</span>
          <strong>{ticket.category}</strong>
        </div>

        <div className="detail">
          <span>Status</span>
          <strong>{ticket.status}</strong>
        </div>

        <div className="detail">
          <span>Agent</span>
          <strong>
            {ticket.agent_name || "Unassigned"}
          </strong>
        </div>

        {/* Assign Agent */}

        <div
          style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #ddd",
          }}
        >
          <h3>Assign Agent</h3>

          <select
            value={selectedAgent}
            onChange={(e) =>
              setSelectedAgent(e.target.value)
            }
            style={{
              padding: "10px",
              marginRight: "10px",
              minWidth: "220px",
            }}
          >
            <option value="">
              Select Agent
            </option>

            {agents.map((agent) => (
              <option
                key={agent.id}
                value={agent.id}
              >
                {agent.name} - {agent.department}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignAgent}
            disabled={assigning || !selectedAgent}
            style={{
              padding: "10px 16px",
              cursor:
                assigning || !selectedAgent
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {assigning
              ? "Assigning..."
              : "Assign Agent"}
          </button>

          {message && (
            <p
              style={{
                marginTop: "10px",
              }}
            >
              {message}
            </p>
          )}
        </div>

        <div className="detail">
          <span>Created</span>
          <strong>
            {new Date(
              ticket.created_at
            ).toLocaleString()}
          </strong>
        </div>

        <div className="detail">
          <span>Updated</span>
          <strong>
            {new Date(
              ticket.updated_at
            ).toLocaleString()}
          </strong>
        </div>
      </section>
    </main>
  );
}