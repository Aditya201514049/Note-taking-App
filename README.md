# Secure Note-Taking App

A note-taking REST API with a React frontend. The backend uses Express, MongoDB/Mongoose, JWT authentication, bcrypt password hashing, and role-based authorization. It also includes public posts and MongoDB aggregation examples.

## Features

- Register and log in with email and password. Passwords are hashed with bcrypt; successful authentication returns a JWT.
- User and admin roles. Users can create and manage their own notes. Admins can manage users, list all notes, and view users grouped by interests.
- Authenticated note operations with ownership checks.
- Public, paginated post reading; authenticated users can create posts.
- User interests can be selected at registration and updated from the dashboard.
- Paginated list endpoints with a default page size of 10 and a maximum page size of 100.
- Mongoose schema indexes for unique email lookup and the note/post/user list queries.
- Aggregation pipelines for grouping users by interest and retrieving a user's posts with `$lookup`.

> **Assessment setup:** Public registration accepts a role so an admin account can be created easily while testing. This is intentionally convenient for the assessment and is not appropriate for production; production systems should not allow users to grant themselves admin privileges.

## Project structure

```text
backend/
  config/       MongoDB connection
  controllers/  Authentication, notes, users, and posts
  middleware/   JWT authentication and role authorization
  models/       Mongoose user, note, and post schemas
  routes/       REST API routes
  utils/        Shared pagination helper
frontend/
  src/
    components/
    context/    Authentication state
    pages/      Login, registration, dashboard, admin, and posts
    services/   Axios API client
```

## Requirements

- Node.js and npm
- MongoDB connection string (local MongoDB or hosted MongoDB)

## Configuration

Create `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/secure-notes
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

`MONGODB_URI` and `JWT_SECRET` must be set. `PORT` and `CLIENT_URL` are optional; the defaults are `5000` and `http://localhost:5173`.

The frontend defaults to `http://localhost:5000/api`. To use another API URL, set `VITE_API_URL` in `frontend/.env`, for example:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit environment files or real secrets.

## Run locally

Install and start the backend:

```bash
cd backend
npm install
npm run dev
```

In another terminal, install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server prints the frontend URL (normally `http://localhost:5173`). The API health check is available at `GET http://localhost:5000/`.

Production frontend build and lint commands:

```bash
cd frontend
npm run build
npm run lint
```

## API

All API routes are under `/api`. Protected routes require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register and receive a JWT |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT |

Registration accepts `username`, `email`, `password`, and optional `role` and `interests`. Login accepts `email` and `password`.

### Notes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/notes` | Authenticated | Create a note for the current user |
| `GET` | `/api/notes/my-notes` | Authenticated | List the current user's notes |
| `GET` | `/api/notes/all` | Admin | List everyone's notes |
| `GET` | `/api/notes/:id` | Owner or admin | Read one note |
| `PUT` | `/api/notes/:id` | Owner | Update a note |
| `DELETE` | `/api/notes/:id` | Owner | Delete a note |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users?page=1&limit=10` | Admin | Paginated user list |
| `POST` | `/api/users` | Admin | Create a user |
| `GET` | `/api/users/by-interests?page=1&limit=10` | Admin | Paginated interest groups, using one aggregation call |
| `GET` | `/api/users/:id` | Authenticated | Read a user profile |
| `PUT` | `/api/users/:id` | Admin | Update a user |
| `DELETE` | `/api/users/:id` | Admin | Delete a user |
| `PUT` | `/api/users/profile` | Authenticated | Update the current user's interests |

### Posts

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/posts?page=1&limit=10` | Public | List public posts |
| `GET` | `/api/posts/user/:userId?page=1&limit=10` | Public | Retrieve a user's posts using `$lookup` |
| `POST` | `/api/posts` | Authenticated | Create a post for the current user |

### Pagination

Paginated list endpoints accept `page` and `limit` query parameters. For example:

```http
GET /api/notes/my-notes?page=2&limit=10
```

The API defaults invalid or missing values to page 1 and limit 10, and caps `limit` at 100. Paginated responses include a `pagination` object with the current page, limit, total result count, and page count. The frontend provides Previous/Next controls for the note, post, user, note-admin, and interest-group lists.

## Aggregations and indexes

- **Users by interests:** `$unwind`, `$group`, `$sort`, and `$facet` are run in a single `User.aggregate()` call. Pagination applies to the resulting interest groups.
- **Posts by user:** a user-rooted aggregation uses `$lookup` into the posts collection, with pagination and a total count inside the lookup pipeline.
- **Indexes:** schemas declare indexes with `schema.index()`. User email is unique; user, note, and post creation-date indexes support sorted lists; compound note and post indexes support per-user lists.

## Notes

- A user can only modify or delete their own notes. Admins can list notes across users.
- `GET /api/users/:id` currently requires authentication but does not restrict profile reads to the owner or an admin.
- The frontend stores the JWT in local storage for API requests. Use an appropriate token-storage strategy and HTTPS for production deployments.