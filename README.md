# KUEvents

KUEvents is a Kuwait University events web application. It allows users to browse events, register for events, request organizer access, create/manage events as an organizer, and contact the admin support team.

## Team Members

- Mennatallah Gbreel - 2221188690
- Kamar Abdulsalam - 2231169963

## Technologies Used

- React
- React Router
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication

## Project Structure

```text
Webproject/
  src/                 React frontend
  backend/             Express API and MongoDB models
  database/            Database wrapper files and setup entry
  public/              React public assets
```

## Requirements

- Node.js 18 or later
- MongoDB running locally, or a MongoDB Atlas connection string
- npm

## Environment Setup

Create a `.env` file inside the `backend` folder. You can copy from `backend/.env.example`.

Example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/kuevents
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

Do not upload real passwords or private database links in `.env`.

## Run the Backend

Open a terminal in the project folder:

```bash
cd backend
npm install
npm run init-db
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## Run the Frontend

Open a second terminal in the main project folder:

```bash
npm install
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

## Initial Database

The initial database seed is located in:

```text
backend/setup/initializeDatabase.js
```

Run this command to create the collections and insert sample data:

```bash
cd backend
npm run init-db
```

The seed creates:

- 10 users
- 3 organizers
- 8 events
- 9 registrations
- 4 contact support messages

## Database Collections

The system uses these MongoDB collections:

- `users`
- `organizers`
- `events`
- `registrations`
- `contactmessages`
- `counters`

## Sample Login Accounts

### Admin

```text
Email: admin@ku.edu.kw
Password: admin123
Role: ADMIN
```

### Organizers

```text
Email: sara@ku.edu.kw
Password: hashed_pw2
Role: ORGANIZER
Organizer Profile: College of Engineering
```

```text
Email: noura@ku.edu.kw
Password: noura123
Role: ORGANIZER
Organizer Profile: Computer Science Club
```

```text
Email: yousef@ku.edu.kw
Password: yousef123
Role: ORGANIZER
Organizer Profile: Student Affairs
```

### KU Users

```text
Email: ahmed@ku.edu.kw
Password: Hashed_pw1
Role: STUDENT
```

```text
Email: omar@ku.edu.kw
Password: omar123
Role: STUDENT
```

```text
Email: fatima@ku.edu.kw
Password: fatima123
Role: STAFF
```

### External Participants

```text
Email: ali@gmail.com
Password: Hashed_pw3
Role: EXTERNAL_PARTICIPANT
```

```text
Email: layla@gmail.com
Password: layla123
Role: EXTERNAL_PARTICIPANT
```

## Main Features

- User registration and login
- JWT authentication
- Role-based access control
- Event browsing and filtering
- Event details page
- Event creation for organizers and admins
- Organizer dashboard
- Event registration and cancellation
- Admin dashboard
- Organizer request review
- Contact support messages
- Admin responses to contact messages
- User view for admin responses

## API Routes

Base URL:

```text
http://localhost:5000/api
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Events

```text
GET /api/events
GET /api/events/:id
GET /api/events/mine
POST /api/events
PUT /api/events/:id
DELETE /api/events/:id
```

### Organizers

```text
GET /api/organizers
GET /api/organizers/me
POST /api/organizers/me
GET /api/organizers/:id
```

### Registrations

```text
GET /api/registrations/my
GET /api/registrations/event/:eventId
POST /api/registrations
DELETE /api/registrations/:id
DELETE /api/registrations/event/:eventId/my
```

### Contact Support

```text
POST /api/contact
GET /api/contact/my
GET /api/contact
PUT /api/contact/:id/respond
```

## Contact Support Schema

Collection:

```text
contactmessages
```

Fields:

```text
messageID: Number
userID: Number
name: String
email: String
subject: String
message: String
status: String [UNREAD, READ, RESPONDED]
response: String
respondedAt: Date
createdAt: Date
```

## Contact Support Sample Calls

Send contact message:

```bash
curl -X POST http://localhost:5000/api/contact ^
-H "Content-Type: application/json" ^
-d "{\"name\":\"Ahmed\",\"email\":\"ahmed@ku.edu.kw\",\"subject\":\"Event registration issue\",\"message\":\"I cannot register for an event.\"}"
```

Get my contact messages:

```bash
curl http://localhost:5000/api/contact/my ^
-H "Authorization: Bearer YOUR_TOKEN"
```

Admin gets all contact messages:

```bash
curl http://localhost:5000/api/contact ^
-H "Authorization: Bearer ADMIN_TOKEN"
```

Admin responds to a contact message:

```bash
curl -X PUT http://localhost:5000/api/contact/1/respond ^
-H "Content-Type: application/json" ^
-H "Authorization: Bearer ADMIN_TOKEN" ^
-d "{\"response\":\"Please try again after refreshing the event page.\"}"
```

## Notes

- `node_modules` should not be uploaded to GitHub.
- The `.env` file should not be uploaded if it contains private values.
- Run `npm run init-db` whenever you need to recreate or update the initial MongoDB data.
