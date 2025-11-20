# Task & User Management App

React + TypeScript + Vite application for managing tasks and users with a clean, feature-based architecture.

## 🚀 Features

- **User Management**: Create, view, and list users
- **Task Management**: Kanban-style task board with To Do, In Progress, and Done columns
- **Form Validation**: React Hook Form with Zod schema validation
- **Routing**: React Router v7 with nested routes
- **API Integration**: json-server for mock REST API
- **Testing**: Vitest with React Testing Library
- **TypeScript**: Full type safety throughout the application

## 📁 Project Structure

```
src/
├── api/                   # API layer
│   ├── usersApi.ts        # User API functions
│   ├── tasksApi.ts        # Task API functions
│   └── index.ts           # Centralized exports
├── components/            # Shared components
│   ├── Header.tsx         # Navigation header
│   └── Layout.tsx         # Main layout wrapper
├── pages/                 # Page components and CSS
│   ├── CreateUser/        # Create user page
│   ├── TaskCreate/        # Create task page 
│   ├── TaskDetails/       # Task details page 
│   ├── TasksList/         # Kanban tasks board page
│   ├── UserDetails/       # User details page   
│   └── Users/             # Users list page
├── schema/                # Types schema definitions
│   ├── taskSchema.ts      # Task schema & TaskFormFields
│   ├── userSchema.ts      # User schema & UserFormFields
├── types                  # TypeScript type definitions
│   ├── user.ts            # User & CreateUserData types
│   ├── task.ts            # Task & CreateTaskData types
│   └── index.ts           # Centralized exports
├── utils                  # Centralized utils
│   └── dateUtils.ts       # Date utils
├── App.tsx                # Export default App
├── router.tsx             # Router configuration
└── main.tsx               # Application entry point

test/
├── config/                # Test configuration
│   ├── setup.ts           # Vitest setup with jest-dom
│   └── vitest.d.ts        # TypeScript declarations
├── CreateUser.test.tsx    # User form tests
├── TaskCreate.test.tsx    # Task form tests
├── TaskDetails.test.tsx   # Task details tests
├── TasksList.test.tsx     # Task list tests
├── UserDetails.test.tsx   # User details tests
└── UsersList.test.tsx     # User list tests
```

## 🛠️ Tech Stack

- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Vite 7.2.2** - Build tool and dev server
- **React Router DOM 7.9.6** - Client-side routing
- **React Hook Form 7.66.0** - Form management
- **Zod 4.1.12** - Schema validation
- **json-server 1.0.0** - Mock REST API
- **Vitest 4.0.10** - Testing framework
- **@testing-library/react** - Component testing

## 🏃 Getting Started

### Installation

```bash
npm install
```

### Development

Run both dev server and API server concurrently:

```bash
npm run dev
```

This starts:

- Vite dev server on `http://localhost:5173`
- json-server API on `http://localhost:3000`

### Production Build

```bash
npm run build
```

### Testing

```bash
npm test           # Watch mode
npm test -- --run  # Run once
```

## 🎨 Features Highlights

### Kanban Task Board

- Three columns: To Do, In Progress, Done
- Color-coded status badges
- Drag-free card-based interface
- Empty state handling

### Form Validation

- Real-time validation with Zod schemas
- Custom error messages
- Disabled submit until valid
- Date validation (past for users, future for tasks)

### Type Safety

- Centralized type definitions in `src/types/`
- No circular dependencies
- Consistent imports across the app

### Testing

- Component rendering tests
- Form validation tests
- User interaction tests
- 100% test pass rate

## 📝 API Endpoints

The mock API (json-server) provides:

**Users**

- `GET /api/users` - List all users
- `GET /api/users/${id}` - Get user by ID
- `POST /api/users` - Create new user

**Tasks**

- `GET /api/tasks` - List all tasks
- `GET /api/tasks/${id}` - Get task by ID
- `POST /api/tasks` - Create new task

## 🔧 Configuration

- **Vite**: `vite.config.ts` - Proxy configuration for API
- **TypeScript**: `tsconfig.json` - Compiler options
- **Vitest**: `vitest.config.ts` - Test configuration
- **ESLint**: `eslint.config.js` - Linting rules

## 📄 License

This project is part of a TypeScript learning curriculum.
