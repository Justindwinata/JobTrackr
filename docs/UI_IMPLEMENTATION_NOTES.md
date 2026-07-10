# JT-0004 UI Implementation Notes

## Stitch Package Inspection

Expected package:

- `stitch_jobtrackr_saas_career_suite-2.zip`

Inspection result on 2026-07-11:

- The package contains HTML and screenshot references for the logo, Home, Discover Jobs, Saved Opportunities, Application Tracker, and Reports.
- The package contains `jobtrackr_professional/DESIGN.md`, which defines the visual system.
- The raw ZIP is treated as an uploaded design package and is not committed to the repository.

## Translation Direction

The Stitch package moves JobTrackr toward a denser career-tech SaaS interface:

- Dashboard-style shell with dark teal navigation, strong active states, and orange CTAs.
- Dashboard-like page surfaces instead of oversized empty hero sections.
- Structured panels, metric rails, workflow previews, bento sections, and action cards.
- Professional form and list layouts for Discover Jobs and Saved Opportunities.
- Honest future-feature previews for Application Tracker and Reports.
- Existing brand palette remains the source of truth:
  - Orange accent: `#FF9E20`
  - Deep teal: `#215E61`
  - Dark neutral: `#1D2128`
  - Soft background: `#F4F2F2`

## Implementation Guardrails

- Preserve all existing routes.
- Preserve Discover Jobs API integration.
- Preserve Saved Opportunities CRUD behavior.
- Do not add fake job listings or fake saved opportunities.
- Do not add scraping, job board API calls, authentication, cloud database, deployment, or AI/LLM features.
- Use only local UI structure, icons, and original JobTrackr assets already in the repository.

## Page-Level Plan

- App shell: desktop sidebar treatment inspired by Stitch, responsive top/mobile navigation, active left-edge/filled states, structured footer.
- Home: career-tech landing page with product mockup, workflow, supported boards, feature matrix, and ethics/trust section.
- Discover Jobs: split workspace with input builder, selected chips, recommendation cards, platform actions, and manual-save CTA.
- Saved Opportunities: operational workspace with manual form, filters, saved cards/table density, status/source badges, edit panel, and empty states.
- Tracker: future pipeline preview with clearly labeled non-data skeleton columns.
- Reports: future reporting preview with clearly labeled non-data chart skeletons.

## Reusable Stitch Patterns

- Use dark teal navigation surfaces for SaaS/product credibility.
- Reserve orange for active route indicators, primary CTAs, and high-impact highlights.
- Use white cards on the soft background with subtle borders and neutral-tinted shadows.
- Prefer tighter section heights, denser cards, and clear information rails over oversized generic heroes.
- Use pill chips for source, status, and selected input previews.
- Use skeleton cards only when explicitly labeled as future workflow previews.

## JT-0004 Implementation Result

- App shell now uses a dark teal desktop sidebar with orange active states and a responsive mobile header.
- Home now presents a denser SaaS-style product story with a workflow mockup, board strip, feature matrix, and no-scraping trust panel.
- Discover Jobs now uses a split command workspace, parsed input metrics, result summaries, and polished recommendation cards while preserving the recommendation API request shape.
- Saved Opportunities now uses a workspace layout with manual form, metrics, richer saved cards, status/source badges, filters, and edit foundation while preserving CRUD behavior.
- Application Tracker and Reports now show clearly labeled future workflow previews instead of empty placeholders or fake analytics.
