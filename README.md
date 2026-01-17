# Backend App

Express.js REST API dengan PostgreSQL dan JWT Authentication.

## Prerequisites

- Node.js (v16 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)

## Instalasi

### 1. Clone dan Install Dependencies

```bash
cd backend-app
npm install
```

### 2. Konfigurasi Environment

Copy file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi Anda:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=backend_app
DB_USER=postgres
DB_PASSWORD=password_postgresql_anda

# JWT (generate secret yang unik)
JWT_SECRET=your_generated_secret_key
JWT_EXPIRES_IN=15m

# CORS
CORS_ORIGIN=http://localhost:3000
```

Generate JWT_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Setup Database

Pastikan PostgreSQL sudah berjalan, kemudian:

```bash
# Buat database
npm run db:create

# Jalankan migrasi
npm run db:migrate

# Isi data awal (seeder)
npm run db:seed
```

### 4. Jalankan Server

```bash
# Development (dengan hot reload)
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:3000`

## Security Features

| Fitur | Deskripsi |
|-------|-----------|
| Helmet | HTTP security headers (XSS, CSP, dll) |
| Rate Limiting | 100 req/15min (general), 5 req/15min (auth) |
| Password Policy | Min 8 karakter, huruf besar, huruf kecil, angka, simbol |
| Input Sanitization | Validasi dan sanitasi input dengan express-validator |
| Refresh Token | Token rotation dengan masa berlaku 30 hari |
| Body Size Limit | Maksimal 10kb per request |

## API Endpoints

Base URL: `http://localhost:3000/api`

### Health Check

| Method | Endpoint  | Deskripsi         |
|--------|-----------|-------------------|
| GET    | `/health` | Cek status server |

### Authentication

| Method | Endpoint                  | Auth | Deskripsi              |
|--------|---------------------------|------|------------------------|
| POST   | `/api/auth/register`      | No   | Daftar user baru       |
| POST   | `/api/auth/login`         | No   | Login user             |
| POST   | `/api/auth/refresh-token` | No   | Refresh access token   |
| POST   | `/api/auth/logout`        | No   | Logout (revoke token)  |
| GET    | `/api/auth/profile`       | Yes  | Get profile            |
| PUT    | `/api/auth/profile`       | Yes  | Update profile         |
| PUT    | `/api/auth/change-password` | Yes | Ubah password        |
| POST   | `/api/auth/logout-all`    | Yes  | Logout semua device    |

### Users

| Method | Endpoint          | Auth | Deskripsi           |
|--------|-------------------|------|---------------------|
| GET    | `/api/users`      | Admin | List semua user    |
| GET    | `/api/users/:id`  | Yes   | Detail user        |
| PUT    | `/api/users/:id`  | Yes   | Update user        |
| DELETE | `/api/users/:id`  | Admin | Hapus user         |

### Categories

| Method | Endpoint              | Auth  | Deskripsi            |
|--------|-----------------------|-------|----------------------|
| GET    | `/api/categories`     | No    | List kategori        |
| GET    | `/api/categories/:id` | No    | Detail kategori      |
| POST   | `/api/categories`     | Admin | Buat kategori        |
| PUT    | `/api/categories/:id` | Admin | Update kategori      |
| DELETE | `/api/categories/:id` | Admin | Hapus kategori       |

### Posts

| Method | Endpoint          | Auth | Deskripsi        |
|--------|-------------------|------|------------------|
| GET    | `/api/posts`      | No   | List semua post  |
| GET    | `/api/posts/:id`  | No   | Detail post      |
| POST   | `/api/posts`      | Yes  | Buat post baru   |
| PUT    | `/api/posts/:id`  | Yes  | Update post      |
| DELETE | `/api/posts/:id`  | Yes  | Hapus post       |

### Comments

| Method | Endpoint             | Auth | Deskripsi          |
|--------|----------------------|------|--------------------|
| GET    | `/api/comments`      | No   | List komentar      |
| GET    | `/api/comments/:id`  | No   | Detail komentar    |
| POST   | `/api/comments`      | Yes  | Buat komentar      |
| PUT    | `/api/comments/:id`  | Yes  | Update komentar    |
| DELETE | `/api/comments/:id`  | Yes  | Hapus komentar     |

### Tags

| Method | Endpoint         | Auth  | Deskripsi      |
|--------|------------------|-------|----------------|
| GET    | `/api/tags`      | No    | List tag       |
| GET    | `/api/tags/:id`  | No    | Detail tag     |
| POST   | `/api/tags`      | Admin | Buat tag       |
| PUT    | `/api/tags/:id`  | Admin | Update tag     |
| DELETE | `/api/tags/:id`  | Admin | Hapus tag      |

## Autentikasi

API menggunakan JWT dengan access token dan refresh token:

- **Access Token**: Berlaku 15 menit, dikirim via header `Authorization: Bearer <token>`
- **Refresh Token**: Berlaku 30 hari, digunakan untuk mendapatkan access token baru

### Flow Autentikasi

1. Login → dapat `accessToken` dan `refreshToken`
2. Gunakan `accessToken` untuk request API
3. Jika access token expired, panggil `/api/auth/refresh-token` dengan `refreshToken`
4. Logout → revoke refresh token

## Contoh Request

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Password harus memenuhi:**
- Minimal 8 karakter
- Minimal 1 huruf besar
- Minimal 1 huruf kecil
- Minimal 1 angka
- Minimal 1 simbol (!@#$%^&*)

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbG...",
    "refreshToken": "a1b2c3...",
    "expiresIn": "15m"
  }
}
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

### Buat Post (dengan token)

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "title": "Judul Post",
    "content": "Isi konten post",
    "categoryId": 1
  }'
```

## Database Commands

```bash
npm run db:create           # Buat database
npm run db:drop             # Hapus database
npm run db:migrate          # Jalankan migrasi
npm run db:migrate:undo     # Undo migrasi terakhir
npm run db:migrate:undo:all # Undo semua migrasi
npm run db:seed             # Jalankan semua seeder
npm run db:seed:undo        # Undo semua seeder
npm run db:reset            # Reset database (undo all + migrate + seed)

# Generate file baru
npm run migration:generate -- nama-migrasi
npm run seed:generate -- nama-seeder
```

## Default Admin

Setelah menjalankan seeder, tersedia akun admin:

- Email: `admin@example.com`
- Password: `Admin123!`
