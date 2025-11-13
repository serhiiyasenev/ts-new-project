# Task Manager - CreateTaskForm Component

This project contains a React form component for creating tasks with validation using react-hook-form and zod.

## Setup Instructions

### 1. Start the JSON Server (Backend)

In the root directory of the project (lesson-9-hometask):

```bash
npx json-server --watch db.json --port 3000
```

This will start the backend API on http://localhost:3000

### 2. Start the React Application

Navigate to the my-project directory and start the development server:

```bash
cd my-project
npm run dev
```

The React app will start on http://localhost:5173 (or another port if 5173 is busy).

## Features Implemented

### ✅ CreateTaskForm Component
- React component using react-hook-form for form management
- Form migrated from main.ts

### ✅ Validation with Zod
- Schema-based validation using zod
- Required fields: title, description, status, priority
- Optional field: deadline
- Custom validation: deadline cannot be in the past

### ✅ Form Validation Features
- Real-time validation (onChange mode)
- Error messages displayed in red below each field
- Red border on invalid fields
- Submit button disabled until form is valid

### ✅ Form Fields
- **Title**: Required, max 100 characters
- **Description**: Required, max 500 characters  
- **Status**: Required (todo, in_progress, done)
- **Priority**: Required (low, medium, high)
- **Deadline**: Optional, cannot be in the past
- **createdAt**: Automatically set to new Date() on submission

### ✅ Submit Handler
- Receives all form data
- Calls TaskAPI.createTask() to send POST request
- Resets form after successful submission
- Shows success/error toast message

### ✅ Styling
- Clean, modern UI with CSS
- Responsive design
- Hover effects on submit button
- Disabled state styling

### ✅ Naming Conventions
- PascalCase for components and types
- camelCase for variables and functions

## Project Structure

```
my-project/src/
├── components/
│   ├── CreateTaskForm.tsx      # Main form component
│   └── CreateTaskForm.css      # Form styles
├── schemas/
│   └── taskSchema.ts           # Zod validation schema
├── api.ts                      # API functions
├── types.ts                    # TypeScript types
├── App.tsx                     # Main app component
└── App.css                     # App styles
```

## Technologies Used

- React 19
- TypeScript
- react-hook-form - Form state management
- zod - Schema validation
- @hookform/resolvers/zod - Integration between react-hook-form and zod
- Vite - Build tool
- json-server - Mock REST API
