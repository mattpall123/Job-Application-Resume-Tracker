import { Link } from "react-router-dom";
import AddJob from "./AddJob";

import "./styles/HomePage.css";

export default function HomePage() {


  return (
    <main className="main">
      <header className="headerCard">
        <div>
          <h1 className="title">Welcome To Our Job Tracker Application</h1>
          <p className="subtitle">
            Track applications and stay organized
          </p>
        </div>
      </header>

      <section className="grid">
        <Cards title="Dashboard" desc="Check and manage your job applications." to="/dashboard" />
        <Cards title="Data Analytics" desc="See charts and analytics." to="/dataanalytics" />
        <Cards title="Personal Information" desc="Update your info." to="/profile" />
      </section>

      <section className="bottom">
        <span className="dot" />
        Job offer starts here!
      </section>
    </main>
  );
}

/*
  reusable cards
*/

function Cards({ title, desc, to }) {
  return (
    <Link className="card" to={to}>
      <div className="cardTitle">{title}</div>
      <div className="cardDescription">{desc}</div>
      <div className="cardLink">Open →</div>
    </Link>
  );
}