# JobTrackr Showcase Checklist

Use this checklist before sharing JobTrackr on GitHub, LinkedIn, or a portfolio site.

## Repository Preview

- README opens with a clear product description.
- README includes current product screenshots from `assets/screenshots/`.
- README states that JobTrackr generates safe external search links.
- README states that saved opportunities are manually entered.
- README states that tracker and reports use saved opportunities only.
- README does not claim scraping, real-time listings, job board API integration, AI recommendations, authentication, cloud database, or deployment.

## Screenshot Review

- Desktop screenshots show Home, Discover Jobs, recommendation results, Saved Opportunities, Application Tracker, Reports, and standalone HTML report.
- Mobile screenshots show Home, Discover Jobs, Saved Opportunities, Application Tracker, and Reports.
- Screenshots use fictional records only.
- Screenshots do not show terminal output, devtools, stack traces, local filesystem paths, SQLite internals, private notes, or personal job search records.
- Screenshot paths resolve from the README.

## Demo Flow

- Start backend locally.
- Start frontend locally.
- Open Home and explain the product boundary.
- Open Discover Jobs and generate recommendation links.
- Open Saved Opportunities and explain manual saving.
- Open Application Tracker and show metrics from saved opportunities.
- Open Reports and standalone HTML report.
- Mention that the app is local-first and portfolio-stage.

## Validation

- `make backend-test` passes.
- `make frontend-test` passes.
- `make frontend-build` passes.
- `make check` passes.
- Git status is clean before sharing.
- Branch `main` is pushed to `origin/main`.

## Remaining Limitations To Say Honestly

- No scraping.
- No real-time job listings.
- No external job board API integration.
- No authentication.
- No cloud database.
- No AI/LLM recommendation.
- No PDF export.
- No drag-and-drop pipeline.
