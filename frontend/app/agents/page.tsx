"use client";

import { useEffect, useState } from "react";

interface Agent {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

        setAgents(result.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load agents");
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, []);

  return (
    <main style={{ padding: "30px" }}>
      <h1>Agents</h1>

      {loading && <p>Loading agents...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Department</th>
              <th style={cellStyle}>Status</th>
            </tr>
          </thead>

          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td style={cellStyle}>
                  {agent.name}
                </td>

                <td style={cellStyle}>
                  {agent.email}
                </td>

                <td style={cellStyle}>
                  {agent.department}
                </td>

                <td style={cellStyle}>
                  {agent.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const cellStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left" as const,
};