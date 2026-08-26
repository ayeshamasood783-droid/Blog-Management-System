# AstraBlog — Secure Blog Management System

A full-stack blog system built with Node.js, Express, MongoDB and vanilla HTML/CSS/JavaScript.

## Features

- View all posts
- Search posts
- Read individual posts
- Register/login
- JWT authentication
- bcrypt password hashing
- Create, edit and delete your own posts
- Input validation
- Helmet security headers
- Rate limiting on authentication
- MongoDB/Mongoose validation
- Environment variables for secrets
- Premium animated 3D-style frontend
- Responsive layout

## Setup

1. Install Node.js.
2. Create a free MongoDB Atlas database.
3. Copy `.env.example` to `.env`.
4. Put your MongoDB connection string in `MONGO_URI`.
5. Create a strong random `JWT_SECRET`.
6. Open a terminal in this folder.
7. Run:

```bash
npm install
npm run dev
```

8. Open:

```text
http://localhost:5000
```

## Security notes

- Never commit `.env`.
- Never put `MONGO_URI` or `JWT_SECRET` in frontend code.
- Use HTTPS when deploying.
- Restrict MongoDB Atlas network access appropriately for your deployment.
- The frontend uses `textContent`/escaping for user content instead of injecting raw HTML.
- This is designed as a strong student/portfolio baseline, not a guarantee of absolute security.

## API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Posts

- `GET /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts` — authenticated
- `PUT /api/posts/:id` — authenticated + owner only
- `DELETE /api/posts/:id` — authenticated + owner only
