import { NavLink } from "react-router-dom";
import { FaHome, FaClipboardList, FaChartBar, FaUser, FaBars } from "react-icons/fa";

export default function Sidebar({ collapsed, toggle }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebarTop">
        <div className="brand">
          <span className="brandText">Job Tracker</span>
        </div>

        <button className="collapseBtn" onClick={toggle} aria-label="Toggle sidebar">
          <FaBars />
        </button>
      </div>

      <nav className="sidebarNav">
        <NavLink to="/" className="navItem">
          <span className="icon"><FaHome /></span>
          <span className="label">Home</span>
        </NavLink>

        <NavLink to="/dashboard" className="navItem">
          <span className="icon"><FaClipboardList /></span>
          <span className="label">Dashboard</span>
        </NavLink>

        <NavLink to="/dataanalytics" className="navItem">
          <span className="icon"><FaChartBar /></span>
          <span className="label">Analytics</span>
        </NavLink>

        <NavLink to="/profile" className="navItem">
          <span className="icon"><FaUser /></span>
          <span className="label">Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}