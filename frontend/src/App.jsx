import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./Dashboard";
import DataAnalytics from "./Dataanalytics";
import DetailedJobInformation from "./DetailedJobInformation";
import HomePage from "./HomePage";
import PersonalInformation from "./Personalinformation";
import AddJob from "./AddJob";

import Sidebar from "./components/Sidebar";
import "./styles/App.css";

function App() {
  // tracks if sidebar is collapsed
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="layout">
        <Sidebar
          collapsed={collapsed}
          toggle={() => setCollapsed((c) => !c)}
        />

        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddJob />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dataanalytics" element={<DataAnalytics />} />
            <Route path="/jobs/:id" element={<DetailedJobInformation />} />
            <Route path="/profile" element={<PersonalInformation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;