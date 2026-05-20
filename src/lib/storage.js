// Local storage utilities for persisting app state

const KEYS = {
  PIPELINE: "jb_pipeline",
  SAVED_JOBS: "jb_saved",
  TAGS: "jb_tags",
  PROFILE: "jb_profile",
  RESUME_TEXT: "jb_resume_text",
  CV_TEXT: "jb_cv_text",
  LAST_RESULTS: "jb_last_results",
};

export function savePipeline(pipeline) {
  localStorage.setItem(KEYS.PIPELINE, JSON.stringify(pipeline));
}

export function loadPipeline() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.PIPELINE)) || {};
  } catch { return {}; }
}

export function saveTags(tags) {
  localStorage.setItem(KEYS.TAGS, JSON.stringify(tags));
}

export function loadTags() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.TAGS)) || [];
  } catch { return []; }
}

export function saveProfile(profile) {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.PROFILE)) || null;
  } catch { return null; }
}

export function saveResumeText(text) {
  localStorage.setItem(KEYS.RESUME_TEXT, text);
}

export function loadResumeText() {
  return localStorage.getItem(KEYS.RESUME_TEXT) || "";
}

export function saveCVText(text) {
  localStorage.setItem(KEYS.CV_TEXT, text);
}

export function loadCVText() {
  return localStorage.getItem(KEYS.CV_TEXT) || "";
}

export function saveLastResults(results) {
  localStorage.setItem(KEYS.LAST_RESULTS, JSON.stringify(results));
}

export function loadLastResults() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.LAST_RESULTS)) || [];
  } catch { return []; }
}

export const PIPELINE_STAGES = [
  "Identified",
  "Applied",
  "Outreach Sent",
  "Interview",
  "Offer",
  "Rejected"
];
