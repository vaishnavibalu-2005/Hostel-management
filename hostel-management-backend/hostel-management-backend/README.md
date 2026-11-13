# Hostel Management Backend

Node.js + Express + MongoDB API for hostel student records.

## Run locally

1. Install Node.js (LTS) and MongoDB, or use a MongoDB Atlas connection string.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Set `MONGO_URI` to your MongoDB connection string.
6. Run `npm run dev` for development or `npm start` for production.

The API starts on port 5000 by default.

## API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

## Deploy on Render

- Root Directory: the backend folder containing this `package.json`
- Build Command: `npm install`
- Start Command: `npm start`
- Add environment variable `MONGO_URI` in Render.
- Add `CLIENT_URL` with the deployed frontend origin (or configure CORS as appropriate).
