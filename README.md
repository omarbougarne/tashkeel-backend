# Tashkeel Backend

## Tech Stack

- NestJS
- PostgreSQL
- TypeORM
- JWT Authentication
- Docker

## Running with Docker

docker compose up --build

## Running Locally

pnpm install
pnpm run dev

## Environment Variables

DB_HOST
DB_PORT
DB_USER
DB_PASS
DB_NAME
JWT_SECRET
JWT_EXPIRES_IN

## API Endpoints

POST /auth/register
POST /auth/login
POST /generate
POST /upload
GET /history
