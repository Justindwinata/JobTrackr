import {
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Loader2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { apiBaseUrl } from "../api/config";
import { friendlyErrorMessage, readApiErrorMessage } from "../api/errors";

type NamedValue = {
  name: string;
};

type TargetRole = {
  title: string;
};

type ExternalSearchLink = {
  source: string;
  label: string;
  url: string;
};

type JobSearchRecommendation = {
  title: string;
  query: string;
  matched_skills: NamedValue[];
  target_role: TargetRole;
  location: NamedValue;
  source_links: ExternalSearchLink[];
};

type RecommendationResponse = {
  recommendations: JobSearchRecommendation[];
};

function parseListInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function DiscoverPage() {
  const [skillsInput, setSkillsInput] = useState("React, TypeScript, SQL");
  const [rolesInput, setRolesInput] = useState("Frontend Developer, Web Developer");
  const [locationsInput, setLocationsInput] = useState("Jakarta, Remote");
  const [recommendations, setRecommendations] = useState<JobSearchRecommendation[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const preview = useMemo(
    () => ({
      skills: parseListInput(skillsInput),
      roles: parseListInput(rolesInput),
      locations: parseListInput(locationsInput),
    }),
    [locationsInput, rolesInput, skillsInput],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    setErrorMessage("");

    if (
      preview.skills.length === 0 ||
      preview.roles.length === 0 ||
      preview.locations.length === 0
    ) {
      setRecommendations([]);
      setErrorMessage("Add at least one skill, target role, and preferred location.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/job-search/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: preview.skills.map((name) => ({ name })),
          target_roles: preview.roles.map((title) => ({ title })),
          preferred_locations: preview.locations.map((name) => ({ name })),
        }),
      });

      if (!response.ok) {
        throw new Error(
          await readApiErrorMessage(
            response,
            "Unable to generate recommendations. Check your inputs and try again.",
          ),
        );
      }

      const payload = (await response.json()) as RecommendationResponse;
      setRecommendations(payload.recommendations);
    } catch (error) {
      setRecommendations([]);
      setErrorMessage(
        friendlyErrorMessage(
          error,
          "Unable to reach the JobTrackr backend. Start the FastAPI server and try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="discover-hero" aria-labelledby="discover-title">
        <div>
          <span className="badge badge-accent">Functional discovery workspace</span>
          <h1 id="discover-title">Build focused job search directions</h1>
          <p>
            Enter skills, target roles, and locations. JobTrackr generates
            deterministic search recommendations and safe external links. It
            does not fetch real listings or scrape job boards.
          </p>
          <div className="discover-hero-metrics" aria-label="Discovery guardrails">
            <div>
              <strong>5</strong>
              <span>external platforms</span>
            </div>
            <div>
              <strong>{preview.skills.length + preview.roles.length + preview.locations.length}</strong>
              <span>parsed inputs</span>
            </div>
            <div>
              <strong>Manual</strong>
              <span>opening and saving</span>
            </div>
          </div>
        </div>
        <div className="discover-note card">
          <ShieldCheck size={26} />
          <strong>No scraping boundary</strong>
          <span>
            JobTrackr creates search URLs only. You open each platform yourself
            and manually save opportunities you trust.
          </span>
          <div className="platform-stack" aria-label="Supported external platforms">
            {["LinkedIn", "JobStreet", "Glints", "Karir", "Dealls"].map((platform) => (
              <span key={platform}>{platform}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="discover-layout" aria-label="Recommendation builder">
        <form className="discover-form card" onSubmit={handleSubmit}>
          <div className="form-header">
            <span className="eyebrow">Search inputs</span>
            <h2>Build recommendations</h2>
            <p>
              Use comma-separated values. The backend combines every role and
              location into deterministic search directions.
            </p>
          </div>

          <label className="field-group">
            <span>Skills</span>
            <input
              value={skillsInput}
              onChange={(event) => setSkillsInput(event.target.value)}
              placeholder="React, TypeScript, SQL"
            />
          </label>

          <label className="field-group">
            <span>Target roles</span>
            <input
              value={rolesInput}
              onChange={(event) => setRolesInput(event.target.value)}
              placeholder="Frontend Developer, Web Developer"
            />
          </label>

          <label className="field-group">
            <span>Preferred locations</span>
            <input
              value={locationsInput}
              onChange={(event) => setLocationsInput(event.target.value)}
              placeholder="Jakarta, Remote"
            />
          </label>

          {errorMessage ? (
            <div className="form-alert" role="alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <button className="button button-primary" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="spin-icon" size={18} /> : <Search size={18} />}
            {isLoading ? "Generating..." : "Generate recommendations"}
          </button>
        </form>

        <aside className="preview-panel card" aria-label="Current parsed inputs">
          <div className="preview-panel-header">
            <span className="eyebrow">Current selection</span>
            <strong>{preview.roles.length * preview.locations.length || 0}</strong>
            <p>possible recommendation cards before platform links are added</p>
          </div>
          <PreviewGroup label="Skills" values={preview.skills} tone="teal" />
          <PreviewGroup label="Roles" values={preview.roles} tone="accent" />
          <PreviewGroup label="Locations" values={preview.locations} tone="neutral" />
        </aside>
      </section>

      <section className="results-section" aria-labelledby="results-title">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow">Recommendations</span>
            <h2 id="results-title">Generated external search links</h2>
          </div>
          <div className="results-copy">
            <p>
              Results come from the deterministic backend contract. They are
              search directions only, not real-time job listings.
            </p>
            <Link className="button button-secondary" to="/saved">
              Found a matching job? Save it manually
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="empty-state empty-state-feature card" aria-live="polite">
            <Loader2 className="spin-icon" size={28} />
            <strong>Generating recommendations</strong>
            <p>JobTrackr is preparing safe external search URLs.</p>
          </div>
        ) : null}

        {!isLoading && recommendations.length > 0 ? (
          <>
            <div className="results-summary card" aria-label="Recommendation summary">
              <div>
                <strong>{recommendations.length}</strong>
                <span>recommendation cards</span>
              </div>
              <div>
                <strong>{recommendations[0]?.source_links.length ?? 0}</strong>
                <span>platform links per card</span>
              </div>
              <div>
                <strong>{preview.skills.length}</strong>
                <span>matched skill inputs</span>
              </div>
            </div>
            <div className="recommendation-grid">
              {recommendations.map((recommendation) => (
                <article
                  className="recommendation-card card"
                  key={`${recommendation.target_role.title}-${recommendation.location.name}`}
                >
                  <div className="recommendation-header">
                    <div className="recommendation-kicker">
                      <span className="badge badge-teal">
                        {recommendation.location.name}
                      </span>
                      <span className="badge badge-muted">External search</span>
                    </div>
                    <h3>{recommendation.title}</h3>
                    <p>{recommendation.query}</p>
                  </div>

                  <div className="recommendation-meta">
                    <div>
                      <span>Target role</span>
                      <strong>{recommendation.target_role.title}</strong>
                    </div>
                    <div>
                      <span>Matched skills</span>
                      <div className="chip-row">
                        {recommendation.matched_skills.map((skill) => (
                          <span className="chip" key={skill.name}>
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="external-link-grid">
                    {recommendation.source_links.map((link) => (
                      <a
                        className="external-link-button"
                        href={link.url}
                        key={link.source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                        <ExternalLink size={16} />
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}

        {!isLoading && hasSubmitted && !errorMessage && recommendations.length === 0 ? (
          <div className="empty-state empty-state-feature card">
            <strong>No recommendations returned</strong>
            <p>
              Try adding at least one skill, target role, and preferred location.
            </p>
          </div>
        ) : null}

        {!isLoading && !hasSubmitted ? (
          <div className="empty-state empty-state-feature card">
            <strong>Your recommendations will appear here</strong>
            <p>
              Submit the form to call the backend and generate external search
              links across the supported job boards.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function PreviewGroup({
  label,
  values,
  tone,
}: {
  label: string;
  values: string[];
  tone: "teal" | "accent" | "neutral";
}) {
  return (
    <div className="preview-group">
      <strong>{label}</strong>
      {values.length > 0 ? (
        <div className="chip-row">
          {values.map((value) => (
            <span className={`chip chip-${tone}`} key={value}>
              {value}
            </span>
          ))}
        </div>
      ) : (
        <span className="muted-text">No values yet</span>
      )}
    </div>
  );
}

export default DiscoverPage;
