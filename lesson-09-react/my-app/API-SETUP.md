# My App - React + JSON Server Setup

## Architecture

- **Client (React)**: Runs on `http://localhost:3000`
- **Server (JSON Server)**: Runs on `http://localhost:3001`
- **API Proxy**: All `/api/*` requests are proxied to the JSON Server

## Getting Started

### Start both client and server:
```bash
npm start
```

This command runs both:
- Vite dev server (React) on port 3000
- JSON Server (API) on port 3001

### Individual commands:
```bash
npm run dev      # Start only the React client
npm run server   # Start only the JSON Server
```

## API Endpoints

All API calls should use the `/api` prefix, which automatically proxies to `http://localhost:3001`:

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Example Usage

```typescript
// Fetch all users
const response = await fetch('/api/users');
const users = await response.json();

// Create a new user
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
});
```

## Database

The `db.json` file contains the mock database. Changes are automatically saved when using POST/PUT/DELETE methods.

## Routes

- `/` - Home/Layout
- `/users` - User list page
- `/users/create` - Create user form
- `/users/:id` - User details page
