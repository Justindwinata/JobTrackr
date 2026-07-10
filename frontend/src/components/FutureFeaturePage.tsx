import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type FutureFeaturePageProps = {
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
  contract: string;
  capabilities: string[];
  boundary: string;
  previewTitle: string;
  previewItems: Array<{
    label: string;
    detail: string;
  }>;
};

function FutureFeaturePage({
  badge,
  title,
  description,
  icon: Icon,
  contract,
  capabilities,
  boundary,
  previewTitle,
  previewItems,
}: FutureFeaturePageProps) {
  return (
    <main className="page-shell">
      <section className="future-hero" aria-labelledby="future-feature-title">
        <div className="future-copy">
          <span className="badge badge-teal">{badge}</span>
          <h1 id="future-feature-title">{title}</h1>
          <p>{description}</p>
          <div className="button-row">
            <Link className="button button-primary" to="/discover">
              Start with Discover Jobs
            </Link>
            <Link className="button button-secondary" to="/">
              Back to Home
            </Link>
          </div>
        </div>
        <aside className="future-status card">
          <Icon size={34} />
          <span className="badge badge-accent">{contract}</span>
          <strong>Coming in a future contract</strong>
          <p>{boundary}</p>
        </aside>
      </section>

      <section className="future-preview card" aria-labelledby="future-preview-title">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow">Future workflow preview</span>
            <h2 id="future-preview-title">{previewTitle}</h2>
          </div>
          <p>
            These panels describe the planned product structure only. They do
            not represent real user records, listings, analytics, or imported
            third-party data.
          </p>
        </div>
        <div className="future-preview-grid">
          {previewItems.map((item) => (
            <article className="future-preview-card" key={item.label}>
              <span className="badge badge-muted">Preview</span>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
              <div className="skeleton-lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="future-grid" aria-label={`${title} planned capabilities`}>
        {capabilities.map((capability) => (
          <article className="future-card card" key={capability}>
            <span />
            <p>{capability}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default FutureFeaturePage;
