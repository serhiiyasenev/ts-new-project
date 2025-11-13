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
│── 📄 Configuration Files
│ ├── .env # Environment variables (VITE_API_URL)
│ ├── eslint.config.js # ESLint configuration
│ ├── package.json # Dependencies and scripts
│ ├── package-lock.json # Lock file for dependencies
│ ├── tsconfig.json # TypeScript configuration (root)
│ ├── tsconfig.app.json # TypeScript config for app
│ ├── tsconfig.node.json # TypeScript config for Node
│ ├── vite.config.ts # Vite bundler configuration
│ └── vitest.config.ts # Vitest test configuration
│
├── 📄 Documentation
│ ├── README.md # Project documentation
│ └── INSTRUCTIONS.md # Project instructions
│
├── 🗄️ Data
│ └── db.json # JSON Server database with tasks
│
├── 🌐 Entry Point
│ └── index.html # HTML entry point
│
├── 📁 src/ # Source code
│ ├── main.tsx # React app entry point
│ ├── App.tsx # Main App component with routing
│ ├── App.css # App styles with header grid layout
│ ├── index.css # Global styles (light theme)
│ │
│ ├── 📁 api/
│ │ └── api.ts # ✅ Task API client (CRUD operations) with comments
│ │
│ ├── 📁 components/
│ │ ├── 📁 createTask/
│ │ │ ├── CreateTaskForm.tsx # ✅ Create task form component with all imports
│ │ │ └── CreateTaskForm.css # Create form styles (full height)
│ │ │
│ │ ├── 📁 editTask/
│ │ │ ├── EditTaskModal.tsx # ✅ Edit task modal component with all imports
│ │ │ └── EditTaskModal.css # Edit modal styles
│ │ │
│ │ ├── 📁 kanbanColumn/
│ │ │ ├── KanbanColumn.tsx # ✅ Reusable Kanban column with all imports
│ │ │ └── KanbanColumn.css # Column styles with drag-over effects
│ │ │
│ │ ├── 📁 statistics/
│ │ │ ├── Statistics.tsx # ✅ Statistics Dashboard component (NEW)
│ │ │ └── Statistics.css # Statistics styles with grid layout
│ │ │
│ │ ├── 📁 taskCard/
│ │ │ ├── TaskCard.tsx # ✅ Individual task card with all imports
│ │ │ └── TaskCard.css # Card styles with priority badges
│ │ │
│ │ ├── 📁 taskForm/
│ │ │ ├── TaskForm.tsx # ✅ Shared form (react-hook-form + Zod) with docs
│ │ │ └── TaskForm.css # Form styles with validation
│ │ │
│ │ ├── 📁 taskList/
│ │ │ ├── TaskList.tsx # ✅ Task list with Kanban board, all imports
│ │ │ └── TaskList.css # List styles with 3-column layout
│ │ │
│ │ └── 📁 toast/
│ │ ├── Toast.tsx # ✅ Toast notification component with all imports
│ │ └── Toast.css # Toast styles with animations
│ │
│ ├── 📁 hooks/
│ │ └── useToast.ts # ✅ Custom toast hook with JSDoc comments
│ │
│ ├── 📁 schemas/
│ │ └── taskSchema.ts # ✅ Zod validation schema with JSDoc comments
│ │
│ ├── 📁 types/
│ │ └── types.ts # ✅ TypeScript type definitions with comments
│ │
│ └── 📁 utils/
│ └── taskConverters.ts # ✅ Task data converters with JSDoc comments
│
└── 📁 test/ # Tests (57 total tests)
├── setup.ts # Vitest setup configuration
├── vitest.d.ts # TypeScript types for tests
├── README.md # Test documentation
│
├── 📁 components/
│ ├── TaskCard.test.tsx # TaskCard tests (6 tests) ✅
│ ├── Toast.test.tsx # Toast tests (6 tests) ✅
│ └── Statistics.test.tsx # Statistics tests (15 tests) ✅ NEW
│
├── 📁 hooks/
│ └── useToast.test.tsx # useToast tests (8 tests) ✅
│
├── 📁 schemas/
│ └── taskSchema.test.ts # Zod schema tests (14 tests) ✅
│
└── 📁 utils/
├── test-utils.tsx # Testing utilities
└── taskConverters.test.ts # Converter tests (8 tests) ✅
```

## Technologies Used

- React 19
- TypeScript
- react-hook-form - Form state management
- zod - Schema validation
- @hookform/resolvers/zod - Integration between react-hook-form and zod
- Vite - Build tool
- json-server - Mock REST API
