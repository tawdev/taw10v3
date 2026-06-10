# TAW10 V3

TAW10 V3 is organized as a two-service project:

```text
taw10V3/
├── frontend/   # Existing Next.js application
├── backend/    # NestJS API with Prisma, MySQL, JWT auth
├── docker-compose.yml
├── .env.example
└── package.json
```

## Frontend

The existing Next.js code was moved into `frontend/` without replacing existing pages, components, styles, or config.

Admin routes:

```text
/portal-taw10-x92-admin
/dashboard
/dashboard/users
/dashboard/settings
```

Set the API URL in `frontend/.env`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## Backend

The NestJS API lives in `backend/` and includes:

- Prisma ORM with MySQL
- JWT authentication
- bcrypt password hashing
- class-validator DTO validation
- Swagger at `/docs`
- Helmet
- Rate limiting
- Admin-only role guards

Auth endpoints:

```http
POST /auth/login
POST /auth/logout
GET  /auth/profile
```

Seeded administrator:

```text
Email: admin@taw10.com
Password: Admin@2026!
Role: SUPER_ADMIN
```

Backend environment:

```env
DATABASE_URL="mysql://taw10:taw10_password@localhost:3306/taw10"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

## Local Development

Install dependencies:

```bash
npm install
npm install --workspace backend
npm install --workspace frontend
```

Start MySQL, then migrate and seed:

```bash
cd backend
npx prisma migrate dev
npm run seed
```

Run the API:

```bash
npm run start:dev
```

Run the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open:

```text
Frontend: http://localhost:3000
Admin login: http://localhost:3000/portal-taw10-x92-admin
Backend: http://localhost:4000
Swagger: http://localhost:4000/docs
```

## Docker

Copy `.env.example` to `.env`, change `JWT_SECRET`, then run:

```bash
docker compose up --build -d
```

Seed and migrations run automatically in the backend container on startup.

## Hostinger VPS Deployment

1. Install Node.js 20+, Docker, Docker Compose, Git, and Nginx on the VPS.
2. Clone the repository and create `.env` from `.env.example`.
3. Set production values:

```env
DATABASE_URL="mysql://taw10:strong-password@mysql:3306/taw10"
JWT_SECRET="a-long-random-production-secret"
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
FRONTEND_URL="https://your-domain.com"
```

4. Start services:

```bash
docker compose up --build -d
```

5. Configure Nginx reverse proxies:

```text
your-domain.com      -> http://127.0.0.1:3000
api.your-domain.com  -> http://127.0.0.1:4000
```

6. Enable HTTPS with Certbot.
7. Confirm:

```text
https://your-domain.com/portal-taw10-x92-admin
https://api.your-domain.com/docs
```
