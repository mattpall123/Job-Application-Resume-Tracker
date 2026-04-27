import { useState, useEffect } from "react";
import axios from "axios";
import ResumeInput from "./components/ResumeInput";
import CoverLetterInput from "./components/CoverLetterInput";
import "./styles/forms.css";

export default function AddJob({ onClose, onSuccess }) {
  const [savedResumes, setSavedResumes] = useState([]);
  const [savedCoverLetters, setSavedCoverLetters] = useState([]);

  useEffect(() => {
    axios
      .get("/api/jobs/resumes/list")
      .then((res) => setSavedResumes(res.data))
      .catch(console.error);
    axios
      .get("/api/jobs/cover-letters/list")
      .then((res) => setSavedCoverLetters(res.data))
      .catch(console.error);
  }, []);

  const [formData, setFormData] = useState({
    companyName: "",
    roleTitle: "",
    status: "Applied",
    resumeUsed: "",
    coverLetterUsed: "",
  });
  const getOriginalName = (hashedFilename) => {
    if (!hashedFilename) return "";
    const idx = hashedFilename.indexOf("_");
    return idx >= 0 ? hashedFilename.substring(idx + 1) : hashedFilename;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      applicationDate: formData.applicationDate
        ? `${formData.applicationDate}T00:00:00`
        : null,
      followUpDate: formData.followUpDate
        ? `${formData.followUpDate}T00:00:00`
        : null,
    };
    try {
      await axios.post("/api/jobs", submissionData);
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalCard">
        <h2 className="appTitle">Add Job Application</h2>

        <form onSubmit={handleSubmit} className="appForm">
          <label>Company</label>
          <input
            className="field"
            placeholder="Company"
            required
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
          />
          <label>Position</label>
          <input
            className="field"
            placeholder="Position"
            required
            onChange={(e) =>
              setFormData({ ...formData, roleTitle: e.target.value })
            }
          />
          <label>Application Status</label>
          <select
            className="field"
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Rejected">Rejected</option>
          </select>
          <label>Application Date (optional)</label>
          <input
            className="field"
            type="date"
            onChange={(e) =>
              setFormData({ ...formData, applicationDate: e.target.value })
            }
          />
          <label>Follow Up Completed</label>
          <select
            className="field"
            onChange={(e) =>
              setFormData({
                ...formData,
                followUpCompleted: e.target.value === "true",
              })
            }
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
          <label>Follow Up Date (optional)</label>
          <input
            className="field"
            type="date"
            onChange={(e) =>
              setFormData({ ...formData, followUpDate: e.target.value })
            }
          />
          <label>Notes</label>
          <input
            className="field"
            placeholder="(optional)"
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
          {/* Resume Section */}
          <label>Resume</label>
          {formData.resumeUsed ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                {getOriginalName(formData.resumeUsed)}
              </span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, resumeUsed: "" })}
                style={{
                  color: "#ef4444",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <>
              {savedResumes.length > 0 && (
                <select
                  className="field"
                  onChange={(e) =>
                    setFormData({ ...formData, resumeUsed: e.target.value })
                  }
                  value={formData.resumeUsed}
                >
                  <option value="">— Select existing resume —</option>
                  {savedResumes.map((r, i) => (
                    <option key={i} value={r.hashed}>
                      {r.original}
                    </option>
                  ))}
                </select>
              )}
              <ResumeInput
                resetAfterUpload
                onChange={({ hashed, original }) => {
                  setFormData((prev) => ({ ...prev, resumeUsed: hashed }));

                  setSavedResumes((prev) => [...prev, { hashed, original }]);
                }}
              />
            </>
          )}

          {/* Cover Letter Section */}
          <label>Cover Letter</label>
          {formData.coverLetterUsed ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                {getOriginalName(formData.coverLetterUsed)}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, coverLetterUsed: "" })
                }
                style={{
                  color: "#ef4444",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <>
              {savedCoverLetters.length > 0 && (
                <select
                  className="field"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coverLetterUsed: e.target.value,
                    })
                  }
                  value={formData.coverLetterUsed}
                >
                  <option value="">— Select existing cover letter —</option>
                  {savedCoverLetters.map((cl, i) => (
                    <option key={i} value={cl.hashed}>
                      {cl.original}
                    </option>
                  ))}
                </select>
              )}
              <CoverLetterInput
                resetAfterUpload
                onChange={({ hashed, original }) => {
                  setFormData((prev) => ({ ...prev, coverLetterUsed: hashed }));

                  setSavedCoverLetters((prev) => [
                    ...prev,
                    { hashed, original },
                  ]);
                }}
              />
            </>
          )}

          <div className="buttonRow">
            <button className="confirmButton" type="submit">
              Add Application
            </button>
            <button className="cancelButton" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
