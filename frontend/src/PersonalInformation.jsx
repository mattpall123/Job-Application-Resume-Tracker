import { useState, useEffect } from "react";
import ResumeInput from "./components/ResumeInput";
import CoverLetterInput from "./components/CoverLetterInput";

import axios from "axios";

const ProfilePage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    university: "",
  });
  const [coverLetters, setCoverLetters] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [editing, setEditing] = useState(false); // state to store user profile data

  useEffect(() => {
    // Fetch User Profile 
    axios.get("/api/users/1")
      .then(res => {
        if (res.data) setForm(res.data);
      })
      .catch(err => console.error("No profile found yet", err));

    // Fetch lists of files from the server
    axios.get("/api/jobs/resumes/list")
      .then(res => setResumes(res.data))
      .catch(err => console.error(err));

    axios.get("/api/jobs/cover-letters/list")
      .then(res => setCoverLetters(res.data))
      .catch(err => console.error(err));
  }, []);
  const handleChange = (e) => {
    // update when user types in input fields
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/users/1", form);
      setEditing(false);
    } catch (error) {
      console.error("Failed to save profile to database", error);
    }
  };

  const handleCoverLetterUpload = ({ hashed, original }) => {
    if (!hashed) return;
    if (coverLetters.some((cl) => cl.hashed === hashed)) return;
    setCoverLetters((prev) => [
      ...prev,
      { hashed, original, uploadedAt: new Date().toLocaleDateString() },
    ]);
  };

  const handleCoverLetterRemove = async (hashed) => {
    try {
      await axios.delete(`/api/jobs/cover-letter/${hashed}`);
      setCoverLetters((prev) => prev.filter((cl) => cl.hashed !== hashed));
    } catch (error) {
      console.error("Failed to delete cover letter:", error);
    }
  };

  const handleResumeUpload = ({ hashed, original }) => {
    if (!hashed) return;
    if (resumes.some((r) => r.hashed === hashed)) return;
    setResumes((prev) => [
      ...prev,
      { hashed, original, uploadedAt: new Date().toLocaleDateString() },
    ]);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAll = async () => {
    try {
      await axios.delete("/api/jobs"); // endpoint for deleting all applications
      setShowDeleteModal(false);
      //alert("All job applications deleted.");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleResumeRemove = async (hashed) => {
    try {
      await axios.delete(`/api/jobs/resume/${hashed}`);
      setResumes((prev) => prev.filter((r) => r.hashed !== hashed));
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
  };
  return (
    <div className="profilePage">
      <div className="profileSection">
        <h2>Personal Information</h2>

        {editing ? (
          <>
            <input name="firstName" placeholder="First Name" value={form.firstName || ""} onChange={handleChange} className="field" />
            <input name="lastName" placeholder="Last Name" value={form.lastName || ""} onChange={handleChange} className="field" />
            <input name="email" placeholder="Email" value={form.email || ""} onChange={handleChange} className="field" />
            <input name="city" placeholder="City" value={form.city || ""} onChange={handleChange} className="field" />
            <input name="university" placeholder="University" value={form.university || ""} onChange={handleChange} className="field" />

            <div className="buttonRow">
              <button className="confirmButton" onClick={handleSave}>Save</button>
              <button className="cancelButton" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p><span>Name:</span> {form.firstName} {form.lastName}</p>
            <p><span>Email:</span> {form.email || "—"}</p>
            <p><span>City:</span> {form.city || "—"}</p>
            <p><span>University:</span> {form.university || "—"}</p>
            <button className="profileLinkButton" onClick={() => setEditing(true)}>Edit</button>
          </>
        )}
      </div>

      <div className="profileSection">
        <h2>Resume</h2>
        <p className="cardDescription">Upload your resume here.</p>
        <ResumeInput resetAfterUpload={true} onChange={handleResumeUpload} />

        {resumes.length > 0 && (
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {resumes.map((r, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#22c55e" }}>✓</span>
                  <span style={{ fontWeight: "600" }}>{r.original}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: "var(--muted)" }}>{r.uploadedAt}</span>
                  <button type="button" onClick={() => handleResumeRemove(r.hashed)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>✕ Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profileSection">
        <h2>Cover Letters</h2>
        <p className="cardDescription">Upload and manage your cover letters.</p>
        <CoverLetterInput resetAfterUpload={true} onChange={handleCoverLetterUpload} />

        {coverLetters.length > 0 && (
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {coverLetters.map((cl, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#22c55e" }}>✓</span>
                  <span style={{ fontWeight: "600" }}>{cl.original}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ color: "var(--muted)" }}>{cl.uploadedAt}</span>
                  <button type="button" onClick={() => handleCoverLetterRemove(cl.hashed)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>✕ Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete data */}
      <div className="profileSection">
        <h2>Reset Job Search</h2>
        <p className="cardDescription">Delete all job applications and all associated data.</p>
        <button className="dangerButton" onClick={() => setShowDeleteModal(true)}>
          Delete All Job Applications
        </button>
      </div>
      {
        showDeleteModal && (
          <div className="modalOverlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modalCard" onClick={(e) => e.stopPropagation()}>
              <h2 className='appTitle'>Delete All Job Applications</h2>

              <p>
                Are you sure you want to delete all job applications and start a new job search?
                This action cannot be undone.
              </p>

              <div className="buttonRow">
                <button className="dangerButton" onClick={handleDeleteAll}>
                  Delete All Applications
                </button>
                <button className="cancelButton" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProfilePage;