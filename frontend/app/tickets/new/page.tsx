"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createTicket } from "../../../lib/api";

import {
  Priority,
  Category,
  CreateTicketInput,
} from "../../../types/ticket";

export default function NewTicketPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] =
    useState<Priority>("MEDIUM");

  const [category, setCategory] =
    useState<Category>("GENERAL");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    // ================================
    // FRONTEND VALIDATION
    // ================================

    if (customerName.trim() === "") {
      setError("Customer name is required.");
      return;
    }

    if (customerEmail.trim() === "") {
      setError("Customer email is required.");
      return;
    }

    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(customerEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (subject.trim() === "") {
      setError("Subject is required.");
      return;
    }

    if (description.trim().length < 10) {
      setError(
        "Description must contain at least 10 characters."
      );
      return;
    }

    try {
      setLoading(true);

      // ================================
      // CREATE TICKET DATA
      // ================================

      const ticketData: CreateTicketInput = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        subject: subject.trim(),
        description: description.trim(),
        priority,
        category,
      };

      const result = await createTicket(ticketData);

      // Backend returns ticketId
      const ticketId = result.ticketId;

      if (!ticketId) {
        throw new Error(
          "Ticket created, but ticket ID was not returned."
        );
      }

      // Go to ticket details
      router.push(`/tickets/${ticketId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create ticket.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">

        {/* PAGE HEADER */}

        <h1 className="text-3xl font-bold">
          Create New Ticket
        </h1>

        <p className="mt-2 text-gray-600">
          Create a new customer support ticket.
        </p>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-xl bg-white p-8 shadow"
        >

          {/* ERROR */}

          {error && (
            <div className="rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* CUSTOMER NAME */}

          <div>
            <label className="mb-2 block font-medium">
              Customer Name *
            </label>

            <input
              type="text"
              value={customerName}
              onChange={(event) =>
                setCustomerName(event.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="Enter customer name"
            />
          </div>

          {/* CUSTOMER EMAIL */}

          <div>
            <label className="mb-2 block font-medium">
              Customer Email *
            </label>

            <input
              type="email"
              value={customerEmail}
              onChange={(event) =>
                setCustomerEmail(event.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="customer@example.com"
            />
          </div>

          {/* SUBJECT */}

          <div>
            <label className="mb-2 block font-medium">
              Subject *
            </label>

            <input
              type="text"
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="Login problem"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block font-medium">
              Description *
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              className="min-h-32 w-full rounded-lg border p-3"
              placeholder="Describe the problem..."
            />

            <p className="mt-1 text-sm text-gray-500">
              Minimum 10 characters.
            </p>
          </div>

          {/* PRIORITY + CATEGORY */}

          <div className="grid gap-6 md:grid-cols-2">

            {/* PRIORITY */}

            <div>
              <label className="mb-2 block font-medium">
                Priority *
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as Priority
                  )
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="CRITICAL">
                  Critical
                </option>
              </select>
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block font-medium">
                Category *
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value as Category
                  )
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="TECHNICAL">
                  Technical
                </option>

                <option value="BILLING">
                  Billing
                </option>

                <option value="ACCOUNT">
                  Account
                </option>

                <option value="GENERAL">
                  General
                </option>
              </select>
            </div>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Ticket"}
          </button>

        </form>
      </div>
    </main>
  );
}