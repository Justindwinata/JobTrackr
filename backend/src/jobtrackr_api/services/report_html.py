from html import escape

from jobtrackr_api.models.report import CareerProgressReport
from jobtrackr_api.models.tracker import (
    TrackerDeadlineItem,
    TrackerDistributionItem,
    TrackerOpportunitySnapshot,
    TrackerPipelineGroup,
    TrackerRecentActivityItem,
    TrackerSummaryCard,
)


def render_career_progress_report_html(report: CareerProgressReport) -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{_text(report.metadata.report_title)} | JobTrackr</title>
  <style>
    :root {{
      color-scheme: light;
      --accent: #ff9e20;
      --teal: #215e61;
      --ink: #1d2128;
      --muted: #667085;
      --line: #d9dcdf;
      --soft: #f4f2f2;
      --card: #ffffff;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      color: var(--ink);
      background: var(--soft);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }}
    main {{ max-width: 1120px; margin: 0 auto; padding: 40px 20px; }}
    header {{
      display: grid;
      gap: 16px;
      padding: 28px;
      color: #fff;
      background: linear-gradient(135deg, var(--ink), var(--teal));
      border-radius: 18px;
    }}
    .brand {{ display: flex; align-items: center; gap: 12px; font-weight: 800; }}
    .mark {{
      display: inline-grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 12px;
      color: var(--ink);
      background: var(--accent);
    }}
    h1, h2, h3 {{ margin: 0; line-height: 1.1; }}
    h1 {{ max-width: 720px; font-size: clamp(2rem, 5vw, 4rem); }}
    h2 {{ margin-bottom: 14px; font-size: 1.35rem; }}
    h3 {{ font-size: 1rem; }}
    p {{ margin: 0; color: var(--muted); }}
    header p {{ max-width: 720px; color: rgba(255, 255, 255, 0.78); }}
    section {{ margin-top: 24px; }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 14px;
    }}
    .card {{
      padding: 18px;
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 16px;
      box-shadow: 0 18px 45px rgba(29, 33, 40, 0.06);
    }}
    .metric {{ color: var(--teal); font-size: 2rem; font-weight: 800; }}
    .label {{ color: var(--ink); font-weight: 750; }}
    .meta {{ color: var(--muted); font-size: 0.9rem; }}
    .distribution {{ display: grid; gap: 12px; }}
    .bar-row {{ display: grid; gap: 6px; }}
    .bar-head {{ display: flex; justify-content: space-between; gap: 12px; }}
    .bar-track {{
      height: 10px;
      overflow: hidden;
      background: #e8ecec;
      border-radius: 999px;
    }}
    .bar-fill {{ height: 100%; background: var(--teal); border-radius: inherit; }}
    .pipeline {{ display: grid; gap: 12px; }}
    .pipeline-group {{ display: grid; gap: 10px; }}
    .opportunity {{
      display: grid;
      gap: 4px;
      padding: 12px;
      background: #fbfcfc;
      border: 1px solid #e8ecec;
      border-radius: 12px;
    }}
    .badge {{
      display: inline-flex;
      width: fit-content;
      padding: 4px 9px;
      color: var(--teal);
      background: rgba(33, 94, 97, 0.1);
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 800;
    }}
    .empty {{ padding: 12px; color: var(--muted); background: #fbfcfc; border-radius: 12px; }}
    footer {{ margin-top: 28px; color: var(--muted); font-size: 0.92rem; }}
    @media (max-width: 640px) {{
      main {{ padding: 24px 14px; }}
      header {{ padding: 22px; }}
    }}
  </style>
</head>
<body>
  <main>
    <header>
      <div class="brand"><span class="mark">JT</span><span>JobTrackr</span></div>
      <h1>{_text(report.metadata.report_title)}</h1>
      <p>Generated {_text(report.metadata.generated_at.isoformat())}. This report summarizes manually saved opportunities only.</p>
    </header>
    <section>
      <h2>Executive Summary</h2>
      <div class="grid">{_summary_cards(report.summary_cards)}</div>
    </section>
    <section>
      <h2>Status Distribution</h2>
      <div class="card distribution">{_distribution(report.status_distribution)}</div>
    </section>
    <section>
      <h2>Source Distribution</h2>
      <div class="card distribution">{_distribution(report.source_distribution)}</div>
    </section>
    <section>
      <h2>Priority Distribution</h2>
      <div class="card distribution">{_distribution(report.priority_distribution)}</div>
    </section>
    <section>
      <h2>Pipeline Summary</h2>
      <div class="grid">{_pipeline(report.pipeline_groups)}</div>
    </section>
    <section>
      <h2>Upcoming Deadlines</h2>
      <div class="card">{_deadline_list(report.upcoming_deadlines, empty="No upcoming deadlines.")}</div>
    </section>
    <section>
      <h2>Overdue Opportunities</h2>
      <div class="card">{_deadline_list(report.overdue_opportunities, empty="No overdue opportunities.")}</div>
    </section>
    <section>
      <h2>Recent Activity</h2>
      <div class="card">{_recent_activity(report.recent_activity)}</div>
    </section>
    <footer>
      Generated from manually saved opportunities. No scraping. No fake job listings. No external job board data ingestion. No AI-generated ranking.
    </footer>
  </main>
</body>
</html>"""


def _summary_cards(cards: list[TrackerSummaryCard]) -> str:
    return "".join(
        f"""<article class="card">
  <div class="metric">{card.value}</div>
  <div class="label">{_text(card.label)}</div>
  <p>{_text(card.description)}</p>
</article>"""
        for card in cards
    )


def _distribution(items: list[TrackerDistributionItem]) -> str:
    if not items or sum(item.count for item in items) == 0:
        return '<div class="empty">No distribution data yet.</div>'

    return "".join(
        f"""<div class="bar-row">
  <div class="bar-head"><strong>{_text(item.label)}</strong><span>{item.count} ({item.percentage}%)</span></div>
  <div class="bar-track"><div class="bar-fill" style="width: {item.percentage}%"></div></div>
</div>"""
        for item in items
    )


def _pipeline(groups: list[TrackerPipelineGroup]) -> str:
    if not groups:
        return '<div class="card empty">No saved opportunities yet.</div>'

    return "".join(
        f"""<article class="card pipeline-group">
  <h3>{_text(group.label)} <span class="badge">{group.count}</span></h3>
  {_opportunity_list(group.opportunities, empty="No opportunities in this status.")}
</article>"""
        for group in groups
    )


def _opportunity_list(
    opportunities: list[TrackerOpportunitySnapshot],
    *,
    empty: str,
) -> str:
    if not opportunities:
        return f'<div class="empty">{_text(empty)}</div>'

    return "".join(_opportunity(item) for item in opportunities)


def _deadline_list(items: list[TrackerDeadlineItem], *, empty: str) -> str:
    if not items:
        return f'<div class="empty">{_text(empty)}</div>'

    return "".join(
        f"""{_opportunity(item)}
<p class="meta">Days until deadline: {item.days_until_deadline}</p>"""
        for item in items
    )


def _recent_activity(items: list[TrackerRecentActivityItem]) -> str:
    if not items:
        return '<div class="empty">No recent activity yet.</div>'

    return "".join(
        f"""{_opportunity(item)}
<p class="meta">{_text(item.activity_label)}</p>"""
        for item in items
    )


def _opportunity(item: TrackerOpportunitySnapshot) -> str:
    deadline = item.deadline.isoformat() if item.deadline is not None else "No deadline"
    return f"""<div class="opportunity">
  <strong>{_text(item.role_title)}</strong>
  <span>{_text(item.company_name)}</span>
  <span class="meta">{_text(item.location)} · {_text(item.source.value)} · {_text(item.priority.value)} · {_text(deadline)}</span>
</div>"""


def _text(value: object) -> str:
    return escape(str(value), quote=True)
