import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users";
import taskRoutes from "./routes/tasks";
import { ApiError, EmailAlreadyExistsError } from "./types/errors";
import morgan from 'morgan';
import cors from 'cors';
import './config/database';

const app = express();
const port = 3000;

// parse JSON bodies
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// simple request logger
app.use((req, _res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// use user routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

// Root route for GET /
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API root. Use /users and /tasks for operations." });
});

// Catch-all for unknown routes (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler mast be the last middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  if (err instanceof EmailAlreadyExistsError) {
    return res.status(409).json({ message: err.message });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({message: "Internal server error"});
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

export default app;