# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start server with nodemon (hot reload)
npm start            # Start server (production)

# Database
npm run db:create    # Create database
npm run db:migrate   # Run all migrations
npm run db:seed      # Run all seeders
npm run db:reset     # Undo all migrations, re-migrate, and seed

# Generate new migration/seeder
npm run migration:generate -- <name>
npm run seed:generate -- <name>
```

## Architecture

This is an Express.js REST API with PostgreSQL database using Sequelize ORM and JWT authentication.

### Project Structure
- `server.js` - Entry point, connects to database and starts server
- `src/app.js` - Express app configuration, middleware setup, route mounting
- `src/config/` - Database configuration (`config.js` for Sequelize CLI, `database.js` for connection)
- `src/models/` - Sequelize models with associations defined in `index.js`
- `src/controllers/` - Request handlers
- `src/routes/` - Route definitions, mounted under `/api`
- `src/middleware/` - Auth and security middleware
- `src/utils/` - Validators and password policy
- `src/migrations/` - Database migrations
- `src/seeders/` - Seed data

### API Routes
All routes are prefixed with `/api`:
- `/api/auth` - Authentication (login, register, refresh-token, logout)
- `/api/users` - User management
- `/api/categories` - Blog categories
- `/api/posts` - Blog posts
- `/api/comments` - Post comments
- `/api/tags` - Post tags

### Data Models
- **User** - `name`, `email`, `password` (auto-hashed), `role` (user/admin), `isActive`
- **Post** - belongs to User (author) and Category, has many Comments, many-to-many with Tags
- **Comment** - belongs to Post and User, self-referential for replies (`parentId`)
- **Category/Tag** - has many Posts
- **RefreshToken** - belongs to User, for token rotation

### Security Features
- **Helmet** - HTTP security headers (`src/middleware/security.js`)
- **Rate Limiting** - General (100 req/15min), Auth (5 req/15min)
- **Password Policy** - Min 8 chars, uppercase, lowercase, digit, symbol (`src/utils/passwordValidator.js`)
- **Input Sanitization** - express-validator with escape/trim (`src/utils/validators.js`)
- **Refresh Token** - Token rotation with revocation support
- **Body Size Limit** - 10kb max request body

### Authentication
JWT access tokens (15min) + refresh tokens (30 days). Middleware in `src/middleware/auth.js`:
- `auth` - Verifies access token, attaches `req.user`
- `isAdmin` - Requires admin role

### Environment Variables
Copy `.env.example` to `.env`:
- `PORT`, `NODE_ENV`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
