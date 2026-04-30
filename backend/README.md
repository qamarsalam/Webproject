# KUEvents Backend API

Backend REST API for the KUEvents web application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and update values if needed.

3. Start MongoDB locally or set `MONGODB_URI` to a MongoDB Atlas connection string.

4. Run the backend:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Test Endpoint

```text
GET /api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "KUEvents API",
  "timestamp": "..."
}
```

## Structure

```text
controllers/  Request handling and response logic
models/       Mongoose schemas and model helpers
routes/       API endpoint definitions
middleware/   Shared Express middleware
config/       Database connection
setup/        Database initialization and sample data
```

Routes stay intentionally small: they define the URL, middleware, and controller function.
