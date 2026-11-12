# sarkarinaukari

This project contains the Sarkari Naukari application.

## Development

Install dependencies and start the development server:

```bash
npm install
copy .env.example .env.local
npm run dev
```

Before starting the app, set `MONGODB_URI` in `.env.local` to a reachable MongoDB database. The public pages read published posts from this database, so the app will show a configuration error until this value is set.

Set `JWT_SECRET` to a random value of at least 32 characters before using `/admin/login`. Run `npm run seed` after setting `ADMIN_EMAIL` and `ADMIN_PASSWORD`; the seed command stores the administrator password as a bcrypt hash.

The local project history also referenced the BrandSentry workspace; that content was merged into this repository's README conflict resolution without discarding the current project identity.
