import React from "react";

export default function PromptForm({
  systemPrompt,
  setSystemPrompt,
  userPrompt,
  setUserPrompt,
  model,
  setModel,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  presencePenalty,
  setPresencePenalty,
  frequencyPenalty,
  setFrequencyPenalty,
  stopSequence,
  setStopSequence,
  onRunTests,
  loading,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onRunTests();
      }}
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "700px",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Model: </strong>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            <option value="gpt-4">gpt-4</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>System Prompt:</strong><br />
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={3}
            cols={60}
            placeholder="System prompt for the assistant"
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>User Prompt:</strong><br />
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={3}
            cols={60}
            placeholder="User prompt (e.g., Describe the iPhone)"
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Temperature: </strong>
          <input
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Max Tokens: </strong>
          <select
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
          >
            <option value={50}>50</option>
            <option value={150}>150</option>
            <option value={300}>300</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Presence Penalty: </strong>
          <select
            value={presencePenalty}
            onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
          >
            <option value={0.0}>0.0</option>
            <option value={1.5}>1.5</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Frequency Penalty: </strong>
          <select
            value={frequencyPenalty}
            onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
          >
            <option value={0.0}>0.0</option>
            <option value={1.5}>1.5</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <strong>Stop Sequence: </strong>
          <input
            type="text"
            value={stopSequence}
            onChange={(e) => setStopSequence(e.target.value)}
            placeholder="Optional"
          />
        </label>
      </div>

      <button type="submit" disabled={loading} style={{ padding: "8px 20px" }}>
        {loading ? "Running..." : "Run Tests"}
      </button>
    </form>
  );
}
