const features = [
  {
    title: "Smart Job Discovery",
    description:
      "Turn selected skills, target roles, and preferred locations into focused job search directions.",
    meta: "Guided search",
  },
  {
    title: "External Search Links",
    description:
      "Open safe search URLs for trusted platforms without scraping or automated data ingestion.",
    meta: "Safe by design",
  },
  {
    title: "Application Tracker",
    description:
      "Prepare a clear workflow for manually saving opportunities and tracking application progress.",
    meta: "Future workflow",
  },
];

function HomePage() {
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
            <a className="button button-primary" href="/discover">
              Discover jobs
            </a>
            <a className="button button-secondary" href="#capabilities">
              Explore scope
            </a>
          </div>
        </div>
        <aside className="status-card card" aria-label="Current product scope">
          <span className="badge badge-accent">JT-0002 ready</span>
          <strong>Professional UI foundation</strong>
          <p>No scraping. No fake listings. Safe external search links only.</p>
        </aside>
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
              <span className="badge badge-muted">{feature.meta}</span>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;

