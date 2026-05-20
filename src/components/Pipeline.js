import { useState } from "react";
import { PIPELINE_STAGES } from "../lib/storage";

const STAGE_COLORS = {
  "Identified": "#6366f1",
  "Applied": "#3b82f6",
  "Outreach Sent": "#8b5cf6",
  "Interview": "#f59e0b",
  "Offer": "#10b981",
  "Rejected": "#6b7280"
};

export default function Pipeline({ pipeline, onUpdateStage, onUpdateNotes, onRemove }) {
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [view, setView] = useState("board");

  const entries = Object.entries(pipeline);
  const byStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = entries.filter(([, job]) => job.stage === stage);
    return acc;
  }, {});

  const activeCount = entries.filter(([, j]) => !["Offer", "Rejected"].includes(j.stage)).length;
  const offerCount = entries.filter(([, j]) => j.stage === "Offer").length;
  const appliedCount = entries.filter(([, j]) => ["Applied", "Outreach Sent", "Interview"].includes(j.stage)).length;

  const startEditingNotes = (key, current) => {
    setEditingNotes(key);
    setNotesDraft(current || "");
  };

  const saveNotes = (key) => {
    onUpdateNotes(key, notesDraft);
    setEditingNotes(null);
  };

  if (entries.length === 0) {
    return (
      <div className="pipeline-empty">
        <p className="empty-icon">⊟</p>
        <p className="empty-title">Your pipeline is empty</p>
        <p className="empty-sub">Find roles in the Search tab and add them to your pipeline to track your applications.</p>
      </div>
    );
  }

  return (
    <div className="pipeline-page">
      <div className="pipeline-header">
        <div>
          <h2 className="pipeline-title">Application Pipeline</h2>
          <p className="pipeline-sub">
            {activeCount} active · {appliedCount} applied/in progress · {offerCount} offer{offerCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="pipeline-view-toggle">
          <button
            className={`view-btn ${view === "board" ? "active" : ""}`}
            onClick={() => setView("board")}
          >Board</button>
          <button
            className={`view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >List</button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="pipeline-progress">
        {PIPELINE_STAGES.map(stage => {
          const count = byStage[stage].length;
          return (
            <div key={stage} className="progress-segment" style={{ "--stage-color": STAGE_COLORS[stage] }}>
              <div className="progress-bar-fill" style={{ width: `${count > 0 ? Math.max(8, (count / entries.length) * 100) : 0}%` }} />
              <span className="progress-label">{stage} ({count})</span>
            </div>
          );
        })}
      </div>

      {view === "board" ? (
        <div className="pipeline-board">
          {PIPELINE_STAGES.map(stage => (
            <div key={stage} className="pipeline-column">
              <div className="column-header" style={{ "--stage-color": STAGE_COLORS[stage] }}>
                <span className="column-title">{stage}</span>
                <span className="column-count">{byStage[stage].length}</span>
              </div>
              <div className="column-cards">
                {byStage[stage].map(([key, job]) => (
                  <div key={key} className="pipeline-card">
                    <div className="pcard-top">
                      <div>
                        <p className="pcard-org">{job.organization}</p>
                        <p className="pcard-title">{job.title}</p>
                      </div>
                      <button
                        className="pcard-remove"
                        onClick={() => onRemove(key)}
                        title="Remove"
                      >✕</button>
                    </div>

                    <div className="pcard-visa">
                      {(job.visaRoute === "J-1" || job.visaRoute === "BOTH") && (
                        <span className="badge badge-j1 badge-sm">{job.j1Viability === "HIGH" ? "J-1 ✓" : "J-1"}</span>
                      )}
                      {(job.visaRoute === "E-2" || job.visaRoute === "BOTH") && (
                        <span className="badge badge-e2 badge-sm">E-2</span>
                      )}
                    </div>

                    <div className="pcard-stage">
                      <select
                        className="stage-select-sm"
                        value={job.stage}
                        onChange={e => onUpdateStage(key, e.target.value)}
                      >
                        {PIPELINE_STAGES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {editingNotes === key ? (
                      <div className="notes-editor">
                        <textarea
                          className="notes-input"
                          value={notesDraft}
                          onChange={e => setNotesDraft(e.target.value)}
                          placeholder="Add notes, contact name, follow-up date…"
                          rows={3}
                        />
                        <div className="notes-actions">
                          <button className="btn-sm btn-save" onClick={() => saveNotes(key)}>Save</button>
                          <button className="btn-sm" onClick={() => setEditingNotes(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="notes-toggle"
                        onClick={() => startEditingNotes(key, job.notes)}
                      >
                        {job.notes ? `📝 ${job.notes.slice(0, 40)}${job.notes.length > 40 ? "…" : ""}` : "+ Add notes"}
                      </button>
                    )}

                    {job.url && job.url !== "null" && (
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="pcard-link">
                        View listing ↗
                      </a>
                    )}
                  </div>
                ))}
                {byStage[stage].length === 0 && (
                  <div className="column-empty">—</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pipeline-list">
          <table className="pipeline-table">
            <thead>
              <tr>
                <th>Organisation</th>
                <th>Role</th>
                <th>Visa</th>
                <th>Status</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([key, job]) => (
                <tr key={key} className={`stage-row-${job.stage.toLowerCase().replace(/\s+/g, "-")}`}>
                  <td className="table-org">{job.organization}</td>
                  <td className="table-title">{job.title}</td>
                  <td>
                    <span className="badge badge-sm badge-j1">{job.visaRoute}</span>
                  </td>
                  <td>
                    <select
                      className="stage-select-sm"
                      value={job.stage}
                      onChange={e => onUpdateStage(key, e.target.value)}
                    >
                      {PIPELINE_STAGES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {editingNotes === key ? (
                      <div className="notes-editor-inline">
                        <input
                          className="notes-input-inline"
                          value={notesDraft}
                          onChange={e => setNotesDraft(e.target.value)}
                          placeholder="Notes…"
                        />
                        <button className="btn-sm btn-save" onClick={() => saveNotes(key)}>✓</button>
                        <button className="btn-sm" onClick={() => setEditingNotes(null)}>✕</button>
                      </div>
                    ) : (
                      <button className="notes-toggle-inline" onClick={() => startEditingNotes(key, job.notes)}>
                        {job.notes ? job.notes.slice(0, 30) + (job.notes.length > 30 ? "…" : "") : "+ Notes"}
                      </button>
                    )}
                  </td>
                  <td>
                    <button className="btn-sm btn-danger" onClick={() => onRemove(key)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Funnel target */}
      <div className="funnel-target">
        <p className="funnel-title">Application funnel target</p>
        <div className="funnel-grid">
          <div className="funnel-item">
            <span className="funnel-num">{entries.length}</span>
            <span className="funnel-label">of 80–120</span>
            <span className="funnel-desc">Orgs identified</span>
          </div>
          <div className="funnel-item">
            <span className="funnel-num">{["Applied", "Outreach Sent", "Interview", "Offer"].reduce((n, s) => n + byStage[s].length, 0)}</span>
            <span className="funnel-label">of 40–60</span>
            <span className="funnel-desc">Applications sent</span>
          </div>
          <div className="funnel-item">
            <span className="funnel-num">{byStage["Interview"].length}</span>
            <span className="funnel-label">of 5–10</span>
            <span className="funnel-desc">Interviews</span>
          </div>
          <div className="funnel-item">
            <span className="funnel-num">{byStage["Offer"].length}</span>
            <span className="funnel-label">target: 1+</span>
            <span className="funnel-desc">Offers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
