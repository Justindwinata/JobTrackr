import {
  AlertCircle,
  CalendarClock,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { friendlyErrorMessage } from "../api/errors";
import {
  getCareerProgressReport,
  getCareerProgressReportHtmlUrl,
} from "../api/reports";
import type { CareerProgressReport } from "../types/report";
import type {
  TrackerDeadlineItem,
  TrackerDistributionItem,
  TrackerOpportunitySnapshot,
  TrackerPipelineGroup,
  TrackerRecentActivityItem,
  TrackerSummaryCard,
} from "../types/tracker";

const emptyReport: CareerProgressReport = {
  metadata: {
    report_id: "",
    generated_at: "",
    report_title: "Career Progress Report",
    period_label: "All saved opportunities",
  },
  executive_summary: {
    total_opportunities: 0,
    active_opportunities: 0,
    closed_opportunities: 0,
    applied_count: 0,
    screening_count: 0,
    interview_count: 0,
    offer_count: 0,
    rejected_count: 0,
  },
  summary_cards: [],
  status_distribution: [],
  source_distribution: [],
  priority_distribution: [],
  pipeline_groups: [],
  upcoming_deadlines: [],
  overdue_opportunities: [],
  recent_activity: [],
  practical_notes: {
    deterministic_report: true,
    generated_from_manual_opportunities: true,
    no_scraping: true,
    no_external_job_board_ingestion: true,
    no_ai_generated_ranking: true,
  },
};

function ReportsPage() {
  const [report, setReport] = useState<CareerProgressReport>(emptyReport);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void loadReport();
  }, []);

  const totalSaved = report.executive_summary.total_opportunities;
  const isEmpty = !isLoading && !errorMessage && totalSaved === 0;
  const htmlReportUrl = useMemo(() => getCareerProgressReportHtmlUrl(), []);

  async function loadReport() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setReport(await getCareerProgressReport());
    } catch (error) {
      setReport(emptyReport);
      setErrorMessage(
        friendlyErrorMessage(
          error,
          "Unable to load career progress report. Start the backend server and try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="reports-hero" aria-labelledby="reports-title">
        <div>
          <span className="badge badge-accent">Reports</span>
          <h1 id="reports-title">Career progress reports from real tracker data</h1>
          <p>
            JobTrackr turns manually saved opportunities into a readable progress
            report. It summarizes applications, distributions, deadlines, and
            recent activity without scraping or fabricated analytics.
          </p>
        </div>
        <aside className="tracker-refresh-card card">
          <FileText size={30} />
          <strong>Standalone HTML report</strong>
          <span>Open a browser-ready report generated directly by the backend.</span>
          <div className="button-row button-row-tight">
            <button className="button button-secondary" type="button" onClick={loadReport}>
              <RefreshCw size={18} />
              Refresh
            </button>
            <a
              className="button button-primary"
              href={htmlReportUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink size={18} />
              Open HTML report
            </a>
          </div>
        </aside>
      </section>

      {isLoading ? (
        <section className="empty-state empty-state-feature card" aria-live="polite">
          <Loader2 className="spin-icon" size={28} />
          <strong>Loading career report</strong>
          <p>JobTrackr is compiling saved opportunities and tracker analytics.</p>
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
          <FileText size={30} />
          <span className="badge badge-teal">No fake report</span>
          <strong>Save opportunities first to generate a career progress report.</strong>
          <p>
            Reports are generated only from opportunities you manually save. Add
            real records first, then return here to review progress.
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
          <section className="report-meta-strip card" aria-label="Report metadata">
            <div>
              <span className="eyebrow">Generated report</span>
              <strong>{report.metadata.report_title}</strong>
            </div>
            <div>
              <span>Generated</span>
              <strong>{formatDateTime(report.metadata.generated_at)}</strong>
            </div>
            <div>
              <span>Period</span>
              <strong>{report.metadata.period_label}</strong>
            </div>
          </section>

          <section className="tracker-card-grid" aria-label="Report overview">
            {report.summary_cards
              .filter((card) =>
                [
                  "total",
                  "active",
                  "applied",
                  "interviews",
                  "offers",
                  "rejected",
                  "upcoming_deadlines",
                  "overdue",
                ].includes(card.key),
              )
              .map((card) => (
                <SummaryCard card={card} key={card.key} />
              ))}
          </section>

          <section className="tracker-section" aria-labelledby="report-distribution-title">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">Distribution summaries</span>
                <h2 id="report-distribution-title">Progress by status, source, and priority</h2>
              </div>
              <p>
                Each bar is calculated from saved opportunity fields. No external
                board data is imported.
              </p>
            </div>
            <div className="analytics-grid">
              <DistributionPanel title="Status distribution" items={report.status_distribution} />
              <DistributionPanel title="Source distribution" items={report.source_distribution} />
              <DistributionPanel
                title="Priority distribution"
                items={report.priority_distribution}
              />
            </div>
          </section>

          <section className="tracker-section" aria-labelledby="report-pipeline-title">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">Pipeline preview</span>
                <h2 id="report-pipeline-title">Grouped application progress</h2>
              </div>
              <p>Grouped by current saved opportunity status.</p>
            </div>
            <div className="report-pipeline-grid">
              {report.pipeline_groups.map((group) => (
                <PipelineSummary group={group} key={group.status} />
              ))}
            </div>
          </section>

          <section className="tracker-section tracker-deadline-grid">
            <DeadlinePanel
              title="Upcoming deadlines"
              emptyText="No upcoming active deadlines."
              items={report.upcoming_deadlines}
              tone="upcoming"
            />
            <DeadlinePanel
              title="Overdue opportunities"
              emptyText="No active opportunities are overdue."
              items={report.overdue_opportunities}
              tone="overdue"
            />
          </section>

          <section className="tracker-section" aria-labelledby="report-activity-title">
            <div className="section-heading split-heading">
              <div>
                <span className="eyebrow">Recent activity</span>
                <h2 id="report-activity-title">Latest saved opportunity updates</h2>
              </div>
              <p>Useful context for weekly career progress reviews.</p>
            </div>
            <div className="activity-list card">
              {report.recent_activity.length > 0 ? (
                report.recent_activity.map((item) => (
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

          <section className="report-notes card" aria-label="Report boundaries">
            <CalendarClock size={24} />
            <div>
              <strong>Report boundary</strong>
              <p>
                Deterministic report generated from manually saved opportunities.
                No scraping, no fake listings, no external job board ingestion,
                and no AI-generated ranking.
              </p>
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

function DistributionPanel({
  title,
  items,
}: {
  title: string;
  items: TrackerDistributionItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <article className="distribution-panel card">
      <h3>{title}</h3>
      {total > 0 ? (
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
      ) : (
        <p className="distribution-empty">No saved opportunity data yet.</p>
      )}
    </article>
  );
}

function PipelineSummary({ group }: { group: TrackerPipelineGroup }) {
  return (
    <article className="report-pipeline-card card">
      <div className="pipeline-column-header">
        <strong>{group.label}</strong>
        <span>{group.count}</span>
      </div>
      <div className="report-pipeline-list">
        {group.opportunities.length > 0 ? (
          group.opportunities.slice(0, 3).map((opportunity) => (
            <div className="pipeline-opportunity-card" key={opportunity.id}>
              <strong>{opportunity.role_title}</strong>
              <span>{opportunity.company_name}</span>
              <div className="pipeline-meta">
                <small>{sourceLabel(opportunity.source)}</small>
                <small>{opportunity.location}</small>
              </div>
            </div>
          ))
        ) : (
          <p className="pipeline-empty">No opportunities</p>
        )}
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
  opportunity: TrackerOpportunitySnapshot | TrackerRecentActivityItem;
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

function formatDateTime(value: string) {
  if (!value) return "Not generated yet";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default ReportsPage;
