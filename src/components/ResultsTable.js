import React from "react";

export default function ResultsTable({ results }) {
  if (!results.length) return null;

  return (
    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Temperature</th>
            <th>Max Tokens</th>
            <th>Presence Penalty</th>
            <th>Frequency Penalty</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx}>
              <td>{r.temperature}</td>
              <td>{r.max_tokens}</td>
              <td>{r.presence_penalty}</td>
              <td>{r.frequency_penalty}</td>
              <td style={{ whiteSpace: "pre-wrap", maxWidth: "600px" }}>
                {r.output}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
