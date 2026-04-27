import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DataAnalytics = () => {
  const [jobData, setJobData] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    interviewing: 0,
    applied: 0,
  });

  // Monthly tracking state
  const [monthlyStats, setMonthlyStats] = useState({
    accepted: Array(12).fill(0),
    rejected: Array(12).fill(0),
    applied: Array(12).fill(0),
    interviewing: Array(12).fill(0),
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/jobs")
      .then((response) => {
        const jobs = response.data;
        
        // Initialize monthly counters
        const acc = Array(12).fill(0);
        const rej = Array(12).fill(0);
        const app = Array(12).fill(0);
        const int = Array(12).fill(0);

        jobs.forEach((job) => {
        const date = new Date(job.applicationDate);
        const month = date.getMonth(); 
        const status = job.status ? job.status.toUpperCase() : "";

        if (status === "ACCEPTED") acc[month]++;
        else if (status === "REJECTED") rej[month]++;
        else if (status === "SENT" || status === "APPLIED") app[month]++;
        else if (status === "INTERVIEW" || status === "INTERVIEWING") int[month]++;
      });

        
        setMonthlyStats({
          accepted: acc,
          rejected: rej,
          applied: app,
          interviewing: int,
        });

        setJobData({
          total: jobs.length,
          accepted: jobs.filter((j) => j.status?.toUpperCase() === "ACCEPTED").length,
          rejected: jobs.filter((j) => j.status?.toUpperCase() === "REJECTED").length,
          interviewing: jobs.filter((j) => 
            j.status?.toUpperCase() === "INTERVIEW" || j.status?.toUpperCase() === "INTERVIEWING"
          ).length,
          applied: jobs.filter((j) => 
            j.status?.toUpperCase() === "SENT" || j.status?.toUpperCase() === "APPLIED"
          ).length,
      });
      })
      .catch((error) => console.error("Error fetching analytics:", error));
  }, []);

  const chartConfig = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Accepted",
        data: monthlyStats.accepted,
        backgroundColor: "#22c55e",
        borderRadius: 6,
      },
      {
        label: "Rejected",
        data: monthlyStats.rejected,
        backgroundColor: "#ef4444",
        borderRadius: 6,
      },
      {
        label: "Applied",
        data: monthlyStats.applied,
        backgroundColor: "#6d28d9",
        borderRadius: 6,
      },
      {
        label: "Interviewing",
        data: monthlyStats.interviewing,
        backgroundColor: "#f59e0b",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 20,
      },
    },
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: { font: { family: "Manrope", weight: '600' } } 
      },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(17, 24, 39, 0.05)" },
        ticks: { stepSize: 1, font: { family: "Manrope" } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: "Manrope" } },
      },
    },
  };

  return (
    <div className="content">
      {/* Header Section*/}
      <div className="headerCard" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="title">Analytics</h1>
          <p className="subtitle">Track your progress and application stats.</p>
        </div>
      </div>

      {/* Main Grid Layout*/}
      <div className="grid">
        {/* Chart */}
        <div className="card analytics-chart-container" style={{ height: "500px" }}>
          <h3 className="cardTitle">Monthly Performance</h3>
          <p className="cardDescription">
            Visual breakdown of your job hunt trends over the year.
          </p>
          <div className="chart-wrapper" style={{ height: "380px" }}>
            <Bar data={chartConfig} options={chartOptions} />
          </div>
        </div>

        {/* Stat Cards*/}
        <div className="card">
          <div className="stat-label">TOTAL APPLICATIONS</div>
          <div className="stat-value text-purple">{jobData.total}</div>
        </div>

        <div className="card">
          <div className="stat-label">INTERVIEWS</div>
          <div className="stat-value text-yellow">{jobData.interviewing}</div>
        </div>

        <div className="card">
          <div className="stat-label">OFFERS</div>
          <div className="stat-value text-green">{jobData.accepted}</div>
        </div>

        <div className="card">
          <div className="stat-label">REJECTIONS</div>
          <div className="stat-value text-red">{jobData.rejected}</div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalytics;