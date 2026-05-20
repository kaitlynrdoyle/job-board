import { useState } from "react";
import { generateOutreachDraft } from "../lib/api";
import { PIPELINE_STAGES } from "../lib/storage";

function VisaBadge({ route, j1, e2 }) {
  return (
    <div className="visa-badges">
      {(route === "J-1" || route === "BOTH") && (
        <span className={`badge badge-j1 badge-${j1?.toLowerCase()}`}>
          J-1 · {j1}
        </span>
      )}
      {(route === "E-2" || route === "BOTH") && (
        <span className={`badge badge-e2 badge-e2-${e2?.toLowerCase()}`}>
          E-2 · {e2}
        </span>
      )}
      {route === "UNCLEAR" && (
        <span className="badge badge-unclear">Visa TBC</span>
      )}
    </div>
  );
}

function FitScore({ score }) {
  const color = score >= 80 ? "#4ade80" : score >= 60 ? "#facc15" : "#fb923c";
  return (
    <div className="fit-score" style={{ "--score-color": color }}>
      <svg viewBox="0 0 36 36" className="fit-ring">
        <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="15" fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={`${(score / 100) * 94} 94`}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="fit-num">{score}</span>
    </div>
  );
}

function JobCard({ job, isSelected, onSelect, onAddToPipeline, inPipeline }) {
  const isPriority = job.priorityMatch;
  return (
    <div
      className={`job-card ${isSelected ? "selected" : ""} ${isPriority ? "priority" : ""}`}
      onClick={() => onSelect(job)}
    >
      <div className="card-top">
        <div className="card-main">
          <p className="card-org">{job.organization}</p>
          <h3 className="card-title">{job.title}</h3>
          <p className="card-meta">
            <span>{job.location}</span>
            {job.salary && <span>· {job.salary}</span>}
            {job.term && job.term !== "null" && <span>· {job.term}</span>}
          </p>
        </div>
        <FitScore score={job.fitScore || 70} />
      </div>

      <VisaBadge route={job.visaRoute} j1={job.j1Viability} e2={job.e2Eligible} />

      {job.salaryException && (
        <p className="exception-note">⚡ Funded study exception</p>
      )}

      {isPriority && (
        <p className="priority-note">★ Matches your focus tags</p>
      )}

      <div className="card-actions">
        {inPipeline ? (
          <span className="in-pipeline-badge">✓ In pipeline · {inPipeline}</span>
        ) : (
          <button
            className="btn-sm btn-add"
            onClick={e => { e.stopPropagation(); onAddToPipeline(job, "Identified"); }}
          >
            + Add to pipeline
          </button>
        )}
        {job.url && job.url !== "null" && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sm btn-link"
            onClick={e => e.stopPropagation()}
          >
            View listing ↗
          </a>
        )}
      </div>
    </div>
  );
}

