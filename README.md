# Kharcha

Kharcha is a full-stack personal expense tracking web application built as a monorepo with a Node.js + Express + MongoDB backend and a React + Vite + Tailwind frontend.

## Project Structure

```text
KHARCHA/
├── backend/
├── frontend/
└── README.md
```

## Setup Guide

1. Clone the repository.
2. Open a terminal and go to the backend:
   `cd backend`
3. Install backend dependencies:
   `npm install`
4. Edit `backend/.env` and change these values:
   `MONGODB_URI`, `EMAIL_USER`, `EMAIL_PASS`, `OWNER_EMAIL`, `JWT_SECRET`
5. Start the backend in development mode:
   `npm run dev`
6. Open a second terminal and go to the frontend:
   `cd ../frontend`
7. Install frontend dependencies:
   `npm install`
8. Edit `frontend/.env` if your backend is not running on `http://localhost:5000`:
   `VITE_API_URL=http://localhost:5000/api`
9. Start the frontend:
   `npm run dev`
10. Open `http://localhost:5173`
11. Enter your owner email on the login page, check your inbox, and click the magic link.

## Notes

- Only the email in `OWNER_EMAIL` can log in.
- Gmail SMTP requires an app password for `EMAIL_PASS`.
- Cron jobs send daily summaries at 10:00 PM IST and recurring income reminders at 9:00 AM IST.
- All routes except the auth request and verify endpoints require a valid JWT.
