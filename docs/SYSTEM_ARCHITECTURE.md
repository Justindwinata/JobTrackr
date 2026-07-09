# System Architecture

## Overview

JobTrackr uses a full-stack architecture with a FastAPI backend and a React TypeScript frontend.

```mermaid
flowchart LR
    User["User"] --> Frontend["React + TypeScript Frontend"]
    Frontend --> API["FastAPI Backend"]
    API --> Domain["Recommendation Domain Service"]
    Domain --> Links["External Search URLs"]
    User --> Boards["External Job Boards"]
    Links --> Boards
```

## Backend

The backend lives in `backend/src/jobtrackr_api`.

Current modules:

- `main.py` creates the FastAPI application and registers routers.
- `api/` contains HTTP route definitions.
- `models/` contains Pydantic request and response contracts.
- `services/` contains deterministic business logic.

Current endpoints:

- `GET /health`
- `POST /job-search/recommendations`

## Frontend

The frontend lives in `frontend/src`.

Current modules:

- `App.tsx` renders the initial portfolio-ready product screen.
- `main.tsx` mounts the React application.
- `styles.css` provides responsive presentation.
- `App.test.tsx` verifies core product content.

## Recommendation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as FastAPI
    participant S as Recommendation Service

    U->>F: Select skills, roles, and locations
    F->>A: POST /job-search/recommendations
    A->>S: Build deterministic recommendations
    S-->>A: Recommendation objects with external links
    A-->>F: JSON response
    U->>F: Open external search link manually
```

## Data Persistence

JT-0001 does not include a database. SQLite is planned for a later contract when manual opportunity saving and application status tracking are introduced.

## Safety Boundary

The system generates URLs only. It does not scrape pages, call private APIs, automate user sessions, or ingest third-party job listings.

