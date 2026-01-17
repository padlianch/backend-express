# Repository Guidelines

## Project Structure & Module Organization
- `server.js` is the entry point; it boots the Express server and connects to the database.
- `src/app.js` configures middleware, CORS, and routes.
- `src/routes/` holds route definitions mounted under `/api`.
- `src/controllers/` contains request handlers; `src/models/` contains Sequelize models.
- `src/middleware/` hosts auth/security middleware; `src/utils/` hosts validators and helpers.
- Database artifacts live in `src/migrations/` and `src/seeders/`.

## Build, Test, and Development Commands
- `npm run dev` runs the API with nodemon for hot reload.
- `npm start` runs the API in production mode.
- `npm run db:create` creates the PostgreSQL database.
- `npm run db:migrate` applies Sequelize migrations.
- `npm run db:seed` loads seed data (includes a default admin).
- `npm run db:reset` re-creates schema and seed data (destructive).
- `npm run migration:generate -- <name>` creates a new migration template.
- `npm run seed:generate -- <name>` creates a new seeder template.

## Coding Style & Naming Conventions
- JavaScript uses CommonJS (`require`/`module.exports`) and semicolons.
- Indentation is 2 spaces; keep lines readable and follow existing patterns.
- Routes are grouped by resource (e.g., `src/routes/posts.js`) and mounted in `src/routes/index.js`.
- Model, controller, and route file names are lowercase and pluralized to match resources.

## Testing Guidelines
- No automated test runner is configured yet; add tests when introducing new logic.
- If you add a test framework, document commands here and use clear, resource-based test names (e.g., `posts.auth.test.js`).

## Commit & Pull Request Guidelines
- Git history shows a single "first commit"; no established convention yet.
- Prefer short, imperative commit subjects (e.g., "Add refresh token rotation").
- PRs should describe changes, link issues if applicable, and note any DB migrations or breaking API changes.

## Security & Configuration Tips
- Copy `.env.example` to `.env` and set `JWT_SECRET`, DB credentials, and `CORS_ORIGIN`.
- Never commit secrets; use `.env` locally and environment variables in deployment.
