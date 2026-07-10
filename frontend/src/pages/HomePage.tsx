import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Compass,
  ExternalLink,
  FileSearch,
  ListChecks,
  MapPinned,
  PieChart,
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
  {
    title: "Manual Saved Opportunities",
    description:
      "Save roles you found yourself and keep company, source, URL, notes, and status together.",
    meta: "SQLite backed",
    icon: ListChecks,
  },
  {
    title: "Reports",
    description:
      "Prepare progress summaries from real saved opportunities when reporting ships.",
    meta: "Future reports",
    icon: PieChart,
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
    title: "Save opportunity",
    description: "Manually store roles you actually found on external platforms.",
  },
  {
    title: "Track application",
    description: "Move saved opportunities through a practical status workflow.",
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
      <section className="home-hero" aria-labelledby="product-title">
        <div className="home-hero-copy">
          <span className="badge badge-teal">Career tracking suite for students</span>
          <h1 id="product-title">
            Your career growth, <span>tracked smarter</span>
          </h1>
          <p className="hero-description">
            A job discovery and application tracking platform for students and
            fresh graduates who want a structured path from search direction to
            saved opportunity management.
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
          <div className="hero-proof-grid" aria-label="Product boundaries">
            <div>
              <strong>5</strong>
              <span>search platforms</span>
            </div>
            <div>
              <strong>0</strong>
              <span>scraped listings</span>
            </div>
            <div>
              <strong>Manual</strong>
              <span>saved opportunities</span>
            </div>
          </div>
        </div>
        <aside className="product-mockup card" aria-label="JobTrackr workflow preview">
          <div className="mockup-topbar">
            <span />
            <span />
            <span />
          </div>
          <div className="mockup-header">
            <div>
              <span className="eyebrow">Pipeline preview</span>
              <strong>Frontend Developer</strong>
            </div>
            <span className="badge badge-accent">Wishlist</span>
          </div>
          <div className="mockup-columns">
            {["Discover", "Saved", "Interview"].map((stage, index) => (
              <div className="mockup-column" key={stage}>
                <span>{stage}</span>
                <div
                  className={
                    index === activeBoardIndex % 3
                      ? "mockup-card active"
                      : "mockup-card"
                  }
                >
                  <MapPinned size={16} />
                  <strong>{jobBoards[index + 1] ?? "LinkedIn"}</strong>
                  <small>Manual workflow</small>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="board-strip" aria-label="Supported job boards">
        <span>Safe external search links</span>
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
            JobTrackr combines deterministic search guidance with manual saved
            opportunities, so the product feels useful without claiming external
            integrations that do not exist.
          </p>
        </div>

        <div className="feature-matrix" aria-label="Product capabilities">
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
            JT-0004 presents the workflow as a real product surface while keeping
            every record user-controlled and every external search manual.
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

      <section className="trust-panel" aria-labelledby="trust-title">
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
            <FileSearch size={24} />
            <strong>No fake listings</strong>
            <span>User-entered records</span>
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
