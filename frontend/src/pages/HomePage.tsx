import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Compass,
  ExternalLink,
  FileSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Smart Job Discovery",
    description:
      "Turn selected skills, target roles, and preferred locations into focused job search directions.",
    meta: "Guided search",
    icon: Compass,
  },
  {
    title: "External Search Links",
    description:
      "Open safe search URLs for trusted platforms without scraping or automated data ingestion.",
    meta: "Safe by design",
    icon: ExternalLink,
  },
  {
    title: "Application Tracker",
    description:
      "Prepare a clear workflow for manually saving opportunities and tracking application progress.",
    meta: "Future workflow",
    icon: BriefcaseBusiness,
  },
];

const jobBoards = [
  "LinkedIn",
  "JobStreet Indonesia",
  "Glints",
  "Karir.com",
  "Dealls",
];

const workflow = [
  {
    title: "Select your strengths",
    description: "Choose skills you can defend in interviews and portfolio work.",
  },
  {
    title: "Set role direction",
    description: "Pair those skills with target job titles and preferred locations.",
  },
  {
    title: "Open safe searches",
    description: "Use generated links to search each platform manually.",
  },
  {
    title: "Track later",
    description: "Save opportunities and monitor progress when persistence is added.",
  },
];

function HomePage() {
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveBoardIndex((current) => (current + 1) % jobBoards.length);
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <main className="page-shell">
      <section className="hero-section" aria-labelledby="product-title">
        <div className="hero-copy stack-lg">
          <span className="badge badge-teal">Student career operating system</span>
          <h1 id="product-title">JobTrackr</h1>
          <p className="hero-description">
            A job discovery and application tracking platform for students and
            fresh graduates who want a structured path from search ideas to
            application progress.
          </p>
          <div className="button-row" aria-label="Primary product actions">
            <Link className="button button-primary" to="/discover">
              Discover jobs
              <ArrowRight size={18} />
            </Link>
            <a className="button button-secondary" href="#workflow">
              Explore scope
            </a>
          </div>
        </div>
        <aside className="hero-dashboard card" aria-label="Current product scope">
          <div className="dashboard-topline">
            <span className="badge badge-accent">JT-0002</span>
            <span>UI milestone</span>
          </div>
          <div className="dashboard-focus">
            <FileSearch size={32} />
            <strong>Generate search directions, not scraped listings.</strong>
          </div>
          <div className="dashboard-list" aria-label="Supported search sources">
            {jobBoards.map((board, index) => (
              <span
                className={
                  index === activeBoardIndex
                    ? "dashboard-source dashboard-source-active"
                    : "dashboard-source"
                }
                key={board}
              >
                {board}
              </span>
            ))}
          </div>
        </aside>
      </section>

      <section className="logo-strip" aria-label="Supported job boards">
        <span>Safe external search links for</span>
        <div>
          {jobBoards.map((board) => (
            <strong key={board}>{board}</strong>
          ))}
        </div>
      </section>

      <section
        className="section-block"
        id="capabilities"
        aria-labelledby="capabilities-title"
      >
        <div className="section-heading">
          <span className="eyebrow">Product foundation</span>
          <h2 id="capabilities-title">Built for a credible job search workflow</h2>
          <p>
            JobTrackr starts with deterministic search guidance and grows toward
            manual opportunity tracking without claiming integrations that do not
            exist yet.
          </p>
        </div>

        <div className="feature-grid" aria-label="Product capabilities">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <feature.icon className="feature-icon" size={24} />
              <span className="badge badge-muted">{feature.meta}</span>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section-block"
        id="workflow"
        aria-labelledby="workflow-title"
      >
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow">Workflow</span>
            <h2 id="workflow-title">From search intent to application discipline</h2>
          </div>
          <p>
            JT-0002 focuses on a credible discovery experience. Later contracts
            will add manual saving, tracker persistence, and reporting from real
            user-entered data.
          </p>
        </div>

        <div className="workflow-grid">
          {workflow.map((step, index) => (
            <article className="workflow-card" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="credibility-section" aria-labelledby="trust-title">
        <div className="credibility-copy">
          <span className="eyebrow">Product credibility</span>
          <h2 id="trust-title">Honest software boundaries from day one</h2>
          <p>
            JobTrackr is built as a portfolio-ready product foundation with
            explicit constraints: deterministic search links, no third-party data
            ingestion, no automated applications, and no fabricated records.
          </p>
        </div>
        <div className="credibility-grid">
          <div>
            <ShieldCheck size={24} />
            <strong>No scraping</strong>
            <span>Search links only</span>
          </div>
          <div>
            <BarChart3 size={24} />
            <strong>Reports later</strong>
            <span>Real data required</span>
          </div>
          <div>
            <Sparkles size={24} />
            <strong>No AI claims</strong>
            <span>Deterministic output</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
