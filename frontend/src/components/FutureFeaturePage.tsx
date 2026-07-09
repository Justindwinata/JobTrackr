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
};

function FutureFeaturePage({
  badge,
  title,
  description,
  icon: Icon,
  contract,
  capabilities,
  boundary,
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

