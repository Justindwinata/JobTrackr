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
