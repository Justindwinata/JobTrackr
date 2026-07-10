# Decision Log

## 2026-07-10 - Avoid scraping job boards

JobTrackr intentionally avoids scraping LinkedIn, JobStreet Indonesia, Glints, Karir.com, Dealls, or any other job board.

Reasoning:

- Respect third-party platform terms and boundaries.
- Keep the product safe and portfolio-friendly.
- Focus the MVP on deterministic search query generation and manual tracking.

## 2026-07-10 - Use FastAPI and React TypeScript

The project uses FastAPI for the backend and React with TypeScript for the frontend.

Reasoning:

- FastAPI provides typed request and response contracts through Pydantic.
- React and TypeScript provide a strong foundation for a polished portfolio UI.
- Both stacks are testable and easy to extend.

## 2026-07-10 - Keep JT-0001 deterministic

JT-0001 uses deterministic recommendation logic instead of AI or LLM-generated recommendations.

Reasoning:

- Keep the initial product foundation testable.
- Avoid overbuilding before the core workflow is proven.
- Make the safety boundary clear: generated search URLs only.

## 2026-07-10 - Defer persistence

SQLite is intentionally deferred until manual opportunity saving and application tracking are implemented.

Reasoning:

- JT-0001 focuses on project foundation and domain contracts.
- Persistence should be introduced when the tracker workflow has concrete data requirements.

## 2026-07-10 - Create an original product identity

JT-0002 adds a custom JobTrackr SVG logo using the project palette.

Reasoning:

- A portfolio product needs a memorable visual identity.
- The logo must be original and not depend on third-party brand marks.
- The symbol uses a path/search motif to suggest career direction and tracking.

## 2026-07-10 - Use honest future pages

Saved Opportunities, Application Tracker, and Reports are implemented as polished future-feature pages instead of fake dashboards.

Reasoning:

- The product should feel complete without pretending data exists.
- Recruiters can see the intended product direction and the engineering boundary.
- Persistence, tracker data, and reports should be introduced in later contracts with real behavior.

## 2026-07-10 - Keep Discover Jobs as the only functional JT-0002 workflow

The Discover Jobs page connects to the existing deterministic backend endpoint.

Reasoning:

- This validates the frontend-to-backend contract.
- It keeps the UI milestone useful without adding database, auth, scraping, or AI scope.
- It makes the no-scraping boundary visible in the user experience.

## 2026-07-10 - Use SQLite for local saved opportunities

JT-0003 introduces SQLite under `backend/data/jobtrackr.sqlite3`.

Reasoning:

- SQLite is enough for a portfolio-stage local tracker.
- It keeps setup simple and avoids cloud/database operational scope.
- It provides real persistence for manually entered opportunities.

## 2026-07-10 - Keep saved opportunities manual

Saved opportunities are created from user-entered form data only.

Reasoning:

- This preserves the no-scraping product boundary.
- It avoids third-party job board API claims.
- It makes the user responsible for deciding which external jobs are worth tracking.

## 2026-07-10 - Start tracker management with status and notes editing

JT-0003 supports editing status and notes before building a full tracker dashboard.

Reasoning:

- Status and notes are the highest-value fields for early application tracking.
- A narrow edit foundation keeps the workflow useful without overbuilding analytics.
- Future contracts can expand from real saved opportunity data.

## 2026-07-11 - Translate Stitch design into the existing React app

JT-0004 uses the uploaded Stitch package as visual direction instead of replacing the application with generated HTML.

Reasoning:

- Preserve the existing React, TypeScript, router, API client, and test structure.
- Improve visual density and SaaS credibility while keeping the codebase maintainable.
- Avoid fake data and unsupported claims while still making future pages portfolio-ready.

## 2026-07-11 - Support adjacent Vite fallback ports in local CORS

The backend allows adjacent Vite development ports when `5173` is already occupied locally.

Reasoning:

- Local QA should still work when another dev server owns the default Vite port.
- The allowance is narrow to localhost and Vite fallback-style ports.
- This preserves the production-facing product boundary because no deployment or external origin support is introduced.
