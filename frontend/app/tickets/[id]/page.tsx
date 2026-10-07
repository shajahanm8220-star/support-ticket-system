"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Ticket {
  id: number;
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

export default function TicketDetailsPage() {
  const params = useParams();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTicket() {
      try {
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
      } catch (err) {
        console.error(err);
        setError("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadTicket();
    }
  }, [params.id]);

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

        <a href="/tickets" className="back-button">
          ← Back to Tickets
        </a>
      </div>

      <section className="ticket-card">

        <div className="detail">
          <span>Customer</span>
          <strong>{ticket.customer_name}</strong>
        </div>

        <div className="detail">
          <span>Email</span>
          <strong>{ticket.customer_email}</strong>
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
          <strong>{ticket.agent_name || "Unassigned"}</strong>
        </div>

        <div className="detail">
          <span>Created</span>
          <strong>
            {new Date(ticket.created_at).toLocaleString()}
          </strong>
        </div>

        <div className="detail">
          <span>Updated</span>
          <strong>
            {new Date(ticket.updated_at).toLocaleString()}
          </strong>
        </div>

      </section>
    </main>
  );
}