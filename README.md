# Creator Platform

A full-stack creator platform with a React frontend, an Express/MongoDB backend, and Docker support for local development.

## Project Structure

- `client/` - Vite + React frontend
- `server/` - Express API with MongoDB, JWT auth, and Cloudinary uploads
- `docker-compose.yml` - Local container setup for MongoDB, API, and frontend

## Prerequisites

- Node.js 18+
- npm
- MongoDB or Docker Desktop

## Environment Variables

Create a `.env` file in `server/` based on `.env.example` with values for:

- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `MONGO_ROOT_USERNAME`
- `MONGO_ROOT_PASSWORD`
- `MONGO_URI` for local server runs
- `DATABASE_URL` for production deployments (e.g., Render)
- `CLIENT_URL` if your frontend runs on a different origin

At the repo root, you can also define Docker host ports in `.env`:

- `SERVER_HOST_PORT` (default: `5001`)
- `CLIENT_HOST_PORT` (default: `3000`)

## Install Dependencies

```bash
npm run install-all
```

## Run Locally

Start both client and server from the repo root:

```bash
npm run dev
```

Or run them separately:

```bash
npm run server
npm run client
```

## Run With Docker

1. Fill in the required environment variables.
2. Start the stack:

```bash
docker compose up --build
```

- API: `http://localhost:5001`
- Frontend: `http://localhost:5173`

This keeps `localhost:5000` available for local `npm run dev` in `server/`.

## API Overview

- `GET /api/health` - health check
- `POST /api/users/register` - register a user
- `POST /api/users/login` - login a user
- `POST /api/users/change-password` - change password
- `GET /api/posts` - list posts
- `POST /api/posts` - create a post

## Frontend Routes

- `/` - home
- `/login` - login page
- `/register` - registration page
- `/dashboard` - dashboard
- `/create-post` - create post form
- `/edit-post/:id` - edit post form