function JobDetail({ job, onAddToPipeline, inPipeline, onClose, resumeText, profile }) {
  const [outreach, setOutreach] = useState("");
  const [outreachType, setOutreachType] = useState(null);
  const [generatingOutreach, setGeneratingOutreach] = useState(false);
  const [addStage, setAddStage] = useState("Identified");
  const [copied, setCopied] = useState(false);

  const handleGenerateOutreach = async (type) => {
    setOutreachType(type);
    setGeneratingOutreach(true);
    try {
      const draft = await generateOutreachDraft({ job, profile, resumeText, type });
      setOutreach(draft);
    } catch (err) {
      setOutreach("Failed to generate draft. Please try again.");
    } finally {
      setGeneratingOutreach(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outreach);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="job-detail">
      <div className="detail-header">
        <button className="detail-close" onClick={onClose}>✕</button>
        <p className="detail-org">{job.organization}</p>
        <h2 className="detail-title">{job.title}</h2>
        <p className="detail-meta">
          {job.location}
          {job.salary && job.salary !== "null" ? ` · ${job.salary}` : ""}
          {job.term && job.term !== "null" ? ` · ${job.term}` : ""}
        </p>
        <VisaBadge route={job.visaRoute} j1={job.j1Viability} e2={job.e2Eligible} />
      </div>

      <div className="detail-body">
        {/* Fit */}
        <div className="detail-section">
          <h4>Why this matches you</h4>
          <p>{job.fitReason}</p>
          <div className="fit-bar">
            <div className="fit-fill" style={{ width: `${job.fitScore || 70}%` }} />
          </div>
          <p className="fit-label">Fit score: {job.fitScore || 70}/100</p>
        </div>

        {/* Description */}
        <div className="detail-section">
          <h4>Role description</h4>
          <p>{job.description}</p>
        </div>

        {/* J-1 assessment */}
        <div className={`detail-section visa-section j1-section viability-${job.j1Viability?.toLowerCase()}`}>
          <h4>J-1 Intern viability · <span className={`inline-badge ${job.j1Viability?.toLowerCase()}`}>{job.j1Viability}</span></h4>
          <p>{job.j1Reason}</p>
        </div>

        {/* E-2 assessment */}
        <div className={`detail-section visa-section e2-section e2-${job.e2Eligible?.toLowerCase()}`}>
          <h4>E-2 Treaty eligibility · <span className={`inline-badge e2-${job.e2Eligible?.toLowerCase()}`}>{job.e2Eligible}</span></h4>
          <p>{job.e2Reason}</p>
        </div>

        {/* Source */}
        {job.source && (
          <p className="detail-source">Found on: {job.source}</p>
        )}

        {/* Pipeline */}
        <div className="detail-section">
          <h4>Add to pipeline</h4>
          {inPipeline ? (
            <p className="in-pipeline-badge">✓ Already in pipeline as: {inPipeline}</p>
          ) : (
            <div className="pipeline-add">
              <select
                className="stage-select"
                value={addStage}
                onChange={e => setAddStage(e.target.value)}
              >
                {PIPELINE_STAGES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                className="btn-primary"
                onClick={() => onAddToPipeline(job, addStage)}
              >
                Add to pipeline
              </button>
            </div>
          )}
        </div>

        {/* Outreach */}
        <div className="detail-section">
          <h4>Generate outreach draft</h4>
          <div className="outreach-btns">
            {(job.visaRoute === "J-1" || job.visaRoute === "BOTH" || job.visaRoute === "UNCLEAR") && (
              <button
                className="btn-secondary"
                onClick={() => handleGenerateOutreach("j1")}
                disabled={generatingOutreach}
              >
                {generatingOutreach && outreachType === "j1" ? "Generating…" : "J-1 host pitch"}
              </button>
            )}
            {(job.visaRoute === "E-2" || job.visaRoute === "BOTH") && (
              <button
                className="btn-secondary"
                onClick={() => handleGenerateOutreach("e2")}
                disabled={generatingOutreach}
              >
                {generatingOutreach && outreachType === "e2" ? "Generating…" : "E-2 employer pitch"}
              </button>
            )}
          </div>
          {outreach && (
            <div className="outreach-output">
              <div className="outreach-toolbar">
                <span className="outreach-label">{outreachType === "e2" ? "E-2 Employer" : "J-1 Host"} pitch</span>
                <button className="btn-copy" onClick={handleCopy}>
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <pre className="outreach-text">{outreach}</pre>
            </div>
          )}
        </div>

        {/* Apply link */}
        {job.url && job.url !== "null" && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-apply"
          >
            View & apply ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function JobFeed({ jobs, tags, pipeline, onAddToPipeline, selectedJob, onSelectJob, resumeText, profile }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("fit");

  const getPipelineStage = (job) => {
    const key = `${job.organization}-${job.title}`.replace(/\s+/g, "-").toLowerCase();
    return pipeline[key]?.stage || null;
  };

  const filtered = jobs.filter(job => {
    if (filter === "j1") return job.visaRoute === "J-1" || job.visaRoute === "BOTH";
    if (filter === "e2") return job.visaRoute === "E-2" || job.visaRoute === "BOTH";
    if (filter === "priority") return job.priorityMatch;
    if (filter === "saved") return !!getPipelineStage(job);
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "fit") return (b.fitScore || 0) - (a.fitScore || 0);
    if (sortBy === "org") return a.organization.localeCompare(b.organization);
    return 0;
  });

  const priorityJobs = sorted.filter(j => j.priorityMatch);
  const otherJobs = sorted.filter(j => !j.priorityMatch);

  return (
    <div className="job-feed-layout">
      <div className={`job-list ${selectedJob ? "with-detail" : ""}`}>
        {/* Controls */}
        <div className="feed-controls">
          <div className="feed-filters">
            {[
              { key: "all", label: `All (${jobs.length})` },
              { key: "j1", label: "J-1" },
              { key: "e2", label: "E-2" },
              { key: "priority", label: "★ Priority" },
              { key: "saved", label: "Saved" }
            ].map(f => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? "active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="fit">Sort: Best fit</option>
            <option value="org">Sort: Organisation</option>
          </select>
        </div>

        {/* Results */}
        <div className="jobs-container">
          {priorityJobs.length > 0 && filter === "all" && (
            <>
              <p className="feed-section-label">★ Matches your focus tags</p>
              {priorityJobs.map((job, i) => (
                <JobCard
                  key={i}
                  job={job}
                  isSelected={selectedJob?.title === job.title && selectedJob?.organization === job.organization}
                  onSelect={onSelectJob}
                  onAddToPipeline={onAddToPipeline}
                  inPipeline={getPipelineStage(job)}
                />
              ))}
              {otherJobs.length > 0 && (
                <p className="feed-section-label secondary">Other eligible roles · Outside your focus tags but you qualify</p>
              )}
            </>
          )}
          {(filter === "all" ? otherJobs : sorted).map((job, i) => (
            <JobCard
              key={i}
              job={job}
              isSelected={selectedJob?.title === job.title && selectedJob?.organization === job.organization}
              onSelect={onSelectJob}
              onAddToPipeline={onAddToPipeline}
              inPipeline={getPipelineStage(job)}
            />
          ))}
          {sorted.length === 0 && (
            <div className="no-results">
              <p>No results match this filter.</p>
            </div>
          )}
        </div>
      </div>

      {selectedJob && (
        <div className="detail-panel">
          <JobDetail
            job={selectedJob}
            onAddToPipeline={onAddToPipeline}
            inPipeline={getPipelineStage(selectedJob)}
            onClose={() => onSelectJob(null)}
            resumeText={resumeText}
            profile={profile}
          />
        </div>
      )}
    </div>
  );
}
