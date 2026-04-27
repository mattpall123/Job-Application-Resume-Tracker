import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaHandshakeSlash, FaHourglassHalf, FaFolderOpen, FaEye } from "react-icons/fa";

import AddJob from "./AddJob";
import ResumeInput from "./components/ResumeInput";
import CoverLetterInput from "./components/CoverLetterInput"; 
import CompanyFilter from "./components/CompanyFilter"; 


import "./styles/forms.css";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [sortOption, setSortOption] = useState("date");
  const [allJobs, setAllJobs] = useState([]);
  const [savedResumes, setSavedResumes] = useState([]);
  const [savedCoverLetters, setSavedCoverLetters] = useState([]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const [editForm, setEditForm] = useState({
    companyName: "",
    roleTitle: "",
    status: "Applied",
    followUpDate: "",
    resumeUsed: "",
    coverLetterUsed: "",
  });

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
      setAllJobs(res.data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    axios.get('/api/jobs/resumes/list').then(res => setSavedResumes(res.data)).catch(console.error);
    axios.get('/api/jobs/cover-letters/list').then(res => setSavedCoverLetters(res.data)).catch(console.error);
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    const prevJobs = jobs;
    setJobs((current) =>
      current.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)),
    );

    try {
      await axios.patch(`api/jobs/${jobId}`, { status: newStatus });
    } catch (err) {
      console.error("Update Failed:", err);
      setJobs(prevJobs);
    }
  };

  const openModalEdit = (job) => {
    setSelectedJob(job);
    setEditForm({
      companyName: job.companyName ?? "",
      roleTitle: job.roleTitle ?? "",
      status: job.status ?? "Applied",
      followUpDate: job.followUpDate
        ? new Date(job.followUpDate).toISOString().split("T")[0]
        : "",
      resumeUsed: job.resumeUsed ?? "",
      coverLetterUsed: job.coverLetterUsed ?? "",
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedJob(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    if (!selectedJob) return;
    const changes = {};
    const oldCompany = selectedJob.companyName ?? "";
    const oldRole = selectedJob.roleTitle ?? "";
    const oldResumeUsed = selectedJob.resumeUsed ?? "";
    const oldStatus = selectedJob.status ?? "Applied";
    const oldFollowUpDate = selectedJob.followUpDate
      ? new Date(selectedJob.followUpDate).toISOString().split("T")[0]
      : "";
    const oldCoverLetterUsed = selectedJob.coverLetterUsed ?? "";
    
    if (editForm.companyName !== oldCompany) changes.companyName = editForm.companyName;
    if (editForm.roleTitle !== oldRole) changes.roleTitle = editForm.roleTitle;
    if (editForm.status !== oldStatus) changes.status = editForm.status;
    if (editForm.followUpDate !== oldFollowUpDate)
      changes.followUpDate = editForm.followUpDate
        ? `${editForm.followUpDate}T00:00:00`
        : null;
    if (editForm.resumeUsed !== oldResumeUsed) changes.resumeUsed = editForm.resumeUsed;
    if (editForm.coverLetterUsed !== oldCoverLetterUsed) changes.coverLetterUsed = editForm.coverLetterUsed;
    
    if (Object.keys(changes).length === 0) {
      closeEditModal();
      return;
    }

    try {
      const res = await axios.patch(`/api/jobs/${selectedJob.id}`, changes);
      setJobs((current) =>
        current.map((j) => (j.id === selectedJob.id ? res.data : j)),
      );
      closeEditModal();
    } catch (err) {
      console.error("Edit save failed:", err);
    }
  };

  const openDeleteModal = (job) => {
    setJobToDelete(job);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setJobToDelete(null);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      await axios.delete(`/api/jobs/${jobToDelete.id}`);

      if (jobToDelete.resumeUsed) {
        await axios.delete(`/api/jobs/resume/${jobToDelete.resumeUsed}`);
      }

      if (jobToDelete.coverLetterUsed) {
        await axios.delete(`/api/jobs/cover-letter/${jobToDelete.coverLetterUsed}`);
      }

      setJobs((current) => current.filter((job) => job.id !== jobToDelete.id));
      closeDeleteModal();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const totalJobApplications = jobs.length;
  const totalRejections = jobs.filter((job) => job.status === "Rejected").length;
  const totalInterviews = jobs.filter((job) => job.status === "Interviewing").length;
  
  const sortedJobs = [...jobs].sort((a, b) => {
  if (sortOption === "status") {
    const statusOrder = {
      Applied: 1,
      Interviewing: 2,
      Accepted: 3,
      Rejected: 4,
    };

    return (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999);
  }

  const dateA = a.applicationDate ? new Date(a.applicationDate) : new Date(0);
  const dateB = b.applicationDate ? new Date(b.applicationDate) : new Date(0);

  return dateB - dateA;
});

  const getOriginalName = (hashedFilename) => {
    if (!hashedFilename) return '';
    const idx = hashedFilename.indexOf('_');
    return idx >= 0 ? hashedFilename.substring(idx + 1) : hashedFilename;
  };

  return (
    <div className="dashboardStyle">
      <h1>My Applications</h1>
      <div className="applicationRow">
        <div className="jobApplicationsRow">
          <h3>
            <FaFolderOpen style={{ color: "var(--purple)" }} /> Total Amount of Applications
          </h3>
          <p className="totalAmount">{totalJobApplications}</p>
        </div>
        <div className="jobApplicationsRow">
          <h3>
            <FaHandshakeSlash style={{ color: "var(--purple)" }} /> Total Amount of Rejections
          </h3>
          <p className="totalRejections">{totalRejections}</p>
        </div>
        <div className="jobApplicationsRow">
          <h3>
            <FaHourglassHalf style={{ color: "var(--purple)" }} /> Total Amount of Interviews
          </h3>
          <p className="totalInterviews">{totalInterviews}</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "12px",
        }}
      >
        <button className="primaryButton" onClick={() => setShowAddJob(true)}>
          + Add Application
        </button>

        <select
          className="field sortSelect"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="status">Sort by Status</option>
        </select>

        <CompanyFilter
          allJobs={allJobs}
          setJobs={setJobs}
          fetchJobs={fetchJobs}
        />
      </div>

      {showAddJob && (
        <AddJob
          onClose={() => setShowAddJob(false)}
          onJobAdded={fetchJobs}
          onSuccess={fetchJobs}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.companyName}</td>
              <td>{job.roleTitle}</td>
              <td>
                <select
                  className={"statusStyle"}
                  value={job.status || "Applied"}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Accepted">Accepted</option>
                </select>
              </td>
              <td className="actionsCell">
                <Link to={`/jobs/${job.id}`} className="actionButtonBase actionButtonPrimary">
                  <FaEye className="iconStyle" /> View
                </Link>
                <button className="actionButtonBase actionButtonPrimary" onClick={() => openModalEdit(job)}>
                  <FaEdit className="iconStyle" /> Edit
                </button>
                <button className="actionButtonBase actionButtonDelete" onClick={() => openDeleteModal(job)}>
                  <FaTrash className="iconStyle" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditOpen && (
        <div className="modalOverlay" onClick={closeEditModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h2 className="appTitle"> Edit Job Application </h2>
            <form className="appForm">
              <label>Company</label>
              <input className="field" name="companyName" value={editForm.companyName} onChange={handleEditChange} />
              
              <label>Position</label>
              <input className="field" name="roleTitle" value={editForm.roleTitle} onChange={handleEditChange} />
              
              <label>Status</label>
              <select className="field" name="status" value={editForm.status} onChange={handleEditChange}>
                <option value="Accepted">Accepted</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Rejected">Rejected</option>
              </select>

              <label>Follow Up Date</label>
              <input className="field" type="date" name="followUpDate" value={editForm.followUpDate} onChange={handleEditChange} />

              <label>Resume</label>
              {editForm.resumeUsed ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.9rem" }}>{getOriginalName(editForm.resumeUsed)}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await axios.delete(`/api/jobs/resume/${editForm.resumeUsed}`);
                        await axios.patch(`/api/jobs/${selectedJob.id}`, { resumeUsed: "" });
                        setJobs(current => current.map(j => j.id === selectedJob.id ? { ...j, resumeUsed: "" } : j));
                        setEditForm(prev => ({ ...prev, resumeUsed: "" }));
                      } catch (error) { console.error(error); }
                    }}
                    style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                  >✕ Remove</button>
                </div>
              ) : (
                <>
                  {savedResumes.length > 0 && (
                    <select className="field" onChange={(e) => setEditForm(prev => ({ ...prev, resumeUsed: e.target.value }))} value={editForm.resumeUsed}>
                      <option value="">— Select existing resume —</option>
                      {savedResumes.map((r, i) => <option key={i} value={r.hashed}>{r.original}</option>)}
                    </select>
                  )}
                  <ResumeInput resetAfterUpload onChange={({ hashed }) => setEditForm(prev => ({ ...prev, resumeUsed: hashed }))} />
                </>
              )}

              <label>Cover Letter</label>
              {editForm.coverLetterUsed ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.85rem" }}>{getOriginalName(editForm.coverLetterUsed)}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await axios.delete(`/api/jobs/cover-letter/${editForm.coverLetterUsed}`);
                        await axios.patch(`/api/jobs/${selectedJob.id}`, { coverLetterUsed: "" });
                        setJobs(current => current.map(j => j.id === selectedJob.id ? { ...j, coverLetterUsed: "" } : j));
                        setEditForm(prev => ({ ...prev, coverLetterUsed: "" }));
                      } catch (error) { console.error(error); }
                    }}
                    style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                  >✕ Remove</button>
                </div>
              ) : (
                <>
                  {savedCoverLetters.length > 0 && (
                    <select className="field" onChange={(e) => setEditForm(prev => ({ ...prev, coverLetterUsed: e.target.value }))} value={editForm.coverLetterUsed}>
                      <option value="">— Select existing cover letter —</option>
                      {savedCoverLetters.map((cl, i) => <option key={i} value={cl.hashed}>{cl.original}</option>)}
                    </select>
                  )}
                  <CoverLetterInput resetAfterUpload onChange={({ hashed }) => setEditForm(prev => ({ ...prev, coverLetterUsed: hashed }))} />
                </>
              )}

              <div className="buttonRow" style={{ marginTop: "20px" }}>
                <button type="button" className="confirmButton" onClick={saveEdit}>Save Changes</button>
                <button type="button" className="cancelButton" onClick={closeEditModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="modalOverlay" onClick={closeDeleteModal}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <h2 className="appTitle">Delete Job Application</h2>
            <p>Are you sure you want to delete the application for <strong>{jobToDelete?.companyName}</strong>?</p>
            <div className="buttonRow">
              <button className="confirmButton" onClick={confirmDelete}>Delete</button>
              <button className="cancelButton" onClick={closeDeleteModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;