# Mavry

**Developer documentation that stays in sync with your code.**

Mavry is a developer documentation platform designed to help teams maintain accurate, reliable, and up-to-date documentation as their code evolves.

Documentation often becomes outdated as APIs change, code examples break, and implementation details drift from what is written. Mavry aims to close that gap by connecting documentation with source code, API specifications, and GitHub changes.

## The Problem

- Documentation drifts out of sync with the actual implementation.
- API references become outdated as endpoints and schemas change.
- Code examples break silently.
- Developers struggle to identify which documentation needs updating after a code change.
- Keeping documentation reliable requires repetitive manual work.

## The Vision

Mavry aims to make documentation verification a continuous part of the development workflow.

- **Documentation management** — Write, organize, and maintain developer documentation.
- **API validation** — Verify documentation against API specifications and schemas.
- **Code example verification** — Detect invalid or outdated examples.
- **Change impact analysis** — Identify documentation affected by code changes.
- **AI-assisted updates** — Generate suggested documentation changes for human review.
- **Verification history** — Track checks, failures, and documentation health over time.
- **GitHub integration** — Connect repositories and use code changes to identify documentation that may need attention.

## How It Works

1. Connect a project and its source repository.
2. Organize documentation and map it to relevant APIs or source files.
3. Verify documentation against supported specifications and code examples.
4. Identify failures and potentially outdated content.
5. Review suggested fixes and approve changes before they are published.

## Tech Stack

The planned stack includes:

- **Frontend:** React, TypeScript
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL
- **Integrations:** GitHub, OpenAPI
- **AI workflows:** Documentation analysis and suggested updates

## Project Structure

```text
mavry/
├── frontend/       # Web application
├── backend/        # FastAPI application
├── contracts/      # API and OpenAPI contracts
├── infra/          # Local development infrastructure
├── docs/           # Architecture and development guides
├── .env.example
├── .gitignore
└── README.md
```

## Project Status

Mavry is under active development. Features and integrations will be implemented incrementally. Planned capabilities should not be considered production-ready until they are implemented and tested.

## Guiding Principle

**Documentation should evolve with the code, not fall behind it.**

---

Built with the goal of making developer documentation more trustworthy, verifiable, and maintainable.