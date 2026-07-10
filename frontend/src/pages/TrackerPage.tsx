import {
  AlertCircle,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { friendlyErrorMessage } from "../api/errors";
import { getTrackerSummary } from "../api/tracker";
import type {
  TrackerDeadlineItem,
  TrackerDistributionItem,
  TrackerOpportunitySnapshot,
  TrackerPipelineGroup,
  TrackerSummaryCard,
  TrackerSummaryResponse,
} from "../types/tracker";

const emptySummary: TrackerSummaryResponse = {
  summary_cards: [],
  status_distribution: [],
  source_distribution: [],
  priority_distribution: [],
  pipeline_groups: [],
  upcoming_deadlines: [],
  overdue_opportunities: [],
  recent_activity: [],
};

function TrackerPage() {
  const [summary, setSummary] = useState<TrackerSummaryResponse>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void loadSummary();
  }, []);

  const totalSaved = useMemo(
    () => summary.summary_cards.find((card) => card.key === "total")?.value ?? 0,
    [summary.summary_cards],
  );
  const isEmpty = !isLoading && !errorMessage && totalSaved === 0;

  async function loadSummary() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setSummary(await getTrackerSummary());
    } catch (error) {
      setSummary(emptySummary);
      setErrorMessage(
        friendlyErrorMessage(
          error,
          "Unable to load tracker analytics. Start the backend server and try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="tracker-hero" aria-labelledby="tracker-title">
        <div>
          <span className="badge badge-accent">Application Tracker</span>
          <h1 id="tracker-title">Track application progress from real saved jobs</h1>
          <p>
            JobTrackr summarizes manually saved opportunities from SQLite. The
            dashboard shows status progress, deadlines, and recent activity
            without scraping or fabricated analytics.
          </p>
        </div>
        <aside className="tracker-refresh-card card">
          <BarChart3 size={30} />
          <strong>Real tracker data only</strong>
          <span>Every metric is derived from saved opportunities you entered.</span>
          <button className="button button-secondary" type="button" onClick={loadSummary}>
            <RefreshCw size={18} />
            Refresh tracker
          </button>
        </aside>
      </section>

      {isLoading ? (
        <section className="empty-state empty-state-feature card" aria-live="polite">
          <Loader2 className="spin-icon" size={28} />
          <strong>Loading tracker dashboard</strong>
          <p>JobTrackr is reading saved opportunities and computing analytics.</p>
        </section>
      ) : null}

      {errorMessage ? (
        <section className="form-alert tracker-alert" role="alert">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </section>
      ) : null}

      {isEmpty ? (
        <section className="tracker-empty card">
          <CheckCircle2 size={30} />
          <span className="badge badge-teal">No fake data</span>
          <strong>Save your first opportunity to start tracking applications.</strong>
          <p>
            The tracker dashboard stays empty until you manually save real
            opportunities. Add a job from the Saved Opportunities page after
            finding it through an external search.
          </p>
          <div className="button-row">
            <Link className="button button-primary" to="/saved">
              Save an opportunity
            </Link>
            <Link className="button button-secondary" to="/discover">
              Discover search links
            </Link>
          </div>
        </section>
      ) : null}

      {!isLoading && !errorMessage && !isEmpty ? (
        <>
          <section className="tracker-card-grid" aria-label="Tracker overview">
            {summary.summary_cards.map((card) => (
              <SummaryCard card={card} key={card.key} />
            ))}
          </section>

          <section className="tracker-section" aria-labelledby="pipeline-title">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">Status pipeline</span>
                <h2 id="pipeline-title">Application status pipeline</h2>
              </div>
              <p>
                Cards are grouped from current saved opportunity statuses.
                Update statuses from Saved Opportunities for now.
              </p>
            </div>
            <div className="pipeline-board">
              {summary.pipeline_groups.map((group) => (
                <PipelineColumn group={group} key={group.status} />
              ))}
            </div>
          </section>

          <section className="tracker-section" aria-labelledby="analytics-title">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">Analytics</span>
                <h2 id="analytics-title">Application distribution</h2>
              </div>
              <p>
                Visual summaries use only manually saved opportunities and their
                current status, source, and priority fields.
              </p>
            </div>
            <div className="analytics-grid">
              <DistributionPanel
                title="Status distribution"
                items={summary.status_distribution}
              />
              <DistributionPanel
                title="Source distribution"
                items={summary.source_distribution}
              />
              <DistributionPanel
                title="Priority distribution"
                items={summary.priority_distribution}
              />
            </div>
          </section>

          <section className="tracker-section tracker-deadline-grid">
            <DeadlinePanel
              title="Upcoming deadlines"
              emptyText="No upcoming active deadlines."
              items={summary.upcoming_deadlines}
              tone="upcoming"
            />
            <DeadlinePanel
              title="Overdue opportunities"
              emptyText="No active opportunities are overdue."
              items={summary.overdue_opportunities}
              tone="overdue"
            />
          </section>

          <section className="tracker-section" aria-labelledby="activity-title">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">Recent activity</span>
                <h2 id="activity-title">Recently updated opportunities</h2>
              </div>
              <p>Ordered by the latest saved opportunity updates.</p>
            </div>
            <div className="activity-list card">
              {summary.recent_activity.length > 0 ? (
                summary.recent_activity.map((item) => (
                  <OpportunityRow
                    opportunity={item}
                    meta={item.activity_label}
                    key={item.id}
                  />
                ))
              ) : (
                <p className="muted-text">No recent activity yet.</p>
              )}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}

function SummaryCard({ card }: { card: TrackerSummaryCard }) {
  return (
    <article className={`tracker-summary-card card tracker-summary-${card.key}`}>
      <span>{card.label}</span>
      <strong>{card.value}</strong>
      <p>{card.description}</p>
    </article>
  );
}

function PipelineColumn({ group }: { group: TrackerPipelineGroup }) {
  return (
    <article className="pipeline-column">
      <div className="pipeline-column-header">
        <strong>{group.label}</strong>
        <span>{group.count}</span>
      </div>
      <div className="pipeline-column-body">
        {group.opportunities.length > 0 ? (
          group.opportunities.map((opportunity) => (
            <OpportunityMiniCard opportunity={opportunity} key={opportunity.id} />
          ))
        ) : (
          <p className="pipeline-empty">No opportunities</p>
        )}
      </div>
    </article>
  );
}

function OpportunityMiniCard({
  opportunity,
}: {
  opportunity: TrackerOpportunitySnapshot;
}) {
  return (
    <div className="pipeline-opportunity-card">
      <strong>{opportunity.role_title}</strong>
      <span>{opportunity.company_name}</span>
      <div className="pipeline-meta">
        <small>{sourceLabel(opportunity.source)}</small>
        <small>{opportunity.location}</small>
        <small>{priorityLabel(opportunity.priority)}</small>
      </div>
      {opportunity.deadline ? (
        <small className="deadline-chip">Deadline {formatDate(opportunity.deadline)}</small>
      ) : null}
    </div>
  );
}

function DistributionPanel({
  title,
  items,
}: {
  title: string;
  items: TrackerDistributionItem[];
}) {
  return (
    <article className="distribution-panel card">
      <h3>{title}</h3>
      <div className="distribution-list">
        {items.map((item) => (
          <div className="distribution-row" key={item.key}>
            <div>
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </div>
            <div className="distribution-track" aria-hidden="true">
              <span style={{ width: `${item.percentage}%` }} />
            </div>
            <small>{item.percentage}%</small>
          </div>
        ))}
      </div>
    </article>
  );
}

function DeadlinePanel({
  title,
  emptyText,
  items,
  tone,
}: {
  title: string;
  emptyText: string;
  items: TrackerDeadlineItem[];
  tone: "upcoming" | "overdue";
}) {
  return (
    <article className={`deadline-panel card deadline-panel-${tone}`}>
      <div className="deadline-panel-header">
        {tone === "upcoming" ? <CalendarClock size={22} /> : <Clock size={22} />}
        <h2>{title}</h2>
      </div>
      {items.length > 0 ? (
        <div className="deadline-list">
          {items.map((item) => (
            <OpportunityRow
              opportunity={item}
              meta={`${Math.abs(item.days_until_deadline)} day${
                Math.abs(item.days_until_deadline) === 1 ? "" : "s"
              } ${item.days_until_deadline < 0 ? "overdue" : "remaining"}`}
              key={item.id}
            />
          ))}
        </div>
      ) : (
        <p className="muted-text">{emptyText}</p>
      )}
    </article>
  );
}

function OpportunityRow({
  opportunity,
  meta,
}: {
  opportunity: TrackerOpportunitySnapshot;
  meta: string;
}) {
  return (
    <div className="tracker-opportunity-row">
      <div>
        <strong>{opportunity.role_title}</strong>
        <span>{opportunity.company_name}</span>
      </div>
      <div>
        <span>{sourceLabel(opportunity.source)}</span>
        <span>{opportunity.location}</span>
        <span>{meta}</span>
      </div>
    </div>
  );
}

function sourceLabel(source: string) {
  const labels: Record<string, string> = {
    linkedin: "LinkedIn",
    jobstreet_indonesia: "JobStreet Indonesia",
    glints: "Glints",
    karir: "Karir.com",
    dealls: "Dealls",
    other: "Other",
  };
  return labels[source] ?? source;
}

function priorityLabel(priority: string) {
  const labels: Record<string, string> = {
    low: "Low priority",
    medium: "Medium priority",
    high: "High priority",
  };
  return labels[priority] ?? priority;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default TrackerPage;
