import { useState, useEffect } from "react";
import { searchJobs } from "./lib/api";
import { DEFAULT_PROFILE } from "./lib/profileData";
import {
  savePipeline, loadPipeline, saveTags, loadTags,
  saveProfile, loadProfile, saveResumeText, loadResumeText,
  saveCVText, loadCVText, saveLastResults, loadLastResults
} from "./lib/storage";
import Dashboard from "./components/Dashboard";
import JobFeed from "./components/JobFeed";
import Pipeline from "./components/Pipeline";
import ProfilePanel from "./components/ProfilePanel";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [jobs, setJobs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [pipeline, setPipeline] = useState({});
  const [tags, setTags] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [resumeText, setResumeText] = useState("");
  const [cvText, setCvText] = useState("");
  const [searchMode, setSearchMode] = useState("broad");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Load persisted state on mount
  useEffect(() => {
    const savedPipeline = loadPipeline();
    const savedTags = loadTags();
    const savedProfile = loadProfile();
    const savedResume = loadResumeText();
    const savedCV = loadCVText();
    const savedResults = loadLastResults();

    if (Object.keys(savedPipeline).length) setPipeline(savedPipeline);
    if (savedTags.length) setTags(savedTags);
    if (savedProfile) setProfile(savedProfile);
    if (savedResume) setResumeText(savedResume);
    if (savedCV) setCvText(savedCV);
    if (savedResults.length) { setJobs(savedResults); setHasSearched(true); }
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchError(null);
    setSelectedJob(null);
    try {
      const results = await searchJobs({
        profile,
        tags,
        resumeText,
        cvText,
        searchMode
      });
      const sorted = results.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
      setJobs(sorted);
      saveLastResults(sorted);
      setHasSearched(true);
      setActiveTab("search");
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToPipeline = (job, stage) => {
    const key = `${job.organization}-${job.title}`.replace(/\s+/g, "-").toLowerCase();
    const updated = {
      ...pipeline,
      [key]: { ...job, stage, addedAt: new Date().toISOString(), notes: pipeline[key]?.notes || "" }
    };
    setPipeline(updated);
    savePipeline(updated);
  };

  const handleUpdatePipelineStage = (key, stage) => {
    const updated = { ...pipeline, [key]: { ...pipeline[key], stage } };
    setPipeline(updated);
    savePipeline(updated);
  };

  const handleUpdateNotes = (key, notes) => {
    const updated = { ...pipeline, [key]: { ...pipeline[key], notes } };
    setPipeline(updated);
    savePipeline(updated);
  };

  const handleRemoveFromPipeline = (key) => {
    const updated = { ...pipeline };
    delete updated[key];
    setPipeline(updated);
    savePipeline(updated);
  };

  const handleTagsChange = (newTags) => {
    setTags(newTags);
    saveTags(newTags);
  };

  const handleProfileChange = (newProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleResumeText = (text) => {
    setResumeText(text);
    saveResumeText(text);
  };

  const handleCVText = (text) => {
    setCvText(text);
    saveCVText(text);
  };

  const pipelineCount = Object.keys(pipeline).length;
  const activeCount = Object.values(pipeline).filter(j => !["Offer", "Rejected"].includes(j.stage)).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-mark">◈</span>
            <div>
              <h1 className="brand-title">Meridian</h1>
              <p className="brand-sub">NYC Job Search · J-1 & E-2 Eligible Roles</p>
            </div>
          </div>
          <nav className="header-nav">
            <button
              className={`nav-btn ${activeTab === "search" ? "active" : ""}`}
              onClick={() => setActiveTab("search")}
            >
              <span className="nav-icon">⊞</span>
              <span>Search</span>
              {jobs.length > 0 && <span className="nav-badge">{jobs.length}</span>}
            </button>
            <button
              className={`nav-btn ${activeTab === "pipeline" ? "active" : ""}`}
              onClick={() => setActiveTab("pipeline")}
            >
              <span className="nav-icon">⊟</span>
              <span>Pipeline</span>
              {pipelineCount > 0 && <span className="nav-badge">{activeCount}</span>}
            </button>
            <button
              className={`nav-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <span className="nav-icon">◎</span>
              <span>Profile</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {activeTab === "search" && (
          <div className="search-layout">
            <aside className="search-sidebar">
              <Dashboard
                profile={profile}
                tags={tags}
                onTagsChange={handleTagsChange}
                searchMode={searchMode}
                onSearchModeChange={setSearchMode}
                onSearch={handleSearch}
                isSearching={isSearching}
                jobCount={jobs.length}
                pipelineCount={pipelineCount}
              />
            </aside>
            <section className="search-results">
              {isSearching ? (
                <div className="search-loading">
                  <div className="loading-spinner" />
                  <p className="loading-title">Searching live job boards…</p>
                  <p className="loading-sub">Finding NYC roles eligible for J-1 or E-2 · This takes 30–60 seconds</p>
                  <div className="loading-steps">
                    <span>Scanning Idealist, ReliefWeb, Devex, LinkedIn…</span>
                    <span>Checking J-1 & E-2 eligibility…</span>
                    <span>Scoring fit against your profile…</span>
                  </div>
                </div>
              ) : searchError ? (
                <div className="search-error">
                  <p className="error-icon">⚠</p>
                  <p className="error-title">Search failed</p>
                  <p className="error-msg">{searchError}</p>
                  <button className="btn-primary" onClick={handleSearch}>Try again</button>
                </div>
              ) : !hasSearched ? (
                <div className="search-empty">
                  <p className="empty-icon">◈</p>
                  <p className="empty-title">Ready to search</p>
                  <p className="empty-sub">Configure your interests in the sidebar, then click Search to find live NYC roles eligible for your visa situation.</p>
                  <button className="btn-primary btn-large" onClick={handleSearch}>
                    Find matching roles
                  </button>
                </div>
              ) : (
                <JobFeed
                  jobs={jobs}
                  tags={tags}
                  pipeline={pipeline}
                  onAddToPipeline={handleAddToPipeline}
                  selectedJob={selectedJob}
                  onSelectJob={setSelectedJob}
                  resumeText={resumeText}
                  profile={profile}
                />
              )}
            </section>
          </div>
        )}

        {activeTab === "pipeline" && (
          <Pipeline
            pipeline={pipeline}
            onUpdateStage={handleUpdatePipelineStage}
            onUpdateNotes={handleUpdateNotes}
            onRemove={handleRemoveFromPipeline}
            resumeText={resumeText}
            profile={profile}
          />
        )}

        {activeTab === "profile" && (
          <ProfilePanel
            profile={profile}
            onProfileChange={handleProfileChange}
            resumeText={resumeText}
            cvText={cvText}
            onResumeText={handleResumeText}
            onCVText={handleCVText}
          />
        )}
      </main>
    </div>
  );
}
