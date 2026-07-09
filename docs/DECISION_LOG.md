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

