const features = [
  {
    title: "Smart Job Discovery",
    description:
      "Turn selected skills, target roles, and preferred locations into focused job search directions.",
  },
  {
    title: "External Search Links",
    description:
      "Open safe search URLs for trusted platforms without scraping or automated data ingestion.",
  },
  {
    title: "Application Tracker",
    description:
      "Prepare a clear workflow for manually saving opportunities and tracking application progress.",
  },
];

function App() {
  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="product-title">
        <div className="hero-copy">
          <p className="eyebrow">Student career operating system</p>
          <h1 id="product-title">JobTrackr</h1>
          <p className="hero-description">
            A job discovery and application tracking platform for students and
            fresh graduates who want a structured path from search ideas to
            application progress.
          </p>
        </div>
        <div className="status-panel" aria-label="Current product scope">
          <span className="status-label">JT-0001</span>
          <strong>Foundation in progress</strong>
          <p>No scraping. No fake listings. Safe external search links only.</p>
        </div>
      </section>

      <section className="feature-grid" aria-label="Product capabilities">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;

