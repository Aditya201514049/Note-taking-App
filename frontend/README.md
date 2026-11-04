# Note-Taking App Frontend

This is the React frontend for the Secure Note-Taking Application.

## Features

- User authentication (Login/Register)
- Note management (Create, Read, Update, Delete)
- Post management (Create, Read)
- Admin panel (User management, View all notes, Users by interests aggregation)
- Role-based access control (User vs Admin)

## Prerequisites

- Node.js installed
- Backend server running on port 5000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Pages

- `/login` - User login
- `/register` - User registration
- `/dashboard` - User's notes and note management
- `/admin` - Admin panel (only accessible by admin users)
- `/posts` - Posts management

## Testing

1. Register a user (or admin)
2. Login
3. Create, edit, delete notes
4. If admin, access the admin panel to manage users and view all notes
