# Tests

It uses **Vitest** and **React Testing Library** for testing.

## Test run

```bash
# Run all tests
npm test

# Run all tests with UI
npm run test:ui

# Run all tests with coverage
npm run test:coverage
```

## Structure

```
test/
├── setup.ts
├── vitest.d.ts
├── components/
│   ├── statistics.test.tsx
│   ├── taskCard.test.tsx
│   └── toast.test.tsx
├── hooks/
│   └── useToast.test.tsx
├── schemas/
│   └── taskSchema.test.ts
└── utils/
    ├── test-utils.tsx
    └── taskConverters.test.ts
```

## Coverage

### Components
- ✅ **TaskCard**
- ✅ **Toast**

### Hooks
- ✅ **useToast**

### Schemas
- ✅ **taskFormSchema**

### Utils
- ✅ **taskConverters**

## Technologies used

- **Vitest**
- **React Testing Library**
- **@testing-library/jest-dom**
- **jsdom**

## Additional info

All tests use TypeScript and include:
- Unit tests for individual components
- Tests for custom hooks
- Validation tests for Zod schemas
- Tests for utility functions

For detailed information, see the test files in the `test/` folder.
