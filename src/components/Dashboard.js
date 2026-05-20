import { useState } from "react";

const ALL_INTEREST_TAGS = [
  "Policy & Research", "Journalism & Editorial", "Humanitarian & Development",
  "Communications & PR", "Nonprofit & NGO", "International Affairs",
  "Behavioural Insights", "Human Rights", "Universities & Research Institutes",
  "UK/Irish-Owned Firms", "Think Tanks", "Foundations & Philanthropy",
  "Climate & Sustainability", "Legal-Adjacent", "Political Risk",
  "Education", "Health Policy", "Immigration & Refugee", "ESG & Corporate Affairs",
  "Media & Broadcasting", "Publishing", "Social Research"
];

export default function Dashboard({
  profile, tags, onTagsChange, searchMode, onSearchModeChange,
  onSearch, isSearching, jobCount, pipelineCount
}) {
  const [tagsExpanded, setTagsExpanded] = useState(true);

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      onTagsChange(tags.filter(t => t !== tag));
    } else {
      onTagsChange([...tags, tag]);
    }
  };

  return (
    <div className="dashboard">
      {/* Profile summary */}
      <div className="dash-section profile-summary">
        <div className="profile-avatar">
          {profile.name?.slice(0, 1) || "E"}
        </div>
        <div className="profile-info">
          <p className="profile-degree">{profile.degreeField} · {profile.university?.replace("University of ", "")}</p>
          <p className="profile-visa">
            <span className="visa-tag">J-1</span>
            <span className="visa-tag">E-2</span>
            <span className="visa-city">NYC</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="stat">
          <span className="stat-num">{jobCount}</span>
          <span className="stat-label">Found</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">{pipelineCount}</span>
          <span className="stat-label">In pipeline</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">{tags.length}</span>
          <span className="stat-label">Focus tags</span>
        </div>
      </div>

      {/* Search mode */}
      <div className="dash-section">
        <label className="section-label">Search mode</label>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${searchMode === "broad" ? "active" : ""}`}
            onClick={() => onSearchModeChange("broad")}
          >
            <span>Broad</span>
            <span className="mode-desc">All eligible roles</span>
          </button>
          <button
            className={`mode-btn ${searchMode === "targeted" ? "active" : ""}`}
            onClick={() => onSearchModeChange("targeted")}
          >
            <span>Targeted</span>
            <span className="mode-desc">Priority tags first</span>
          </button>
        </div>
      </div>

      {/* Interest tags */}
      <div className="dash-section">
        <button
          className="section-label section-toggle"
          onClick={() => setTagsExpanded(!tagsExpanded)}
        >
          <span>Interest tags</span>
          <span>{tagsExpanded ? "▲" : "▼"}</span>
        </button>
        {tagsExpanded && (
          <div className="tags-grid">
            {ALL_INTEREST_TAGS.map(tag => (
              <button
                key={tag}
                className={`tag-chip ${tags.includes(tag) ? "selected" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        {tags.length > 0 && (
          <button className="clear-tags" onClick={() => onTagsChange([])}>
            Clear all tags
          </button>
        )}
      </div>

      {/* Eligibility summary */}
      <div className="dash-section eligibility-summary">
        <label className="section-label">Eligibility filters active</label>
        <ul className="eligibility-list">
          <li>✓ NYC / NYC Metro only</li>
          <li>✓ Paid ≥ $35k/year</li>
          <li>✓ Entry level (0–3 years)</li>
          <li>✓ Degree-compatible field</li>
          <li>✓ J-1 or E-2 eligible route</li>
          <li>✓ Funded study exception</li>
        </ul>
      </div>

      {/* Search button */}
      <button
        className="btn-search"
        onClick={onSearch}
        disabled={isSearching}
      >
        {isSearching ? (
          <>
            <span className="btn-spinner" />
            Searching…
          </>
        ) : (
          <>
            <span>⊕</span>
            {jobCount > 0 ? "Search again" : "Find matching roles"}
          </>
        )}
      </button>
    </div>
  );
}
