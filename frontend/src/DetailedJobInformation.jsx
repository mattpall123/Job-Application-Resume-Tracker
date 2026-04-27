import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import "./styles/DetailedJobInformation.css";

export default function DetailedJobInformation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [editNotes, setEditNotes] = useState(false);
  const [note, setNotes] = useState("");

  useEffect(() => {
    axios.get(`/api/jobs/${id}`)
      .then(res => {
        setJob(res.data);
        setNotes(res.data.notes || "");
      })
      .catch(err => console.error("Failed to load job:", err));
  }, [id]);

  const toggleFollowUpDateCompleted = async () => {
    try {
      const updatedValue = !job.followUpCompleted;
      const res = await axios.patch(`/api/jobs/${id}`, {
        followUpCompleted: updatedValue
      });
      setJob(res.data);
    } catch (err) {
      console.error("Failed to toggle follow up completed", err);
    }
  };
  const saveNotes = async () => {
    try {
      const res = await axios.patch(`/api/jobs/${id}`, {
        notes: note
      });
      setJob(res.data);
      setEditNotes(false);
    }
    catch (err) {
      console.error("Failed to update notes:", err);
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="jobDetailsContainer">
      <div className="jobCard">
        <div className="jobHeader">
          <h1>{job.companyName}</h1>
          <span className="statusBadge">{job.status}</span>
        </div>

        <div className="jobInfo">
          <div className="infoRow">
            <span className="appLabel">Position</span>
            <span>{job.roleTitle}</span>
          </div>

          <div className="infoRow">
            <span className="appLabel">Applied On</span>
            <span>{job.applicationDate ? (new Date(job.applicationDate)).toLocaleDateString() : "—"}</span>
          </div>

          <div className="infoRow">
            <span className="appLabel">Follow Up Completed</span>
            <button
              type="button"
              className="toggleButton"
              onClick={toggleFollowUpDateCompleted}
            >
              {job.followUpCompleted ? "Yes" : "No"}
            </button>
          </div>

          <div className="infoRow">
            <span className="appLabel">Follow Up Date</span>
            <span>{job.followUpDate ? (new Date(job.followUpDate)).toLocaleDateString() : "—"}</span>
          </div>
        </div>

        <div className="notesSection">
          <h3>Notes</h3>
          {editNotes ? (
            <div className="notedEditor">
              <textarea
                className="notesTextArea"
                value={note}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes here"
              ></textarea>

              <div className="notesButton actionsCell" >
                <button className="actionButtonBase actionButtonPrimary" onClick={saveNotes}>
                  Save notes
                </button>
                <button className="actionButtonBase actionButtonDelete"
                  onClick={() => {
                    setEditNotes(false);
                    setNotes(job.notes || "");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p>{job.notes || "No notes added."}</p>
          )}
        </div>

        <div className="jobActions actionsCell">
          <button
            className="primaryButton"
            onClick={() => setEditNotes(true)}
          >
            {job.notes ? "Edit Notes" : "Add Notes"}
          </button>

          <button
            className="primaryButton"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
