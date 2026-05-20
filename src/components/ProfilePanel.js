import { useState, useRef } from "react";
import { DEFAULT_PROFILE } from "../lib/profileData";
import { analyzeDocument } from "../lib/api";

function FileUploadZone({ label, sublabel, onTextExtracted, hasFile, fileName }) {
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      let text = "";
      if (file.type === "application/pdf") {
        // For PDF: read as array buffer and extract text via FileReader
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Basic text extraction from PDF binary — works for text-based PDFs
            const bytes = new Uint8Array(e.target.result);
            let raw = "";
            for (let i = 0; i < bytes.length; i++) {
              raw += String.fromCharCode(bytes[i]);
            }
            // Extract text between stream markers
            const matches = raw.match(/stream[\r\n]([\s\S]*?)endstream/g) || [];
            let extracted = matches
              .map(s => s.replace(/stream[\r\n]/, "").replace(/endstream/, ""))
              .join(" ")
              .replace(/[^\x20-\x7E\n]/g, " ")
              .replace(/\s+/g, " ")
              .trim();
            // Fallback: just use decoded readable chars
            if (extracted.length < 100) {
              extracted = raw.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ").trim();
            }
            resolve(extracted || `[PDF: ${file.name}]`);
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      } else {
        // Text/Word: read as text
        text = await file.text();
      }
      onTextExtracted(text, file.name);
    } catch (err) {
      setError("Could not read file. Try a different format.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`upload-zone ${hasFile ? "has-file" : ""}`}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        style={{ display: "none" }}
        onChange={e => handleFile(e.target.files[0])}
      />
      {loading ? (
        <div className="upload-loading">
          <div className="loading-spinner sm" />
          <p>Reading file…</p>
        </div>
      ) : hasFile ? (
        <div className="upload-success">
          <span className="upload-icon-success">✓</span>
          <p className="upload-filename">{fileName}</p>
          <p className="upload-replace">Click to replace</p>
        </div>
      ) : (
        <div className="upload-prompt">
          <span className="upload-icon">⊕</span>
          <p className="upload-label">{label}</p>
          <p className="upload-sub">{sublabel}</p>
        </div>
      )}
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}

export default function ProfilePanel({ profile, onProfileChange, resumeText, cvText, onResumeText, onCVText }) {
  const [resumeFileName, setResumeFileName] = useState(resumeText ? "Uploaded" : null);
  const [cvFileName, setCvFileName] = useState(cvText ? "Uploaded" : null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);

  const handleResumeUpload = async (text, name) => {
    onResumeText(text);
    setResumeFileName(name);
    // Auto-analyze
    setAnalyzing(true);
    try {
      const analysis = await analyzeDocument(text, "resume");
      setAnalysisResult(analysis);
    } catch {} finally {
      setAnalyzing(false);
    }
  };

  const handleCVUpload = (text, name) => {
    onCVText(text);
    setCvFileName(name);
  };

  const handleSaveProfile = () => {
    onProfileChange(profileDraft);
    setEditingProfile(false);
  };

  const handleResetProfile = () => {
    setProfileDraft(DEFAULT_PROFILE);
    onProfileChange(DEFAULT_PROFILE);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2 className="profile-page-title">Profile & Documents</h2>
        <p className="profile-page-sub">Your eligibility context is pre-loaded. Upload your resume and CV as additional context for the AI matching engine.</p>
      </div>

      <div className="profile-grid">
        {/* Documents */}
        <div className="profile-card">
          <h3 className="card-heading">Documents</h3>
          <p className="card-desc">Upload your resume and CV. The AI uses these to personalise job matching and outreach drafts. These are stored locally in your browser only.</p>

          <div className="upload-pair">
            <div className="upload-item">
              <label className="upload-label-text">Resume <span className="upload-hint">(1-page, tailored)</span></label>
              <FileUploadZone
                label="Upload Resume"
                sublabel="PDF, Word, or TXT · 1-page format"
                onTextExtracted={handleResumeUpload}
                hasFile={!!resumeFileName}
                fileName={resumeFileName}
              />
            </div>
            <div className="upload-item">
              <label className="upload-label-text">CV <span className="upload-hint">(full academic/professional)</span></label>
              <FileUploadZone
                label="Upload CV"
                sublabel="PDF, Word, or TXT · Full document"
                onTextExtracted={handleCVUpload}
                hasFile={!!cvFileName}
                fileName={cvFileName}
              />
            </div>
          </div>

          {analyzing && (
            <div className="analysis-loading">
              <div className="loading-spinner sm" />
              <span>Analysing resume…</span>
            </div>
          )}

          {analysisResult && (
            <div className="analysis-result">
              <p className="analysis-title">Resume parsed ✓</p>
              {analysisResult.skills?.length > 0 && (
                <p className="analysis-item"><strong>Skills detected:</strong> {analysisResult.skills.slice(0, 8).join(", ")}</p>
              )}
              {analysisResult.experience?.length > 0 && (
                <p className="analysis-item"><strong>Experience:</strong> {analysisResult.experience.slice(0, 2).map(e => `${e.role} at ${e.org}`).join("; ")}</p>
              )}
            </div>
          )}
        </div>

        {/* Core profile */}
        <div className="profile-card">
          <div className="card-heading-row">
            <h3 className="card-heading">Eligibility Profile</h3>
            <button
              className="btn-sm btn-edit"
              onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
            >
              {editingProfile ? "Save" : "Edit"}
            </button>
          </div>
          <p className="card-desc">Pre-loaded with your situation. Edit if anything changes.</p>

          {editingProfile ? (
            <div className="profile-form">
              {[
                { key: "nationality", label: "Nationality (comma-separated)", type: "text", isArray: true },
                { key: "targetCity", label: "Target city", type: "text" },
                { key: "degreeField", label: "Degree field", type: "text" },
                { key: "university", label: "University", type: "text" },
                { key: "graduationDate", label: "Graduation date", type: "text" },
                { key: "targetStartDate", label: "Target start date", type: "text" },
                { key: "targetSalaryMin", label: "Minimum salary (USD/year)", type: "number" },
              ].map(field => (
                <div key={field.key} className="form-field">
                  <label className="form-label">{field.label}</label>
                  <input
                    className="form-input"
                    type={field.type}
                    value={field.isArray ? profileDraft[field.key]?.join(", ") : profileDraft[field.key] || ""}
                    onChange={e => setProfileDraft({
                      ...profileDraft,
                      [field.key]: field.isArray
                        ? e.target.value.split(",").map(s => s.trim())
                        : field.type === "number" ? Number(e.target.value) : e.target.value
                    })}
                  />
                </div>
              ))}
              <div className="form-actions">
                <button className="btn-primary" onClick={handleSaveProfile}>Save profile</button>
                <button className="btn-secondary" onClick={() => setEditingProfile(false)}>Cancel</button>
                <button className="btn-danger-sm" onClick={handleResetProfile}>Reset to defaults</button>
              </div>
            </div>
          ) : (
            <div className="profile-view">
              {[
                { label: "Nationality", value: Array.isArray(profile.nationality) ? profile.nationality.join(" / ") : profile.nationality },
                { label: "Degree", value: `${profile.degreeLevel} ${profile.degreeField}` },
                { label: "Previous study", value: profile.previousStudy },
                { label: "University", value: profile.university },
                { label: "Graduating", value: profile.graduationDate },
                { label: "Target start", value: profile.targetStartDate },
                { label: "Target city", value: profile.targetCity },
                { label: "Min. salary", value: `$${profile.targetSalaryMin?.toLocaleString()}/year` },
                { label: "Visa routes", value: profile.visaRoutes?.join(", ") },
              ].map(row => (
                <div key={row.label} className="profile-row">
                  <span className="profile-key">{row.label}</span>
                  <span className="profile-val">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visa info */}
        <div className="profile-card visa-info-card">
          <h3 className="card-heading">Visa routes</h3>
          <div className="visa-info-grid">
            <div className="visa-info-block j1-block">
              <h4>J-1 Intern</h4>
              <p>For recent graduates of foreign universities. Up to 12 months (extendable to 18). Must be structured as a supervised training placement with learning objectives. Arranged through a designated sponsor organisation.</p>
              <div className="visa-info-tags">
                <span>Up to 12–18 months</span>
                <span>Fixed-term roles</span>
                <span>Fellows / Interns / Assistants</span>
              </div>
            </div>
            <div className="visa-info-block e2-block">
              <h4>E-2 Treaty Employee</h4>
              <p>For UK or Irish citizens working at a qualifying UK/Irish-owned US employer. Role must be executive, supervisory, or require essential skills. Renewable, no time limit. Not a direct green card route.</p>
              <div className="visa-info-tags">
                <span>Renewable</span>
                <span>UK/Irish employer only</span>
                <span>Essential skills required</span>
              </div>
            </div>
          </div>
          <p className="visa-disclaimer">This app provides context only, not legal advice. Consult an immigration attorney before applying for any visa.</p>
        </div>
      </div>
    </div>
  );
}
