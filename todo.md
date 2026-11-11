# Sarkari Naukri project checklist

## Phase 0: Project setup

- [x] Create the Next.js App Router project
- [x] Keep the project JavaScript-only
- [x] Add Tailwind CSS and MongoDB/Mongoose dependencies
- [x] Create the `/app`, `/components`, `/lib`, `/models`, `/scraper`, and `/scripts` folders
- [x] Add `.env.example` with the required environment variables
- [x] Add the MongoDB connection helper at `/lib/db.js`
- [x] Add a minimal mobile-first app shell

Notes: The initial JavaScript-only Next.js scaffold, Tailwind setup, environment template, cached Mongoose connection helper, and installed dependencies are in place.

## Phase 1: Database models

- [x] Define the Post, Admin, and ScrapeLog Mongoose schemas
- [x] Add requested field validation and indexes
- [x] Add the environment-driven seed script with sample posts
- [ ] Add job listing and detail APIs
- [ ] Add filtering, search, and pagination
- [ ] Add validation and API error handling

Notes: Added reusable Mongoose models with timestamps, enum validation, unique slugs, text search indexes, and an idempotent seed command. The seed script hashes the admin password with Node.js scrypt and does not overwrite existing sample posts.

## Phase 2: Scraping pipeline

- [ ] Implement source fetching and parsing
- [ ] Normalize scraped job data
- [ ] Add deduplication and update behavior
- [ ] Add a safe scheduled/manual scrape command

## Phase 3: Public portal UI

- [ ] Build the mobile-first home page
- [ ] Add job category and search views
- [ ] Add job detail pages
- [ ] Add results, admit cards, and important links sections

## Phase 4: Admin and authentication

- [ ] Add admin authentication
- [ ] Add protected job management screens
- [ ] Add publishing and moderation controls

## Phase 5: Quality and deployment

- [ ] Add automated tests
- [ ] Add accessibility and responsive checks
- [ ] Add production configuration and deployment documentation
